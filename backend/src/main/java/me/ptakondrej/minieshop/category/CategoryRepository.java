package me.ptakondrej.minieshop.category;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	List<Category> findAllByTitleContainingIgnoreCase(String name, Pageable pageable);
	Optional<Category> findByTitle(String name);
	Optional<Category> findBySlug(String slug);
	boolean existsBySlug(String slug);
}
