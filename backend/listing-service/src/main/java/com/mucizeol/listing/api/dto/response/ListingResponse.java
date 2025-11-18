package com.mucizeol.listing.api.dto.response;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {

    private Long listingId;
    private Long userId;
    private String title;
    private String description;
    private String imageUrl;
    private Long animalTypeId;
    private Long animalBreedId;
    private Long cityId;
    private Integer age;
    private String gender;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}

