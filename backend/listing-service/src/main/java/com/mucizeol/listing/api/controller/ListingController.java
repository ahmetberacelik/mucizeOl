package com.mucizeol.listing.api.controller;

import com.mucizeol.listing.api.dto.request.CreateListingRequest;
import com.mucizeol.listing.api.dto.request.UpdateListingRequest;
import com.mucizeol.listing.api.dto.response.ListingResponse;
import com.mucizeol.listing.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ListingResponse> createListing(
            @Valid @ModelAttribute CreateListingRequest request,
            @RequestPart("image") MultipartFile image,
            @RequestHeader("X-User-Id") Long userId) {
        
        ListingResponse response = listingService.createListing(request, image, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ListingResponse>> getListings(
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) Long animalTypeId,
            @RequestParam(required = false) Long animalBreedId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<ListingResponse> response = listingService.getListings(cityId, animalTypeId, animalBreedId, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getListingById(@PathVariable Long id) {
        ListingResponse response = listingService.getListingById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingResponse> updateListing(
            @PathVariable Long id,
            @Valid @RequestBody UpdateListingRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        
        ListingResponse response = listingService.updateListing(id, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListing(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String userRole) {
        
        listingService.deleteListing(id, userId, userRole);
        return ResponseEntity.noContent().build();
    }
}

