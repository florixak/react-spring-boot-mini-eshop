package me.ptakondrej.minieshop.order;

import jakarta.persistence.*;
import lombok.*;
import me.ptakondrej.minieshop.orderItem.OrderItem;
import me.ptakondrej.minieshop.user.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
	@JoinColumn(name = "user_id")
	private User user;

	@Column(name = "customer_email")
	private String customerEmail;

	@Column(name = "customer_phone")
	private String customerPhone;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private OrderStatus status;

	@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OrderItem> orderItems;

	@Column(name = "shipping_address", nullable = false)
	private String shippingAddress;

	@Enumerated(EnumType.STRING)
	@Column(name = "shipping_method", nullable = false)
	private ShippingMethod shippingMethod;

	@Column(name = "total_price", nullable = false, precision = 10, scale = 2)
	private BigDecimal totalPrice;

	@Column(name = "stripe_session_id", unique = true)
	private String stripeSessionId;

	@Column(name = "payment_at")
	private LocalDateTime paymentAt;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;

	@Column(name = "expires_at", nullable = false)
	private LocalDateTime expiresAt;
}
