package com.mucizeol.listing.service;

import com.mucizeol.listing.api.dto.request.CreateListingRequest;
import com.mucizeol.listing.api.dto.request.UpdateListingRequest;
import com.mucizeol.listing.api.dto.response.ListingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ListingService {

    ListingResponse createListing(CreateListingRequest request, MultipartFile image, Long userId);

    Page<ListingResponse> getListings(Long cityId, Long animalTypeId, Long animalBreedId, Pageable pageable);

    ListingResponse getListingById(Long id);

    Page<ListingResponse> getMyListings(Long userId, Pageable pageable);

    ListingResponse updateListing(Long id, UpdateListingRequest request, Long userId);

    void deleteListing(Long id, Long userId, String userRole);
}

