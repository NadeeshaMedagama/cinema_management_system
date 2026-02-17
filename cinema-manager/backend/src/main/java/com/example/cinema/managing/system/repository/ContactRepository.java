package com.example.cinema.managing.system.repository;

import com.example.cinema.managing.system.model.Contact;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {
    List<Contact> findByStatusOrderByCreatedAtDesc(String status);

    List<Contact> findAllByOrderByCreatedAtDesc();
}
