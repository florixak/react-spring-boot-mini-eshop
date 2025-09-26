package me.ptakondrej.minieshop.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
	Optional<User> findByUsername(String username);
	long countByCreatedAtAfter(LocalDateTime dateTime);
	boolean existsByVerificationCode(String code);
}
