package com.mucizeol.auth.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter // alanlar için getter üretir
@Setter // alanlar için setter üretir
@NoArgsConstructor // parametresiz ctor oluşturur
@AllArgsConstructor // tüm alanları içeren ctor oluşturur
public class LoginRequest { // giriş isteğinin gövdesi

    @NotBlank // boş bırakılamaz
    @Email // format kontrolü
    @Size(max = 255) // uzunluk sınırı
    private String email; // kullanıcı emaili

    @NotBlank // boş şifre olmaz
    @Size(min = 8, max = 72) // şifre uzunluğu
    private String password; // kullanıcı şifresi
}

