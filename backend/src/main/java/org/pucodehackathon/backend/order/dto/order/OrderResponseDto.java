package org.pucodehackathon.backend.order.dto.order;

import lombok.Builder;
import lombok.Getter;
import org.pucodehackathon.backend.order.model.OrderStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Builder
@Getter
public class OrderResponseDto {
    private UUID orderId;
    private UUID vendorId;
    private String vendorName;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private List<OrderItemDto> items;
}
