package me.ptakondrej.minieshop.controllers;

import me.ptakondrej.minieshop.models.OrderDTO;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.order.OrderMapper;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@GetMapping
	public ResponseEntity<Response<List<OrderDTO>>> getAllUserOrders(@RequestAttribute Long userId) {
		try {
			List<Order> orders = orderService.getAllUserOrders(userId);
			List<OrderDTO> orderDTOs = orders.stream()
					.map(OrderMapper::convertToDto)
					.toList();
			return ResponseEntity.ok(
					new Response<List<OrderDTO>>(true, orderDTOs, "Orders retrieved successfully")
			);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(
					new Response<List<OrderDTO>>(false, null, "Invalid request: " + e.getMessage())
			);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(
					new Response<List<OrderDTO>>(false, null, "An error occurred while retrieving orders: " + e.getMessage())
			);
		}
	}

	@GetMapping("/{orderId}")
	public ResponseEntity<Response<OrderDTO>> getOrderById(@RequestAttribute Long userId, @PathVariable Long orderId) {
		try {
			if (orderId == null || orderId <= 0) {
				return ResponseEntity.badRequest().body(
						new Response<OrderDTO>(false, null, "Invalid order ID")
				);
			}

			Order order = orderService.getOrderById(userId, orderId);
			if (order == null) {
				return ResponseEntity.status(404).body(
						new Response<OrderDTO>(false, null, "Order not found")
				);
			}

			OrderDTO orderDTO = OrderMapper.convertToDto(order);
			return ResponseEntity.ok(
					new Response<OrderDTO>(true, orderDTO, "Order retrieved successfully")
			);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(
					new Response<OrderDTO>(false, null, "Invalid request: " + e.getMessage())
			);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(
					new Response<OrderDTO>(false, null, "An error occurred while retrieving the order: " + e.getMessage())
			);
		}
	}
}
