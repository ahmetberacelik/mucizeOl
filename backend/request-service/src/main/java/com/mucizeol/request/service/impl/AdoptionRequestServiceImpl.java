package com.mucizeol.request.service.impl;

import com.mucizeol.request.api.dto.request.CreateAdoptionRequestRequest;
import com.mucizeol.request.api.dto.response.AdoptionRequestResponse;
import com.mucizeol.request.api.dto.response.MessageResponse;
import com.mucizeol.request.data.entity.AdoptionRequestEntity;
import com.mucizeol.request.data.repository.AdoptionRequestRepository;
import com.mucizeol.request.exception.BusinessException;
import com.mucizeol.request.exception.ConflictException;
import com.mucizeol.request.exception.NotFoundException;
import com.mucizeol.request.exception.UnauthorizedException;
import com.mucizeol.request.service.AdoptionRequestService;
import com.mucizeol.request.client.ListingServiceClient;
import com.mucizeol.request.client.ListingServiceClient.ListingDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdoptionRequestServiceImpl implements AdoptionRequestService {

    private final AdoptionRequestRepository adoptionRequestRepository;
    private final ListingServiceClient listingServiceClient;

    @Override
    @Transactional
    public AdoptionRequestResponse createRequest(Long userId, CreateAdoptionRequestRequest request) {
        log.info("Yeni talep oluşturuluyor - userId: {}, listingId: {}", userId, request.getListingId());

        // 1. İlan var mı kontrol et
        ListingDto listing = listingServiceClient.getListingById(request.getListingId());

        // 2. Kullanıcı kendi ilanına talep gönderemez
        if (listing.getUserId().equals(userId)) {
            throw new BusinessException("REQUEST.SELF_REQUEST", "Kendi ilanınıza talep gönderemezsiniz");
        }

        // 3. İlan durumu "Mevcut" olmalı
        if (!"Mevcut".equals(listing.getStatus())) {
            throw new BusinessException("REQUEST.LISTING_NOT_AVAILABLE", "Bu ilan artık sahiplendirme için uygun değil");
        }

        // 4. Kullanıcı daha önce aynı ilana talep gönderdiyse hata fırlat
        if (adoptionRequestRepository.existsByUserIdAndListingId(userId, request.getListingId())) {
            throw new ConflictException("REQUEST.DUPLICATE", "Bu ilana daha önce talep gönderdiniz");
        }

        // 5. Talebi oluştur
        AdoptionRequestEntity entity = AdoptionRequestEntity.builder()
                .userId(userId)
                .listingId(request.getListingId())
                .requestMessage(request.getRequestMessage())
                .status("Beklemede")
                .build();

        AdoptionRequestEntity saved = adoptionRequestRepository.save(entity);
        log.info("Talep oluşturuldu - requestId: {}", saved.getRequestId());

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdoptionRequestResponse> getMyRequests(Long userId) {
        log.info("Kullanıcının talepleri getiriliyor - userId: {}", userId);
        
        List<AdoptionRequestEntity> requests = adoptionRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return requests.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdoptionRequestResponse> getMyListingsRequests(Long userId) {
        log.info("Kullanıcının ilanlarına gelen talepler getiriliyor - userId: {}", userId);
        
        // Bu özellik için listing-service'e yeni endpoint eklemek gerekir
        // Şimdilik basit implementasyon: Tüm talepleri getirir ve filtreleme yapmaz
        // TODO: Optimize edilmeli - listing-service'ten kullanıcının listing ID'lerini alıp filtreleme yapmalı
        
        List<AdoptionRequestEntity> allRequests = adoptionRequestRepository.findAll();
        
        return allRequests.stream()
                .filter(request -> {
                    try {
                        ListingDto listing = listingServiceClient.getListingById(request.getListingId());
                        return listing.getUserId().equals(userId);
                    } catch (Exception e) {
                        log.warn("İlan bilgisi alınamadı: {}", request.getListingId());
                        return false;
                    }
                })
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponse approveRequest(Long requestId, Long userId) {
        log.info("Talep onaylanıyor - requestId: {}, userId: {}", requestId, userId);

        // 1. Talep var mı kontrol et
        AdoptionRequestEntity request = adoptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("REQUEST.NOT_FOUND", "Talep bulunamadı"));

        // 2. İlan bilgisini al
        ListingDto listing = listingServiceClient.getListingById(request.getListingId());

        // 3. Sadece ilan sahibi onaylayabilir
        if (!listing.getUserId().equals(userId)) {
            throw new UnauthorizedException("REQUEST.UNAUTHORIZED", "Bu talebi onaylama yetkiniz yok");
        }

        // 4. Talep durumu "Beklemede" olmalı
        if (!"Beklemede".equals(request.getStatus())) {
            throw new BusinessException("REQUEST.ALREADY_PROCESSED", "Bu talep zaten işleme alınmış");
        }

        // 5. Talebi onayla
        request.setStatus("Onaylandı");
        adoptionRequestRepository.save(request);

        // 6. İlan durumunu "Sahiplendirildi" olarak güncelle (ilan sahibinin userId'si ile)
        listingServiceClient.updateListingStatus(listing.getListingId(), "Sahiplendirildi", listing.getUserId());

        log.info("Talep onaylandı ve ilan durumu güncellendi - requestId: {}", requestId);
        return MessageResponse.of("Talep onaylandı ve ilan 'Sahiplendirildi' olarak güncellendi.");
    }

    @Override
    @Transactional
    public MessageResponse rejectRequest(Long requestId, Long userId) {
        log.info("Talep reddediliyor - requestId: {}, userId: {}", requestId, userId);

        // 1. Talep var mı kontrol et
        AdoptionRequestEntity request = adoptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("REQUEST.NOT_FOUND", "Talep bulunamadı"));

        // 2. İlan bilgisini al
        ListingDto listing = listingServiceClient.getListingById(request.getListingId());

        // 3. Sadece ilan sahibi reddedebilir
        if (!listing.getUserId().equals(userId)) {
            throw new UnauthorizedException("REQUEST.UNAUTHORIZED", "Bu talebi reddetme yetkiniz yok");
        }

        // 4. Talep durumu "Beklemede" olmalı
        if (!"Beklemede".equals(request.getStatus())) {
            throw new BusinessException("REQUEST.ALREADY_PROCESSED", "Bu talep zaten işleme alınmış");
        }

        // 5. Talebi reddet
        request.setStatus("Reddedildi");
        adoptionRequestRepository.save(request);

        log.info("Talep reddedildi - requestId: {}", requestId);
        return MessageResponse.of("Talep reddedildi.");
    }

    private AdoptionRequestResponse mapToResponse(AdoptionRequestEntity entity) {
        return AdoptionRequestResponse.builder()
                .requestId(entity.getRequestId())
                .userId(entity.getUserId())
                .listingId(entity.getListingId())
                .status(entity.getStatus())
                .requestMessage(entity.getRequestMessage())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

