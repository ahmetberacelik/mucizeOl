package com.mucizeol.listing.api.controller;

import com.mucizeol.listing.api.dto.response.AnimalBreedResponse;
import com.mucizeol.listing.api.dto.response.AnimalTypeResponse;
import com.mucizeol.listing.api.dto.response.CityResponse;
import com.mucizeol.listing.service.MetaDataService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/meta")
@RequiredArgsConstructor
public class MetaDataController {

    private final MetaDataService metaDataService;

    @GetMapping("/cities")
    public ResponseEntity<List<CityResponse>> getAllCities() {
        List<CityResponse> response = metaDataService.getAllCities();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/animal-types")
    public ResponseEntity<List<AnimalTypeResponse>> getAllAnimalTypes() {
        List<AnimalTypeResponse> response = metaDataService.getAllAnimalTypes();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/animal-types/{typeId}/breeds")
    public ResponseEntity<List<AnimalBreedResponse>> getBreedsByTypeId(@PathVariable Long typeId) {
        List<AnimalBreedResponse> response = metaDataService.getBreedsByTypeId(typeId);
        return ResponseEntity.ok(response);
    }
}

