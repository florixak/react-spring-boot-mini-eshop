package me.ptakondrej.minieshop.product;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
@Builder
public class Product {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String title;
	@Column(nullable = false, length = 500)
	private String description;
	@Column(nullable = false)
	private String imageUrl;
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal price;
	@Column(nullable = false, columnDefinition = "integer default 0")
	private Integer quantity;
}
