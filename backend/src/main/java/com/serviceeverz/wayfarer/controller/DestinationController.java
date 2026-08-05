package com.serviceeverz.wayfarer.controller;

import com.serviceeverz.wayfarer.entity.Destination;
import com.serviceeverz.wayfarer.service.DestinationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ResponseEntity<List<Destination>> getAll() {
        return ResponseEntity.ok(destinationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getById(@PathVariable Long id) {
        return ResponseEntity.ok(destinationService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Destination> create(@RequestBody Destination destination) {
        return ResponseEntity.status(HttpStatus.CREATED).body(destinationService.create(destination));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Destination> update(@PathVariable Long id, @RequestBody Destination destination) {
        return ResponseEntity.ok(destinationService.update(id, destination));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        destinationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
