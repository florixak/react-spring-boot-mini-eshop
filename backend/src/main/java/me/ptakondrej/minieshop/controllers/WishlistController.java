package me.ptakondrej.minieshop.controllers;

import me.ptakondrej.minieshop.models.ProductDTO;
import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.product.ProductMapper;
import me.ptakondrej.minieshop.responses.PageableResponse;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.ProductService;
import me.ptakondrej.minieshop.services.WishlistService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@Controller
@RequestMapping("/api/wishlist")
public class WishlistController {

	private final WishlistService wishlistService;
	private final ProductService productService;

	public WishlistController(WishlistService wishlistService, ProductService productService) {
		this.wishlistService = wishlistService;
		this.productService = productService;
	}

	@GetMapping("/all")
	public ResponseEntity<Response<List<ProductDTO>>> getAllWishlistProducts(@RequestAttribute("userId") Long userId) {
		try {
			if (userId == null || userId <= 0) {
				return ResponseEntity.badRequest().body(new Response<>(false, null, "Invalid user ID"));
			}
			Set<Product> wishlistProducts = wishlistService.getWishlistByUserId(userId);
			List<ProductDTO> productDTOs = wishlistProducts.stream()
					.map(ProductMapper::convertToDto)
					.toList();
			return ResponseEntity.ok(new Response<>(true, productDTOs, "Wishlist products retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Failed to retrieve wishlist products: " + e.getMessage()));
		}
	}

	@GetMapping
	public ResponseEntity<Response<PageableResponse<ProductDTO>>> getWishlist(@RequestAttribute("userId") Long userId, @RequestParam(required = false, defaultValue = "0") Integer page, @RequestParam(required = false, defaultValue = "10") Integer size) {
		try {
			if (page < 0 || size <= 0) {
				return ResponseEntity.badRequest().body(new Response<>(false, null, "Invalid pagination parameters"));
			}
			if (userId == null || userId <= 0) {
				return ResponseEntity.badRequest().body(new Response<>(false, null, "Invalid user ID"));
			}
			Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
			Page<Product> wishlistProducts = wishlistService.getWishlistProducts(userId, pageable);
			List<ProductDTO> productDTOs = wishlistProducts.stream()
					.map(ProductMapper::convertToDto)
					.toList();

			return ResponseEntity.ok(new Response<>(true, new PageableResponse<>(
					productDTOs,
					wishlistProducts.getNumber(),
					wishlistProducts.getSize(),
					wishlistProducts.getTotalElements(),
					wishlistProducts.getTotalPages()
			), "Wishlist retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Failed to retrieve wishlist: " + e.getMessage()));
		}
	}

	@DeleteMapping("/clear")
	public ResponseEntity<Response<String>> clearWishlist(@RequestAttribute("userId") Long userId) {
		try {
			wishlistService.clearWishlist(userId);
			return ResponseEntity.ok(new Response<>(true, null, "Wishlist cleared successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Failed to clear wishlist: " + e.getMessage()));
		}
	}

	@PostMapping("/add/{productId}")
	public ResponseEntity<Response<String>> addProductToWishlist(@RequestAttribute("userId") Long userId, @PathVariable Long productId) {
		try {
			wishlistService.addProductToWishlist(userId, productService.getProductById(productId));
			return ResponseEntity.status(201).body(new Response<>(true, null, "Product added to wishlist successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Failed to add product to wishlist: " + e.getMessage()));
		}
	}

	@DeleteMapping("/remove/{productId}")
	public ResponseEntity<Response<String>> removeProductFromWishlist(@RequestAttribute("userId") Long userId, @PathVariable Long productId) {
		try {
			wishlistService.removeProductFromWishlist(userId, productService.getProductById(productId));
			return ResponseEntity.ok(new Response<>(true, null, "Product removed from wishlist successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<>(false, null, "Failed to remove product from wishlist: " + e.getMessage()));
		}
	}
}
