package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.category.Category;
import me.ptakondrej.minieshop.category.CategoryRepository;
import me.ptakondrej.minieshop.requests.CategoryCreationRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

import static me.ptakondrej.minieshop.utils.SlugUtils.generateSlug;

@Service
public class CategoryService {

	private final CategoryRepository categoryRepository;

	public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	public List<Category> getAllCategories(String name, Pageable pageable) {
		if (name == null || name.isEmpty()) {
			return categoryRepository.findAll(pageable).getContent();
		} else {
			return categoryRepository.findAllByTitleContainingIgnoreCase(name, pageable);
		}
	}

	public Category createCategory(CategoryCreationRequest request) throws IllegalArgumentException {
		if (request == null) {
			throw new IllegalArgumentException("Category creation request cannot be null");
		}
		if (request.getTitle() == null || request.getTitle().isEmpty()) {
			throw new IllegalArgumentException("Category title cannot be null or empty");
		}
		if (request.getDescription() == null || request.getDescription().isEmpty()) {
			throw new IllegalArgumentException("Category description cannot be null or empty");
		}
		if (request.getImageUrl() == null || request.getImageUrl().isEmpty()) {
			throw new IllegalArgumentException("Category image URL cannot be null or empty");
		}

		Category category = Category.builder()
				.title(request.getTitle())
				.slug(generateSlug(request.getTitle()))
				.description(request.getDescription())
				.imageUrl(request.getImageUrl())
				.enabled(true)
				.build();

		return categoryRepository.save(category);
	}

	public Category getCategoryById(Long id) {
		return categoryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
	}






}
