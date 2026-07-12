package com.serviceeverz.wayfarer.repository;

import com.serviceeverz.wayfarer.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
}
