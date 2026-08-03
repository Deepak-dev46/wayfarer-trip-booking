package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.entity.Offer;
import com.serviceeverz.wayfarer.exception.ResourceNotFoundException;
import com.serviceeverz.wayfarer.repository.OfferRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OfferService {

    private final OfferRepository offerRepository;

    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    @Transactional(readOnly = true)
    public List<Offer> getAll() {
        return offerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Offer getById(Long id) {
        return offerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found with id: " + id));
    }

    public Offer create(Offer offer) {
        offer.setId(null);
        return offerRepository.save(offer);
    }

    public Offer update(Long id, Offer updates) {
        Offer existing = getById(id);
        existing.setTitle(updates.getTitle());
        existing.setDescription(updates.getDescription());
        existing.setDiscount(updates.getDiscount());
        existing.setBannerImage(updates.getBannerImage());
        existing.setStartDate(updates.getStartDate());
        existing.setEndDate(updates.getEndDate());
        existing.setPackageId(updates.getPackageId());
        existing.setPopupEnabled(updates.isPopupEnabled());
        return offerRepository.save(existing);
    }

    public void delete(Long id) {
        if (!offerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Offer not found with id: " + id);
        }
        offerRepository.deleteById(id);
    }
}
