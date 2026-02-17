package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Food;
import com.example.cinema.managing.system.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public List<Food> getActiveFoods() {
        return foodRepository.findByActiveTrue();
    }

    public Optional<Food> getFoodById(String id) {
        return foodRepository.findById(id);
    }

    public List<Food> getFoodsByCategory(String category) {
        return foodRepository.findByCategoryAndActiveTrue(category);
    }

    public List<Food> getCombos() {
        return foodRepository.findByComboTrue();
    }

    public Food createFood(Food food) {
        food.setCreatedAt(LocalDateTime.now());
        food.setSalesCount(0);
        return foodRepository.save(food);
    }

    public Food updateFood(String id, Food foodDetails) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
        
        food.setName(foodDetails.getName());
        food.setDescription(foodDetails.getDescription());
        food.setPrice(foodDetails.getPrice());
        food.setCategory(foodDetails.getCategory());
        food.setImageUrl(foodDetails.getImageUrl());
        food.setSize(foodDetails.getSize());
        food.setCombo(foodDetails.isCombo());
        food.setSeatDelivery(foodDetails.isSeatDelivery());
        food.setActive(foodDetails.isActive());
        
        return foodRepository.save(food);
    }

    public void deleteFood(String id) {
        foodRepository.deleteById(id);
    }

    public void incrementSalesCount(String id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
        
        food.setSalesCount(food.getSalesCount() + 1);
        foodRepository.save(food);
    }
}
