package me.ptakondrej.minieshop.product;

import me.ptakondrej.minieshop.category.Category;
import me.ptakondrej.minieshop.models.ProductDTO;
import me.ptakondrej.minieshop.models.ProductListDataDTO;
import me.ptakondrej.minieshop.requests.ProductCreationRequest;
import me.ptakondrej.minieshop.requests.ProductsRequest;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.CategoryService;
import me.ptakondrej.minieshop.services.ProductService;
import me.ptakondrej.minieshop.utils.SlugUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

	private final ProductService productService;
	private final CategoryService categoryService;

	public ProductController(ProductService productService, CategoryService categoryService) {
		this.productService = productService;
		this.categoryService = categoryService;
	}

	@GetMapping
	public ResponseEntity<Response<ProductListDataDTO>> getAllProducts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestBody ProductsRequest productsRequest) {
		try {
			if (productsRequest == null || page < 0 || size <= 0) {
				return ResponseEntity.badRequest().body(new Response<ProductListDataDTO>(false, null, "Invalid request parameters"));
			}

			Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
			Page<Product> products = productService.getAllProducts(pageable);
			List<ProductDTO> productDTOs = products.getContent().stream()
					.map(ProductMapper::convertToDto)
					.toList();

			return ResponseEntity.ok(
					new Response<ProductListDataDTO>(
							true,
							new ProductListDataDTO(
									productDTOs,
									products.getNumber(),
									products.getSize(),
									products.getTotalElements(),
									products.getTotalPages()
							),
							"Products retrieved successfully"
					)
			);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<ProductListDataDTO>(false, null, e.getMessage()));
		}
	}

	@GetMapping("/{slug}")
	public ResponseEntity<Response<ProductDTO>> getProductBySlug(@PathVariable String slug) {
		try {
			if (slug == null || slug.trim().isEmpty()) {
				return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, "Product slug cannot be null or empty"));
			}
			Product product = productService.getProductBySlug(slug);
			if (product == null) {
				return ResponseEntity.notFound().build();
			}
			ProductDTO productDTO = ProductMapper.convertToDto(product);
			return ResponseEntity.ok(new Response<ProductDTO>(true, productDTO, "Product retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, e.getMessage()));
		}
	}

	@PostMapping("/admin")
	public ResponseEntity<Response<ProductDTO>> createProduct(@RequestBody ProductCreationRequest request) {
		try {
			if (request == null || request.getTitle() == null || request.getTitle().trim().isEmpty()) {
				return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, "Product data cannot be null or empty"));
			}
			if (request.getPrice() <= 0) {
				return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, "Product price must be greater than zero"));
			}
			if (request.getCategoryId() <= 0) {
				return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, "Category ID must be a positive number"));
			}

			if (productService.existsProductBySlug(request.getTitle())) {
				return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, "Product with this title already exists"));
			}

			Category category = categoryService.getCategoryById(request.getCategoryId());
			if (category == null) {
				return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, "Category not found with ID: " + request.getCategoryId()));
			}

			Product product = Product.builder()
					.title(request.getTitle())
					.description(request.getDescription())
					.price(BigDecimal.valueOf(request.getPrice()))
					.category(category)
					.imageUrl(request.getImageUrl())
					.enabled(true)
					.build();
			Product savedProduct = productService.createProduct(product);
			ProductDTO savedProductDTO = ProductMapper.convertToDto(savedProduct);
			return ResponseEntity.ok(new Response<ProductDTO>(true, savedProductDTO, "Product created successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, e.getMessage()));
		}
	}
}
