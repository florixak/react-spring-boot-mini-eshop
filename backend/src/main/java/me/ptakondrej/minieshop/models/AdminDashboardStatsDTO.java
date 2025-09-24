package me.ptakondrej.minieshop.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDTO {

	private long totalUsers;
	private long newUsers;
	private long totalOrders;
	private long totalProducts;
	private double totalRevenue;
	private long lowStockProducts;
	private long totalPendingOrders;
}
