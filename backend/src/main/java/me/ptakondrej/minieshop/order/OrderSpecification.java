package me.ptakondrej.minieshop.order;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import me.ptakondrej.minieshop.user.User;
import org.springframework.data.jpa.domain.Specification;

public class OrderSpecification {

	public static Specification<Order> filter(
			String search
	) {
		return (root, query, cb) -> {
			Predicate predicate = cb.conjunction();

			if (search != null && !search.isBlank()) {
				String likeSearch = "%" + search.toLowerCase() + "%";

				Predicate orderNumberPredicate = cb.like(cb.lower(cb.literal(String.valueOf(root.get("id")))), likeSearch);
				Predicate userEmailPredicate = cb.like(cb.lower(root.get("customerEmail")), likeSearch);
				Predicate orderStatus = cb.like(cb.lower(root.get("status").as(String.class)), likeSearch);
				Join<Order, User> userJoin = root.join("user", JoinType.LEFT);
				Predicate userUsernamePredicate = cb.like(cb.lower(userJoin.get("username")), likeSearch);

				predicate = cb.and(predicate, cb.or(
						orderNumberPredicate,
						userEmailPredicate,
						userUsernamePredicate,
						orderStatus
				));
			}
			return predicate;
		};
	}
}
