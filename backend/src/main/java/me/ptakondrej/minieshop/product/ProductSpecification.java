package me.ptakondrej.minieshop.product;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {
	public static Specification<Product> filter(Long categoryId, Double minPrice, Double maxPrice, String search, boolean inStock) {
		return (root, query, cb) -> {
			Predicate predicate = cb.conjunction();
			if (categoryId != null) {
				predicate = cb.and(predicate, cb.equal(root.get("category").get("id"), categoryId));
			}
			if (minPrice != null) {
				predicate = cb.and(predicate, cb.ge(root.get("price"), minPrice));
			}
			if (maxPrice != null) {
				predicate = cb.and(predicate, cb.le(root.get("price"), maxPrice));
			}
			if (search != null && !search.isBlank()) {
				predicate = cb.and(predicate, cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"));
			}
			if (inStock) {
				predicate = cb.and(predicate, cb.greaterThan(root.get("stockQuantity"), 0));
			}
			predicate = cb.and(predicate, cb.isFalse(root.get("deleted")));
			predicate = cb.and(predicate, cb.isTrue(root.get("enabled")));
			return predicate;
		};
	}
}
