package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "loyalty_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyTransaction {
    @Id
    private String id;
    
    private String userId;
    
    private Integer points;
    
    private String type; // EARNED, REDEEMED
    
    private String source; // BOOKING, ORDER, SIGNUP_BONUS
    
    private String referenceId; // bookingId or orderId
    
    private String description;
    
    private LocalDateTime transactionDate = LocalDateTime.now();
}
