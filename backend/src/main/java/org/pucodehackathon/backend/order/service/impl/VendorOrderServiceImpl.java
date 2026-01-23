package org.pucodehackathon.backend.order.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.exception.vendor_exceptions.VendorNotFoundException;
import org.pucodehackathon.backend.order.dto.order.OrderItemDto;
import org.pucodehackathon.backend.order.dto.order.OrderResponseDto;
import org.pucodehackathon.backend.order.dto.order.VendorOrderActionResponseDto;
import org.pucodehackathon.backend.order.model.Order;
import org.pucodehackathon.backend.order.model.OrderItem;
import org.pucodehackathon.backend.order.model.OrderStatus;
import org.pucodehackathon.backend.order.repository.OrderRepository;
import org.pucodehackathon.backend.order.service.VendorOrderService;
import org.pucodehackathon.backend.product.model.Product;
import org.pucodehackathon.backend.product.repositories.ProductRepository;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class VendorOrderServiceImpl implements VendorOrderService {

    private final VendorRepository vendorRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public VendorOrderActionResponseDto acceptOrder(UUID userId, UUID orderId) {

        Vendor vendor = getVendor(userId);
        Order order = getVendorOrder(vendor, orderId);

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new IllegalStateException("Order cannot be accepted");
        }

        // Deduct stock
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();

            if (product.getStock() < item.getQuantity()) {
                throw new IllegalStateException(
                        "Insufficient stock for product: " + product.getName()
                );
            }

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.ACCEPTED);
        orderRepository.save(order);

        return VendorOrderActionResponseDto.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus())
                .message("Order accepted successfully")
                .build();
    }

    @Override
    public VendorOrderActionResponseDto rejectOrder(UUID userId, UUID orderId, String reason) {

        Vendor vendor = getVendor(userId);
        Order order = getVendorOrder(vendor, orderId);

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new IllegalStateException("Order cannot be rejected");
        }

        order.setStatus(OrderStatus.REJECTED);
        orderRepository.save(order);

        return VendorOrderActionResponseDto.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus())
                .message("Order rejected: " + reason)
                .build();
    }

    @Override
    public List<OrderResponseDto> getVendorOrders(UUID userId) {

        Vendor vendor = getVendor(userId);

        return orderRepository.findByVendor_VendorId(vendor.getVendorId())
                .stream()
                .map(o -> mapToResponse((Order) o))
                .toList();
    }

    // 🔒 Helpers

    private Vendor getVendor(UUID userId) {
        return vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new VendorNotFoundException("Vendor not found"));
    }

    private Order getVendorOrder(Vendor vendor, UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Unauthorized order access");
        }

        return order;
    }

    private OrderResponseDto mapToResponse(Order order) {
        return OrderResponseDto.builder()
                .orderId(order.getOrderId())
                .vendorId(order.getVendor().getVendorId())
                .vendorName(order.getVendor().getBusinessName())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(
                        order.getItems().stream()
                                .map(i -> OrderItemDto.builder()
                                        .productId(i.getProduct().getProductId())
                                        .productName(i.getProduct().getName())
                                        .quantity(i.getQuantity())
                                        .price(i.getPrice())
                                        .build())
                                .toList()
                )
                .build();
    }
}
