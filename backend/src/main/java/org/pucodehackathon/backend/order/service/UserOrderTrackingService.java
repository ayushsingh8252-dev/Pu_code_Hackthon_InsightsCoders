package org.pucodehackathon.backend.order.service;

import org.pucodehackathon.backend.order.dto.order.OrderTrackingResponseDto;
import org.pucodehackathon.backend.order.dto.order.UserOrderSummaryDto;
import org.pucodehackathon.backend.order.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserOrderTrackingService {

    Page<UserOrderSummaryDto> listUserOrders(
            UUID userId,
            OrderStatus status,
            Pageable pageable
    );

    OrderTrackingResponseDto trackOrder(UUID userId, UUID orderId);
}
