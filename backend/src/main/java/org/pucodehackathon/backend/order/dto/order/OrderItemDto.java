package org.pucodehackathon.backend.order.dto.order;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
@Getter
public class OrderItemDto {
    private UUID productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
}
