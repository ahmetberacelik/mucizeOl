package com.mucizeol.request.service;

import com.mucizeol.request.api.dto.request.CreateAdoptionRequestRequest;
import com.mucizeol.request.api.dto.response.AdoptionRequestResponse;
import com.mucizeol.request.api.dto.response.SimpleMessageResponse;

import java.util.List;

public interface AdoptionRequestService {

    /**
     * Yeni sahiplenme talebi oluşturur
     */
    AdoptionRequestResponse createRequest(Long userId, CreateAdoptionRequestRequest request);

    /**
     * Kullanıcının gönderdiği talepleri getirir
     */
    List<AdoptionRequestResponse> getMyRequests(Long userId);

    /**
     * Kullanıcının ilanlarına gelen talepleri getirir
     */
    List<AdoptionRequestResponse> getMyListingsRequests(Long userId);

    /**
     * Talebi onaylar (ilan sahibi)
     */
    SimpleMessageResponse approveRequest(Long requestId, Long userId);

    /**
     * Talebi reddeder (ilan sahibi)
     */
    SimpleMessageResponse rejectRequest(Long requestId, Long userId);
}

