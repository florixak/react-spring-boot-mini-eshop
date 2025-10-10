package me.ptakondrej.minieshop.controllers;

import me.ptakondrej.minieshop.models.ProductDTO;
import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.product.ProductMapper;
import me.ptakondrej.minieshop.requests.ProductRequest;
import me.ptakondrej.minieshop.responses.PageableResponse;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.ProductService;
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

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	@GetMapping
	public ResponseEntity<Response<PageableResponse<ProductDTO>>> getAllProducts(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(required = false) String categorySlug,
			@RequestParam(required = false) Double minPrice,
			@RequestParam(required = false) Double maxPrice,
			@RequestParam(required = false) String search,
			@RequestParam(defaultValue = "false") boolean inStock,
			@RequestParam(defaultValue = "id,asc") String[] sort) {
		try {
			if (page < 0 || size <= 0) {
				return ResponseEntity.badRequest().body(new Response<>(false, null, "Invalid request parameters"));
			}

			Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
			Page<Product> products = productService.filterProducts(categorySlug, minPrice, maxPrice, search, inStock, pageable);
			List<ProductDTO> productDTOs = products.stream()
					.map(ProductMapper::convertToDto)
					.toList();
			return ResponseEntity.ok(
					new Response<>(
							true,
							new PageableResponse<ProductDTO>(
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
			return ResponseEntity.badRequest().body(new Response<>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "An error occurred while retrieving products: " + e.getMessage()));
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
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<ProductDTO>(false, null, "An error occurred while retrieving the product: " + e.getMessage()));
		}
	}

	@GetMapping("/most-expensive")
	public ResponseEntity<Response<BigDecimal>> getMostExpensivePrice(@RequestParam(required = false) String categorySlug) {
		try {
			Product product = productService.getMostExpensiveProduct(categorySlug);
			if (product == null) {
				return ResponseEntity.notFound().build();
			}
			ProductDTO productDTO = ProductMapper.convertToDto(product);
			return ResponseEntity.ok(new Response<>(true, productDTO.getPrice(), "Most expensive price retrieved successfully"));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "An error occurred while retrieving the most expensive product: " + e.getMessage()));
		}
	}

	@GetMapping("/admin")
	public ResponseEntity<Response<List<ProductDTO>>> getAllProductsAdmin() {
		try {
			List<Product> products = productService.getAllProducts();
			List<ProductDTO> productDTOs = products.stream()
					.map(ProductMapper::convertToDto)
					.toList();
			return ResponseEntity.ok(new Response<List<ProductDTO>>(true, productDTOs, "Products retrieved successfully"));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<List<ProductDTO>>(false, null, "An error occurred while retrieving products: " + e.getMessage()));
		}
	}

	@GetMapping("/admin/{id}")
	public ResponseEntity<Response<ProductDTO>> getProductByIdAdmin(@PathVariable Long id) {
		try {
			if (id == null || id <= 0) {
				return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, "Invalid product ID"));
			}
			Product product = productService.getProductById(id);
			if (product == null) {
				return ResponseEntity.notFound().build();
			}
			ProductDTO productDTO = ProductMapper.convertToDto(product);
			return ResponseEntity.ok(new Response<ProductDTO>(true, productDTO, "Product retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<ProductDTO>(false, null, "An error occurred while retrieving the product: " + e.getMessage()));
		}
	}

	@PostMapping("/admin")
	public ResponseEntity<Response<ProductDTO>> createProduct(@RequestBody ProductRequest request) {
		try {
			Product savedProduct = productService.createProduct(request);
			ProductDTO savedProductDTO = ProductMapper.convertToDto(savedProduct);
			return ResponseEntity.ok(new Response<ProductDTO>(true, savedProductDTO, "Product created successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<ProductDTO>(false, null, "An error occurred while creating the product: " + e.getMessage()));
		}
	}

	@PutMapping("/admin/{id}")
	public ResponseEntity<Response<ProductDTO>> updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
		try {
			Product product = productService.updateProduct(id, request);
			ProductDTO productDTO = ProductMapper.convertToDto(product);
			return ResponseEntity.ok(new Response<ProductDTO>(true, productDTO, "Product updated successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<ProductDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<ProductDTO>(false, null, "An error occurred while updating the product: " + e.getMessage()));
		}
	}

	@DeleteMapping("/admin/{id}")
	public ResponseEntity<Response<Void>> deleteProduct(@PathVariable Long id) {
		try {
			productService.deleteProduct(id);
			return ResponseEntity.ok(new Response<Void>(true, null, "Product deleted successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<Void>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<Void>(false, null, "An error occurred while deleting the product: " + e.getMessage()));
		}
	}
}
