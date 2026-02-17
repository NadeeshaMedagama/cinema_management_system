package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.Merchandise;
import com.example.cinema.managing.system.service.MerchandiseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchandise")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MerchandiseController {

    @Autowired
    private MerchandiseService merchandiseService;

    @GetMapping
    public ResponseEntity<List<Merchandise>> getAllMerchandise() {
        return ResponseEntity.ok(merchandiseService.getActiveMerchandise());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Merchandise>> getAllMerchandiseAdmin() {
        return ResponseEntity.ok(merchandiseService.getAllMerchandise());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Merchandise> getMerchandiseById(@PathVariable String id) {
        return merchandiseService.getMerchandiseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Merchandise>> getMerchandiseByCategory(@PathVariable String category) {
        return ResponseEntity.ok(merchandiseService.getMerchandiseByCategory(category));
    }

    @GetMapping("/bundles")
    public ResponseEntity<List<Merchandise>> getBundleMerchandise() {
        return ResponseEntity.ok(merchandiseService.getBundleMerchandise());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Merchandise> createMerchandise(@RequestBody Merchandise merchandise) {
        return ResponseEntity.ok(merchandiseService.createMerchandise(merchandise));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Merchandise> updateMerchandise(@PathVariable String id, @RequestBody Merchandise merchandise) {
        try {
            return ResponseEntity.ok(merchandiseService.updateMerchandise(id, merchandise));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMerchandise(@PathVariable String id) {
        merchandiseService.deleteMerchandise(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Merchandise> updateStock(@PathVariable String id, @RequestParam Integer quantity) {
        try {
            return ResponseEntity.ok(merchandiseService.updateStock(id, quantity));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
