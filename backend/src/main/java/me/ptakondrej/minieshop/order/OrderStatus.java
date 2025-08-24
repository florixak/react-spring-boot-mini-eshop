package me.ptakondrej.minieshop.order;

public enum OrderStatus {
	PENDING,
	PAID,
	PROCESSING,
	COMPLETED,
	CANCELLED;

	public static OrderStatus fromString(String status) {
		for (OrderStatus orderStatus : OrderStatus.values()) {
			if (orderStatus.name().equalsIgnoreCase(status)) {
				return orderStatus;
			}
		}
		throw new IllegalArgumentException("Unknown order status: " + status);
	}

	public String toString() {
		return name().toLowerCase();
	}
}
