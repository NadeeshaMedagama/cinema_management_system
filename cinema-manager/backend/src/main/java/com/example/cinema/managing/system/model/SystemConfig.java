package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "system_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemConfig {
    @Id
    private String id;
    
    private String configKey; // e.g., "TICKET_FORMATS", "SCREEN_CONFIG", "DEFAULT_PRICES"
    
    private String configType; // e.g., "LIST", "OBJECT", "NUMBER"
    
    private Object value; // The actual configuration value
    
    private String description;
    
    private boolean active = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Predefined config keys
    public static final String TICKET_FORMATS = "TICKET_FORMATS";
    public static final String SCREEN_NUMBERS = "SCREEN_NUMBERS";
    public static final String DEFAULT_SEAT_COUNT = "DEFAULT_SEAT_COUNT";
    public static final String FOOD_CATEGORIES = "FOOD_CATEGORIES";
    public static final String MERCHANDISE_CATEGORIES = "MERCHANDISE_CATEGORIES";
    public static final String DEFAULT_TICKET_PRICE = "DEFAULT_TICKET_PRICE";
    public static final String SEAT_ROWS = "SEAT_ROWS";
    public static final String SEATS_PER_ROW = "SEATS_PER_ROW";
    public static final String SEAT_TYPES = "SEAT_TYPES";
    public static final String WELCOME_BONUS = "WELCOME_BONUS";
    public static final String DEFAULT_ADMIN_EMAIL = "DEFAULT_ADMIN_EMAIL";
    public static final String DEFAULT_ADMIN_PASSWORD = "DEFAULT_ADMIN_PASSWORD";
}
