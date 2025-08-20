package me.ptakondrej.minieshop.product;

import me.ptakondrej.minieshop.category.CategoryMapper;
import me.ptakondrej.minieshop.models.ProductDTO;

public class ProductMapper {

	public static ProductDTO convertToDto(Product product) {
		return ProductDTO.builder()
				.id(product.getId())
				.title(product.getTitle())
				.slug(product.getSlug())
				.description(product.getDescription())
				.imageUrl(product.getImageUrl())
				.price(product.getPrice())
				.category(CategoryMapper.convertToDto(product.getCategory()))
				.enabled(product.getEnabled())
				.build();
	}

	public static Product convertToEntity(ProductDTO productDTO) {
		return Product.builder()
				.id(productDTO.getId())
				.title(productDTO.getTitle())
				.slug(productDTO.getSlug())
				.description(productDTO.getDescription())
				.imageUrl(productDTO.getImageUrl())
				.price(productDTO.getPrice())
				.category(CategoryMapper.convertToEntity(productDTO.getCategory()))
				.enabled(productDTO.getEnabled())
				.build();
	}
}
