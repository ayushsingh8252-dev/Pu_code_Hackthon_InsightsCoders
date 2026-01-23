package org.pucodehackathon.backend.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCategoryRequestDto {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private Boolean isActive;
}