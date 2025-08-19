package me.ptakondrej.minieshop.responses;

import lombok.Getter;
import lombok.Setter;
import me.ptakondrej.minieshop.models.OrderDTO;

import java.util.List;

@Getter
@Setter
public class OrderListResponse extends Response {

	private List<OrderDTO> orders;

	public OrderListResponse(boolean success, List<OrderDTO> orders, String message) {
		super(success, message);
		this.orders = orders;
	}
}
