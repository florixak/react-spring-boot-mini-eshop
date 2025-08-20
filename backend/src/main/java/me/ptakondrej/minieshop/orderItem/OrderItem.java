package me.ptakondrej.minieshop.orderItem;

import jakarta.persistence.*;
import lombok.*;
import me.ptakondrej.minieshop.order.Order;
import me.ptakondrej.minieshop.product.Product;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_items")
@Builder
public class OrderItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "order_id", nullable = false)
	private Order order;

	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@Column(nullable = false, columnDefinition = "integer default 0")
	private Integer quantity;
}
