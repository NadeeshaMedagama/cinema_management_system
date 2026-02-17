package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private String merchandiseId;
    private String name;
    private Double price;
    private String imageUrl;
    private Integer quantity;
    private String category;
    private String characterName;
    private String relatedMovie;
    
    public Double getSubtotal() {
        return price * quantity;
    }
}
