package com.example.cinema.managing.system.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cinema.managing.system.dto.BookingResponse;
import com.example.cinema.managing.system.model.Booking;
import com.example.cinema.managing.system.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<BookingResponse>> getUserBookings(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/code/{bookingCode}")
    public ResponseEntity<Booking> getBookingByCode(@PathVariable String bookingCode) {
        return ResponseEntity.ok(bookingService.getBookingByCode(bookingCode));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> cancelBooking(@PathVariable String id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }
}
