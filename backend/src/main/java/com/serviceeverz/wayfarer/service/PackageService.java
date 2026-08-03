package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.entity.TravelPackage;
import com.serviceeverz.wayfarer.exception.ResourceNotFoundException;
import com.serviceeverz.wayfarer.repository.PackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PackageService {

    private final PackageRepository packageRepository;

    public PackageService(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @Transactional(readOnly = true)
    public List<TravelPackage> getAll() {
        return packageRepository.findAll();
    }

    @Transactional(readOnly = true)
    public TravelPackage getById(Long id) {
        return packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));
    }

    public TravelPackage create(TravelPackage pkg) {
        pkg.setId(null);
        if (pkg.getRating() == null) {
            pkg.setRating(4.5);
        }
        if (pkg.getReviewCount() == null) {
            pkg.setReviewCount(0);
        }
        if (pkg.getTripType() == null || pkg.getTripType().isBlank()) {
            pkg.setTripType("International");
        }
        return packageRepository.save(pkg);
    }

    public TravelPackage update(Long id, TravelPackage updates) {
        TravelPackage existing = getById(id);

        existing.setTitle(updates.getTitle());
        existing.setDestinationId(updates.getDestinationId());
        existing.setLocation(updates.getLocation());
        existing.setCategory(updates.getCategory());
        existing.setTripType(updates.getTripType() == null || updates.getTripType().isBlank()
                ? "International" : updates.getTripType());
        existing.setDuration(updates.getDuration());
        existing.setPrice(updates.getPrice());
        if (updates.getRating() != null) {
            existing.setRating(updates.getRating());
        }
        if (updates.getReviewCount() != null) {
            existing.setReviewCount(updates.getReviewCount());
        }
        existing.setFeatured(updates.getFeatured());
        existing.setTrending(updates.getTrending());
        existing.setImages(updates.getImages());
        existing.setShortDescription(updates.getShortDescription());
        existing.setDescription(updates.getDescription());
        existing.setIncluded(updates.getIncluded());
        existing.setExcluded(updates.getExcluded());
        existing.setTourPlan(updates.getTourPlan());

        return packageRepository.save(existing);
    }

    public void delete(Long id) {
        if (!packageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Package not found with id: " + id);
        }
        packageRepository.deleteById(id);
    }
}
