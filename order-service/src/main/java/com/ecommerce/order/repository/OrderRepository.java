package com.ecommerce.order.repository;

import com.ecommerce.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUserId(Long userId);
    
    @Query("SELECT o FROM Order o WHERE o.orderDate >= :startDate ORDER BY o.orderDate DESC")
    List<Order> findRecentOrders(@Param("startDate") LocalDateTime startDate);
    
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
}
