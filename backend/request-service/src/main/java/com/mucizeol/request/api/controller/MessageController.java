package com.mucizeol.request.api.controller;

import com.mucizeol.request.api.dto.request.SendMessageRequest;
import com.mucizeol.request.api.dto.response.ConversationResponse;
import com.mucizeol.request.api.dto.response.MessageResponse;
import com.mucizeol.request.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /**
     * Yeni mesaj gönderir
     */
    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody SendMessageRequest request
    ) {
        log.info("POST /api/v1/messages - userId: {}", userId);
        MessageResponse response = messageService.sendMessage(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Bir conversation'daki tüm mesajları getirir
     */
    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<ConversationResponse> getConversation(
            @PathVariable("conversationId") Long conversationId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        log.info("GET /api/v1/messages/conversations/{} - userId: {}", conversationId, userId);
        ConversationResponse response = messageService.getConversation(conversationId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Kullanıcının tüm conversation'larını getirir
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(
            @RequestHeader("X-User-Id") Long userId
    ) {
        log.info("GET /api/v1/messages/conversations - userId: {}", userId);
        List<ConversationResponse> responses = messageService.getConversations(userId);
        return ResponseEntity.ok(responses);
    }

    /**
     * Mesajları okundu olarak işaretle
     */
    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable("conversationId") Long conversationId,
            @RequestHeader("X-User-Id") Long userId
    ) {
        log.info("POST /api/v1/messages/conversations/{}/read - userId: {}", conversationId, userId);
        messageService.markAsRead(conversationId, userId);
        return ResponseEntity.noContent().build();
    }
}

