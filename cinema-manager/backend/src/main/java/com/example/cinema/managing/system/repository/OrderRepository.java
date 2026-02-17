package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByUserIdOrderByOrderDateDesc(String userId);
    List<Order> findByOrderType(String orderType);
    List<Order> findByStatus(String status);
    List<Order> findByBookingId(String bookingId);
    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
}
