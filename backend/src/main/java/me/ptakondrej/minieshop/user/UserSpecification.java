package me.ptakondrej.minieshop.user;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {

	public static Specification<User> filter(
			String search
	) {
		return (root, query, cb) -> {
			Predicate predicate = cb.conjunction();

			if (search != null && !search.isBlank()) {
				String likeSearch = "%" + search.toLowerCase() + "%";
				Predicate usernamePredicate = cb.like(cb.lower(root.get("username")), likeSearch);
				Predicate emailPredicate = cb.like(cb.lower(root.get("email")), likeSearch);
				Predicate firstNamePredicate = cb.like(cb.lower(root.get("firstName")), likeSearch);
				Predicate lastNamePredicate = cb.like(cb.lower(root.get("lastName")), likeSearch);
				predicate = cb.and(predicate, cb.or(usernamePredicate, emailPredicate, firstNamePredicate, lastNamePredicate));
			}
			return predicate;
		};
	}
}
