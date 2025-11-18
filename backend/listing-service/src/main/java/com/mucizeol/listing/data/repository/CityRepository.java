package com.mucizeol.listing.data.repository;

import com.mucizeol.listing.data.entity.CityEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<CityEntity, Long> {
}

