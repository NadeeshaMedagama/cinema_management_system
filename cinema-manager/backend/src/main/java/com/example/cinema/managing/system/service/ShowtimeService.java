package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Showtime;
import com.example.cinema.managing.system.model.Seat;
import com.example.cinema.managing.system.model.SystemConfig;
import com.example.cinema.managing.system.repository.ShowtimeRepository;
import com.example.cinema.managing.system.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private SystemConfigService systemConfigService;

    @Value("${app.seats.rows:A,B,C,D,E,F,G,H,I,J}")
    private String seatRowsConfig;

    @Value("${app.seats.per-row:10}")
    private int seatsPerRowConfig;

    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    public Showtime getShowtimeById(String id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
    }

    public List<Showtime> getShowtimesByMovieId(String movieId) {
        return showtimeRepository.findByMovieIdAndActiveTrueOrderByShowDateTimeAsc(movieId);
    }

    public List<Showtime> getUpcomingShowtimes() {
        return showtimeRepository.findByShowDateTimeAfterAndActiveTrue(LocalDateTime.now());
    }

    @Transactional
    public Showtime createShowtime(Showtime showtime) {
        showtime.setCreatedAt(LocalDateTime.now());
        showtime.setActive(true);
        showtime.setAvailableSeats(showtime.getTotalSeats());
        
        // Save showtime
        Showtime savedShowtime = showtimeRepository.save(showtime);
        
        // Generate seats for this showtime
        generateSeats(savedShowtime);
        
        return savedShowtime;
    }

    private void generateSeats(Showtime showtime) {
        List<Seat> seats = new ArrayList<>();
        
        // Get seat configuration from SystemConfig or environment variable
        List<String> rows = (List<String>) systemConfigService.getConfigValue(
            SystemConfig.SEAT_ROWS, 
            Arrays.asList(seatRowsConfig.split(","))
        );
        
        int seatsPerRow = ((Number) systemConfigService.getConfigValue(
            SystemConfig.SEATS_PER_ROW, 
            seatsPerRowConfig
        )).intValue();
        
        List<String> seatTypes = (List<String>) systemConfigService.getConfigValue(
            SystemConfig.SEAT_TYPES,
            Arrays.asList("STANDARD")
        );
        
        String defaultSeatType = seatTypes.isEmpty() ? "STANDARD" : seatTypes.get(0);
        
        for (int i = 0; i < rows.size(); i++) {
            for (int j = 1; j <= seatsPerRow; j++) {
                Seat seat = new Seat();
                seat.setShowtimeId(showtime.getId());
                seat.setSeatNumber(String.valueOf(j));
                seat.setRow(rows.get(i));
                seat.setColumn(j);
                seat.setStatus("AVAILABLE");
                seat.setType(defaultSeatType);
                seat.setPrice(showtime.getPrice());
                
                seats.add(seat);
            }
        }
        
        seatRepository.saveAll(seats);
    }

    public Showtime updateShowtime(String id, Showtime showtime) {
        Showtime existingShowtime = getShowtimeById(id);
        
        showtime.setId(id);
        showtime.setCreatedAt(existingShowtime.getCreatedAt());
        showtime.setAvailableSeats(existingShowtime.getAvailableSeats());
        
        return showtimeRepository.save(showtime);
    }

    public void deleteShowtime(String id) {
        Showtime showtime = getShowtimeById(id);
        showtime.setActive(false);
        showtimeRepository.save(showtime);
    }

    public void regenerateSeatsForShowtime(String showtimeId) {
        Showtime showtime = getShowtimeById(showtimeId);

        // Delete existing seats for this showtime
        List<Seat> existingSeats = seatRepository.findByShowtimeId(showtimeId);
        if (!existingSeats.isEmpty()) {
            seatRepository.deleteAll(existingSeats);
        }

        // Generate new seats
        generateSeats(showtime);
    }

    public void regenerateSeatsForAllShowtimes() {
        List<Showtime> showtimes = showtimeRepository.findAll();
        for (Showtime showtime : showtimes) {
            regenerateSeatsForShowtime(showtime.getId());
        }
    }
}
