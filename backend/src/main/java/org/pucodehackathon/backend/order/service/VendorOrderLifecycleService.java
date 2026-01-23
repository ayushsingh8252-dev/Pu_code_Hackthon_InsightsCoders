package org.pucodehackathon.backend.order.service;

import org.pucodehackathon.backend.order.dto.order.OrderStatusUpdateResponseDto;

import java.util.UUID;

public interface VendorOrderLifecycleService {

    OrderStatusUpdateResponseDto markOutForDelivery(UUID userId, UUID orderId);

    OrderStatusUpdateResponseDto markDelivered(UUID userId, UUID orderId);
}

