package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.Cart;
import com.example.cinema.managing.system.model.User;
import com.example.cinema.managing.system.service.CartService;
import com.example.cinema.managing.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private UserRepository userRepository;
    
    // Helper method to get user ID from authentication
    private String getUserIdFromAuthentication(Authentication authentication) {
        String email = authentication.getName(); // JWT contains email as subject
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getId();
    }
    
    @GetMapping
    public ResponseEntity<?> getCart(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
            }
            
            String userId = getUserIdFromAuthentication(authentication);
            Cart cart = cartService.getCart(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error retrieving cart: " + e.getMessage()));
        }
    }
    
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
            }
            
            String userId = getUserIdFromAuthentication(authentication);
            String merchandiseId = (String) request.get("merchandiseId");
            Integer quantity = (Integer) request.get("quantity");
            
            if (quantity == null) {
                quantity = 1;
            }
            
            Cart cart = cartService.addToCart(userId, merchandiseId, quantity);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error adding to cart: " + e.getMessage()));
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
            }
            
            String userId = getUserIdFromAuthentication(authentication);
            String merchandiseId = (String) request.get("merchandiseId");
            Integer quantity = (Integer) request.get("quantity");
            
            Cart cart = cartService.updateCartItemQuantity(userId, merchandiseId, quantity);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error updating cart: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{merchandiseId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable String merchandiseId,
            Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
            }
            
            String userId = getUserIdFromAuthentication(authentication);
            Cart cart = cartService.removeFromCart(userId, merchandiseId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error removing item: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
            }
            
            String userId = getUserIdFromAuthentication(authentication);
            Cart cart = cartService.clearCart(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error clearing cart: " + e.getMessage()));
        }
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not authenticated"));
            }
            
            String userId = getUserIdFromAuthentication(authentication);
            Cart cart = cartService.getCart(userId);
            
            if (cart.getItems().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Cart is empty"));
            }
            
            cartService.checkoutCart(userId);
            return ResponseEntity.ok(Map.of(
                "message", "Checkout successful",
                "total", cart.getTotal()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error during checkout: " + e.getMessage()));
        }
    }
}
