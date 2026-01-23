package org.pucodehackathon.backend.order.service;

import org.pucodehackathon.backend.order.dto.cart.AddToCartRequestDto;
import org.pucodehackathon.backend.order.dto.cart.CartResponseDto;

import java.util.UUID;

public interface CartService {
    CartResponseDto addToCart(UUID userId, AddToCartRequestDto request);

    CartResponseDto getCart(UUID userId);

    void removeItem(UUID userId, UUID cartItemId);

    void clearCart(UUID userId);
}
