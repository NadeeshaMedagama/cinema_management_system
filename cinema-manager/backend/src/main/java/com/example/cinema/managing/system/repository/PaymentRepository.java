package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByUserId(String userId);
    List<Payment> findByBookingId(String bookingId);
    List<Payment> findByOrderId(String orderId);
    List<Payment> findByStatus(String status);
    List<Payment> findByPaymentDateBetween(LocalDateTime start, LocalDateTime end);
    List<Payment> findByPaymentType(String paymentType);
}
