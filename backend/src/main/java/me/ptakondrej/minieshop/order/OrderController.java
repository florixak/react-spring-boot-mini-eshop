package me.ptakondrej.minieshop.order;

import me.ptakondrej.minieshop.services.OrderService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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
