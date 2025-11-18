package com.mucizeol.request.api.controller;

import com.mucizeol.request.api.dto.request.CreateAdoptionRequestRequest;
import com.mucizeol.request.api.dto.response.AdoptionRequestResponse;
import com.mucizeol.request.api.dto.response.MessageResponse;
import com.mucizeol.request.service.AdoptionRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
public class AdoptionRequestController {

    private final AdoptionRequestService adoptionRequestService;

    /**
     * Yeni sahiplenme talebi oluşturur
     */
    @PostMapping
    public ResponseEntity<AdoptionRequestResponse> createRequest(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreateAdoptionRequestRequest request
    ) {
        log.info("POST /api/v1/requests - userId: {}", userId);
        AdoptionRequestResponse response = adoptionRequestService.createRequest(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Kullanıcının gönderdiği talepleri listeler
     */
    @GetMapping("/my-requests")
    public ResponseEntity<List<AdoptionRequestResponse>> getMyRequests(
            @RequestHeader("X-User-Id") Long userId
    ) {
        log.info("GET /api/v1/requests/my-requests - userId: {}", userId);
        List<AdoptionRequestResponse> responses = adoptionRequestService.getMyRequests(userId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Kullanıcının ilanlarına gelen talepleri listeler
     */
    @GetMapping("/my-listings-requests")
    public ResponseEntity<List<AdoptionRequestResponse>> getMyListingsRequests(
            @RequestHeader("X-User-Id") Long userId
    ) {
        log.info("GET /api/v1/requests/my-listings-requests - userId: {}", userId);
        List<AdoptionRequestResponse> responses = adoptionRequestService.getMyListingsRequests(userId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Talebi onaylar (ilan sahibi)
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<MessageResponse> approveRequest(
            @PathVariable("id") Long requestId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        log.info("POST /api/v1/requests/{}/approve - userId: {}", requestId, userId);
        MessageResponse response = adoptionRequestService.approveRequest(requestId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Talebi reddeder (ilan sahibi)
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<MessageResponse> rejectRequest(
            @PathVariable("id") Long requestId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        log.info("POST /api/v1/requests/{}/reject - userId: {}", requestId, userId);
        MessageResponse response = adoptionRequestService.rejectRequest(requestId, userId);
        return ResponseEntity.ok(response);
    }
}

