package me.ptakondrej.minieshop.models;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

	private Long id;
	private String title;
	private String slug;
	private String description;
	private BigDecimal price;
	private String imageUrl;
	private Integer stockQuantity;
	private CategoryDTO category;
	private Boolean enabled;
}
