package org.pucodehackathon.backend.order.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter
@Builder
public class OrderDetailsResponseDto {

    private UUID orderId;
    private String status;

    private VendorSummaryDto vendor;
    private UserAddressDto deliveryAddress;

    private List<OrderItemDto> items;

    private BigDecimal totalAmount;
    private String paymentMethod;

    private LocalDateTime createdAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime outForDeliveryAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime completedAt;
}
