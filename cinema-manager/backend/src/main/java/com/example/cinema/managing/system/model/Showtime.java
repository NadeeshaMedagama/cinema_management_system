package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "showtimes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Showtime {
    @Id
    private String id;
    
    private String movieId;
    
    private String screenNumber;
    
    private LocalDateTime showDateTime;
    
    private Double price;
    
    private Integer totalSeats;
    
    private Integer availableSeats;
    
    private String format; // 2D, 3D, IMAX, etc. - values from SystemConfig
    
    private boolean active = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
