package com.mucizeol.gateway.security;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtTokenService jwtTokenService;

    // Public endpoint'ler (JWT gerektirmez)
    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/auth/refresh",
            "/api/v1/meta/" // Şehir, tür, cins bilgileri public
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        HttpMethod method = exchange.getRequest().getMethod();

        // OPTIONS istekleri (CORS preflight) her zaman geçer
        if (HttpMethod.OPTIONS.equals(method)) {
            return chain.filter(exchange);
        }

        // Public endpoint kontrolü
        if (isPublicPath(path, method)) {
            return chain.filter(exchange);
        }

        // Authorization header'ı al
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("JWT token bulunamadı: {}", path);
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Token parse et
        String token = authHeader.substring(7);
        try {
            Claims claims = jwtTokenService.parseToken(token);
            String userId = jwtTokenService.getUserId(claims);
            String email = jwtTokenService.getEmail(claims);
            String role = jwtTokenService.getRole(claims);

            // Header'lara kullanıcı bilgilerini ekle
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("X-User-Id", userId)
                    .header("X-User-Email", email)
                    .header("X-User-Role", role)
                    .build();

            log.debug("JWT doğrulandı - userId: {}, email: {}, role: {}", userId, email, role);
            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (Exception ex) {
            log.warn("JWT doğrulama hatası: {}", ex.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    private boolean isPublicPath(String path, HttpMethod method) {
        // Auth ve meta endpoint'leri her zaman public
        if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
            return true;
        }

        // İlanlar için GET public (listing listesi, detay herkes görebilir)
        // ANCAK /my-listings endpoint'i protected olmalı
        if (path.startsWith("/api/v1/listings")) {
            // /my-listings endpoint'i protected
            if (path.contains("/my-listings")) {
                return false;
            }
            return HttpMethod.GET.equals(method);
        }

        // Request endpoint'leri TAMAMEN protected (kullanıcı talepleri, gizli)
        return false;
    }

    @Override
    public int getOrder() {
        return -100; // Yüksek öncelik (routing'den önce çalış)
    }
}

