package me.ptakondrej.minieshop.user;

import me.ptakondrej.minieshop.services.OrderService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserController {

	private final OrderService orderService;

	public UserController(OrderService orderService) {
		this.orderService = orderService;
	}

}
