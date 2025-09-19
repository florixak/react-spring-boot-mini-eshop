package me.ptakondrej.minieshop.wishlist;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.user.User;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "wishlists")
public class Wishlist {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	@ManyToMany
	@JoinTable(
			name = "wishlist_products",
			joinColumns = @JoinColumn(name = "wishlist_id"),
			inverseJoinColumns = @JoinColumn(name = "product_id")
	)
	private Set<Product> products = new HashSet<>();
}
