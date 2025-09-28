package me.ptakondrej.minieshop.controllers;

import me.ptakondrej.minieshop.models.OrderDTO;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.order.OrderMapper;
import me.ptakondrej.minieshop.order.OrderStatus;
import me.ptakondrej.minieshop.responses.PageableResponse;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
	public ResponseEntity<Response<PageableResponse<OrderDTO>>> getAllUserOrders(@RequestAttribute Long userId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
		try {
			Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
			Page<Order> wishlistProducts = orderService.getAllOrders(userId, pageable);
			List<OrderDTO> orderDTOs = wishlistProducts.stream()
					.map(OrderMapper::convertToDto)
					.toList();
			return ResponseEntity.ok(
					new Response<>(true,
							new PageableResponse<>(
									orderDTOs,
									wishlistProducts.getNumber(),
									wishlistProducts.getSize(),
									wishlistProducts.getTotalElements(),
									wishlistProducts.getTotalPages()
							), "Orders retrieved successfully")
			);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(
					new Response<>(false,null, "Invalid request: " + e.getMessage())
			);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(
					new Response<>(false, null, "An error occurred while retrieving orders: " + e.getMessage())
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

			Order order = orderService.getOrderByUserIdAndOrderId(userId, orderId);
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

	@DeleteMapping("/{orderId}")
	public ResponseEntity<Response<Void>> cancelOrder(@RequestAttribute Long userId, @PathVariable Long orderId) {
		try {
			if (orderId == null || orderId <= 0) {
				return ResponseEntity.badRequest().body(
						new Response<Void>(false, null, "Invalid order ID")
				);
			}

			Order order = orderService.getOrderByUserIdAndOrderId(userId, orderId);
			if (order == null) {
				return ResponseEntity.status(404).body(
						new Response<Void>(false, null, "Order not found")
				);
			}

			if (order.getStatus() != OrderStatus.PENDING) {
				return ResponseEntity.badRequest().body(
						new Response<Void>(false, null, "Only orders with PENDING status can be cancelled")
				);
			}

			orderService.updateOrderStatus(userId, orderId, OrderStatus.CANCELLED);
			return ResponseEntity.ok(
					new Response<Void>(true, null, "Order cancelled successfully")
			);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(
					new Response<Void>(false, null, "Invalid request: " + e.getMessage())
			);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(
					new Response<Void>(false, null, "An error occurred while cancelling the order: " + e.getMessage())
			);
		}
	}

	@GetMapping("/admin")
	public ResponseEntity<Response<List<OrderDTO>>> getAllOrders(@RequestParam(required = false) String search) {
		try {
			List<Order> orders = orderService.getAllOrders(search);
			List<OrderDTO> orderDTOs = orders.stream()
					.map(OrderMapper::convertToDto)
					.toList();
			return ResponseEntity.ok(
					new Response<>(true, orderDTOs, "Orders retrieved successfully")
			);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(
					new Response<>(false, null, "Invalid request: " + e.getMessage())
			);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(
					new Response<>(false, null, "An error occurred while retrieving orders: " + e.getMessage())
			);
		}
	}

	@DeleteMapping("/admin/{orderId}")
	public ResponseEntity<Response<Void>> cancelOrderAdmin(@PathVariable Long orderId) {
		try {
			if (orderId == null || orderId <= 0) {
				return ResponseEntity.badRequest().body(
						new Response<Void>(false, null, "Invalid order ID")
				);
			}

			Order order = orderService.getOrderById(orderId);
			if (order == null) {
				return ResponseEntity.status(404).body(
						new Response<Void>(false, null, "Order not found")
				);
			}

			if (order.getStatus() != OrderStatus.PENDING) {
				return ResponseEntity.badRequest().body(
						new Response<Void>(false, null, "Only orders with PENDING status can be cancelled")
				);
			}

			orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED);
			return ResponseEntity.ok(
					new Response<Void>(true, null, "Order cancelled successfully")
			);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(
					new Response<Void>(false, null, "Invalid request: " + e.getMessage())
			);
		} catch (Exception e) {
			return ResponseEntity.status(500).body(
					new Response<Void>(false, null, "An error occurred while cancelling the order: " + e.getMessage())
			);
		}
	}
}
