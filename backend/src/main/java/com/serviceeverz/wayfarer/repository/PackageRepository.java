package com.serviceeverz.wayfarer.repository;

import com.serviceeverz.wayfarer.entity.TravelPackage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackageRepository extends JpaRepository<TravelPackage, Long> {
}
