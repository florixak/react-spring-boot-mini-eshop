package me.ptakondrej.minieshop.product;

import me.ptakondrej.minieshop.models.ProductDTO;
import me.ptakondrej.minieshop.models.ProductListDataDTO;
import me.ptakondrej.minieshop.requests.ProductRequest;
import me.ptakondrej.minieshop.requests.ProductsRequest;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.CategoryService;
import me.ptakondrej.minieshop.services.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<ProductListDataDTO>(false, null, "An error occurred while retrieving products: " + e.getMessage()));
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
