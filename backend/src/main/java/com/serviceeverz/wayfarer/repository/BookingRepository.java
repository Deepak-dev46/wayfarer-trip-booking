package com.serviceeverz.wayfarer.repository;

import com.serviceeverz.wayfarer.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
