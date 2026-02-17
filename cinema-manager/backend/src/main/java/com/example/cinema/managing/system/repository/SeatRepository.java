package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Seat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatRepository extends MongoRepository<Seat, String> {
    List<Seat> findByShowtimeId(String showtimeId);
    List<Seat> findByShowtimeIdAndStatus(String showtimeId, String status);
    List<Seat> findByBookingId(String bookingId);
}
