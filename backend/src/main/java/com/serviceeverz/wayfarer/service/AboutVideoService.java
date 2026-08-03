package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.entity.AboutVideo;
import com.serviceeverz.wayfarer.exception.ResourceNotFoundException;
import com.serviceeverz.wayfarer.repository.AboutVideoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AboutVideoService {

    private final AboutVideoRepository aboutVideoRepository;

    public AboutVideoService(AboutVideoRepository aboutVideoRepository) {
        this.aboutVideoRepository = aboutVideoRepository;
    }

    @Transactional(readOnly = true)
    public List<AboutVideo> getAll() {
        return aboutVideoRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder", "id"));
    }

    @Transactional(readOnly = true)
    public AboutVideo getById(Long id) {
        return aboutVideoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + id));
    }

    public AboutVideo create(AboutVideo video) {
        video.setId(null);
        return aboutVideoRepository.save(video);
    }

    public AboutVideo update(Long id, AboutVideo updates) {
        AboutVideo existing = getById(id);
        existing.setTitle(updates.getTitle());
        existing.setDescription(updates.getDescription());
        existing.setVideoUrl(updates.getVideoUrl());
        existing.setThumbnailUrl(updates.getThumbnailUrl());
        existing.setDisplayOrder(updates.getDisplayOrder());
        existing.setActive(updates.isActive());
        return aboutVideoRepository.save(existing);
    }

    public void delete(Long id) {
        if (!aboutVideoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Video not found with id: " + id);
        }
        aboutVideoRepository.deleteById(id);
    }
}
