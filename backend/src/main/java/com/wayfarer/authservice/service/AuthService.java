package com.wayfarer.authservice.service;

import com.wayfarer.authservice.dto.LoginRequest;
import com.wayfarer.authservice.dto.LoginResponse;
import com.wayfarer.authservice.entity.User;
import com.wayfarer.authservice.exception.InvalidCredentialsException;
import com.wayfarer.authservice.repository.UserRepository;
import com.wayfarer.authservice.security.AuthenticatedUser;
import com.wayfarer.authservice.security.JwtUtil;
import com.wayfarer.authservice.security.TokenBlacklistService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtUtil jwtUtil,
            TokenBlacklistService tokenBlacklistService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication;

        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        AuthenticatedUser authenticatedUser = (AuthenticatedUser) authentication.getPrincipal();
        User user = authenticatedUser.getUser();

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return new LoginResponse(token, "Bearer", jwtUtil.getExpirationSeconds(), user.getUsername(), user.getRole().name());
    }

    public void logout(String bearerToken) {
        if (bearerToken == null || !bearerToken.startsWith("Bearer ")) {
            return;
        }
        String token = bearerToken.substring("Bearer ".length());

        if (jwtUtil.isTokenWellFormed(token) && !jwtUtil.isTokenExpired(token)) {
            Date expiration = jwtUtil.extractExpiration(token);
            tokenBlacklistService.blacklist(token, expiration);
        }
    }
}
