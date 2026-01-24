package org.pucodehackathon.backend.order.service;

import org.pucodehackathon.backend.order.dto.order.OrderDetailsResponseDto;

import java.util.UUID;

public interface UserOrderService {
    OrderDetailsResponseDto getOrderDetails(UUID userId, UUID orderId);
}