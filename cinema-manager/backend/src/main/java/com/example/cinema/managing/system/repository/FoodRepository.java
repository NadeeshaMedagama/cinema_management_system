package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Food;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodRepository extends MongoRepository<Food, String> {
    List<Food> findByActiveTrue();
    List<Food> findByCategory(String category);
    List<Food> findByCategoryAndActiveTrue(String category);
    List<Food> findByComboTrue();
    List<Food> findTop10ByOrderBySalesCountDesc();
}
