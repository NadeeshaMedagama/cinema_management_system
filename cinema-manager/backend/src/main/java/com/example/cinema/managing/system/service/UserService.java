package com.example.cinema.managing.system.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.cinema.managing.system.dto.UpdateUserRequest;
import com.example.cinema.managing.system.dto.UserProfileResponse;
import com.example.cinema.managing.system.model.User;
import com.example.cinema.managing.system.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserProfileResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToProfileResponse(user);
    }

    public UserProfileResponse getUserProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToProfileResponse(user);
    }

    public UserProfileResponse updateUserProfile(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return updateUser(user, request);
    }

    public UserProfileResponse updateUserProfileByEmail(String email, UpdateUserRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return updateUser(user, request);
    }

    private UserProfileResponse updateUser(User user, UpdateUserRequest request) {
        // Check if email is being changed and if it's already taken
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }

        // Update other fields
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        return mapToProfileResponse(updatedUser);
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setLoyaltyPoints(user.getLoyaltyPoints());
        response.setProfileImage(user.getProfileImage());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }

    public List<UserProfileResponse> getAllAdmins() {
        List<User> admins = userRepository.findByRole("ADMIN");
        return admins.stream()
            .map(this::mapToProfileResponse)
            .collect(Collectors.toList());
    }

    public User createAdminUser(User adminUser) {
        // Check if email already exists
        if (userRepository.findByEmail(adminUser.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Encode password
        adminUser.setPassword(passwordEncoder.encode(adminUser.getPassword()));
        
        // Set admin role and defaults
        adminUser.setRole("ADMIN");
        adminUser.setLoyaltyPoints(0);
        adminUser.setCreatedAt(LocalDateTime.now());
        adminUser.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(adminUser);
    }
}
