package me.ptakondrej.minieshop.models;

import lombok.*;
import me.ptakondrej.minieshop.order.Order;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

	private Long id;
	private Order order;
	private ProductDTO product;
	private Integer quantity;
}
