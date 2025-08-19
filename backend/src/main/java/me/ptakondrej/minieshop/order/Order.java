package me.ptakondrej.minieshop.order;

import jakarta.persistence.*;
import lombok.*;
import me.ptakondrej.minieshop.orderItem.OrderItem;
import me.ptakondrej.minieshop.user.User;
import org.hibernate.annotations.CreationTimestamp;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
@Builder
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToMany
	@JoinTable(
			name = "order_items",
			joinColumns = @JoinColumn(name = "order_id"),
			inverseJoinColumns = @JoinColumn(name = "product_id")
	)
	private List<OrderItem> orderItems;

	@Column(name = "created_at", nullable = false)
	@CreationTimestamp
	private String createdAt;

	@Column(name = "status", nullable = false)
	private OrderStatus status = OrderStatus.PENDING;

}
