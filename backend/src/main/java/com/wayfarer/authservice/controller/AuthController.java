package com.wayfarer.authservice.controller;

import com.wayfarer.authservice.dto.LoginRequest;
import com.wayfarer.authservice.dto.LoginResponse;
import com.wayfarer.authservice.dto.MessageResponse;
import com.wayfarer.authservice.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        authService.logout(bearerToken);
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }
}
