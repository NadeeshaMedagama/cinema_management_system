package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByUserIdOrderByBookingDateDesc(String userId);
    List<Booking> findByMovieId(String movieId);
    List<Booking> findByShowtimeId(String showtimeId);
    List<Booking> findByStatus(String status);
    List<Booking> findByBookingDateBetween(LocalDateTime start, LocalDateTime end);
    Optional<Booking> findByBookingCode(String bookingCode);
    Long countByStatus(String status);
}
