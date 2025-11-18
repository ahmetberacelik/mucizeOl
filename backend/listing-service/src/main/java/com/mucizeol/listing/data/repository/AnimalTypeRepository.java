package com.mucizeol.listing.data.repository;

import com.mucizeol.listing.data.entity.AnimalTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalTypeRepository extends JpaRepository<AnimalTypeEntity, Long> {
}

