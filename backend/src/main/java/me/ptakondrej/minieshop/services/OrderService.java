package me.ptakondrej.minieshop.services;

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
import java.util.ArrayList;
import java.util.List;

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
		return orderRepository.findByUserIdAndId(userId, orderId)
				.orElse(null);
	}

	public List<Order> getAllUserOrders(Long userId) {
		return orderRepository.findAllByUserId(userId);
	}

	@Transactional
	public Order createOrder(Long userId, OrderCreationRequest request) {
		User user = userService.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

		Order order = Order.builder()
				.user(user)
				.shippingAddress(request.getShippingAddress())
				.billingAddress(request.getBillingAddress())
				.paymentMethod(request.getPaymentMethod())
				.status(request.getStatus())
				.totalPrice(BigDecimal.valueOf(request.getTotalPrice()))
				.build();

		Order savedOrder = orderRepository.save(order);

		List<OrderItem> orderItems = request.getOrderItems().stream().map(itemDTO -> {
			Product product = productService.getProductById(itemDTO.getProductId());
			if (product == null) {
				throw new IllegalArgumentException("Product not found with ID: " + itemDTO.getProductId());
			}
			return OrderItem.builder().product(product).order(savedOrder).quantity(itemDTO.getQuantity()).build();
		}).map(orderItemService::createOrderItem).toList();
		System.out.println("Order items created: " + orderItems.size());

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

}
