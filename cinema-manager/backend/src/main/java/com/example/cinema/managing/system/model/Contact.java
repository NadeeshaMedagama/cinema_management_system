package com.example.cinema.managing.system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Contact {
    @Id
    private String id;

    private String name;

    private String email;

    private String phone;

    private String subject;

    private String message;

    private String status; // "NEW", "IN_PROGRESS", "RESOLVED"

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
