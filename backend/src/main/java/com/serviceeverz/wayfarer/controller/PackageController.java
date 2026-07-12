package com.serviceeverz.wayfarer.controller;

import com.serviceeverz.wayfarer.entity.TravelPackage;
import com.serviceeverz.wayfarer.service.PackageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packages")
public class PackageController {

    private final PackageService packageService;

    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping
    public ResponseEntity<List<TravelPackage>> getAll() {
        return ResponseEntity.ok(packageService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TravelPackage> getById(@PathVariable Long id) {
        return ResponseEntity.ok(packageService.getById(id));
    }

    @PostMapping
    public ResponseEntity<TravelPackage> create(@RequestBody TravelPackage pkg) {
        return ResponseEntity.status(HttpStatus.CREATED).body(packageService.create(pkg));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TravelPackage> update(@PathVariable Long id, @RequestBody TravelPackage pkg) {
        return ResponseEntity.ok(packageService.update(id, pkg));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        packageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
