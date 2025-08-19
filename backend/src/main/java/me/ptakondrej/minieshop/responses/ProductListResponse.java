package me.ptakondrej.minieshop.responses;

import lombok.Getter;
import lombok.Setter;
import me.ptakondrej.minieshop.models.ProductDTO;

import java.util.List;

@Getter
@Setter
public class ProductListResponse extends Response {

	private List<ProductDTO> products;

	public ProductListResponse(String message, List<ProductDTO> products, boolean success) {
		super(success, message);
		this.products = products;
	}
}
