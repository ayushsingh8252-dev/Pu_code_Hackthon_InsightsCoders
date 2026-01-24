package org.pucodehackathon.backend.order.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.order.dto.order.*;
import org.pucodehackathon.backend.order.model.Order;
import org.pucodehackathon.backend.order.model.OrderStatus;
import org.pucodehackathon.backend.order.repository.OrderRepository;
import org.pucodehackathon.backend.order.service.UserOrderLifecycleService;
import org.pucodehackathon.backend.order.service.UserOrderService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserOrderServiceImpl implements UserOrderService {

    private final OrderRepository orderRepository;
    private final org.pucodehackathon.backend.auth.repositories.UserRepository userRepository;

    @Override
    public OrderDetailsResponseDto getOrderDetails(UUID userId, UUID orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Unauthorized access to order");
        }

        // Fetch vendor's user to get phone number
        org.pucodehackathon.backend.auth.model.User vendorUser = userRepository.findById(order.getVendor().getUserId())
                .orElse(null);

        VendorSummaryDto vendor = VendorSummaryDto.builder()
                .vendorId(order.getVendor().getVendorId())
                .businessName(order.getVendor().getBusinessName())
                .phone(vendorUser != null ? vendorUser.getPhoneNumber() : null)
                .build();

        UserAddressDto address = UserAddressDto.builder()
                .addressLine(order.getDeliveryAddress())
                .phone(order.getDeliveryPhone())
                .build();

        List<OrderItemDto> items = order.getItems().stream()
                .map(i -> OrderItemDto.builder()
                        .productId(i.getProduct().getProductId())
                        .productName(i.getProduct().getName())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .total(i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                        .build())
                .toList();

        return OrderDetailsResponseDto.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus().name())
                .vendor(vendor)
                .deliveryAddress(address)
                .items(items)
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod().name())
                .createdAt(order.getCreatedAt())
                .acceptedAt(order.getAcceptedAt())
                .outForDeliveryAt(order.getOutForDeliveryAt())
                .deliveredAt(order.getDeliveredAt())
                .completedAt(order.getCompletedAt())
                .build();
    }
}
