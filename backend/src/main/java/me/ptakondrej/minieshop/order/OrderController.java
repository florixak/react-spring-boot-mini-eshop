package me.ptakondrej.minieshop.order;

import me.ptakondrej.minieshop.models.OrderDTO;
import me.ptakondrej.minieshop.requests.UserOrdersRequest;
import me.ptakondrej.minieshop.responses.OrderListResponse;
import me.ptakondrej.minieshop.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}





	// getting order by id
	// creating new order
	// updating order status
	// deleting order by id
}
