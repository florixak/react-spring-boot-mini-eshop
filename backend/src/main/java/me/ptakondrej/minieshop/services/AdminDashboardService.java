package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.order.OrderStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminDashboardService {
	private final UserService userService;
	private final OrderService orderService;
	private final ProductService productService;

	private final int RECENT_ORDERS_LIMIT = 5;

	public AdminDashboardService(UserService userService, OrderService orderService, ProductService productService) {
		this.userService = userService;
		this.orderService = orderService;
		this.productService = productService;
	}

	public long getTotalUsers() {
		return userService.countUsers();
	}

	public long getTotalOrders() {
		return orderService.countOrders();
	}

	public long getTotalProducts() {
		return productService.countProducts();
	}

	public List<Order> getRecentOrders() {
		return orderService.getAllOrders().stream()
				.sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
				.limit(RECENT_ORDERS_LIMIT)
				.toList();
	}

	public double getTotalRevenue() {
		List<Order> allOrders = orderService.getAllOrders();
		if (allOrders.isEmpty()) {
			return 0.0;
		}
		return allOrders.stream()
				.filter(order -> order.getStatus() == OrderStatus.COMPLETED)
				.mapToDouble(order -> order.getTotalPrice().doubleValue())
				.sum();
	}





}
