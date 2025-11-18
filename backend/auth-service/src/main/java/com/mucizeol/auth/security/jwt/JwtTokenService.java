package com.mucizeol.auth.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component // Spring yönetimli JWT servisi
@RequiredArgsConstructor
public class JwtTokenService {

    private final JwtProperties jwtProperties;
    private Key signingKey; // imzalama anahtarı

    @PostConstruct
    void init() {
        this.signingKey = Keys.hmacShaKeyFor(jwtProperties.getSecretKey().getBytes()); // HMAC anahtarı hazırla
    }

    public String generateAccessToken(Long userId, String email, String role) { // access token üret
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(jwtProperties.getAccessTokenExpirationMinutes() * 60);
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiresAt))
                .claim("email", email)
                .claim("role", role)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public JwtPayload parseToken(String token) { // token doğrula ve payload döndür
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Long userId = Long.valueOf(claims.getSubject());
        String email = claims.get("email", String.class);
        String role = claims.get("role", String.class);
        Instant expiresAt = claims.getExpiration().toInstant();
        return new JwtPayload(userId, email, role, expiresAt);
    }
}

