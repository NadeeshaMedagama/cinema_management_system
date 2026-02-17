package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.dto.BookingResponse;
import com.example.cinema.managing.system.model.Booking;
import com.example.cinema.managing.system.model.Movie;
import com.example.cinema.managing.system.model.Seat;
import com.example.cinema.managing.system.model.Showtime;
import com.example.cinema.managing.system.repository.BookingRepository;
import com.example.cinema.managing.system.repository.MovieRepository;
import com.example.cinema.managing.system.repository.SeatRepository;
import com.example.cinema.managing.system.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;
    
    @Autowired
    private MovieRepository movieRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<BookingResponse> getBookingsByUserId(String userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private BookingResponse convertToResponse(Booking booking) {
        Movie movie = movieRepository.findById(booking.getMovieId()).orElse(null);
        String movieTitle = movie != null ? movie.getTitle() : "Unknown Movie";
        String moviePosterUrl = movie != null ? movie.getPosterUrl() : null;
        return BookingResponse.fromBooking(booking, movieTitle, moviePosterUrl);
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public Booking getBookingByCode(String bookingCode) {
        return bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        // Validate showtime exists
        Showtime showtime = showtimeRepository.findById(booking.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found with ID: " + booking.getShowtimeId()));

        // Validate seats exist for this showtime
        List<Seat> allShowtimeSeats = seatRepository.findByShowtimeId(booking.getShowtimeId());
        if (allShowtimeSeats.isEmpty()) {
            throw new RuntimeException("No seats found for this showtime. Please contact admin to regenerate seats.");
        }

        // Validate requested seats exist
        List<Seat> seats = seatRepository.findAllById(booking.getSeatIds());
        if (seats.size() != booking.getSeatIds().size()) {
            throw new RuntimeException("One or more selected seats do not exist. Please refresh and try again.");
        }

        // Validate all seats belong to this showtime
        for (Seat seat : seats) {
            if (!seat.getShowtimeId().equals(booking.getShowtimeId())) {
                throw new RuntimeException("Seat " + seat.getRow() + seat.getSeatNumber() + " does not belong to this showtime");
            }
        }

        // Check seat availability
        for (Seat seat : seats) {
            if (!"AVAILABLE".equals(seat.getStatus())) {
                throw new RuntimeException("Seat " + seat.getRow() + seat.getSeatNumber() + " is not available. It may have been booked by another user.");
            }
        }

        // Calculate food total
        Double foodTotal = 0.0;
        if (booking.getFoodItems() != null && !booking.getFoodItems().isEmpty()) {
            foodTotal = booking.getFoodItems().stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();
        }
        booking.setFoodTotal(foodTotal);

        // Calculate merchandise total
        Double merchandiseTotal = 0.0;
        if (booking.getMerchandiseItems() != null && !booking.getMerchandiseItems().isEmpty()) {
            merchandiseTotal = booking.getMerchandiseItems().stream()
                    .mapToDouble(item -> item.getPrice() * item.getQuantity())
                    .sum();
        }
        booking.setMerchandiseTotal(merchandiseTotal);

        // Calculate final total amount (seats + food + merchandise)
        Double seatsTotal = seats.stream().mapToDouble(Seat::getPrice).sum();
        Double finalTotal = seatsTotal + foodTotal + merchandiseTotal;
        booking.setTotalAmount(finalTotal);

        // Generate unique booking code
        booking.setBookingCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        // Update seats status to BOOKED
        for (Seat seat : seats) {
            seat.setStatus("BOOKED");
            seat.setBookedBy(booking.getUserId());
        }

        // Save booking first to get the ID
        Booking savedBooking = bookingRepository.save(booking);

        // Update seats with booking ID
        for (Seat seat : seats) {
            seat.setBookingId(savedBooking.getId());
        }
        seatRepository.saveAll(seats);

        // Update showtime available seats
        showtime.setAvailableSeats(showtime.getAvailableSeats() - booking.getNumberOfSeats());
        showtimeRepository.save(showtime);

        return savedBooking;
    }

    @Transactional
    public void cancelBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);
        
        if ("CANCELLED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking is already cancelled");
        }
        
        // Release seats
        List<Seat> seats = seatRepository.findByBookingId(bookingId);
        for (Seat seat : seats) {
            seat.setStatus("AVAILABLE");
            seat.setBookedBy(null);
            seat.setBookingId(null);
        }
        seatRepository.saveAll(seats);
        
        // Update showtime available seats
        Showtime showtime = showtimeRepository.findById(booking.getShowtimeId())
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        showtime.setAvailableSeats(showtime.getAvailableSeats() + booking.getNumberOfSeats());
        showtimeRepository.save(showtime);
        
        // Update booking status
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getBookingsByDateRange(LocalDateTime start, LocalDateTime end) {
        return bookingRepository.findByBookingDateBetween(start, end);
    }
}
