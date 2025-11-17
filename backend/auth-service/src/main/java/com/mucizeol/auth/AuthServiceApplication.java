package com.mucizeol.auth;

import com.mucizeol.auth.security.jwt.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication // Spring Boot uygulama giriş noktası
@EnableConfigurationProperties(JwtProperties.class) // JWT ayarlarını yükle
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args); // uygulamayı başlat
    }
}
