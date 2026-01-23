package org.pucodehackathon.backend.order.service;

import org.pucodehackathon.backend.order.dto.order.OrderResponseDto;
import org.pucodehackathon.backend.order.dto.order.PlaceOrderRequestDto;

import java.util.List;
import java.util.UUID;

public interface OrderService {
    OrderResponseDto placeOrder(UUID userId, PlaceOrderRequestDto request);
    List<OrderResponseDto> getUserOrders(UUID userId);
}
