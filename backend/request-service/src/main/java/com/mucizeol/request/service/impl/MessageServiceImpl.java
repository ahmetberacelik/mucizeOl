package com.mucizeol.request.service.impl;

import com.mucizeol.request.api.dto.request.SendMessageRequest;
import com.mucizeol.request.api.dto.response.ConversationResponse;
import com.mucizeol.request.api.dto.response.MessageResponse;
import com.mucizeol.request.client.ListingServiceClient;
import com.mucizeol.request.data.entity.MessageEntity;
import com.mucizeol.request.data.repository.AdoptionRequestRepository;
import com.mucizeol.request.data.repository.MessageRepository;
import com.mucizeol.request.exception.BusinessException;
import com.mucizeol.request.exception.UnauthorizedException;
import com.mucizeol.request.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import com.mucizeol.request.data.entity.AdoptionRequestEntity;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final ListingServiceClient listingServiceClient;
    private final AdoptionRequestRepository adoptionRequestRepository;

    @Override
    @Transactional
    public MessageResponse sendMessage(Long senderId, SendMessageRequest request) {
        log.info("Yeni mesaj gönderiliyor - senderId: {}, listingId: {}, receiverId: {}", 
                senderId, request.getListingId(), request.getReceiverId());

        // 1. İlan var mı kontrol et
        ListingServiceClient.ListingDto listing = listingServiceClient.getListingById(request.getListingId());

        // 2. Gönderen ve alıcı aynı kişi olamaz
        if (senderId.equals(request.getReceiverId())) {
            throw new BusinessException("MESSAGE.SELF_MESSAGE", "Kendinize mesaj gönderemezsiniz");
        }

        // 3. Mesaj gönderme yetkisi kontrolü
        boolean isListingOwner = listing.getUserId().equals(senderId);
        boolean isReceiverListingOwner = listing.getUserId().equals(request.getReceiverId());
        
        if (isListingOwner) {
            // İlan sahibi mesaj gönderiyor -> Alıcı bu ilana talep göndermiş olmalı
            boolean receiverHasRequest = adoptionRequestRepository.existsByUserIdAndListingId(
                    request.getReceiverId(), request.getListingId());
            if (!receiverHasRequest) {
                throw new UnauthorizedException("MESSAGE.UNAUTHORIZED", 
                        "Bu kullanıcı bu ilana talep göndermemiş");
            }
        } else if (isReceiverListingOwner) {
            // Talep sahibi ilan sahibine mesaj gönderiyor -> Gönderen bu ilana talep göndermiş olmalı
            boolean senderHasRequest = adoptionRequestRepository.existsByUserIdAndListingId(
                    senderId, request.getListingId());
            if (!senderHasRequest) {
                throw new UnauthorizedException("MESSAGE.UNAUTHORIZED", 
                        "Bu ilan için mesaj gönderme yetkiniz yok. Önce sahiplenme talebi göndermelisiniz.");
            }
        } else {
            // Ne gönderen ne de alıcı ilan sahibi -> Hata
            throw new UnauthorizedException("MESSAGE.UNAUTHORIZED", 
                    "Bu ilan için mesaj gönderme yetkiniz yok");
        }

        // 4. Mesajı oluştur
        MessageEntity message = MessageEntity.builder()
                .conversationId(request.getListingId()) // Listing ID = Conversation ID
                .senderId(senderId)
                .receiverId(request.getReceiverId())
                .content(request.getContent())
                .isRead(false)
                .build();

        MessageEntity saved = messageRepository.save(message);
        log.info("Mesaj gönderildi - messageId: {}", saved.getMessageId());

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationResponse getConversation(Long conversationId, Long userId) {
        log.info("Conversation getiriliyor - conversationId: {}, userId: {}", conversationId, userId);

        // 1. İlan var mı kontrol et
        ListingServiceClient.ListingDto listing = listingServiceClient.getListingById(conversationId);

        // 2. Kullanıcı ilan sahibi, bu conversation'da mesajı olan biri veya onaylanmış adoption request'i olan biri olmalı
        boolean isListingOwner = listing.getUserId().equals(userId);
        boolean hasMessages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .anyMatch(m -> m.getSenderId().equals(userId) || m.getReceiverId().equals(userId));
        
        // Onaylanmış adoption request kontrolü
        boolean hasApprovedRequest = false;
        if (!isListingOwner && !hasMessages) {
            // Kullanıcının bu ilana onaylanmış talebi var mı?
            hasApprovedRequest = adoptionRequestRepository.existsByUserIdAndListingId(userId, conversationId) &&
                    adoptionRequestRepository.findByUserIdOrderByCreatedAtDesc(userId)
                            .stream()
                            .filter(req -> req.getListingId().equals(conversationId))
                            .anyMatch(req -> "Onaylandı".equals(req.getStatus()));
            
            // Veya kullanıcı ilan sahibi ve bu ilana onaylanmış talep var mı?
            if (!hasApprovedRequest && isListingOwner) {
                hasApprovedRequest = adoptionRequestRepository.findByListingIdOrderByCreatedAtDesc(conversationId)
                        .stream()
                        .anyMatch(req -> "Onaylandı".equals(req.getStatus()));
            }
        }

        if (!isListingOwner && !hasMessages && !hasApprovedRequest) {
            throw new UnauthorizedException("MESSAGE.UNAUTHORIZED", "Bu conversation'a erişim yetkiniz yok");
        }

        // 3. Mesajları getir
        List<MessageEntity> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        
        // 4. Karşı tarafın ID'sini bul
        Long otherUserId = null;
        if (!messages.isEmpty()) {
            // Mesaj varsa, mesajlardan karşı tarafı bul
            otherUserId = messages.stream()
                    .filter(m -> !m.getSenderId().equals(userId))
                    .map(MessageEntity::getSenderId)
                    .findFirst()
                    .orElse(null);
        }
        
        // Mesaj yoksa, adoption request'ten karşı tarafı bul
        if (otherUserId == null) {
            if (isListingOwner) {
                // İlan sahibi ise, onaylanmış talebin sahibini bul
                otherUserId = adoptionRequestRepository.findByListingIdOrderByCreatedAtDesc(conversationId)
                        .stream()
                        .filter(req -> "Onaylandı".equals(req.getStatus()))
                        .map(AdoptionRequestEntity::getUserId)
                        .findFirst()
                        .orElse(null);
            } else {
                // Talep sahibi ise, ilan sahibini bul
                otherUserId = listing.getUserId();
            }
        }

        // 5. Okunmamış mesaj sayısını getir
        Long unreadCount = messageRepository.countUnreadMessages(conversationId, userId);

        // 6. Son mesajı bul
        MessageEntity lastMessage = messages.isEmpty() ? null : messages.get(messages.size() - 1);

        return ConversationResponse.builder()
                .conversationId(conversationId)
                .listingId(conversationId)
                .otherUserId(otherUserId)
                .otherUserName(null) // Frontend'de doldurulacak
                .listingTitle(null) // Frontend'de doldurulacak
                .lastMessage(lastMessage != null ? lastMessage.getContent() : null)
                .lastMessageTime(lastMessage != null ? lastMessage.getCreatedAt() : null)
                .unreadCount(unreadCount)
                .messages(messages.stream().map(this::mapToResponse).collect(Collectors.toList()))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> getConversations(Long userId) {
        log.info("Kullanıcının conversation'ları getiriliyor - userId: {}", userId);

        // 1. Kullanıcının conversation ID'lerini getir (mesaj gönderdiği/alığı)
        List<Long> conversationIds = messageRepository.findConversationIdsByUserId(userId);

        // 2. Onaylanmış adoption request'lerden conversation ID'lerini getir
        // Kullanıcının gönderdiği onaylanmış talepler
        List<AdoptionRequestEntity> myApprovedRequests = adoptionRequestRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(req -> "Onaylandı".equals(req.getStatus()))
                .collect(Collectors.toList());
        
        // Kullanıcının ilanlarına gelen onaylanmış talepler
        List<AdoptionRequestEntity> myListingsApprovedRequests = adoptionRequestRepository.findAll()
                .stream()
                .filter(req -> "Onaylandı".equals(req.getStatus()))
                .filter(req -> {
                    try {
                        ListingServiceClient.ListingDto listing = listingServiceClient.getListingById(req.getListingId());
                        return listing.getUserId().equals(userId);
                    } catch (Exception e) {
                        return false;
                    }
                })
                .collect(Collectors.toList());

        // 3. Tüm conversation ID'lerini birleştir (mesajlar + onaylanmış talepler)
        Set<Long> allConversationIds = new HashSet<>(conversationIds);
        myApprovedRequests.forEach(req -> allConversationIds.add(req.getListingId()));
        myListingsApprovedRequests.forEach(req -> allConversationIds.add(req.getListingId()));

        // 4. Her conversation için detayları getir
        return allConversationIds.stream()
                .map(conversationId -> {
                    try {
                        return getConversation(conversationId, userId);
                    } catch (Exception e) {
                        log.warn("Conversation getirilemedi: {}", conversationId, e);
                        return null;
                    }
                })
                .filter(conv -> conv != null)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long conversationId, Long userId) {
        log.info("Mesajlar okundu olarak işaretleniyor - conversationId: {}, userId: {}", conversationId, userId);
        messageRepository.markAsRead(conversationId, userId);
    }

    private MessageResponse mapToResponse(MessageEntity entity) {
        return MessageResponse.builder()
                .messageId(entity.getMessageId())
                .conversationId(entity.getConversationId())
                .senderId(entity.getSenderId())
                .receiverId(entity.getReceiverId())
                .content(entity.getContent())
                .isRead(entity.getIsRead())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

