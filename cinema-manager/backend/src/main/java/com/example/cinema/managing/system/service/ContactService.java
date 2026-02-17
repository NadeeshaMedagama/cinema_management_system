package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Contact;
import com.example.cinema.managing.system.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContactService {

    private static final Logger logger = LoggerFactory.getLogger(ContactService.class);

    @Autowired
    private ContactRepository contactRepository;

    public Contact createContact(Contact contact) {
        logger.info("Creating contact: {}", contact.getName());
        contact.setStatus("NEW");
        contact.setCreatedAt(LocalDateTime.now());
        contact.setUpdatedAt(LocalDateTime.now());
        Contact saved = contactRepository.save(contact);
        logger.info("Contact saved successfully with ID: {}", saved.getId());
        return saved;
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Contact> getContactsByStatus(String status) {
        return contactRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    public Contact updateContactStatus(String id, String status) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        contact.setStatus(status);
        contact.setUpdatedAt(LocalDateTime.now());
        return contactRepository.save(contact);
    }

    public void deleteContact(String id) {
        contactRepository.deleteById(id);
    }
}
