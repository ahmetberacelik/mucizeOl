package com.mucizeol.auth.security.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter // config alanları için getter
@Setter // config alanları için setter
@ConfigurationProperties(prefix = "security.jwt") // security.jwt.* değerlerini oku
public class JwtProperties {

    private String secretKey; // imzalama anahtarı
    private long accessTokenExpirationMinutes; // access token süresi
    private long refreshTokenExpirationDays; // refresh token süresi
}

