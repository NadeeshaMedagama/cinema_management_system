package com.example.cinema.managing.system.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    private String id;

    private String userId;

    private String movieId;

    private String showtimeId;

    private List<String> seatIds;

    private List<String> seatNumbers;

    private Integer numberOfSeats;

    private Double totalAmount;

    private String bookingCode; // unique code for QR

    private String qrCodeUrl;

    private String status; // PENDING, CONFIRMED, CANCELLED, COMPLETED

    private String paymentId;

    private Integer loyaltyPointsEarned;

    private List<BookingFoodItem> foodItems;

    private Double foodTotal = 0.0;

    private List<BookingMerchandiseItem> merchandiseItems;

    private Double merchandiseTotal = 0.0;

    private LocalDateTime bookingDate = LocalDateTime.now();

    private LocalDateTime showDate;

    private boolean emailSent = false;
}
