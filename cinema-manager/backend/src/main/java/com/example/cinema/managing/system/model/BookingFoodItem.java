package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingFoodItem {

    private String foodItemId;

    private String name;

    private Integer quantity;

    private Double price;

    private Double subtotal; // price * quantity
}
