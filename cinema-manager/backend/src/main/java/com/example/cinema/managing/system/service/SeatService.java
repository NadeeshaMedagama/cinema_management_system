package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Seat;
import com.example.cinema.managing.system.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    public List<Seat> getSeatsByShowtimeId(String showtimeId) {
        return seatRepository.findByShowtimeId(showtimeId);
    }

    public List<Seat> getAvailableSeats(String showtimeId) {
        return seatRepository.findByShowtimeIdAndStatus(showtimeId, "AVAILABLE");
    }

    public List<Seat> getBookedSeats(String showtimeId) {
        return seatRepository.findByShowtimeIdAndStatus(showtimeId, "BOOKED");
    }

    public Seat getSeatById(String id) {
        return seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
    }

    public List<Seat> bookSeats(List<String> seatIds, String userId, String bookingId) {
        List<Seat> seats = seatRepository.findAllById(seatIds);
        
        // Check if all seats are available
        for (Seat seat : seats) {
            if (!"AVAILABLE".equals(seat.getStatus())) {
                throw new RuntimeException("Seat " + seat.getRow() + seat.getSeatNumber() + " is not available");
            }
        }
        
        // Book all seats
        for (Seat seat : seats) {
            seat.setStatus("BOOKED");
            seat.setBookedBy(userId);
            seat.setBookingId(bookingId);
        }
        
        return seatRepository.saveAll(seats);
    }

    public void releaseSeats(String bookingId) {
        List<Seat> seats = seatRepository.findByBookingId(bookingId);
        for (Seat seat : seats) {
            seat.setStatus("AVAILABLE");
            seat.setBookedBy(null);
            seat.setBookingId(null);
        }
        seatRepository.saveAll(seats);
    }

    public boolean areSeatsAvailable(List<String> seatIds) {
        List<Seat> seats = seatRepository.findAllById(seatIds);
        return seats.stream().allMatch(seat -> "AVAILABLE".equals(seat.getStatus()));
    }
}
