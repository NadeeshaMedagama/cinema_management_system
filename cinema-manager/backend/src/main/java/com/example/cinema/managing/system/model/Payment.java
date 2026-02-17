package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    private String id;
    
    private String userId;
    
    private String bookingId;
    
    private String orderId; // for merchandise/food orders
    
    private Double amount;
    
    private String paymentMethod; // CARD, UPI, WALLET, CASH
    
    private String transactionId;
    
    private String status; // PENDING, SUCCESS, FAILED, REFUNDED
    
    private LocalDateTime paymentDate = LocalDateTime.now();
    
    private String paymentType; // BOOKING, ORDER
}
