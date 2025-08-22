package me.ptakondrej.minieshop.models;

import lombok.*;
import me.ptakondrej.minieshop.order.OrderStatus;
import me.ptakondrej.minieshop.order.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private PaymentMethod paymentMethod;
	private OrderStatus status;

}
