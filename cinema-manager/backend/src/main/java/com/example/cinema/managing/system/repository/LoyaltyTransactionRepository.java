package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.LoyaltyTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoyaltyTransactionRepository extends MongoRepository<LoyaltyTransaction, String> {
    List<LoyaltyTransaction> findByUserId(String userId);
    List<LoyaltyTransaction> findByUserIdOrderByTransactionDateDesc(String userId);
    List<LoyaltyTransaction> findByType(String type);
}
