package org.pucodehackathon.backend.order.dto.cart;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Builder
@Getter
public class CartResponseDto {
    private UUID cartId;
    private UUID vendorId;
    private String vendorName;
    private List<CartItemDto> items;
    private BigDecimal totalAmount;
}
