package com.example.cinema.managing.system.dto;

import com.example.cinema.managing.system.model.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String id;
    private String userId;
    private String movieId;
    private String movieTitle;
    private String moviePosterUrl;
    private String showtimeId;
    private List<String> seatIds;
    private List<String> seatNumbers;
    private Integer numberOfSeats;
    private Double totalAmount;
    private String bookingCode;
    private String qrCodeUrl;
    private String status;
    private String paymentId;
    private Integer loyaltyPointsEarned;
    private LocalDateTime bookingDate;
    private LocalDateTime showDate;
    private boolean emailSent;
    
    public static BookingResponse fromBooking(Booking booking, String movieTitle, String moviePosterUrl) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setUserId(booking.getUserId());
        response.setMovieId(booking.getMovieId());
        response.setMovieTitle(movieTitle);
        response.setMoviePosterUrl(moviePosterUrl);
        response.setShowtimeId(booking.getShowtimeId());
        response.setSeatIds(booking.getSeatIds());
        response.setSeatNumbers(booking.getSeatNumbers());
        response.setNumberOfSeats(booking.getNumberOfSeats());
        response.setTotalAmount(booking.getTotalAmount());
        response.setBookingCode(booking.getBookingCode());
        response.setQrCodeUrl(booking.getQrCodeUrl());
        response.setStatus(booking.getStatus());
        response.setPaymentId(booking.getPaymentId());
        response.setLoyaltyPointsEarned(booking.getLoyaltyPointsEarned());
        response.setBookingDate(booking.getBookingDate());
        response.setShowDate(booking.getShowDate());
        response.setEmailSent(booking.isEmailSent());
        return response;
    }
}
