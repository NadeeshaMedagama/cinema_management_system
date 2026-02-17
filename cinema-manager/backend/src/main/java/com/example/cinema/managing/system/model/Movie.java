package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    private Integer duration; // in minutes
    
    private String language;
    
    private String director;
    
    private List<String> cast;
    
    private String genre;
    
    private String rating; // PG, PG-13, R, etc.
    
    private String posterUrl;
    
    private String bannerUrl;
    
    private String trailerUrl;
    
    private LocalDateTime releaseDate;
    
    private Double imdbRating;
    
    private String categoryId;
    
    private Integer viewCount = 0;
    
    private Integer bookingCount = 0;
    
    private boolean featured = false;
    
    private boolean nowShowing = true;
    
    private boolean comingSoon = false;
    
    private List<Showtime> showtimes; // Available showtimes for this movie
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Showtime {
        private String id;
        private String date; // e.g., "2025-12-09"
        private String time; // e.g., "10:00", "14:30", "19:00"
        private String format; // "2D", "3D", "IMAX", "4DX"
        private String screen; // e.g., "1", "2", "VIP Hall"
        private Double price; // Base ticket price
        private Integer availableSeats; // Seats available for this showtime
        private Integer totalSeats; // Total capacity
    }
}
