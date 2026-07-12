package com.serviceeverz.wayfarer.repository;

import com.serviceeverz.wayfarer.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPackageId(Long packageId);
}
