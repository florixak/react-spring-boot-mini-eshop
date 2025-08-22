package me.ptakondrej.minieshop.order;

public enum PaymentMethod {
	CREDIT_CARD,
	PAYPAL,
	BANK_TRANSFER,
	CASH_ON_DELIVERY;

	public static PaymentMethod fromString(String method) {
		try {
			return PaymentMethod.valueOf(method.toUpperCase().replace(" ", "_"));
		} catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Invalid payment method: " + method);
		}
	}
}
