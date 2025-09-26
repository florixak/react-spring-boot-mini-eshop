package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.category.Category;
import me.ptakondrej.minieshop.category.CategoryRepository;
import me.ptakondrej.minieshop.requests.CategoryRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static me.ptakondrej.minieshop.utils.SlugUtils.generateSlug;

@Service
public class CategoryService {

	private final CategoryRepository categoryRepository;

	public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	@Transactional(readOnly = true)
	public List<Category> getAllCategories(String name, Pageable pageable) {
		if (name == null || name.isEmpty()) {
			return categoryRepository.findAll(pageable).getContent();
		} else {
			return categoryRepository.findAllByTitleContainingIgnoreCase(name, pageable);
		}
	}

	@Transactional(readOnly = true)
	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}

	@Transactional
	public Category createCategory(CategoryRequest request) throws IllegalArgumentException {
		if (!validateCategoryRequest(request)) {
			throw new IllegalArgumentException("Invalid category creation request");
		}

		if (existsCategoryBySlug(request.getTitle())) {
			throw new IllegalArgumentException("Category with the same title already exists");
		}

		Category category = Category.builder()
				.title(request.getTitle())
				.slug(generateSlug(request.getTitle()))
				.description(request.getDescription())
				.enabled(true)
				.deleted(false)
				.build();

		return categoryRepository.save(category);
	}

	@Transactional
	public Category updateCategory(Long id, CategoryRequest request) throws IllegalArgumentException {
		if (id == null || id <= 0) {
			throw new IllegalArgumentException("Category ID must be a positive number");
		}

		if (!validateCategoryRequest(request)) {
			throw new IllegalArgumentException("Invalid category update request");
		}

		Category existingCategory = categoryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));

		existingCategory.setTitle(request.getTitle());
		existingCategory.setSlug(generateSlug(request.getTitle()));
		existingCategory.setDescription(request.getDescription());
		existingCategory.setEnabled(request.getEnabled() != null ? request.getEnabled() : existingCategory.getEnabled());

		return categoryRepository.save(existingCategory);
	}

	@Transactional
	public Category deleteCategory(Long id) throws IllegalArgumentException {
		if (id == null || id <= 0) {
			throw new IllegalArgumentException("Category ID must be a positive number");
		}

		Category existingCategory = categoryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
		existingCategory.setDeleted(true);
		existingCategory.setDeletedAt(LocalDateTime.now());
		existingCategory.setEnabled(false);
		return categoryRepository.save(existingCategory);
	}

	public boolean existsCategoryBySlug (String title){
		String slug = generateSlug(title);
		return categoryRepository.existsBySlug(slug);
	}

	public Category getCategoryById (Long id){
		return categoryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
	}

	public Category getCategoryBySlug (String slug){
		return categoryRepository.findBySlug(slug)
				.orElseThrow(() -> new IllegalArgumentException("Category not found with slug: " + slug));
	}

	private boolean validateCategoryRequest (CategoryRequest request){
		return request != null
				&& request.getTitle() != null && !request.getTitle().isEmpty()
				&& request.getDescription() != null && !request.getDescription().isEmpty();
	}

}
