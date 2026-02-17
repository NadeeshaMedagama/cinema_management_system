package com.example.cinema.managing.system.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "food_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodItem {

    @Id
    private String id;

    private String name;

    private String description;

    private String category; // POPCORN, DRINKS, SNACKS, COMBOS

    private Double price;

    private String imageUrl;

    private boolean available = true;

    private Integer preparationTime; // in minutes
}
