package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.Merchandise;
import com.example.cinema.managing.system.repository.MerchandiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MerchandiseService {

    @Autowired
    private MerchandiseRepository merchandiseRepository;

    public List<Merchandise> getAllMerchandise() {
        return merchandiseRepository.findAll();
    }

    public List<Merchandise> getActiveMerchandise() {
        return merchandiseRepository.findByActiveTrue();
    }

    public Optional<Merchandise> getMerchandiseById(String id) {
        return merchandiseRepository.findById(id);
    }

    public List<Merchandise> getMerchandiseByCategory(String category) {
        return merchandiseRepository.findByCategoryAndActiveTrue(category);
    }

    public List<Merchandise> getBundleMerchandise() {
        return merchandiseRepository.findByBundleTrue();
    }

    public Merchandise createMerchandise(Merchandise merchandise) {
        merchandise.setCreatedAt(LocalDateTime.now());
        merchandise.setSalesCount(0);
        return merchandiseRepository.save(merchandise);
    }

    public Merchandise updateMerchandise(String id, Merchandise merchandiseDetails) {
        Merchandise merchandise = merchandiseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchandise not found with id: " + id));
        
        merchandise.setName(merchandiseDetails.getName());
        merchandise.setDescription(merchandiseDetails.getDescription());
        merchandise.setPrice(merchandiseDetails.getPrice());
        merchandise.setCategory(merchandiseDetails.getCategory());
        merchandise.setImageUrl(merchandiseDetails.getImageUrl());
        merchandise.setStock(merchandiseDetails.getStock());
        merchandise.setBundle(merchandiseDetails.isBundle());
        merchandise.setBundleMovieId(merchandiseDetails.getBundleMovieId());
        merchandise.setActive(merchandiseDetails.isActive());
        
        return merchandiseRepository.save(merchandise);
    }

    public void deleteMerchandise(String id) {
        merchandiseRepository.deleteById(id);
    }

    public Merchandise updateStock(String id, Integer quantity) {
        Merchandise merchandise = merchandiseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchandise not found with id: " + id));
        
        merchandise.setStock(merchandise.getStock() + quantity);
        return merchandiseRepository.save(merchandise);
    }

    public void incrementSalesCount(String id) {
        Merchandise merchandise = merchandiseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchandise not found with id: " + id));
        
        merchandise.setSalesCount(merchandise.getSalesCount() + 1);
        merchandiseRepository.save(merchandise);
    }
}
