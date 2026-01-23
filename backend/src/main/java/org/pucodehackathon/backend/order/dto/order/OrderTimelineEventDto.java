package org.pucodehackathon.backend.order.dto.order;

import lombok.Builder;
import lombok.Getter;
import org.pucodehackathon.backend.order.model.OrderStatus;

import java.time.LocalDateTime;

@Getter
@Builder
public class OrderTimelineEventDto {
    private OrderStatus status;
    private LocalDateTime timestamp;
    private String description;
}
