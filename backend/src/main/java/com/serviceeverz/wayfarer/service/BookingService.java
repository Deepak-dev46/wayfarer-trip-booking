package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.dto.common.MailRequest;
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
    private final MailService mailService;

    public BookingService(BookingRepository bookingRepository, MailService mailService) {
        this.bookingRepository = bookingRepository;
        this.mailService = mailService;
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
        Booking b= bookingRepository.save(booking);
        String emailBody = """
        		Dear Team,
        		 
        		A new booking has been made by %s for %s.
        		 
        		Please log in to the application to review the booking details and take the necessary action.
        		
        		Contact Number: %s
        		 
        		Thank you.
        		 
        		Best regards,
        		%s
        		""".formatted(booking.getEmail(), booking.getPackageTitle(), booking.getPhone(), "Tripa Holidays");
        		 
        try {
        	MailRequest req= new MailRequest();
        	req.setBody(emailBody);
        	req.setSubject("New Booking Arrived!! Please Check the application.");
        	req.setTo("dpak8055@gmail.com");
			mailService.sendEmail(req);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
        return b;
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
