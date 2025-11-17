package com.mucizeol.auth.api.dto.request;

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
public class RefreshTokenRequest { // access token yenileme isteği

    @NotBlank // boş olamaz
    @Size(min = 10, max = 255) // token uzunluğu
    private String refreshToken; // gönderilen refresh token
}

