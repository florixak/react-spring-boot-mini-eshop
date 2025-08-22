package me.ptakondrej.minieshop.category;

import me.ptakondrej.minieshop.models.CategoryDTO;
import me.ptakondrej.minieshop.requests.CategoryRequest;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.CategoryService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	private final CategoryService categoryService;

	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@GetMapping
	public ResponseEntity<Response<List<CategoryDTO>>> getAllCategories(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int limit,
			@RequestParam(required = false) String name
	) {
		try {
			if (page < 0 || limit <= 0) {
				throw new IllegalArgumentException("Page number must be non-negative and limit must be positive.");
			}
			if (name != null && name.trim().isEmpty()) {
				throw new IllegalArgumentException("Name parameter cannot be empty.");
			}

			Pageable pageable = PageRequest.of(page, limit, Sort.by("id").ascending());
			List<Category> categories = categoryService.getAllCategories(name, pageable);
			if (categories.isEmpty()) {
				return ResponseEntity.ok(new Response<List<CategoryDTO>>(true, List.of(), "No categories found"));
			}
			List<CategoryDTO> categoryDTOs = categories.stream()
					.map(CategoryMapper::convertToDto)
					.toList();

			return ResponseEntity.ok(new Response<List<CategoryDTO>>(true, categoryDTOs, "Categories retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<List<CategoryDTO>>(false, null, e.getMessage()));
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<Response<CategoryDTO>> getCategoryById(@PathVariable Long id) {
		try {
			if (id == null || id <= 0) {
				throw new IllegalArgumentException("Category ID must be a positive number.");
			}

			Category category = categoryService.getCategoryById(id);
			if (category == null) {
				return ResponseEntity.notFound().build();
			}

			CategoryDTO categoryDTO = CategoryMapper.convertToDto(category);
			return ResponseEntity.ok(new Response<CategoryDTO>(true, categoryDTO, "Category retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<CategoryDTO>(false, null, e.getMessage()));
		}
	}

	@PostMapping("/admin")
	public ResponseEntity<Response<CategoryDTO>> createCategory(@RequestBody CategoryRequest request) {
		try {
			if (request == null) {
				throw new IllegalArgumentException("Category data cannot be null.");
			}

			Category category = categoryService.createCategory(request);
			CategoryDTO createdCategoryDTO = CategoryMapper.convertToDto(category);
			return ResponseEntity.ok(new Response<CategoryDTO>(true, createdCategoryDTO, "Category created successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<CategoryDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<CategoryDTO>(false, null, "An error occurred while creating the category: " + e.getMessage()));
		}
	}

	@PutMapping("/admin/{id}")
	public ResponseEntity<Response<CategoryDTO>> updateCategory(@PathVariable Long id, @RequestBody CategoryRequest request) {
		try {
			Category category = categoryService.updateCategory(id, request);
			CategoryDTO updatedCategoryDTO = CategoryMapper.convertToDto(category);
			return ResponseEntity.ok(new Response<CategoryDTO>(true, updatedCategoryDTO, "Category updated successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<CategoryDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<CategoryDTO>(false, null, "An error occurred while updating the category: " + e.getMessage()));
		}
	}

	@DeleteMapping("/admin/{id}")
	public ResponseEntity<Response<Void>> deleteCategory(@PathVariable Long id) {
		try {
			categoryService.deleteCategory(id);
			return ResponseEntity.ok(new Response<Void>(true, null, "Category deleted successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<Void>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<Void>(false, null, "An error occurred while deleting the category: " + e.getMessage()));
		}
	}
}
