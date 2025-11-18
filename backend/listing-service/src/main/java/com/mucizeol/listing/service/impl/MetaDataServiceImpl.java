package com.mucizeol.listing.service.impl;

import com.mucizeol.listing.api.dto.response.AnimalBreedResponse;
import com.mucizeol.listing.api.dto.response.AnimalTypeResponse;
import com.mucizeol.listing.api.dto.response.CityResponse;
import com.mucizeol.listing.data.repository.AnimalBreedRepository;
import com.mucizeol.listing.data.repository.AnimalTypeRepository;
import com.mucizeol.listing.data.repository.CityRepository;
import com.mucizeol.listing.service.MetaDataService;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MetaDataServiceImpl implements MetaDataService {

    private final CityRepository cityRepository;
    private final AnimalTypeRepository animalTypeRepository;
    private final AnimalBreedRepository animalBreedRepository;

    @Override
    public List<CityResponse> getAllCities() {
        return cityRepository.findAll().stream()
                .map(city -> new CityResponse(city.getId(), city.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<AnimalTypeResponse> getAllAnimalTypes() {
        return animalTypeRepository.findAll().stream()
                .map(type -> new AnimalTypeResponse(type.getId(), type.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<AnimalBreedResponse> getBreedsByTypeId(Long typeId) {
        return animalBreedRepository.findByTypeId(typeId).stream()
                .map(breed -> new AnimalBreedResponse(breed.getId(), breed.getType().getId(), breed.getName()))
                .collect(Collectors.toList());
    }
}

