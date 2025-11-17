package com.mucizeol.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter // hata kodu ve status'e erişim
public abstract class ApiException extends RuntimeException { // uygulama bazlı temel exception

    private final String code; // uygulama hata kodu
    private final HttpStatus status; // HTTP status

    protected ApiException(String code, String message, HttpStatus status) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

