package org.pucodehackathon.backend.order.service;

import org.pucodehackathon.backend.order.dto.order.OrderResponseDto;
import org.pucodehackathon.backend.order.dto.order.VendorOrderActionResponseDto;

import java.util.List;
import java.util.UUID;

public interface VendorOrderService {

    VendorOrderActionResponseDto acceptOrder(UUID userId, UUID orderId);

    VendorOrderActionResponseDto rejectOrder(UUID userId, UUID orderId, String reason);

    List<OrderResponseDto> getVendorOrders(UUID userId);
}