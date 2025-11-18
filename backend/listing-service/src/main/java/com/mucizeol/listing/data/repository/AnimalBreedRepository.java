package com.mucizeol.listing.data.repository;

import com.mucizeol.listing.data.entity.AnimalBreedEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalBreedRepository extends JpaRepository<AnimalBreedEntity, Long> {
    
    List<AnimalBreedEntity> findByTypeId(Long typeId); // Türe göre cinsleri getir
}

