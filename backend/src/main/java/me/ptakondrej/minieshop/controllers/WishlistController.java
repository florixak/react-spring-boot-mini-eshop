package me.ptakondrej.minieshop.controllers;

import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.requests.WishlistManipulateRequest;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.ProductService;
import me.ptakondrej.minieshop.services.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

	@GetMapping
	public ResponseEntity<Response<Set<Product>>> getWishlist(@RequestAttribute("userId") Long userId) {
		try {
			Set<Product> wishlistProducts = wishlistService.getWishlistByUserId(userId);
			return ResponseEntity.ok(new Response<>(true, wishlistProducts, "Wishlist retrieved successfully"));
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
