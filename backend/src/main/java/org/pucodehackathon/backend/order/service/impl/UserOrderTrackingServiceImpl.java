package org.pucodehackathon.backend.order.service.impl;


import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.order.dto.order.OrderTimelineEventDto;
import org.pucodehackathon.backend.order.dto.order.OrderTrackingResponseDto;
import org.pucodehackathon.backend.order.dto.order.UserOrderSummaryDto;
import org.pucodehackathon.backend.order.model.Order;
import org.pucodehackathon.backend.order.model.OrderStatus;
import org.pucodehackathon.backend.order.repository.OrderRepository;
import org.pucodehackathon.backend.order.service.UserOrderTrackingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserOrderTrackingServiceImpl implements UserOrderTrackingService {

    private final OrderRepository orderRepository;

    @Override
    public Page<UserOrderSummaryDto> listUserOrders(
            UUID userId,
            OrderStatus status,
            Pageable pageable
    ) {

        Page<Order> page;

        if (status != null) {
            List<Order> orders = (List<Order>) orderRepository.findByUser_IdAndStatus(userId, status ,pageable);
            page = new org.springframework.data.domain.PageImpl<>(orders, pageable, orders.size());
        } else {
            List<Order> orders = orderRepository.findByUser_Id(userId);
            page = new org.springframework.data.domain.PageImpl<>(orders, pageable, orders.size());
        }

        return page.map(o -> UserOrderSummaryDto.builder()
                .orderId(o.getOrderId())
                .vendorName(o.getVendor().getBusinessName())
                .status(o.getStatus())
                .totalAmount(o.getTotalAmount())
                .createdAt(o.getCreatedAt())
                .build());
    }

    @Override
    public OrderTrackingResponseDto trackOrder(UUID userId, UUID orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Unauthorized order access");
        }

        User user = order.getUser();

        return OrderTrackingResponseDto.builder()
                .orderId(order.getOrderId())
                .currentStatus(order.getStatus())
                .vendorName(order.getVendor().getBusinessName())
                .vendorPhone(user.getPhoneNumber()) // ✅ FIXED
                .deliveryAddress(order.getDeliveryAddress())              // ✅ FIXED
                .timeline(buildTimeline(order))
                .build();
    }

    private List<OrderTimelineEventDto> buildTimeline(Order order) {

        List<OrderTimelineEventDto> timeline = new ArrayList<>();

        timeline.add(event(
                OrderStatus.PLACED,
                order.getCreatedAt(),
                "Order placed"
        ));

        if (order.getAcceptedAt() != null) {
            timeline.add(event(
                    OrderStatus.ACCEPTED,
                    order.getAcceptedAt(),
                    "Vendor accepted order"
            ));
        }

        if (order.getOutForDeliveryAt() != null) {
            timeline.add(event(
                    OrderStatus.OUT_FOR_DELIVERY,
                    order.getOutForDeliveryAt(),
                    "Out for delivery"
            ));
        }

        if (order.getDeliveredAt() != null) {
            timeline.add(event(
                    OrderStatus.DELIVERED,
                    order.getDeliveredAt(),
                    "Order delivered"
            ));
        }

        if (order.getCompletedAt() != null) {
            timeline.add(event(
                    OrderStatus.COMPLETED,
                    order.getCompletedAt(),
                    "Order completed"
            ));
        }

        if (order.getStatus() == OrderStatus.REJECTED && order.getRejectedAt() != null) {
            timeline.add(event(
                    OrderStatus.REJECTED,
                    order.getRejectedAt(),
                    "Order rejected"
            ));
        }

        return timeline;
    }

    private OrderTimelineEventDto event(
            OrderStatus status,
            LocalDateTime time,
            String desc
    ) {
        return OrderTimelineEventDto.builder()
                .status(status)
                .timestamp(time)
                .description(desc)
                .build();
    }
}

