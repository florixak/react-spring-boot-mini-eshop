package me.ptakondrej.minieshop.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.ptakondrej.minieshop.models.OrderItemDataDTO;
import me.ptakondrej.minieshop.order.OrderStatus;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreationRequest {

	private Long userId;
	private String shippingAddress;
	private String billingAddress;
	private String paymentMethod;
	private List<OrderItemDataDTO> orderItems;
	private double totalPrice;
	private OrderStatus status;
}
