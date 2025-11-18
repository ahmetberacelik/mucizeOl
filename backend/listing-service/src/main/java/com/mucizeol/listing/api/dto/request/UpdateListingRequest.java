package com.mucizeol.listing.api.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateListingRequest {

    @Size(max = 200)
    private String title;

    @Size(max = 2000)
    private String description;

    @Min(0)
    private Integer age;

    @Size(max = 10)
    private String gender;

    // Not: Tür, cins, şehir ve resim değiştirilemez!
}

