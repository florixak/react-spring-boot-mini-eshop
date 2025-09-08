package me.ptakondrej.minieshop.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

	private String title;
	private String description;
	private String imageUrl;
	private double price;
	private long categoryId;
	private Integer stockQuantity;
	private Boolean enabled;
}
