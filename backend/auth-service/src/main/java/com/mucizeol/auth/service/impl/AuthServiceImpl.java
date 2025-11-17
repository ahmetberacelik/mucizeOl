package com.mucizeol.auth.service.impl;

import com.mucizeol.auth.api.dto.request.LoginRequest;
import com.mucizeol.auth.api.dto.request.RefreshTokenRequest;
import com.mucizeol.auth.api.dto.request.RegisterRequest;
import com.mucizeol.auth.api.dto.response.AuthTokensResponse;
import com.mucizeol.auth.api.dto.response.UserResponse;
import com.mucizeol.auth.data.entity.RoleEntity;
import com.mucizeol.auth.data.entity.UserEntity;
import com.mucizeol.auth.data.repository.RoleRepository;
import com.mucizeol.auth.data.repository.UserRepository;
import com.mucizeol.auth.security.jwt.JwtProperties;
import com.mucizeol.auth.security.jwt.JwtTokenService;
import com.mucizeol.auth.service.AuthService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service // Auth iş mantığı implementasyonu
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final JwtProperties jwtProperties;

    @Override
    public UserResponse register(RegisterRequest request) { // yeni kullanıcı oluştur
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email zaten kayıtlı");
        }
        RoleEntity defaultRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Varsayılan rol bulunamadı"));

        UserEntity user = new UserEntity();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(defaultRole);
        UserEntity saved = userRepository.save(user);
        return mapToUserResponse(saved);
    }

    @Override
    public AuthTokensResponse login(LoginRequest request) { // giriş yap ve token üret
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz bilgiler"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz bilgiler");
        }
        return issueTokens(user);
    }

    @Override
    public AuthTokensResponse refresh(RefreshTokenRequest request) { // refresh token yenile
        TokenParts parts = parseRefreshToken(request.getRefreshToken());
        UserEntity user = userRepository.findById(parts.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum bulunamadı"));
        if (user.getRefreshTokenHash() == null || user.getRefreshTokenExpiresAt() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Oturum bulunamadı");
        }
        if (!passwordEncoder.matches(request.getRefreshToken(), user.getRefreshTokenHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz token");
        }
        if (user.getRefreshTokenExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token süresi dolmuş");
        }
        return issueTokens(user);
    }

    @Override
    public void logout(Long userId) { // refresh token'ı geçersiz kıl
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        user.setRefreshTokenHash(null);
        user.setRefreshTokenExpiresAt(null);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) { // current user bilgisi
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kullanıcı bulunamadı"));
        return mapToUserResponse(user);
    }

    private AuthTokensResponse issueTokens(UserEntity user) { // access ve refresh token üret
        String accessToken = jwtTokenService.generateAccessToken(user.getId(), user.getEmail(), user.getRole().getName());
        String refreshToken = buildRefreshToken(user);
        user.setRefreshTokenHash(passwordEncoder.encode(refreshToken));
        user.setRefreshTokenExpiresAt(Instant.now().plus(jwtProperties.getRefreshTokenExpirationDays(), ChronoUnit.DAYS));
        return new AuthTokensResponse(accessToken, refreshToken);
    }

    private String buildRefreshToken(UserEntity user) { // refresh token formatını oluştur
        return user.getId() + "." + UUID.randomUUID();
    }

    private TokenParts parseRefreshToken(String refreshToken) { // token içinden userId çıkar
        String[] segments = refreshToken.split("\\.");
        if (segments.length != 2) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz token");
        }
        try {
            Long userId = Long.parseLong(segments[0]);
            return new TokenParts(userId);
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Geçersiz token");
        }
    }

    private UserResponse mapToUserResponse(UserEntity user) { // entity -> dto dönüşümü
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole().getName());
    }

    private record TokenParts(Long userId) { } // refresh token parçaları
}

