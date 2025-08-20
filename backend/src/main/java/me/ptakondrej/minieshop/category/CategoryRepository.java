package me.ptakondrej.minieshop.category;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	List<Category> findAllByNameContainingIgnoreCase(String name, Pageable pageable);
	Optional<Category> findByName(String name);
	boolean existsByName(String name);
}
