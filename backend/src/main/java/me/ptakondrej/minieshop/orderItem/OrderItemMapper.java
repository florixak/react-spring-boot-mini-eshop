package me.ptakondrej.minieshop.orderItem;

import me.ptakondrej.minieshop.models.OrderItemDTO;
import me.ptakondrej.minieshop.product.ProductMapper;

public class OrderItemMapper {

	public static OrderItemDTO convertToDto(OrderItem orderItem) {
		return OrderItemDTO.builder()
				.id(orderItem.getId())
				.product(ProductMapper.convertToDto(orderItem.getProduct()))
				.quantity(orderItem.getQuantity())
				.build();
	}

	public static OrderItem convertToEntity(OrderItemDTO orderItemDTO) {
		return OrderItem.builder()
				.id(orderItemDTO.getId())
				.product(ProductMapper.convertToEntity(orderItemDTO.getProduct()))
				.quantity(orderItemDTO.getQuantity())
				.build();
	}

}
