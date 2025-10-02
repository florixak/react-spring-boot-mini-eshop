package me.ptakondrej.minieshop.services;

import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import me.ptakondrej.minieshop.models.OrderPriceModel;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.order.OrderRepository;
import me.ptakondrej.minieshop.order.OrderSpecification;
import me.ptakondrej.minieshop.order.OrderStatus;
import me.ptakondrej.minieshop.orderItem.OrderItem;
import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.requests.OrderCreationRequest;
import me.ptakondrej.minieshop.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.stripe.net.ApiResource.GSON;

@Service
public class OrderService {

	private final OrderRepository orderRepository;
	private final UserService userService;
	private final OrderItemService orderItemService;
	private final ProductService productService;
	private final EmailService emailService;

	public OrderService(OrderRepository orderRepository, UserService userService, OrderItemService orderItemService, ProductService productService, EmailService emailService) {
		this.orderRepository = orderRepository;
		this.userService = userService;
		this.orderItemService = orderItemService;
		this.productService = productService;
		this.emailService = emailService;
	}

	public Order getOrderById(Long orderId) {
		return orderRepository.findById(orderId).orElse(null);
	}

	public Order getOrderByUserIdAndOrderId(Long userId, Long orderId) {
		return orderRepository.findByUserIdAndId(userId, orderId).orElse(null);
	}

	public List<Order> getAllUserOrders(Long userId) {
		return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
	}

