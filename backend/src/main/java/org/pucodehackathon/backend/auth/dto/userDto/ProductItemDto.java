package org.pucodehackathon.backend.auth.dto.userDto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
public class ProductItemDto {
    private UUID productId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Boolean isAvailable;
}
