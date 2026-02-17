package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    private String id;
    
    private String userId;
    
    private List<CartItem> items = new ArrayList<>();
    
    private Double total = 0.0;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    private String status = "ACTIVE"; // ACTIVE, CHECKED_OUT, ABANDONED
    
    public void calculateTotal() {
        this.total = items.stream()
            .mapToDouble(CartItem::getSubtotal)
            .sum();
        this.updatedAt = LocalDateTime.now();
    }
    
    public int getTotalItems() {
        return items.stream()
            .mapToInt(CartItem::getQuantity)
            .sum();
    }
}
