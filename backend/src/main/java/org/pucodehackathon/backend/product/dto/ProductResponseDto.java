package org.pucodehackathon.backend.product.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ProductResponseDto {
    private UUID productId;
    private String name;
    private BigDecimal price;
    private Boolean isAvailable;
}
