package com.wayfarer.authservice.security;

import com.wayfarer.authservice.entity.BlacklistedToken;
import com.wayfarer.authservice.repository.BlacklistedTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
public class TokenBlacklistService {

    private final BlacklistedTokenRepository blacklistedTokenRepository;

    public TokenBlacklistService(BlacklistedTokenRepository blacklistedTokenRepository) {
        this.blacklistedTokenRepository = blacklistedTokenRepository;
    }

    public void blacklist(String token, Date expiration) {
        LocalDateTime expiresAt = expiration.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        blacklistedTokenRepository.save(new BlacklistedToken(token, expiresAt));
    }

    public boolean isBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }

    /**
     * Runs once every hour to purge blacklisted tokens whose natural JWT
     * expiry has already passed, so the table doesn't grow forever.
     */
    @Scheduled(fixedRate = 60 * 60 * 1000L)
    public void purgeExpiredTokens() {
        blacklistedTokenRepository.deleteAllExpiredTokens(LocalDateTime.now());
    }
}
