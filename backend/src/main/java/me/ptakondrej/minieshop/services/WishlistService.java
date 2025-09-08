package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserRepository;
import me.ptakondrej.minieshop.wishlist.Wishlist;
import me.ptakondrej.minieshop.wishlist.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class WishlistService {

	private final WishlistRepository wishlistRepository;
	private final UserRepository userRepository;

	public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository) {
		this.wishlistRepository = wishlistRepository;
		this.userRepository = userRepository;
	}

	@Transactional
	public void addProductToWishlist(Long userId, Product product) {
		if (product == null) {
			throw new IllegalArgumentException("Product cannot be null");
		}
		if (userId == null || userId <= 0) {
			throw new IllegalArgumentException("Invalid user ID");
		}
		Wishlist wishlist = wishlistRepository.findByUserId(userId).orElse(null);
		if (wishlist != null) {
			wishlist.getProducts().add(product);
			wishlistRepository.save(wishlist);
		} else {
			throw new IllegalArgumentException("Wishlist not found for user ID: " + userId);
		}
	}

	@Transactional
	public void removeProductFromWishlist(Long userId, Product product) {
		Wishlist wishlist = wishlistRepository.findByUserId(userId).orElse(null);
		if (wishlist != null) {
			wishlist.getProducts().remove(product);
			wishlistRepository.save(wishlist);
		}
	}

	@Transactional
	public void clearWishlist(Long userId) {
		Wishlist wishlist = wishlistRepository.findByUserId(userId).orElse(null);
		if (wishlist != null) {
			wishlist.getProducts().clear();
			wishlistRepository.save(wishlist);
		}
	}

	@Transactional
	public Wishlist createWishlist(Long userId) {
		if (userId == null || userId <= 0) {
			throw new IllegalArgumentException("Invalid user ID");
		}
		if (wishlistRepository.findByUserId(userId).isPresent()) {
			throw new IllegalArgumentException("Wishlist already exists for user ID: " + userId);
		}
		if (!userRepository.existsById(userId)) {
			throw new IllegalArgumentException("User not found with ID: " + userId);
		}
		Wishlist wishlist = new Wishlist();
		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
		wishlist.setUser(user);
		return wishlistRepository.save(wishlist);
	}

	@Transactional(readOnly = true)
	public Set<Product> getWishlistByUserId(Long userId) {
		Wishlist wishlist = wishlistRepository.findByUserId(userId).orElse(null);
		if (wishlist != null) {
			return wishlist.getProducts();
		}
		return Set.of();
	}

	@Transactional
	public void deleteWishlistByUserId(Long userId) {
		wishlistRepository.findByUserId(userId).ifPresent(wishlistRepository::delete);
	}
}
