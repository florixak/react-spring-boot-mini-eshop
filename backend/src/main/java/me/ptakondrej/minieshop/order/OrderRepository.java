package me.ptakondrej.minieshop.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findAllByUserId(Long userId);
	Optional<Order> findByUserIdAndId(Long userId, Long orderId);
	List<Order> findAllByStatusAndExpiresAtBefore(OrderStatus status, LocalDateTime dateTime);

}
