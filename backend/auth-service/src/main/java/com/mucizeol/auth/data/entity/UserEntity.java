package com.mucizeol.auth.data.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter // getter üret
@Setter // setter üret
@NoArgsConstructor // parametresiz ctor
@Entity // JPA entity
@Table(name = "users") // tablo adı
public class UserEntity { // kullanıcılar tablosu için entity

    @Id // birincil anahtar
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto increment
    @Column(name = "user_id") // kolon adı
    private Long id; // kullanıcı kimliği

    @Column(name = "first_name", nullable = false, length = 100) // isim kolonu
    private String firstName; // ad

    @Column(name = "last_name", nullable = false, length = 100) // soyad kolonu
    private String lastName; // soyad

    @Column(name = "email", nullable = false, unique = true, length = 255) // email kolonu
    private String email; // benzersiz email

    @Column(name = "password_hash", nullable = false, length = 255) // hash kolonu
    private String passwordHash; // şifre hash'i

    @Column(name = "refresh_token_hash", length = 255) // refresh hash kolonu
    private String refreshTokenHash; // refresh token hash'i

    @Column(name = "refresh_token_expires_at") // süresi kolonu
    private Instant refreshTokenExpiresAt; // refresh token süresi

    @Column(name = "phone_number", nullable = false, length = 20) // telefon kolonu
    private String phoneNumber; // telefon

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // rol ilişkisi
    @JoinColumn(name = "role_id", nullable = false) // foreign key
    private RoleEntity role; // kullanıcı rolü

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false) // otomatik tarih
    private Instant createdAt; // oluşturulma zamanı
}

