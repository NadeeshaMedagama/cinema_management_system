package com.example.cinema.managing.system.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.cinema.managing.system.model.FoodItem;

@Repository
public interface FoodItemRepository extends MongoRepository<FoodItem, String> {

    List<FoodItem> findByCategory(String category);

    List<FoodItem> findByAvailableTrue();
}
