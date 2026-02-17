package com.example.cinema.managing.system.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {

    private String username;
    private String email;
    private String phone;
    private String profileImage;
}
