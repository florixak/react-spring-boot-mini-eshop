package me.ptakondrej.minieshop.order;

import jakarta.persistence.*;
import lombok.*;
import me.ptakondrej.minieshop.orderItem.OrderItem;
import me.ptakondrej.minieshop.user.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

	@Column(name = "status", nullable = false)
	private OrderStatus status = OrderStatus.PENDING;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> orderItems;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private String createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private String updatedAt;
}
