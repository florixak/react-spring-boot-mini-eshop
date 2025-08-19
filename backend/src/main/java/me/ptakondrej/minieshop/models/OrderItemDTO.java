package me.ptakondrej.minieshop.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.product.Product;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {

	private Long id;
	private Order order;
	private Product product;
	private Integer quantity;
}
