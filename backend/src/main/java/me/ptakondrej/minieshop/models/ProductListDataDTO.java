package me.ptakondrej.minieshop.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProductListDataDTO {
	private List<ProductDTO> products;
	private Integer page;
	private Integer size;
	private Long totalItems;
	private Integer totalPages;
}
