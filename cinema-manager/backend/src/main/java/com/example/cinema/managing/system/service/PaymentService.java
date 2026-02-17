package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Payment;
import com.example.cinema.managing.system.repository.PaymentRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Create a Stripe Payment Intent
     * This generates a client secret that the frontend uses to complete payment
     */
    public Map<String, String> createPaymentIntent(Double amount, String currency, String userId) throws StripeException {
        // Convert amount to cents (Stripe uses smallest currency unit)
        long amountInCents = (long) (amount * 100);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(currency.toLowerCase())
                .putMetadata("userId", userId)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", intent.getClientSecret());
        response.put("paymentIntentId", intent.getId());

        return response;
    }

    public Payment createPayment(Payment payment) {
        payment.setPaymentDate(LocalDateTime.now());
        payment.setTransactionId(generateTransactionId());
        payment.setStatus("PENDING");
        return paymentRepository.save(payment);
    }

    public Payment processStripePayment(String paymentId, String paymentIntentId) throws StripeException {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Retrieve the payment intent from Stripe to verify
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);

        if ("succeeded".equals(intent.getStatus())) {
            payment.setPaymentMethod("CARD");
            payment.setStatus("SUCCESS");
            payment.setTransactionId(paymentIntentId);
            payment.setPaymentDate(LocalDateTime.now());
        } else {
            payment.setStatus("FAILED");
        }

        return paymentRepository.save(payment);
    }

    public Payment processPayment(String paymentId, String paymentMethod) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // For non-card payments (UPI, Wallet)
        payment.setPaymentMethod(paymentMethod);
        payment.setStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());

        return paymentRepository.save(payment);
    }

    public Payment getPaymentById(String id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public List<Payment> getPaymentsByUserId(String userId) {
        return paymentRepository.findByUserId(userId);
    }

    public List<Payment> getPaymentsByBookingId(String bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    public Payment refundPayment(String paymentId) throws StripeException {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!"SUCCESS".equals(payment.getStatus())) {
            throw new RuntimeException("Only successful payments can be refunded");
        }

        // If it's a Stripe payment, process refund through Stripe
        if ("CARD".equals(payment.getPaymentMethod()) && payment.getTransactionId().startsWith("pi_")) {
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(payment.getTransactionId())
                    .build();

            Refund refund = Refund.create(params);

            if ("succeeded".equals(refund.getStatus())) {
                payment.setStatus("REFUNDED");
            }
        } else {
            // For other payment methods, just mark as refunded
            payment.setStatus("REFUNDED");
        }

        return paymentRepository.save(payment);
    }

    private String generateTransactionId() {
        return "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
