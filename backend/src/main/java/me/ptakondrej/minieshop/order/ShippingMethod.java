package me.ptakondrej.minieshop.order;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public enum ShippingMethod {

	STANDARD(BigDecimal.valueOf(5.99), "Standard Shipping (5-7 days)"),
	EXPRESS(BigDecimal.valueOf(12.99), "Express Shipping (2-3 days)"),
	OVERNIGHT(BigDecimal.valueOf(24.99), "Overnight Shipping (1 day)");

	private final BigDecimal price;
	private final String description;

	public static ShippingMethod fromString(String method) {
		for (ShippingMethod sm : ShippingMethod.values()) {
			if (sm.name().equalsIgnoreCase(method)) {
				return sm;
			}
		}
		throw new IllegalArgumentException("Unknown shipping method: " + method);
	}
}
