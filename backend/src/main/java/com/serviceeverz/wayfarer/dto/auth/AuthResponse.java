package com.serviceeverz.wayfarer.dto.auth;

public class AuthResponse {

    private String token;
    private String role;
    private UserResponse user;

    public AuthResponse() {
    }

    public AuthResponse(String token, String role, UserResponse user) {
        this.token = token;
        this.role = role;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }
}
