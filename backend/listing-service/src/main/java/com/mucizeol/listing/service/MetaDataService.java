package com.mucizeol.listing.service;

import com.mucizeol.listing.api.dto.response.AnimalBreedResponse;
import com.mucizeol.listing.api.dto.response.AnimalTypeResponse;
import com.mucizeol.listing.api.dto.response.CityResponse;
import java.util.List;

public interface MetaDataService {

    List<CityResponse> getAllCities();

    List<AnimalTypeResponse> getAllAnimalTypes();

    List<AnimalBreedResponse> getBreedsByTypeId(Long typeId);
}

