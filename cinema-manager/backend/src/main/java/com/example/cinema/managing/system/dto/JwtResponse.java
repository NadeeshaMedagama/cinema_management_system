package com.example.cinema.managing.system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String username;
    private String email;
    private String role;
    private Integer loyaltyPoints;

    public JwtResponse(String token, String id, String username, String email, String role, Integer loyaltyPoints) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.loyaltyPoints = loyaltyPoints;
    }
}
