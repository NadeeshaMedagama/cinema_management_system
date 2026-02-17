package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserIdAndStatus(String userId, String status);
    Optional<Cart> findByUserId(String userId);
}
