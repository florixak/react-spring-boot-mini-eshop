		package me.ptakondrej.minieshop.order;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class OrderSpecification {

	public static Specification<Order> filter(
			String search
	) {
		return (root, query, cb) -> {
			Predicate predicate = cb.conjunction();

			if (search != null && !search.isBlank()) {
				String likeSearch = "%" + search.toLowerCase() + "%";

				Predicate orderNumberPredicate = cb.like(cb.function("text", String.class, root.get("id")), likeSearch);
				Predicate userEmailPredicate = cb.like(cb.lower(root.get("customerEmail")), likeSearch);
				Join<?, ?> userJoin = root.join("user");
				Predicate userFirstNamePredicate = cb.like(cb.lower(userJoin.get("firstName")), likeSearch);
				Predicate userLastNamePredicate = cb.like(cb.lower(userJoin.get("lastName")), likeSearch);

				predicate = cb.and(predicate, cb.or(
						orderNumberPredicate,
						userEmailPredicate,
						userFirstNamePredicate,
						userLastNamePredicate
				));
			}
			return predicate;
		};
	}
}
