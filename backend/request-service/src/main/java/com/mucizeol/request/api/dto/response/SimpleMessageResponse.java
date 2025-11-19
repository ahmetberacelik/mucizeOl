package com.mucizeol.request.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleMessageResponse {
    private String message;

    public static SimpleMessageResponse of(String message) {
        return new SimpleMessageResponse(message);
    }
}

