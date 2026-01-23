package org.pucodehackathon.backend.order.dto.order;

import lombok.Builder;
import lombok.Getter;
import org.pucodehackathon.backend.order.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class UserOrderSummaryDto {
    private UUID orderId;
    private String vendorName;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
}

