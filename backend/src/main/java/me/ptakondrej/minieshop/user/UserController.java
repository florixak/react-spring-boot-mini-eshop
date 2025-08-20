package me.ptakondrej.minieshop.user;

import me.ptakondrej.minieshop.models.OrderDTO;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final OrderService orderService;

	public UserController(OrderService orderService) {
		this.orderService = orderService;
	}

	@GetMapping("/orders")
	public ResponseEntity<Response<List<OrderDTO>>> getAllUserOrders(@RequestAttribute Long userId) {
		try {
			List<Order> orders = orderService.getAllUserOrders(userId);
			List<OrderDTO> orderDTOs = orders.stream()
					.map(orderService::convertToDTO)
					.toList();
			return ResponseEntity.ok(
					new Response<List<OrderDTO>>(true, orderDTOs, "Orders retrieved successfully")
			);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(
					new Response<List<OrderDTO>>(false, null, "Failed to retrieve orders: " + e.getMessage())
			);
		}
	}
}
