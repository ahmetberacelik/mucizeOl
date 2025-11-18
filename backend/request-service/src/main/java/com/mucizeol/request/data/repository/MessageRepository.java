package com.mucizeol.request.data.repository;

import com.mucizeol.request.data.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    
    // Bir conversation'daki tüm mesajları getir (listing ID'sine göre)
    List<MessageEntity> findByConversationIdOrderByCreatedAtAsc(Long conversationId);
    
    // Kullanıcının tüm conversation'larını getir (kullanıcının gönderdiği veya aldığı mesajlar)
    @Query("SELECT DISTINCT m.conversationId FROM MessageEntity m WHERE m.senderId = :userId OR m.receiverId = :userId")
    List<Long> findConversationIdsByUserId(@Param("userId") Long userId);
    
    // Bir conversation'daki okunmamış mesaj sayısını getir
    @Query("SELECT COUNT(m) FROM MessageEntity m WHERE m.conversationId = :conversationId AND m.receiverId = :userId AND m.isRead = false")
    Long countUnreadMessages(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
    
    // Kullanıcının okunmamış mesaj sayısını getir
    @Query("SELECT COUNT(m) FROM MessageEntity m WHERE m.receiverId = :userId AND m.isRead = false")
    Long countTotalUnreadMessages(@Param("userId") Long userId);
    
    // Mesajları okundu olarak işaretle
    @Modifying
    @Transactional
    @Query("UPDATE MessageEntity m SET m.isRead = true WHERE m.conversationId = :conversationId AND m.receiverId = :userId AND m.isRead = false")
    void markAsRead(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}

