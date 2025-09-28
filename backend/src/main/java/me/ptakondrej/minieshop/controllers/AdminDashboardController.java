package me.ptakondrej.minieshop.controllers;

import me.ptakondrej.minieshop.models.AdminDashboardStatsDTO;
import me.ptakondrej.minieshop.models.OrderDTO;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.order.OrderMapper;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.AdminDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

	private final AdminDashboardService adminDashboardService;

	public AdminDashboardController(AdminDashboardService adminDashboardService) {
		this.adminDashboardService = adminDashboardService;
	}

	@GetMapping("/stats")
	public ResponseEntity<Response<AdminDashboardStatsDTO>> getDashboardStats() {
		try {
			AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO(
					adminDashboardService.getTotalUsers(),
					adminDashboardService.getNewUsersLastWeek(),
					adminDashboardService.getTotalOrders(),
					adminDashboardService.getTotalActiveProducts(),
					adminDashboardService.getTotalRevenue(),
					adminDashboardService.getLowStockProducts(),
					adminDashboardService.getTotalPendingOrders()
			);
			return ResponseEntity.ok(new Response<>(true, stats, "Dashboard stats retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Internal server error"));
		}
	}

	@GetMapping("/recent-orders")
	public ResponseEntity<Response<List<OrderDTO>>> getRecentOrders() {
		try {
			List<Order> recentOrders = adminDashboardService.getRecentOrders();
			List<OrderDTO> recentOrdersDTO = recentOrders.stream()
					.map(OrderMapper::convertToDto)
					.toList();
			return ResponseEntity.ok(new Response<>(true, recentOrdersDTO, "Recent orders retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Internal server error"));
		}
	}
}
