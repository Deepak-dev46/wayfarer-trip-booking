package com.wayfarer.authservice.dto;

public class LoginResponse {

    private String token;
    private String tokenType;
    private Long expiresInSeconds;
    private String username;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(String token, String tokenType, Long expiresInSeconds, String username, String role) {
        this.token = token;
        this.tokenType = tokenType;
        this.expiresInSeconds = expiresInSeconds;
        this.username = username;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getExpiresInSeconds() {
        return expiresInSeconds;
    }

    public void setExpiresInSeconds(Long expiresInSeconds) {
        this.expiresInSeconds = expiresInSeconds;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
