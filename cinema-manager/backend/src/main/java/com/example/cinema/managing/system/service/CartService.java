package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Cart;
import com.example.cinema.managing.system.model.CartItem;
import com.example.cinema.managing.system.model.Merchandise;
import com.example.cinema.managing.system.repository.CartRepository;
import com.example.cinema.managing.system.repository.MerchandiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private MerchandiseRepository merchandiseRepository;
    
    public Cart getOrCreateCart(String userId) {
        Optional<Cart> existingCart = cartRepository.findByUserIdAndStatus(userId, "ACTIVE");
        if (existingCart.isPresent()) {
            return existingCart.get();
        }
        
        Cart newCart = new Cart();
        newCart.setUserId(userId);
        newCart.setStatus("ACTIVE");
        return cartRepository.save(newCart);
    }
    
    public Cart addToCart(String userId, String merchandiseId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        
        // Verify merchandise exists and has stock
        Merchandise merchandise = merchandiseRepository.findById(merchandiseId)
            .orElseThrow(() -> new RuntimeException("Merchandise not found"));
        
        if (merchandise.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock available");
        }
        
        // Check if item already exists in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
            .filter(item -> item.getMerchandiseId().equals(merchandiseId))
            .findFirst();
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            
            if (merchandise.getStock() < newQuantity) {
                throw new RuntimeException("Cannot add more items than available in stock");
            }
            
            item.setQuantity(newQuantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setMerchandiseId(merchandiseId);
            newItem.setName(merchandise.getName());
            newItem.setPrice(merchandise.getPrice());
            newItem.setImageUrl(merchandise.getImageUrl());
            newItem.setQuantity(quantity);
            newItem.setCategory(merchandise.getCategory());
            newItem.setCharacterName(merchandise.getCharacterName());
            newItem.setRelatedMovie(merchandise.getRelatedMovie());
            cart.getItems().add(newItem);
        }
        
        cart.calculateTotal();
        return cartRepository.save(cart);
    }
    
    public Cart updateCartItemQuantity(String userId, String merchandiseId, Integer quantity) {
        Cart cart = getOrCreateCart(userId);
        
        if (quantity <= 0) {
            return removeFromCart(userId, merchandiseId);
        }
        
        // Verify merchandise stock
        Merchandise merchandise = merchandiseRepository.findById(merchandiseId)
            .orElseThrow(() -> new RuntimeException("Merchandise not found"));
        
        if (merchandise.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock available");
        }
        
        CartItem item = cart.getItems().stream()
            .filter(i -> i.getMerchandiseId().equals(merchandiseId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Item not found in cart"));
        
        item.setQuantity(quantity);
        cart.calculateTotal();
        return cartRepository.save(cart);
    }
    
    public Cart removeFromCart(String userId, String merchandiseId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(item -> item.getMerchandiseId().equals(merchandiseId));
        cart.calculateTotal();
        return cartRepository.save(cart);
    }
    
    public Cart clearCart(String userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cart.calculateTotal();
        return cartRepository.save(cart);
    }
    
    public Cart getCart(String userId) {
        return getOrCreateCart(userId);
    }
    
    public void checkoutCart(String userId) {
        Cart cart = getOrCreateCart(userId);
        cart.setStatus("CHECKED_OUT");
        cartRepository.save(cart);
    }
}
