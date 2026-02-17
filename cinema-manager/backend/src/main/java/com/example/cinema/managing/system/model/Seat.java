package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    @Id
    private String id;
    
    private String showtimeId;
    
    private String seatNumber; // e.g., A1, A2, B1
    
    private String row;
    
    private Integer column;
    
    private String type; // STANDARD, VIP, PREMIUM
    
    private Double price;
    
    private String status; // AVAILABLE, BOOKED, BLOCKED
    
    private String bookedBy; // userId if booked
    
    private String bookingId;
}
