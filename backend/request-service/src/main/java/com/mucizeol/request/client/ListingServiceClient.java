package com.mucizeol.request.client;

import com.mucizeol.request.exception.BusinessException;
import com.mucizeol.request.exception.NotFoundException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Listing Service ile iletişim için HTTP Client
 * WebClient: Spring'in reactive HTTP client'ı (RestTemplate'in modern alternatifi)
 */
@Slf4j
@Component
public class ListingServiceClient {

    private final WebClient webClient;

    public ListingServiceClient(@Value("${listing.service.url}") String listingServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(listingServiceUrl)
                .build();
    }

    /**
     * Listing Service'ten ilan bilgisini getirir
     * Not: Service-to-service iletişim, Gateway'den geçmez, header'ları manuel eklemeye gerek yok (public endpoint)
     */
    public ListingDto getListingById(Long listingId) {
        log.debug("Listing Service'ten ilan getiriliyor: {}", listingId);
        
        return webClient.get()
                .uri("/api/v1/listings/{id}", listingId)
                .retrieve()
                .onStatus(
                    httpStatus -> httpStatus == HttpStatus.NOT_FOUND,
                    response -> Mono.error(new NotFoundException("REQUEST.LISTING_NOT_FOUND", "İlan bulunamadı"))
                )
                .onStatus(
                    httpStatus -> httpStatus.isError(),
                    response -> Mono.error(new BusinessException("REQUEST.LISTING_SERVICE_ERROR", "İlan servisi ile iletişim hatası"))
                )
                .bodyToMono(ListingDto.class)
                .block();
    }

    /**
     * Listing Service'te ilanın durumunu günceller
     * Not: Service-to-service iletişim - Gateway'den geçmediği için X-User-Id header'ını manuel ekliyoruz
     */
    public void updateListingStatus(Long listingId, String status, Long userId) {
        log.debug("Listing Service'te ilan durumu güncelleniyor: {} -> {}", listingId, status);
        
        webClient.put()
                .uri("/api/v1/listings/{id}", listingId)
                .header("X-User-Id", String.valueOf(userId))  // ✅ Header'ı manuel ekle
                .header("X-User-Email", "system@request-service")  // Dummy value (gerekli değil ama tutarlılık için)
                .header("X-User-Role", "ROLE_USER")  // Dummy value
                .bodyValue(new UpdateStatusRequest(status))
                .retrieve()
                .onStatus(
                    httpStatus -> httpStatus.isError(),
                    response -> Mono.error(new BusinessException("REQUEST.LISTING_UPDATE_ERROR", "İlan durumu güncellenemedi"))
                )
                .bodyToMono(Void.class)
                .block();
    }

    /**
     * Listing Service'ten gelen ilan bilgisi
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListingDto {
        private Long listingId;
        private Long userId;
        private String status;
    }

    /**
     * İlan durumu güncelleme request'i
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class UpdateStatusRequest {
        private String status;
    }
}

