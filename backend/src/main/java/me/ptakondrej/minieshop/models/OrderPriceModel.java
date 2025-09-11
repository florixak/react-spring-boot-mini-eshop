package me.ptakondrej.minieshop.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import me.ptakondrej.minieshop.order.Order;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class OrderPriceModel {

	private Order order;
	private BigDecimal subtotal;
	private BigDecimal tax;
	private BigDecimal shippingCost;
	private BigDecimal total;
}
