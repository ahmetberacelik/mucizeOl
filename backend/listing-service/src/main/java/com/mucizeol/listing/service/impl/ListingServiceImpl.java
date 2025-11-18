package com.mucizeol.listing.service.impl;

import com.mucizeol.listing.api.dto.request.CreateListingRequest;
import com.mucizeol.listing.api.dto.request.UpdateListingRequest;
import com.mucizeol.listing.api.dto.response.ListingResponse;
import com.mucizeol.listing.data.entity.AnimalBreedEntity;
import com.mucizeol.listing.data.entity.AnimalTypeEntity;
import com.mucizeol.listing.data.entity.CityEntity;
import com.mucizeol.listing.data.entity.ListingEntity;
import com.mucizeol.listing.data.repository.AnimalBreedRepository;
import com.mucizeol.listing.data.repository.AnimalTypeRepository;
import com.mucizeol.listing.data.repository.CityRepository;
import com.mucizeol.listing.data.repository.ListingRepository;
import com.mucizeol.listing.exception.NotFoundException;
import com.mucizeol.listing.exception.UnauthorizedException;
import com.mucizeol.listing.service.FileStorageService;
import com.mucizeol.listing.service.ListingService;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class ListingServiceImpl implements ListingService {

    private final ListingRepository listingRepository;
    private final CityRepository cityRepository;
    private final AnimalTypeRepository animalTypeRepository;
    private final AnimalBreedRepository animalBreedRepository;
    private final FileStorageService fileStorageService;

    @Override
    public ListingResponse createListing(CreateListingRequest request, MultipartFile image, Long userId) {
        // Foreign key'leri kontrol et
        CityEntity city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new NotFoundException("LISTING.CITY_NOT_FOUND", "Şehir bulunamadı"));
        
        AnimalTypeEntity animalType = animalTypeRepository.findById(request.getAnimalTypeId())
                .orElseThrow(() -> new NotFoundException("LISTING.TYPE_NOT_FOUND", "Hayvan türü bulunamadı"));
        
        AnimalBreedEntity animalBreed = animalBreedRepository.findById(request.getAnimalBreedId())
                .orElseThrow(() -> new NotFoundException("LISTING.BREED_NOT_FOUND", "Hayvan cinsi bulunamadı"));

        // Resim yükle
        String imageUrl = fileStorageService.storeFile(image);

        // Entity oluştur
        ListingEntity listing = new ListingEntity();
        listing.setUserId(userId);
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setImageUrl(imageUrl);
        listing.setAnimalType(animalType);
        listing.setAnimalBreed(animalBreed);
        listing.setCity(city);
        listing.setAge(request.getAge());
        listing.setGender(request.getGender());

        ListingEntity saved = listingRepository.save(listing);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ListingResponse> getListings(Long cityId, Long animalTypeId, Long animalBreedId, Pageable pageable) {
        // Dinamik filtreleme için Specification kullan
        Specification<ListingEntity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Sadece "Mevcut" ilanlar
            predicates.add(cb.equal(root.get("status"), "Mevcut"));
            
            // Şehir filtresi
            if (cityId != null) {
                predicates.add(cb.equal(root.get("city").get("id"), cityId));
            }
            
            // Tür filtresi
            if (animalTypeId != null) {
                predicates.add(cb.equal(root.get("animalType").get("id"), animalTypeId));
            }
            
            // Cins filtresi
            if (animalBreedId != null) {
                predicates.add(cb.equal(root.get("animalBreed").get("id"), animalBreedId));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return listingRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ListingResponse getListingById(Long id) {
        ListingEntity listing = listingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("LISTING.NOT_FOUND", "İlan bulunamadı"));
        return mapToResponse(listing);
    }

    @Override
    public ListingResponse updateListing(Long id, UpdateListingRequest request, Long userId) {
        ListingEntity listing = listingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("LISTING.NOT_FOUND", "İlan bulunamadı"));

        // Yetki kontrolü
        if (!listing.getUserId().equals(userId)) {
            throw new UnauthorizedException("LISTING.UNAUTHORIZED", "Bu ilanı düzenleme yetkiniz yok");
        }

        // Sadece belirtilen alanları güncelle (partial update)
        if (request.getTitle() != null) {
            listing.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            listing.setDescription(request.getDescription());
        }
        if (request.getAge() != null) {
            listing.setAge(request.getAge());
        }
        if (request.getGender() != null) {
            listing.setGender(request.getGender());
        }
        if (request.getStatus() != null) {
            listing.setStatus(request.getStatus());
        }

        ListingEntity updated = listingRepository.save(listing);
        return mapToResponse(updated);
    }

    @Override
    public void deleteListing(Long id, Long userId, String userRole) {
        ListingEntity listing = listingRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("LISTING.NOT_FOUND", "İlan bulunamadı"));

        // Yetki kontrolü (ilan sahibi veya admin)
        boolean isOwner = listing.getUserId().equals(userId);
        boolean isAdmin = "ROLE_ADMIN".equals(userRole);
        
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("LISTING.UNAUTHORIZED", "Bu ilanı silme yetkiniz yok");
        }

        listingRepository.delete(listing);
    }

    private ListingResponse mapToResponse(ListingEntity listing) {
        return new ListingResponse(
                listing.getId(),
                listing.getUserId(),
                listing.getTitle(),
                listing.getDescription(),
                listing.getImageUrl(),
                listing.getAnimalType().getId(),
                listing.getAnimalBreed().getId(),
                listing.getCity().getId(),
                listing.getAge(),
                listing.getGender(),
                listing.getStatus(),
                listing.getCreatedAt(),
                listing.getUpdatedAt()
        );
    }
}

