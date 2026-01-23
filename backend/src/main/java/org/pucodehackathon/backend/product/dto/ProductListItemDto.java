package org.pucodehackathon.backend.product.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ProductListItemDto {
    private UUID productId;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private Boolean isAvailable;
    private UUID categoryId;
}
