package org.pucodehackathon.backend.product.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CategoryResponseDto {
    private UUID categoryId;
    private String name;
    private Boolean isActive;
}