package com.serviceeverz.wayfarer.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.serviceeverz.wayfarer.entity.*;
import com.serviceeverz.wayfarer.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * Seeds the database with demo data on first startup (mirrors the original
 * Wayfarer React mock-API dataset) plus a default admin account. Only runs
 * when the relevant tables are empty, so it is safe across restarts.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final PackageRepository packageRepository;
    private final OfferRepository offerRepository;
    private final DestinationRepository destinationRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ContactRepository contactRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.seed.enabled:true}")
    private boolean seedEnabled;

    @Value("${app.seed.admin-email:admin@trip.com}")
    private String adminEmail;

    @Value("${app.seed.admin-password:admin123}")
    private String adminPassword;

    private final Map<String, Long> destinationIdMap = new HashMap<>();
    private final Map<String, Long> packageIdMap = new HashMap<>();

    public DataSeeder(PackageRepository packageRepository,
                       OfferRepository offerRepository,
                       DestinationRepository destinationRepository,
                       ReviewRepository reviewRepository,
                       UserRepository userRepository,
                       BookingRepository bookingRepository,
                       ContactRepository contactRepository,
                       PasswordEncoder passwordEncoder) {
        this.packageRepository = packageRepository;
        this.offerRepository = offerRepository;
        this.destinationRepository = destinationRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.contactRepository = contactRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedAdmin();

        if (!seedEnabled) {
            return;
        }

        seedDestinations();
        seedPackages();
        seedOffers();
        seedReviews();
        seedUsers();
        seedBookings();
        seedContacts();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmailIgnoreCase(adminEmail)) {
            return;
        }
        User admin = new User("Admin", adminEmail, passwordEncoder.encode(adminPassword), "", LocalDate.now(), Role.ADMIN);
        userRepository.save(admin);
    }

    private JsonNode readSeedFile(String filename) throws Exception {
        try (InputStream is = new ClassPathResource("seed/" + filename).getInputStream()) {
            return objectMapper.readTree(is);
        }
    }

    private void seedDestinations() throws Exception {
        if (destinationRepository.count() > 0) {
            return;
        }
        for (JsonNode node : readSeedFile("destinations.json")) {
            Destination d = new Destination();
            d.setName(text(node, "name"));
            d.setCountry(text(node, "country"));
            d.setImage(text(node, "image"));
            d.setPackageCount(node.path("packageCount").asInt(0));
            d.setBlurb(text(node, "blurb"));
            Destination saved = destinationRepository.save(d);
            destinationIdMap.put(text(node, "id"), saved.getId());
        }
    }

    private void seedPackages() throws Exception {
        if (packageRepository.count() > 0) {
            return;
        }
        for (JsonNode node : readSeedFile("packages.json")) {
            TravelPackage pkg = new TravelPackage();
            pkg.setTitle(text(node, "title"));
            pkg.setDestinationId(destinationIdMap.get(text(node, "destinationId")));
            pkg.setLocation(text(node, "location"));
            pkg.setCategory(text(node, "category"));
            String tripType = text(node, "tripType");
            if (tripType == null || tripType.isBlank()) {
                tripType = "International";
            }
            pkg.setTripType(tripType);
            pkg.setDuration(node.path("duration").asInt(0));
            pkg.setPrice(node.path("price").asDouble(0));
            pkg.setRating(node.path("rating").asDouble(4.5));
            pkg.setReviewCount(node.path("reviewCount").asInt(0));
            pkg.setFeatured(node.path("featured").asBoolean(false));
            pkg.setTrending(node.path("trending").asBoolean(false));
            pkg.setShortDescription(text(node, "shortDescription"));
            pkg.setDescription(text(node, "description"));

            node.path("images").forEach(n -> pkg.getImages().add(n.asText()));
            node.path("included").forEach(n -> pkg.getIncluded().add(n.asText()));
            node.path("excluded").forEach(n -> pkg.getExcluded().add(n.asText()));
            node.path("tourPlan").forEach(n -> pkg.getTourPlan().add(new TourPlanItem(
                    n.path("day").asInt(0), text(n, "title"), text(n, "detail"))));

            TravelPackage saved = packageRepository.save(pkg);
            packageIdMap.put(text(node, "id"), saved.getId());
        }
    }

    private void seedOffers() throws Exception {
        if (offerRepository.count() > 0) {
            return;
        }
        for (JsonNode node : readSeedFile("offers.json")) {
            Offer offer = new Offer();
            offer.setTitle(text(node, "title"));
            offer.setDescription(text(node, "description"));
            offer.setDiscount(text(node, "discount"));
            offer.setBannerImage(text(node, "bannerImage"));
            offer.setStartDate(date(node, "startDate"));
            offer.setEndDate(date(node, "endDate"));
            offer.setPackageId(packageIdMap.get(text(node, "packageId")));
            offer.setPopupEnabled(node.path("popupEnabled").asBoolean(false));
            offerRepository.save(offer);
        }
    }

    private void seedReviews() throws Exception {
        if (reviewRepository.count() > 0) {
            return;
        }
        for (JsonNode node : readSeedFile("reviews.json")) {
            Review review = new Review();
            review.setPackageId(packageIdMap.get(text(node, "packageId")));
            review.setName(text(node, "name"));
            review.setAvatar(text(node, "avatar"));
            review.setRating(node.path("rating").asInt(5));
            review.setDate(date(node, "date"));
            review.setComment(text(node, "comment"));
            reviewRepository.save(review);
        }
    }

    private void seedUsers() throws Exception {
        // Only seed demo users the first time (beyond the admin account created in seedAdmin()).
        if (userRepository.count() > 1) {
            return;
        }
        for (JsonNode node : readSeedFile("users.json")) {
            String email = text(node, "email");
            if (userRepository.existsByEmailIgnoreCase(email)) {
                continue;
            }
            User user = new User(
                    text(node, "name"),
                    email,
                    passwordEncoder.encode(text(node, "password")),
                    text(node, "phone"),
                    date(node, "joined"),
                    Role.USER
            );
            userRepository.save(user);
        }
    }

    private void seedBookings() throws Exception {
        if (bookingRepository.count() > 0) {
            return;
        }
        for (JsonNode node : readSeedFile("bookings.json")) {
            Booking booking = new Booking();
            booking.setPackageId(packageIdMap.get(text(node, "packageId")));
            booking.setPackageTitle(text(node, "packageTitle"));
            booking.setName(text(node, "name"));
            booking.setEmail(text(node, "email"));
            booking.setPhone(text(node, "phone"));
            booking.setAdults(node.path("adults").asInt(1));
            booking.setChildren(node.path("children").asInt(0));
            booking.setTravelDate(date(node, "travelDate"));
            booking.setSpecialRequests(text(node, "specialRequests"));
            booking.setStatus(text(node, "status"));
            booking.setTotalPrice(node.path("totalPrice").asDouble(0));
            booking.setCreatedAt(date(node, "createdAt"));
            bookingRepository.save(booking);
        }
    }

    private void seedContacts() throws Exception {
        if (contactRepository.count() > 0) {
            return;
        }
        for (JsonNode node : readSeedFile("contacts.json")) {
            Contact contact = new Contact();
            contact.setName(text(node, "name"));
            contact.setEmail(text(node, "email"));
            contact.setPhone(text(node, "phone"));
            contact.setSubject(text(node, "subject"));
            contact.setMessage(text(node, "message"));
            contact.setDate(date(node, "date"));
            contact.setReadState(node.path("read").asBoolean(false));
            contactRepository.save(contact);
        }
    }

    private String text(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? null : value.asText();
    }

    private LocalDate date(JsonNode node, String field) {
        String value = text(node, field);
        return value == null || value.isBlank() ? null : LocalDate.parse(value);
    }
}
