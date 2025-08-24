package me.ptakondrej.minieshop.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.ptakondrej.minieshop.models.OrderItemDataDTO;
import me.ptakondrej.minieshop.order.PaymentMethod;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreationRequest {

	private String shippingAddress;
	private String billingAddress;
	private PaymentMethod paymentMethod;
	private List<OrderItemDataDTO> orderItems;
}
