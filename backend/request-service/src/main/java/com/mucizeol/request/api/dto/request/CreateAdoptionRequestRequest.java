package com.mucizeol.request.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAdoptionRequestRequest {

    @NotNull(message = "İlan ID'si boş olamaz")
    @Positive(message = "İlan ID'si pozitif bir sayı olmalıdır")
    private Long listingId;

    @NotBlank(message = "Talep mesajı boş olamaz")
    private String requestMessage;
}

