package com.example.cinema.managing.system.controller;

import com.example.cinema.managing.system.model.SystemConfig;
import com.example.cinema.managing.system.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/system-config")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SystemConfigController {

    @Autowired
    private SystemConfigService systemConfigService;

    @GetMapping
    public ResponseEntity<List<SystemConfig>> getAllConfigs() {
        return ResponseEntity.ok(systemConfigService.getAllConfigs());
    }

    @GetMapping("/{configKey}")
    public ResponseEntity<SystemConfig> getConfigByKey(@PathVariable String configKey) {
        return systemConfigService.getConfigByKey(configKey)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{configKey}/value")
    public ResponseEntity<Object> getConfigValue(@PathVariable String configKey) {
        return systemConfigService.getConfigByKey(configKey)
                .map(config -> ResponseEntity.ok(config.getValue()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemConfig> createConfig(@RequestBody SystemConfig config) {
        return ResponseEntity.ok(systemConfigService.saveConfig(config));
    }

    @PutMapping("/{configKey}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemConfig> updateConfig(@PathVariable String configKey, @RequestBody Object value) {
        try {
            return ResponseEntity.ok(systemConfigService.updateConfig(configKey, value));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteConfig(@PathVariable String id) {
        systemConfigService.deleteConfig(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/initialize")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> initializeDefaults() {
        systemConfigService.initializeDefaultConfigs();
        return ResponseEntity.ok("Default configurations initialized");
    }
}
