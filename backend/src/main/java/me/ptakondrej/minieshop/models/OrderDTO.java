package me.ptakondrej.minieshop.models;

import lombok.*;
import me.ptakondrej.minieshop.order.OrderStatus;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

	private Long id;
	private UserDTO user;
	private List<OrderItemDTO> orderItems;
	private BigDecimal totalPrice;
	private String createdAt;
	private String updatedAt;
	private OrderStatus status;
}
