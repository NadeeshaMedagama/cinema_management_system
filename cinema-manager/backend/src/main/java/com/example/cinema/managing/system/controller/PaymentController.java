package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.Payment;
import com.example.cinema.managing.system.service.PaymentService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Value("${stripe.public.key:}")
    private String stripePublicKey;

    @GetMapping("/config")
    public ResponseEntity<?> getStripeConfig() {
        return ResponseEntity.ok(Map.of("publishableKey", stripePublicKey));
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                        .body(Map.of("message", "User not authenticated"));
            }

            String userId = authentication.getName();
            Double amount = ((Number) request.get("amount")).doubleValue();
            String currency = (String) request.getOrDefault("currency", "usd");

            Map<String, String> paymentIntent = paymentService.createPaymentIntent(amount, currency, userId);
            return ResponseEntity.ok(paymentIntent);
        } catch (StripeException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error creating payment intent: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            @RequestBody Payment payment,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                        .body(Map.of("message", "User not authenticated"));
            }

            String userId = authentication.getName();
            payment.setUserId(userId);

            Payment createdPayment = paymentService.createPayment(payment);
            return ResponseEntity.ok(createdPayment);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error creating payment: " + e.getMessage()));
        }
    }

    @PostMapping("/process/{paymentId}")
    public ResponseEntity<?> processPayment(
            @PathVariable String paymentId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                        .body(Map.of("message", "User not authenticated"));
            }

            String paymentMethod = request.get("paymentMethod");
            String paymentIntentId = request.get("paymentIntentId");

            Payment processedPayment;

            // If it's a Stripe payment (CARD), process through Stripe
            if ("CARD".equals(paymentMethod) && paymentIntentId != null) {
                processedPayment = paymentService.processStripePayment(paymentId, paymentIntentId);
            } else {
                // For UPI, Wallet, etc.
                processedPayment = paymentService.processPayment(paymentId, paymentMethod);
            }

            return ResponseEntity.ok(processedPayment);
        } catch (StripeException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Stripe error: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error processing payment: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPayment(@PathVariable String id) {
        try {
            Payment payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.status(404)
                    .body(Map.of("message", "Payment not found"));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserPayments(@PathVariable String userId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByUserId(userId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error fetching payments"));
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getBookingPayments(@PathVariable String bookingId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByBookingId(bookingId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error fetching booking payments"));
        }
    }

    @PostMapping("/refund/{paymentId}")
    public ResponseEntity<?> refundPayment(
            @PathVariable String paymentId,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401)
                        .body(Map.of("message", "User not authenticated"));
            }

            Payment refundedPayment = paymentService.refundPayment(paymentId);
            return ResponseEntity.ok(refundedPayment);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Error processing refund: " + e.getMessage()));
        }
    }
}