	public Page<Order> getAllOrders(Long userId, Pageable pageable) {
		if (userId == null || userId <= 0) {
			throw new IllegalArgumentException("Invalid user ID");
		}
		if (pageable == null) {
			throw new IllegalArgumentException("Pageable cannot be null");
		}
		return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId, pageable);
	}

	public List<Order> getAllOrders() {
		return orderRepository.findAll();
	}

	public List<Order> getAllOrders(String search) {
		return sortOrdersByCreatedAtDesc(orderRepository.findAll(OrderSpecification.filter(search)));
	}

	public int countOrders() {
		return (int) orderRepository.count();
	}

	public int countPendingOrders() {
		return (int) orderRepository.countByStatus(OrderStatus.PENDING);
	}

	@Transactional
	public OrderPriceModel createOrder(Long userId, OrderCreationRequest request) {

		if (request == null) {
			throw new IllegalArgumentException("Order creation request cannot be null");
		}

		if (request.getShippingAddress() == null || request.getShippingAddress().isEmpty()) {
			throw new IllegalArgumentException("Shipping address is required");
		}

		if (request.getCustomerEmail() == null || request.getCustomerEmail().isEmpty()) {
			throw new IllegalArgumentException("Customer email is required");
		}

		if (request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
			throw new IllegalArgumentException("Order must contain at least one item");
		}

		if (request.getShippingMethod() == null) {
			throw new IllegalArgumentException("Shipping method is required");
		}

		BigDecimal subtotal = request.getOrderItems().stream().map(itemDTO -> {
			Product product = productService.getProductById(itemDTO.getProductId());
			if (product == null) {
				throw new IllegalArgumentException("Product not found with ID: " + itemDTO.getProductId());
			}
			if (itemDTO.getQuantity() <= 0) {
				throw new IllegalArgumentException("Quantity must be greater than zero for product ID: " + itemDTO.getProductId());
			}
			if (product.getStockQuantity() < itemDTO.getQuantity()) {
				throw new IllegalArgumentException("Insufficient stock for product ID: " + itemDTO.getProductId());
			}
			return product.getPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
		}).reduce(BigDecimal.ZERO, BigDecimal::add);

		BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.10));
		BigDecimal shippingCost =subtotal.compareTo(BigDecimal.valueOf(50)) > 0 ? BigDecimal.ZERO : request.getShippingMethod().getPrice();
		BigDecimal totalPrice = subtotal.add(tax).add(shippingCost);

		Order order = Order.builder()
				.shippingAddress(request.getShippingAddress())
				.customerEmail(request.getCustomerEmail())
				.customerPhone(request.getCustomerPhone())
				.shippingMethod(request.getShippingMethod())
				.status(OrderStatus.PENDING)
				.totalPrice(totalPrice)
				.expiresAt(LocalDateTime.now().plusMinutes(30))
				.build();

		if (userId != null) {
			User user = userService.findById(userId);
			if (user == null) {
				throw new IllegalArgumentException("User not found with ID: " + userId);
			}
			if (!user.isVerified()) {
				throw new IllegalArgumentException("User email is not verified");
			}
			order.setUser(user);
		}

		Order savedOrder = orderRepository.save(order);

		List<OrderItem> orderItems = request.getOrderItems().stream().map(itemDTO -> {
			Product product = productService.getProductById(itemDTO.getProductId());
			if (product == null) {
				throw new IllegalArgumentException("Product not found with ID: " + itemDTO.getProductId());
			}
			productService.reduceStock(product.getId(), itemDTO.getQuantity());
			return OrderItem.builder().product(product).order(savedOrder).quantity(itemDTO.getQuantity()).build();
		}).map(orderItemService::createOrderItem).toList();

		savedOrder.setOrderItems(new ArrayList<>(orderItems));

		try {
			emailService.sendOrderConfirmationEmail(savedOrder.getCustomerEmail(), savedOrder.toString());
		} catch (Exception e) {
			System.err.println("Failed to send new order notification to admin: " + e.getMessage());
		}

		return new OrderPriceModel(orderRepository.save(savedOrder), subtotal, tax, shippingCost, totalPrice);
	}

	@Transactional
	public Order updateOrderStatus(Long orderId, OrderStatus status) {
		Order order = getOrderById(orderId);
		if (order == null) {
			throw new IllegalArgumentException("Order not found with ID: " + orderId);
		}
		order.setStatus(status);
		return orderRepository.save(order);
	}

	@Transactional
	public Order updateOrderStatus(Long userId, Long orderId, OrderStatus status) {
		Order order = getOrderByUserIdAndOrderId(userId, orderId);
		if (order == null) {
			throw new IllegalArgumentException("Order not found with ID: " + orderId);
		}
		order.setStatus(status);
		return orderRepository.save(order);
	}

	@Transactional
	public void handleOrderPaymentSuccess(Event event) {
		Session session = parseEventData(event);
		if (session == null || session.getMetadata() == null || !session.getMetadata().containsKey("orderId")) {
			throw new IllegalArgumentException("Invalid event data: missing orderId in metadata");
		}
		Long orderId = Long.parseLong(session.getMetadata().get("orderId"));

		Order order = orderRepository.findById(orderId).orElse(null);
		if (order != null && order.getStatus().equals(OrderStatus.PENDING)) {
			order.setStatus(OrderStatus.PAID);
			order.setStripeSessionId(session.getId());
			order.setPaymentAt(LocalDateTime.now());
			orderRepository.save(order);
			try {
				emailService.sendOrderPaymentSuccessEmail(order.getCustomerEmail(), order.toString());
			} catch (Exception e) {
				System.err.println("Failed to send payment success email: " + e.getMessage());
			}
		}
	}

	@Transactional
	public void handleOrderPaymentFailure(Event event) {
		Session session = parseEventData(event);
		if (session == null || session.getMetadata() == null || !session.getMetadata().containsKey("orderId")) {
			throw new IllegalArgumentException("Invalid event data: missing orderId in metadata");
		}
		Long orderId = Long.parseLong(session.getMetadata().get("orderId"));

		Order order = orderRepository.findById(orderId).orElse(null);
		if (order != null && order.getStatus() == OrderStatus.PENDING) {
			order.setStripeSessionId(null);
			orderRepository.save(order);
		}
	}

	private Session parseEventData(Event event) {
		if (event.getData() != null && event.getData().getObject() != null) {
			String json = event.getData().getObject().toJson();
			return GSON.fromJson(json, Session.class);
		}
		return null;
	}

	private List<Order> sortOrdersByCreatedAtDesc(List<Order> orders) {
		orders.sort((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()));
		return orders;
	}
}
