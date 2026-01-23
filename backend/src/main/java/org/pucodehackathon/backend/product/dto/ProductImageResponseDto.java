package org.pucodehackathon.backend.product.dto;


import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class ProductImageResponseDto {
    private UUID imageId;
    private String imageUrl;
    private Boolean isPrimary;
}