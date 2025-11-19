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
public class SendMessageRequest {

    @NotNull(message = "İlan ID'si boş olamaz")
    @Positive(message = "İlan ID'si pozitif bir sayı olmalıdır")
    private Long listingId; // Conversation ID olarak kullanılacak

    @NotNull(message = "Alıcı ID'si boş olamaz")
    @Positive(message = "Alıcı ID'si pozitif bir sayı olmalıdır")
    private Long receiverId; // Mesaj alacak kullanıcı ID'si

    @NotBlank(message = "Mesaj içeriği boş olamaz")
    private String content; // Mesaj içeriği
}

