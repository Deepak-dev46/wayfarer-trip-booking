package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.entity.Review;
import com.serviceeverz.wayfarer.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getAll(Long packageId) {
        if (packageId != null) {
            return reviewRepository.findByPackageId(packageId);
        }
        return reviewRepository.findAll();
    }
}
