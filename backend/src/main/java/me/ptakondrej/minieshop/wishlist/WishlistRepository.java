package me.ptakondrej.minieshop.wishlist;

import me.ptakondrej.minieshop.product.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
	Optional<Wishlist> findByUserId(Long userId);
	@Query("SELECT p FROM Wishlist w JOIN w.products p WHERE w.user.id = :userId")
	Page<Product> findProductsByUserId(@Param("userId") Long userId, Pageable pageable);
}
