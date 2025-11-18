package com.mucizeol.request.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends ApiException {

    public BusinessException(String code, String message) {
        super(HttpStatus.BAD_REQUEST, code, message);
    }
}

