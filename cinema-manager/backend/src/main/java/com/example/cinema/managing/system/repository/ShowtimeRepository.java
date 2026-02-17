package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Showtime;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends MongoRepository<Showtime, String> {
    List<Showtime> findByMovieIdAndActiveTrueOrderByShowDateTimeAsc(String movieId);
    List<Showtime> findByShowDateTimeBetween(LocalDateTime start, LocalDateTime end);
    List<Showtime> findByShowDateTimeAfterAndActiveTrue(LocalDateTime dateTime);
}
