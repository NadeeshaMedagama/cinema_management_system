package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "foods")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Food {
    @Id
    private String id;
    
    private String name;
    
    private String description;
    
    private Double price;
    
    private String category; // POPCORN, DRINKS, SNACKS, COMBOS
    
    private String imageUrl;
    
    private String size; // SMALL, MEDIUM, LARGE
    
    private boolean combo = false;
    
    private Integer salesCount = 0;
    
    private boolean seatDelivery = true;
    
    private boolean active = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
