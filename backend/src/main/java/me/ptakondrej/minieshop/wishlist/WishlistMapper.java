package me.ptakondrej.minieshop.wishlist;

import me.ptakondrej.minieshop.models.WishlistDTO;
import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.product.ProductMapper;
import me.ptakondrej.minieshop.user.UserMapper;

import java.util.Set;
import java.util.stream.Collectors;

public class WishlistMapper {

	public static WishlistDTO convertToDto(Wishlist wishlist) {
		WishlistDTO wishlistDTO = new WishlistDTO();
		wishlistDTO.setProducts( wishlist.getProducts().stream()
				.map(ProductMapper::convertToDto)
				.collect(Collectors.toSet()));
		wishlistDTO.setUser(UserMapper.convertToDto(wishlist.getUser()));
		return wishlistDTO;
	}

	public static Wishlist convertToEntity(WishlistDTO wishlistDTO) {
		Set<Product> products = wishlistDTO.getProducts().stream()
				.map(ProductMapper::convertToEntity)
				.collect(Collectors.toSet());
		Wishlist wishlist = new Wishlist();
		wishlist.setProducts(products);
		wishlist.setUser(UserMapper.convertToEntity(wishlistDTO.getUser()));
		return wishlist;
	}
}
