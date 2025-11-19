package com.mucizeol.request.service;

import com.mucizeol.request.api.dto.request.SendMessageRequest;
import com.mucizeol.request.api.dto.response.ConversationResponse;
import com.mucizeol.request.api.dto.response.MessageResponse;

import java.util.List;

public interface MessageService {

    /**
     * Yeni mesaj gönderir
     */
    MessageResponse sendMessage(Long senderId, SendMessageRequest request);

    /**
     * Bir conversation'daki tüm mesajları getirir
     */
    ConversationResponse getConversation(Long conversationId, Long userId);

    /**
     * Kullanıcının tüm conversation'larını getirir
     */
    List<ConversationResponse> getConversations(Long userId);

    /**
     * Mesajları okundu olarak işaretle
     */
    void markAsRead(Long conversationId, Long userId);
}

