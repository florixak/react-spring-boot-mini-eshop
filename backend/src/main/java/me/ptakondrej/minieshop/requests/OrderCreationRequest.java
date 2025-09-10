package me.ptakondrej.minieshop.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.ptakondrej.minieshop.models.OrderItemDataDTO;
import me.ptakondrej.minieshop.order.ShippingMethod;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreationRequest {

	private String shippingAddress;
	private String customerEmail;
	private String customerPhone;
	private ShippingMethod shippingMethod;
	private List<OrderItemDataDTO> orderItems;
}
