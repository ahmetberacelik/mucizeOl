package com.mucizeol.request.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {

    private Long conversationId; // Listing ID
    private Long listingId; // Listing ID (aynı)
    private Long otherUserId; // Karşı tarafın kullanıcı ID'si
    private String otherUserName; // Karşı tarafın adı
    private String listingTitle; // İlan başlığı
    private String lastMessage; // Son mesaj
    private LocalDateTime lastMessageTime; // Son mesaj zamanı
    private Long unreadCount; // Okunmamış mesaj sayısı
    private List<MessageResponse> messages; // Tüm mesajlar
}

