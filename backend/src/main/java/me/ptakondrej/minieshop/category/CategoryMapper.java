package me.ptakondrej.minieshop.category;

import me.ptakondrej.minieshop.models.CategoryDTO;

public class CategoryMapper {

	public static CategoryDTO convertToDto(Category category) {
		return CategoryDTO.builder()
				.id(category.getId())
				.title(category.getTitle())
				.slug(category.getSlug())
				.description(category.getDescription())
				.imageUrl(category.getImageUrl())
				.enabled(category.getDeleted())
				.build();
	}

	public static Category convertToEntity(CategoryDTO categoryDTO) {
		return Category.builder()
				.id(categoryDTO.getId())
				.title(categoryDTO.getTitle())
				.slug(categoryDTO.getSlug())
				.description(categoryDTO.getDescription())
				.imageUrl(categoryDTO.getImageUrl())
				.enabled(categoryDTO.getEnabled())
				.build();
	}

}
