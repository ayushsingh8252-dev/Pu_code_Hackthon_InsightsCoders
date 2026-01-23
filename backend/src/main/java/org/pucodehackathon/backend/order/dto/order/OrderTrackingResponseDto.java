package org.pucodehackathon.backend.order.dto.order;
import lombok.Builder;
import lombok.Getter;
import org.pucodehackathon.backend.order.model.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class OrderTrackingResponseDto {
    private UUID orderId;
    private OrderStatus currentStatus;
    private String vendorName;
    private String vendorPhone;
    private String deliveryAddress;
    private List<OrderTimelineEventDto> timeline;
}