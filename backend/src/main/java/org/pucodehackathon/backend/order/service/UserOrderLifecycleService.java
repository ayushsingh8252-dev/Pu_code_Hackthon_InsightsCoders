package org.pucodehackathon.backend.order.service;

import org.pucodehackathon.backend.order.dto.order.OrderStatusUpdateResponseDto;

import java.util.UUID;

public interface UserOrderLifecycleService {
    OrderStatusUpdateResponseDto completeOrder(UUID userId, UUID orderId);
}
