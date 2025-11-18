package com.mucizeol.listing.data.repository;

import com.mucizeol.listing.data.entity.ListingEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ListingRepository extends JpaRepository<ListingEntity, Long>, 
                                           JpaSpecificationExecutor<ListingEntity> {
    
    // Status'e göre sayfalı listeleme (filtreleme için JpaSpecificationExecutor kullanacağız)
    Page<ListingEntity> findAllByStatus(String status, Pageable pageable);
    
    // Yetki kontrolü için
    boolean existsByIdAndUserId(Long id, Long userId);
}

