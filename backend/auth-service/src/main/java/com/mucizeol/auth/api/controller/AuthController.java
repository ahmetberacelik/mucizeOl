package com.mucizeol.auth.api.controller;

import com.mucizeol.auth.api.dto.request.LoginRequest;
import com.mucizeol.auth.api.dto.request.RefreshTokenRequest;
import com.mucizeol.auth.api.dto.request.RegisterRequest;
import com.mucizeol.auth.api.dto.response.AuthTokensResponse;
import com.mucizeol.auth.api.dto.response.UserResponse;
import com.mucizeol.auth.exception.BusinessException;
import com.mucizeol.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // REST controller tanımı
@RequestMapping("/api/v1/auth") // auth endpoint kökü
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) { // yeni kullanıcı kaydı
        UserResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthTokensResponse> login(@Valid @RequestBody LoginRequest request) { // giriş yap
        AuthTokensResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthTokensResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) { // token yenile
        AuthTokensResponse response = authService.refresh(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() { // oturumu kapat
        Long userId = getCurrentUserId();
        authService.logout(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() { // current user bilgisi
        Long userId = getCurrentUserId();
        UserResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(response);
    }

    private Long getCurrentUserId() { // SecurityContext'ten userId al
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof com.mucizeol.auth.security.userdetails.AuthUserDetails userDetails)) {
            throw new BusinessException("AUTH.AUTHENTICATION_REQUIRED", "Kimlik doğrulama bulunamadı");
        }
        return userDetails.getId();
    }
}

