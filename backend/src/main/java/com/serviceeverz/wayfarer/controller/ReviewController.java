package com.serviceeverz.wayfarer.controller;

import com.serviceeverz.wayfarer.entity.Review;
import com.serviceeverz.wayfarer.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
}
