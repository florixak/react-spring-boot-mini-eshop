package me.ptakondrej.minieshop.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
	List<Order> findAllByUserIdOrderByCreatedAtDesc(Long userId);
	Optional<Order> findByUserIdAndId(Long userId, Long orderId);
	List<Order> findAllByStatusAndExpiresAtBefore(OrderStatus status, LocalDateTime dateTime);
	@Query("SELECT o FROM Order o WHERE o.user.id = :userId")
	Page<Order> findAllByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);
	long countByStatus(OrderStatus status);

}
