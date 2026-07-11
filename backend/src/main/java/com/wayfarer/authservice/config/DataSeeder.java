package com.wayfarer.authservice.config;

import com.wayfarer.authservice.entity.Role;
import com.wayfarer.authservice.entity.User;
import com.wayfarer.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds two default accounts on first startup so the skeleton is testable
 * immediately without needing to insert rows by hand.
 *
 * admin / admin123   (ROLE_ADMIN)
 * demo  / demo1234   (ROLE_USER)
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedIfMissing("admin", "admin@wayfarer.example", "admin123", Role.ADMIN);
        seedIfMissing("demo", "demo@wayfarer.example", "demo1234", Role.USER);
    }

    private void seedIfMissing(String username, String email, String rawPassword, Role role) {
        if (userRepository.existsByUsername(username)) {
            return;
        }
        User user = new User(username, email, passwordEncoder.encode(rawPassword), role);
        userRepository.save(user);
    }
}
