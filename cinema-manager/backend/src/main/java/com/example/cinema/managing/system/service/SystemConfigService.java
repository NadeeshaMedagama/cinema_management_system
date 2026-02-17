package com.example.cinema.managing.system.service;

import com.example.cinema.managing.system.model.SystemConfig;
import com.example.cinema.managing.system.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class SystemConfigService {

    @Autowired
    private SystemConfigRepository systemConfigRepository;

    public List<SystemConfig> getAllConfigs() {
        return systemConfigRepository.findAll();
    }

    public Optional<SystemConfig> getConfigByKey(String configKey) {
        return systemConfigRepository.findByConfigKey(configKey);
    }

    public Object getConfigValue(String configKey, Object defaultValue) {
        return systemConfigRepository.findByConfigKey(configKey)
                .map(SystemConfig::getValue)
                .orElse(defaultValue);
    }

    public SystemConfig saveConfig(SystemConfig config) {
        config.setUpdatedAt(LocalDateTime.now());
        return systemConfigRepository.save(config);
    }

    public SystemConfig updateConfig(String configKey, Object value) {
        SystemConfig config = systemConfigRepository.findByConfigKey(configKey)
                .orElseThrow(() -> new RuntimeException("Config not found: " + configKey));
        
        config.setValue(value);
        config.setUpdatedAt(LocalDateTime.now());
        return systemConfigRepository.save(config);
    }

    public void deleteConfig(String id) {
        systemConfigRepository.deleteById(id);
    }

    // Initialize default configs if they don't exist
    public void initializeDefaultConfigs() {
        initializeIfNotExists(SystemConfig.TICKET_FORMATS, "LIST", 
            Arrays.asList("2D", "3D", "IMAX", "4DX", "Dolby Atmos"),
            "Available ticket formats");
        
        initializeIfNotExists(SystemConfig.SCREEN_NUMBERS, "LIST",
            Arrays.asList("1", "2", "3", "4", "5", "VIP Hall", "Gold Class"),
            "Available screen numbers/halls");
        
        initializeIfNotExists(SystemConfig.DEFAULT_SEAT_COUNT, "NUMBER",
            100,
            "Default seat count per showtime");
        
        initializeIfNotExists(SystemConfig.FOOD_CATEGORIES, "LIST",
            Arrays.asList("POPCORN", "DRINKS", "SNACKS", "COMBOS", "DESSERTS"),
            "Food item categories");
        
        initializeIfNotExists(SystemConfig.MERCHANDISE_CATEGORIES, "LIST",
            Arrays.asList("POSTERS", "TOYS", "CLOTHING", "COLLECTIBLES", "ACCESSORIES"),
            "Merchandise categories");
        
        initializeIfNotExists(SystemConfig.DEFAULT_TICKET_PRICE, "NUMBER",
            1500.0,
            "Default ticket price in LKR");
            
        initializeIfNotExists(SystemConfig.SEAT_ROWS, "LIST",
            Arrays.asList("A", "B", "C", "D", "E", "F", "G", "H", "I", "J"),
            "Seat row labels");
            
        initializeIfNotExists(SystemConfig.SEATS_PER_ROW, "NUMBER",
            10,
            "Number of seats per row");
            
        initializeIfNotExists(SystemConfig.SEAT_TYPES, "LIST",
            Arrays.asList("STANDARD", "VIP", "PREMIUM"),
            "Available seat types");
            
        initializeIfNotExists(SystemConfig.WELCOME_BONUS, "NUMBER",
            100,
            "Welcome bonus points for new users");
    }

    private void initializeIfNotExists(String key, String type, Object value, String description) {
        if (!systemConfigRepository.findByConfigKey(key).isPresent()) {
            SystemConfig config = new SystemConfig();
            config.setConfigKey(key);
            config.setConfigType(type);
            config.setValue(value);
            config.setDescription(description);
            config.setActive(true);
            systemConfigRepository.save(config);
        }
    }
}
