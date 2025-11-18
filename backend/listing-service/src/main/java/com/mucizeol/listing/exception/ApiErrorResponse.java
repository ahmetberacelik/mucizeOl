package com.mucizeol.listing.exception;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        Instant timestamp,
        String path,
        int status,
        String code,
        String message,
        List<FieldValidationError> errors
) {
    public record FieldValidationError(String field, String message) { }
}

