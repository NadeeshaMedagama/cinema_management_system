package com.example.cinema.managing.system.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private String id;
    private String username;
    private String email;
    private String phone;
    private String role;
    private Integer loyaltyPoints;
    private String profileImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
