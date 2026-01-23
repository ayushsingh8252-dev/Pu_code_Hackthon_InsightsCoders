package org.pucodehackathon.backend.order.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.order.dto.order.OrderStatusUpdateResponseDto;
import org.pucodehackathon.backend.order.model.Order;
import org.pucodehackathon.backend.order.model.OrderStatus;
import org.pucodehackathon.backend.order.repository.OrderRepository;
import org.pucodehackathon.backend.order.service.UserOrderLifecycleService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserOrderLifecycleServiceImpl implements UserOrderLifecycleService {

    private final OrderRepository orderRepository;

    @Override
    public OrderStatusUpdateResponseDto completeOrder(UUID userId, UUID orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Unauthorized");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalStateException("Order cannot be completed");
        }

        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);

        return OrderStatusUpdateResponseDto.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus())
                .message("Order completed successfully")
                .build();
    }
}
