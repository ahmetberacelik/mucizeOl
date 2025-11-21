package com.mucizeol.auth.api.controller;

import com.mucizeol.auth.api.dto.request.LoginRequest;
import com.mucizeol.auth.api.dto.request.RefreshTokenRequest;
import com.mucizeol.auth.api.dto.request.RegisterRequest;
import com.mucizeol.auth.api.dto.response.AuthTokensResponse;
import com.mucizeol.auth.api.dto.response.UserResponse;
import com.mucizeol.auth.exception.BusinessException;
import com.mucizeol.auth.security.userdetails.AuthUserDetails;
import com.mucizeol.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // REST controller tanımı
@RequestMapping("/api/v1/auth") // auth endpoint kökü
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Kimlik doğrulama işlemleri")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Kullanıcı kaydı oluştur")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) { // yeni kullanıcı kaydı
        UserResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Giriş yap ve token üret")
    public ResponseEntity<AuthTokensResponse> login(@Valid @RequestBody LoginRequest request) { // giriş yap
        AuthTokensResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Access token yenile")
    public ResponseEntity<AuthTokensResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) { // token yenile
        AuthTokensResponse response = authService.refresh(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Oturumu kapat", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> logout() { // oturumu kapat
        Long userId = getCurrentUserId();
        authService.logout(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Mevcut kullanıcının bilgilerini getir", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<UserResponse> me() { // current user bilgisi
        Long userId = getCurrentUserId();
        UserResponse response = authService.getCurrentUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    @Operation(summary = "Kullanıcı bilgilerini getir", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) { // userId'ye göre kullanıcı bilgisi
        UserResponse response = authService.getUserById(userId);
        return ResponseEntity.ok(response);
    }

    private Long getCurrentUserId() { // SecurityContext'ten userId al
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthUserDetails userDetails)) {
            throw new BusinessException("AUTH.AUTHENTICATION_REQUIRED", "Kimlik doğrulama bulunamadı");
        }
        return userDetails.getId();
    }
}

