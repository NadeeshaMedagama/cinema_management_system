package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    private String id;
    
    private String userId;
    
    private String orderType; // FOOD, MERCHANDISE
    
    private List<OrderItem> items;
    
    private Double totalAmount;
    
    private String status; // PENDING, CONFIRMED, PREPARING, DELIVERED, CANCELLED
    
    private String deliveryType; // SEAT, COUNTER
    
    private String seatNumber; // if seat delivery
    
    private String bookingId; // linked booking if applicable
    
    private String paymentId;
    
    private LocalDateTime orderDate = LocalDateTime.now();
    
    private LocalDateTime deliveryTime;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        private String itemId;
        private String itemName;
        private String itemType; // FOOD, MERCHANDISE
        private Integer quantity;
        private Double price;
        private Double subtotal;
    }
}
