package org.pucodehackathon.backend.product.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateProductRequestDto {

    @NotBlank
    private String name;

    private String description;

    @NotNull
    private BigDecimal price;

    private Integer stock;

    @NotNull
    private Boolean isAvailable;
}