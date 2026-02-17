package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.Seat;
import com.example.cinema.managing.system.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/showtime/{showtimeId}")
    public ResponseEntity<List<Seat>> getSeatsByShowtime(@PathVariable String showtimeId) {
        return ResponseEntity.ok(seatService.getSeatsByShowtimeId(showtimeId));
    }

    @GetMapping("/showtime/{showtimeId}/available")
    public ResponseEntity<List<Seat>> getAvailableSeats(@PathVariable String showtimeId) {
        return ResponseEntity.ok(seatService.getAvailableSeats(showtimeId));
    }

    @GetMapping("/showtime/{showtimeId}/booked")
    public ResponseEntity<List<Seat>> getBookedSeats(@PathVariable String showtimeId) {
        return ResponseEntity.ok(seatService.getBookedSeats(showtimeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seat> getSeatById(@PathVariable String id) {
        return ResponseEntity.ok(seatService.getSeatById(id));
    }
}
