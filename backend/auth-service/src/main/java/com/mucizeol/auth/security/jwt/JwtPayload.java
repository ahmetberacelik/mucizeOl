package com.mucizeol.auth.security.jwt;

import java.time.Instant;

public record JwtPayload(Long userId, String email, String role, Instant expiresAt) { // token içeriği
}

