package me.ptakondrej.minieshop.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
	List<Product> findAllByEnabledTrue(Pageable pageable);
	List<Product> findAllByEnabledTrue();
	Page<Product> findAllByCategoryIdAndEnabledTrue(long categoryId, Pageable pageable);
	List<Product> findAllByCategoryIdAndEnabledTrue(long categoryId);
	Optional<Product> findById(long id);
	Optional<Product> findBySlug(String slug);

	void deleteById(long id);
}
