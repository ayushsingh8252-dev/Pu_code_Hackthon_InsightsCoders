package org.pucodehackathon.backend.order.dto.order;

import lombok.Builder;
import lombok.Getter;
import org.pucodehackathon.backend.order.model.OrderStatus;

import java.util.UUID;

@Builder
@Getter
public class VendorOrderActionResponseDto {
    private UUID orderId;
    private OrderStatus status;
    private String message;
}
