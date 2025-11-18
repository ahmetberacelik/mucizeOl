package com.mucizeol.gateway.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Slf4j
@Component
public class GlobalExceptionHandler implements ErrorWebExceptionHandler {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        log.error("Gateway hatası: {}", ex.getMessage(), ex);

        // Hata durumunu belirle
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "Bir hata oluştu";

        if (ex instanceof org.springframework.web.server.ResponseStatusException) {
            org.springframework.web.server.ResponseStatusException rse = 
                (org.springframework.web.server.ResponseStatusException) ex;
            status = HttpStatus.valueOf(rse.getStatusCode().value());
            message = rse.getReason();
        }

        // JSON hata yanıtı oluştur
        String errorJson = String.format(
                "{\"timestamp\":\"%s\",\"path\":\"%s\",\"status\":%d,\"error\":\"%s\",\"message\":\"%s\"}",
                Instant.now().toString(),
                exchange.getRequest().getPath().value(),
                status.value(),
                status.getReasonPhrase(),
                message
        );

        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);

        DataBuffer buffer = exchange.getResponse().bufferFactory()
                .wrap(errorJson.getBytes(StandardCharsets.UTF_8));

        return exchange.getResponse().writeWith(Mono.just(buffer));
    }
}

