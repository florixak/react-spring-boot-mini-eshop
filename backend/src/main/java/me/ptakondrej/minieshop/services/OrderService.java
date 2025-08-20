package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.models.OrderDTO;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.order.OrderRepository;
import me.ptakondrej.minieshop.orderItem.OrderItemMapper;
import me.ptakondrej.minieshop.user.UserMapper;
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
				.user(UserMapper.convertToDto(order.getUser()))
				.orderItems(
						order.getOrderItems().stream()
								.map(OrderItemMapper::convertToDto)
								.toList()
				)
				.createdAt(order.getCreatedAt())
				.status(order.getStatus())
				.build();
	}
}
