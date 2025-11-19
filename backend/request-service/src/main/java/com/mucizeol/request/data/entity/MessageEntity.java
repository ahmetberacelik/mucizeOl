package com.mucizeol.request.data.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @Column(name = "conversation_id", nullable = false)
    private Long conversationId; // İlan ID'si - aynı ilan için tüm mesajlar bir conversation'da

    @Column(name = "sender_id", nullable = false)
    private Long senderId; // Mesaj gönderen kullanıcı ID'si

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId; // Mesaj alan kullanıcı ID'si

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content; // Mesaj içeriği

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false; // Okundu mu?

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isRead == null) {
            isRead = false;
        }
    }
}

