package com.mucizeol.auth.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j // hata logları için
@RestControllerAdvice // global exception yakalayıcı
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(ApiException ex, HttpServletRequest request) {
        log.warn("İş kuralı hatası: {}", ex.getMessage());
        return buildResponse(ex.getStatus(), ex.getCode(), ex.getMessage(), request.getRequestURI(), null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ApiErrorResponse.FieldValidationError> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new ApiErrorResponse.FieldValidationError(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toList());
        return buildResponse(HttpStatus.BAD_REQUEST, "COMMON.VALIDATION_ERROR", "Geçersiz alanlar mevcut",
                request.getRequestURI(), fieldErrors);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "AUTH.INVALID_CREDENTIALS", "Geçersiz kimlik bilgileri",
                request.getRequestURI(), null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.FORBIDDEN, "AUTH.ACCESS_DENIED", "Bu işlem için yetkiniz yok",
                request.getRequestURI(), null);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String message = String.format("Parametre '%s' geçersiz", ex.getName());
        return buildResponse(HttpStatus.BAD_REQUEST, "COMMON.TYPE_MISMATCH", message,
                request.getRequestURI(), null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Beklenmeyen hata", ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON.UNEXPECTED_ERROR", "Beklenmeyen bir hata oluştu",
                request.getRequestURI(), null);
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(HttpStatus status,
                                                           String code,
                                                           String message,
                                                           String path,
                                                           List<ApiErrorResponse.FieldValidationError> errors) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                path,
                status.value(),
                code,
                message,
                errors
        );
        return ResponseEntity.status(status).body(body);
    }
}

