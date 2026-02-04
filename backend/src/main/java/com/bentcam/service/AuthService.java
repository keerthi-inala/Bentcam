package com.bentcam.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    public static class Session {
        public final Long userId;
        public final String role;
        public final Instant expiresAt;
        public Session(Long userId, String role, Instant expiresAt) {
            this.userId = userId;
            this.role = role;
            this.expiresAt = expiresAt;
        }
    }

    @Value("${app.auth.token-ttl-minutes:120}")
    private long tokenTtlMinutes;

    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    public String issueToken(Long userId, String role) {
        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(Duration.ofMinutes(tokenTtlMinutes));
        sessions.put(token, new Session(userId, role, expiresAt));
        return token;
    }

    public Session validate(String token) {
        Session s = sessions.get(token);
        if (s == null) return null;
        if (Instant.now().isAfter(s.expiresAt)) {
            sessions.remove(token);
            return null;
        }
        return s;
    }

    public void revoke(String token) {
        sessions.remove(token);
    }
}
