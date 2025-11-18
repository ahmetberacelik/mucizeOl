package com.mucizeol.auth.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends ApiException { // iş kurallarına dair hata

    public BusinessException(String code, String message) {
        super(code, message, HttpStatus.BAD_REQUEST);
    }
}

