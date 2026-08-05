package com.serviceeverz.wayfarer.controller;

import com.serviceeverz.wayfarer.entity.Review;
import com.serviceeverz.wayfarer.security.CustomUserDetails;
import com.serviceeverz.wayfarer.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAll(@RequestParam(required = false) Long packageId) {
        return ResponseEntity.ok(reviewService.getAll(packageId));
    }

    @PostMapping
    public ResponseEntity<Review> create(@RequestBody Review review, Authentication authentication) {
        CustomUserDetails userDetails = getCurrentUser(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.create(review, userDetails.getUser().getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> update(@PathVariable Long id, @RequestBody Review review, Authentication authentication) {
        CustomUserDetails userDetails = getCurrentUser(authentication);
        return ResponseEntity.ok(reviewService.update(id, review, userDetails.getUser().getId(), userDetails.getUser().getRole().name()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        CustomUserDetails userDetails = getCurrentUser(authentication);
        reviewService.delete(id, userDetails.getUser().getId(), userDetails.getUser().getRole().name());
        return ResponseEntity.noContent().build();
    }

    private CustomUserDetails getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new AccessDeniedException("Please log in to manage reviews.");
        }
        return userDetails;
    }
}
