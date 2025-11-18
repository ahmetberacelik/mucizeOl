package com.mucizeol.request.data.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "adoption_requests",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_request_user_listing",
        columnNames = {"user_id", "listing_id"}
    )
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdoptionRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "listing_id", nullable = false)
    private Long listingId;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "request_message", nullable = false, columnDefinition = "TEXT")
    private String requestMessage;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = "Beklemede";
        }
    }
}

