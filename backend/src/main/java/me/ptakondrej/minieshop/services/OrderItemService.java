package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.orderItem.OrderItem;
import me.ptakondrej.minieshop.orderItem.OrderItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderItemService {

	private final OrderItemRepository orderItemRepository;

	public OrderItemService(OrderItemRepository orderItemRepository) {
		this.orderItemRepository = orderItemRepository;
	}

	@Transactional
	public OrderItem createOrderItem(OrderItem orderItem) {
		try {
			return orderItemRepository.save(orderItem);
		} catch (Exception e) {
			throw new IllegalArgumentException("Failed to create order item: " + e.getMessage());
		}
	}

	@Transactional(readOnly = true)
	public List<OrderItem> getOrderItemByOrderId(Long orderId) {
		if (orderId == null || orderId <= 0) {
			throw new IllegalArgumentException("Invalid order item ID");
		}
		return orderItemRepository.findAllByOrderId(orderId);
	}
}
