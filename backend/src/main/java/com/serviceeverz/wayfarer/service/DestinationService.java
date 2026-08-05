package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.entity.Destination;
import com.serviceeverz.wayfarer.exception.ResourceNotFoundException;
import com.serviceeverz.wayfarer.repository.DestinationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Transactional(readOnly = true)
    public List<Destination> getAll() {
        return destinationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Destination getById(Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
    }

    public Destination create(Destination destination) {
        destination.setId(null);
        return destinationRepository.save(destination);
    }

    public Destination update(Long id, Destination updates) {
        Destination existing = getById(id);
        existing.setName(updates.getName());
        existing.setCountry(updates.getCountry());
        existing.setImage(updates.getImage());
        existing.setPackageCount(updates.getPackageCount());
        existing.setBlurb(updates.getBlurb());
        return destinationRepository.save(existing);
    }

    public void delete(Long id) {
        if (!destinationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Destination not found with id: " + id);
        }
        destinationRepository.deleteById(id);
    }
}
