package org.pucodehackathon.backend.order.dto.cart;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
@Getter
public class CartItemDto {
    private UUID cartItemId;
    private UUID productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price;
}
