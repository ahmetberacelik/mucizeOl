package com.mucizeol.auth.data.repository;

import com.mucizeol.auth.data.entity.RoleEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> { // rol CRUD işlemleri

    Optional<RoleEntity> findByName(String name); // isimden rolü bul
}

