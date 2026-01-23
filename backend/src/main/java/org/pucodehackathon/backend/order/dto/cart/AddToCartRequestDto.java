package org.pucodehackathon.backend.order.dto.cart;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class AddToCartRequestDto {
    private UUID productId;
    private Integer quantity;
}