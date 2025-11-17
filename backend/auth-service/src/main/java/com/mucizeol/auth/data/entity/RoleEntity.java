package com.mucizeol.auth.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter // Lombok getter üretir
@Setter // Lombok setter üretir
@NoArgsConstructor // parametresiz ctor
@Entity // JPA entity tanımı
@Table(name = "roles") // tablo adı eşlemesi
public class RoleEntity { // roller tablosu için entity

    @Id // birincil anahtar
    @GeneratedValue(strategy = GenerationType.IDENTITY) // otomatik artan
    @Column(name = "role_id") // kolon adı
    private Long id; // rol kimliği

    @Column(name = "role_name", nullable = false, unique = true, length = 50) // rol adı kolonu
    private String name; // rol adı
}

