package com.mucizeol.auth.exception;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        Instant timestamp, // hata zamanı
        String path, // isteğin path'i
        int status, // HTTP status kodu
        String code, // uygulama hata kodu
        String message, // kullanıcı mesajı
        List<FieldValidationError> errors // alan bazlı hatalar
) {

    public record FieldValidationError(String field, String message) { } // validasyon detayları
}

