package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.Showtime;
import com.example.cinema.managing.system.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ShowtimeController {

    @Autowired
    private ShowtimeService showtimeService;

    @GetMapping
    public ResponseEntity<List<Showtime>> getAllShowtimes() {
        return ResponseEntity.ok(showtimeService.getAllShowtimes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Showtime> getShowtimeById(@PathVariable String id) {
        return ResponseEntity.ok(showtimeService.getShowtimeById(id));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Showtime>> getShowtimesByMovieId(@PathVariable String movieId) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovieId(movieId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Showtime>> getUpcomingShowtimes() {
        return ResponseEntity.ok(showtimeService.getUpcomingShowtimes());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Showtime>> getAvailableShowtimes() {
        return ResponseEntity.ok(showtimeService.getAllShowtimes());
    }

    @PostMapping
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for bulk import
    public ResponseEntity<Showtime> createShowtime(@RequestBody Showtime showtime) {
        return ResponseEntity.ok(showtimeService.createShowtime(showtime));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Showtime> updateShowtime(@PathVariable String id, @RequestBody Showtime showtime) {
        return ResponseEntity.ok(showtimeService.updateShowtime(id, showtime));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteShowtime(@PathVariable String id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/regenerate-seats")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<String> regenerateSeatsForShowtime(@PathVariable String id) {
        showtimeService.regenerateSeatsForShowtime(id);
        return ResponseEntity.ok("Seats regenerated successfully for showtime " + id);
    }

    @PostMapping("/regenerate-all-seats")
    // @PreAuthorize("hasRole('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<String> regenerateAllSeats() {
        showtimeService.regenerateSeatsForAllShowtimes();
        return ResponseEntity.ok("Seats regenerated successfully for all showtimes");
    }
}
