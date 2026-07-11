package com.wayfarer.authservice.repository;

import com.wayfarer.authservice.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {

    boolean existsByToken(String token);

    @Modifying
    @Query("DELETE FROM BlacklistedToken b WHERE b.expiresAt < :now")
    void deleteAllExpiredTokens(@Param("now") LocalDateTime now);
}
