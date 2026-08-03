package com.serviceeverz.wayfarer.repository;

import com.serviceeverz.wayfarer.entity.AboutVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AboutVideoRepository extends JpaRepository<AboutVideo, Long> {
}
