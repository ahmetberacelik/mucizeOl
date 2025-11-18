package com.mucizeol.auth.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter // getter üret
@Setter // setter üret
@NoArgsConstructor // parametresiz ctor
@AllArgsConstructor // tüm alanları alan ctor
public class RegisterRequest { // yeni kullanıcı kayıt isteği

    @NotBlank // zorunlu alan
    @Size(max = 100) // maksimum uzunluk
    private String firstName; // ad bilgisi

    @NotBlank // zorunlu alan
    @Size(max = 100) // maksimum uzunluk
    private String lastName; // soyad bilgisi

    @NotBlank // boş olamaz
    @Email // format kontrolü
    @Size(max = 255) // maksimum uzunluk
    private String email; // benzersiz email

    @NotBlank // zorunlu
    @Size(min = 8, max = 72) // şifre uzunluğu
    private String password; // hash'lenecek parola

    @NotBlank // zorunlu
    @Size(min = 10, max = 20) // telefon uzunluğu
    private String phoneNumber; // iletişim telefonu
}

