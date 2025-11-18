package com.mucizeol.auth.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends ApiException { // bulunamayan kaynak hatası

    public NotFoundException(String code, String message) {
        super(code, message, HttpStatus.NOT_FOUND);
    }
}

