package me.ptakondrej.minieshop.order;

import me.ptakondrej.minieshop.models.OrderDTO;
import me.ptakondrej.minieshop.orderItem.OrderItemMapper;
import me.ptakondrej.minieshop.user.UserMapper;

public class OrderMapper {

	public static OrderDTO convertToDto(Order order) {
		return OrderDTO.builder()
				.id(order.getId())
				.user(order.getUser() != null ? UserMapper.convertToDto(order.getUser()) : null)
				.customerEmail(order.getCustomerEmail())
				.customerPhone(order.getCustomerPhone())
				.shippingAddress(order.getShippingAddress())
				.shippingMethod(order.getShippingMethod())
				.stripeSessionId(order.getStripeSessionId())
				.orderItems(order.getOrderItems().stream().map(OrderItemMapper::convertToDto).toList())
				.status(order.getStatus())
				.totalPrice(order.getTotalPrice())
				.createdAt(order.getCreatedAt())
				.updatedAt(order.getUpdatedAt())
				.build();
	}

	public static Order convertToEntity(OrderDTO orderDTO) {
		return Order.builder()
				.id(orderDTO.getId())
				.user(orderDTO.getUser() != null ? UserMapper.convertToEntity(orderDTO.getUser()) : null)
				.customerEmail(orderDTO.getCustomerEmail())
				.customerPhone(orderDTO.getCustomerPhone())
				.shippingAddress(orderDTO.getShippingAddress())
				.shippingMethod(orderDTO.getShippingMethod())
				.stripeSessionId(orderDTO.getStripeSessionId())
				.orderItems(orderDTO.getOrderItems().stream()
						.map(OrderItemMapper::convertToEntity)
						.toList())
				.status(orderDTO.getStatus())
				.totalPrice(orderDTO.getTotalPrice())
				.createdAt(orderDTO.getCreatedAt())
				.updatedAt(orderDTO.getUpdatedAt())
				.build();
	}
}
