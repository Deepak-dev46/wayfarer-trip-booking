package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.entity.Review;
import com.serviceeverz.wayfarer.entity.Role;
import com.serviceeverz.wayfarer.exception.ResourceNotFoundException;
import com.serviceeverz.wayfarer.repository.ReviewRepository;
import org.springframework.security.access.AccessDeniedException;
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

    @Transactional
    public Review create(Review review, Long currentUserId) {
        review.setId(null);
        review.setUserId(currentUserId);
        review.setDate(java.time.LocalDate.now());
        return reviewRepository.save(review);
    }

    @Transactional
    public Review update(Long reviewId, Review updates, Long currentUserId, String currentUserRole) {
        Review existing = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        if (!existing.getUserId().equals(currentUserId) && !Role.ADMIN.name().equalsIgnoreCase(currentUserRole)) {
            throw new AccessDeniedException("You can only edit your own reviews.");
        }

        existing.setName(updates.getName());
        existing.setComment(updates.getComment());
        existing.setRating(updates.getRating());
        return reviewRepository.save(existing);
    }

    @Transactional
    public void delete(Long reviewId, Long currentUserId, String currentUserRole) {
        Review existing = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        if (!existing.getUserId().equals(currentUserId) && !Role.ADMIN.name().equalsIgnoreCase(currentUserRole)) {
            throw new AccessDeniedException("You can only delete your own reviews.");
        }

        reviewRepository.delete(existing);
    }
}
