package com.mucizeol.request.data.repository;

import com.mucizeol.request.data.entity.AdoptionRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequestEntity, Long> {

    /**
     * Kullanıcının gönderdiği tüm talepleri getirir
     */
    List<AdoptionRequestEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Bir ilana gelen tüm talepleri getirir
     */
    List<AdoptionRequestEntity> findByListingIdOrderByCreatedAtDesc(Long listingId);

    /**
     * Kullanıcının belirli bir ilana talebi olup olmadığını kontrol eder
     */
    boolean existsByUserIdAndListingId(Long userId, Long listingId);

    /**
     * Belirli listing ID'lerine gelen tüm talepleri getirir
     * (Kullanıcının ilanlarına gelen talepleri bulmak için)
     */
    List<AdoptionRequestEntity> findByListingIdInOrderByCreatedAtDesc(List<Long> listingIds);
}

