package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.models.OrderDTO;
import me.ptakondrej.minieshop.models.OrderItemDTO;
import me.ptakondrej.minieshop.models.UserDTO;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.order.OrderRepository;
import me.ptakondrej.minieshop.orderItem.OrderItem;
import me.ptakondrej.minieshop.user.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

	private final OrderRepository orderRepository;

	public OrderService(OrderRepository orderRepository) {
		this.orderRepository = orderRepository;
	}

	public List<Order> getAllUserOrders(Long userId) {
		return orderRepository.findAllByUserId(userId);
	}

	public OrderDTO convertToDTO(Order order) {
		return OrderDTO.builder()
				.id(order.getId())
				.user(convertToUserDTO(order.getUser()))
				.orderItems(
						order.getOrderItems().stream()
								.map(this::convertToOrderItemDTO)
								.toList()
				)
				.createdAt(order.getCreatedAt())
				.status(order.getStatus().name())
				.build();
	}

	private UserDTO convertToUserDTO(User user) {
		return new UserDTO(
				user.getId(),
				user.getUsername(),
				user.getEmail(),
				user.isEnabled()
		);
	}

	private OrderItemDTO convertToOrderItemDTO(OrderItem orderItem) {
		return new OrderItemDTO(
				orderItem.getId(),
				orderItem.getOrder(),
				orderItem.getProduct(),
				orderItem.getQuantity()
		);
	}

}
