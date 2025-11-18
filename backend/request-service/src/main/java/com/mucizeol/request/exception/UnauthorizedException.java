package com.mucizeol.request.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends ApiException {

    public UnauthorizedException(String code, String message) {
        super(HttpStatus.FORBIDDEN, code, message);
    }
}

