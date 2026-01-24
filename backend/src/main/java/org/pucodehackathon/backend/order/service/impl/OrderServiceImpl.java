package org.pucodehackathon.backend.order.service.impl;


import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.auth.repositories.UserRepository;
import org.pucodehackathon.backend.order.dto.cart.AddToCartRequestDto;
import org.pucodehackathon.backend.order.dto.cart.CartItemDto;
import org.pucodehackathon.backend.order.dto.cart.CartResponseDto;
import org.pucodehackathon.backend.order.dto.order.OrderItemDto;
import org.pucodehackathon.backend.order.dto.order.OrderResponseDto;
import org.pucodehackathon.backend.order.dto.order.PlaceOrderRequestDto;
import org.pucodehackathon.backend.order.model.Cart;
import org.pucodehackathon.backend.order.model.CartItem;
import org.pucodehackathon.backend.order.model.Order;
import org.pucodehackathon.backend.order.model.OrderItem;
import org.pucodehackathon.backend.order.repository.CartItemRepository;
import org.pucodehackathon.backend.order.repository.CartRepository;
import org.pucodehackathon.backend.order.repository.OrderRepository;
import org.pucodehackathon.backend.order.service.CartService;
import org.pucodehackathon.backend.order.service.OrderService;
import org.pucodehackathon.backend.product.model.Product;
import org.pucodehackathon.backend.product.repositories.ProductRepository;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public OrderResponseDto placeOrder(UUID userId, PlaceOrderRequestDto request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        Vendor vendor = cart.getVendor();

        // Re-validate stock
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (!product.getIsAvailable() || product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Product out of stock: " + product.getName());
            }
        }

        Order order = new Order();
        order.setUser(user);
        order.setVendor(vendor);

        // Address logic: use request if provided, otherwise default address
        String societyName = request.getSocietyName();
        String houseNumber = request.getHouseNumber();
        String phoneNumber = request.getPhoneNumber();

        if (societyName == null || houseNumber == null || phoneNumber == null) {
            user.getAddresses().stream()
                    .filter(org.pucodehackathon.backend.auth.model.UserAddress::getIsDefault)
                    .findFirst()
                    .ifPresent(addr -> {
                        order.setSocietyName(request.getSocietyName() != null ? request.getSocietyName() : addr.getSociety());
                        order.setHouseNumber(request.getHouseNumber() != null ? request.getHouseNumber() : addr.getHouseNo());
                        order.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : user.getPhoneNumber());
                        order.setDeliveryLatitude(addr.getLatitude());
                        order.setDeliveryLongitude(addr.getLongitude());
                    });
        }

        // Fallback if still null
        if (order.getSocietyName() == null) order.setSocietyName(request.getSocietyName());
        if (order.getHouseNumber() == null) order.setHouseNumber(request.getHouseNumber());
        if (order.getPhoneNumber() == null) order.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : user.getPhoneNumber());

        // If coordinates still null, try to take from first address if available
        if (order.getDeliveryLatitude() == null && !user.getAddresses().isEmpty()) {
            org.pucodehackathon.backend.auth.model.UserAddress firstAddr = user.getAddresses().iterator().next();
            order.setDeliveryLatitude(firstAddr.getLatitude());
            order.setDeliveryLongitude(firstAddr.getLongitude());
        }

        // Set mandatory fields for Order entity
        String fullAddress = String.format("%s, %s", order.getHouseNumber(), order.getSocietyName());
        order.setDeliveryAddress(fullAddress);
        order.setDeliveryPhone(order.getPhoneNumber());

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(item.getPrice());

            order.getItems().add(orderItem);

            total = total.add(
                    item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
            );
        }

        order.setTotalAmount(total);

        orderRepository.save(order);

        // Clear cart
        cartRepository.delete(cart);

        return mapToResponse(order);
    }

    @Override
    public List<OrderResponseDto> getUserOrders(UUID userId) {
        return orderRepository.findByUser_Id(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private OrderResponseDto mapToResponse(Order order) {
        return OrderResponseDto.builder()
                .orderId(order.getOrderId())
                .vendorId(order.getVendor().getVendorId())
                .vendorName(order.getVendor().getBusinessName())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .societyName(order.getSocietyName())
                .houseNumber(order.getHouseNumber())
                .phoneNumber(order.getPhoneNumber())
                .deliveryLatitude(order.getDeliveryLatitude())
                .deliveryLongitude(order.getDeliveryLongitude())
                .items(
                        order.getItems().stream()
                                .map(i -> OrderItemDto.builder()
                                        .productId(i.getProduct().getProductId())
                                        .productName(i.getProduct().getName())
                                        .quantity(i.getQuantity())
                                        .price(i.getPrice())
                                        .total(i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                                        .build())
                                .toList()
                )
                .build();
    }
}
