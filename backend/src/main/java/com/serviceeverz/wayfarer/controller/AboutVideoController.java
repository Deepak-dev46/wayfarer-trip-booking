package com.serviceeverz.wayfarer.controller;

import com.serviceeverz.wayfarer.entity.AboutVideo;
import com.serviceeverz.wayfarer.service.AboutVideoService;
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
@RequestMapping("/api/videos")
public class AboutVideoController {

    private final AboutVideoService aboutVideoService;

    public AboutVideoController(AboutVideoService aboutVideoService) {
        this.aboutVideoService = aboutVideoService;
    }

    @GetMapping
    public ResponseEntity<List<AboutVideo>> getAll() {
        return ResponseEntity.ok(aboutVideoService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AboutVideo> getById(@PathVariable Long id) {
        return ResponseEntity.ok(aboutVideoService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AboutVideo> create(@RequestBody AboutVideo video) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aboutVideoService.create(video));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AboutVideo> update(@PathVariable Long id, @RequestBody AboutVideo video) {
        return ResponseEntity.ok(aboutVideoService.update(id, video));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        aboutVideoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
