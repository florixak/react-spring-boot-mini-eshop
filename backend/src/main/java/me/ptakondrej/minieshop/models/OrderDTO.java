package me.ptakondrej.minieshop.models;

import lombok.*;
import me.ptakondrej.minieshop.order.OrderStatus;
import me.ptakondrej.minieshop.order.ShippingMethod;

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
	private String customerEmail;
	private String customerPhone;
	private List<OrderItemDTO> orderItems;
	private BigDecimal totalPrice;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private OrderStatus status;
	private String shippingAddress;
	private String stripeSessionId;
	private ShippingMethod shippingMethod;
}
