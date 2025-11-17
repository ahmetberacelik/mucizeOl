package com.mucizeol.auth.data.repository;

import com.mucizeol.auth.data.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> { // kullanıcı CRUD işlemleri

    Optional<UserEntity> findByEmail(String email); // email'e göre kullanıcı bul

    boolean existsByEmail(String email); // email kayıtlı mı?
}

