package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.entity.Booking;
import com.serviceeverz.wayfarer.exception.BadRequestException;
import com.serviceeverz.wayfarer.exception.ResourceNotFoundException;
import com.serviceeverz.wayfarer.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class BookingService {

    private static final Set<String> VALID_STATUSES = Set.of("Pending", "Confirmed", "Cancelled");

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Booking getById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public Booking create(Booking booking) {
        booking.setId(null);
        booking.setStatus("Pending");
        booking.setCreatedAt(LocalDate.now());
        return bookingRepository.save(booking);
    }

    public Booking updateStatus(Long id, String status) {
        if (!VALID_STATUSES.contains(status)) {
            throw new BadRequestException("Status must be one of: " + VALID_STATUSES);
        }
        Booking existing = getById(id);
        existing.setStatus(status);
        return bookingRepository.save(existing);
    }

    public void delete(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }
}
