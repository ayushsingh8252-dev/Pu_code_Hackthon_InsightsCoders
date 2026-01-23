package org.pucodehackathon.backend.order.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.exception.vendor_exceptions.VendorNotFoundException;
import org.pucodehackathon.backend.order.dto.order.OrderStatusUpdateResponseDto;
import org.pucodehackathon.backend.order.model.Order;
import org.pucodehackathon.backend.order.model.OrderStatus;
import org.pucodehackathon.backend.order.repository.OrderRepository;
import org.pucodehackathon.backend.order.service.VendorOrderLifecycleService;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class VendorOrderLifecycleServiceImpl implements VendorOrderLifecycleService {

    private final VendorRepository vendorRepository;
    private final OrderRepository orderRepository;

    @Override
    public OrderStatusUpdateResponseDto markOutForDelivery(UUID userId, UUID orderId) {

        Order order = getVendorOrder(userId, orderId);

        if (order.getStatus() != OrderStatus.ACCEPTED) {
            throw new IllegalStateException("Order cannot be dispatched");
        }

        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        orderRepository.save(order);

        return response(order, "Order is out for delivery");
    }

    @Override
    public OrderStatusUpdateResponseDto markDelivered(UUID userId, UUID orderId) {

        Order order = getVendorOrder(userId, orderId);

        if (order.getStatus() != OrderStatus.OUT_FOR_DELIVERY) {
            throw new IllegalStateException("Order cannot be marked delivered");
        }

        order.setStatus(OrderStatus.DELIVERED);
        orderRepository.save(order);

        return response(order, "Order delivered successfully");
    }

    private Order getVendorOrder(UUID userId, UUID orderId) {

        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new VendorNotFoundException("Vendor not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Unauthorized order access");
        }

        return order;
    }

    private OrderStatusUpdateResponseDto response(Order order, String msg) {
        return OrderStatusUpdateResponseDto.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus())
                .message(msg)
                .build();
    }
}
