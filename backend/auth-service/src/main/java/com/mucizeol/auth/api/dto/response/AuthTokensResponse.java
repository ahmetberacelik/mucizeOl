package com.mucizeol.auth.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter // getter üret
@Setter // setter üret
@NoArgsConstructor // parametresiz ctor
@AllArgsConstructor // tüm alanları alan ctor
public class AuthTokensResponse { // token üretim cevap modeli

    private String accessToken; // kısa ömürlü token
    private String refreshToken; // yenileme token'ı
}

