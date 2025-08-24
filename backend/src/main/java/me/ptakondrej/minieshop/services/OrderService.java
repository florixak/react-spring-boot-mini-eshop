package me.ptakondrej.minieshop.services;

import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.order.OrderRepository;
import me.ptakondrej.minieshop.order.OrderStatus;
import me.ptakondrej.minieshop.orderItem.OrderItem;
import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.requests.OrderCreationRequest;
import me.ptakondrej.minieshop.user.User;
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

	public OrderService(OrderRepository orderRepository, UserService userService, OrderItemService orderItemService, ProductService productService) {
		this.orderRepository = orderRepository;
		this.userService = userService;
		this.orderItemService = orderItemService;
		this.productService = productService;
	}

	public Order getOrderById(Long userId, Long orderId) {
		return orderRepository.findByUserIdAndId(userId, orderId).orElse(null);
	}

	public List<Order> getAllUserOrders(Long userId) {
		return orderRepository.findAllByUserId(userId);
	}

	@Transactional
	public Order createOrder(Long userId, OrderCreationRequest request) {
		if (userId == null) {
			throw new IllegalArgumentException("User ID is required");
		}

		if (request == null) {
			throw new IllegalArgumentException("Order creation request cannot be null");
		}
		User user = userService.findById(userId);

		if (user == null) {
			throw new IllegalArgumentException("User not found with ID: " + userId);
		}

		if (request.getShippingAddress() == null || request.getShippingAddress().isEmpty()) {
			throw new IllegalArgumentException("Shipping address is required");
		}

		if (request.getOrderItems() == null || request.getOrderItems().isEmpty()) {
			throw new IllegalArgumentException("Order must contain at least one item");
		}

		if (request.getPaymentMethod() == null) {
			throw new IllegalArgumentException("Payment method is required");
		}

		if (request.getBillingAddress() == null || request.getBillingAddress().isEmpty()) {
			throw new IllegalArgumentException("Billing address is required");
		}

		BigDecimal totalPrice = BigDecimal.valueOf(request.getOrderItems().stream().mapToDouble(item -> {
			Product product = productService.getProductById(item.getProductId());
			if (product == null) {
				throw new IllegalArgumentException("Product not found with ID: " + item.getProductId());
			}
			return product.getPrice().doubleValue() * item.getQuantity();
		}).sum());

		Order order = Order.builder()
				.user(user)
				.shippingAddress(request.getShippingAddress())
				.billingAddress(request.getBillingAddress())
				.paymentMethod(request.getPaymentMethod())
				.status(OrderStatus.PENDING)
				.totalPrice(totalPrice)
				.build();

		Order savedOrder = orderRepository.save(order);

		List<OrderItem> orderItems = request.getOrderItems().stream().map(itemDTO -> {
			Product product = productService.getProductById(itemDTO.getProductId());
			if (product == null) {
				throw new IllegalArgumentException("Product not found with ID: " + itemDTO.getProductId());
			}
			return OrderItem.builder().product(product).order(savedOrder).quantity(itemDTO.getQuantity()).build();
		}).map(orderItemService::createOrderItem).toList();

		savedOrder.setOrderItems(new ArrayList<>(orderItems));
		return orderRepository.save(savedOrder);
	}

	@Transactional
	public Order updateOrderStatus(Long userId, Long orderId, OrderStatus status) {
		Order order = getOrderById(userId, orderId);
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
			order.setStatus(OrderStatus.CANCELLED);
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



}
