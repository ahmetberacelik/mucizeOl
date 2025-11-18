package com.mucizeol.listing.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateListingRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @NotNull
    private Long animalTypeId;

    @NotNull
    private Long animalBreedId;

    @NotNull
    private Long cityId;

    @NotNull
    @Min(0)
    private Integer age;

    @NotBlank
    @Size(max = 10)
    private String gender; // "Dişi" veya "Erkek"
}

