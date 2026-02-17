package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.Contact;
import com.example.cinema.managing.system.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact) {
        logger.info("Received contact form submission: name={}, email={}, subject={}", 
            contact.getName(), contact.getEmail(), contact.getSubject());
        try {
            Contact savedContact = contactService.createContact(contact);
            logger.info("Successfully saved contact with ID: {}", savedContact.getId());
            return ResponseEntity.ok(savedContact);
        } catch (Exception e) {
            logger.error("Error saving contact: ", e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Contact>> getContactsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(contactService.getContactsByStatus(status));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Contact> updateContactStatus(
            @PathVariable String id,
            @RequestParam String status) {
        Contact updatedContact = contactService.updateContactStatus(id, status);
        return ResponseEntity.ok(updatedContact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable String id) {
        contactService.deleteContact(id);
        return ResponseEntity.ok().build();
    }
}
