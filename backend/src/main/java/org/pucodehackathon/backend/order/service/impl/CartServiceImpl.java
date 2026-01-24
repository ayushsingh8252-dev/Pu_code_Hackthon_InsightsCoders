package org.pucodehackathon.backend.order.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.auth.repositories.UserRepository;
import org.pucodehackathon.backend.order.dto.cart.AddToCartRequestDto;
import org.pucodehackathon.backend.order.dto.cart.CartItemDto;
import org.pucodehackathon.backend.order.dto.cart.CartResponseDto;
import org.pucodehackathon.backend.order.model.Cart;
import org.pucodehackathon.backend.order.model.CartItem;
import org.pucodehackathon.backend.order.repository.CartItemRepository;
import org.pucodehackathon.backend.order.repository.CartRepository;
import org.pucodehackathon.backend.order.service.CartService;
import org.pucodehackathon.backend.product.model.Product;
import org.pucodehackathon.backend.product.repositories.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override

    public CartResponseDto addToCart(UUID userId, AddToCartRequestDto request) {

        if (request == null || request.getProductId() == null) {
            throw new RuntimeException("Invalid request");
        }

        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!Boolean.TRUE.equals(product.getIsAvailable())) {
            throw new RuntimeException("Product is not available");
        }

        int stock = product.getStock() == null ? 0 : product.getStock();

        Cart cart = cartRepository.findByUser_Id(userId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    c.setUser(user);
                    c.setVendor(product.getVendor());
                    return cartRepository.save(c);
                });

        // ❌ Prevent multi-vendor cart
        if (!cart.getVendor().getVendorId().equals(product.getVendor().getVendorId())) {
            throw new RuntimeException("Cart already contains products from another vendor");
        }

        // 🔍 Find existing cart item
        CartItem item = cartItemRepository
                .findByCart_CartIdAndProduct_ProductId(
                        cart.getCartId(),
                        product.getProductId()
                )
                .orElse(null);

        int existingQty = (item == null) ? 0 : item.getQuantity();
        int newQty = existingQty + request.getQuantity();

        if (newQty > stock) {
            throw new RuntimeException(
                    "Not enough stock. Requested: " + newQty + ", Available: " + stock
            );
        }

        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            item.setPrice(product.getPrice()); // price snapshot
        } else {
            item.setQuantity(newQty);
        }

        cartItemRepository.save(item);

        return mapToResponse(cartRepository.findById(cart.getCartId()).get());
    }


    @Override
    public CartResponseDto getCart(UUID userId) {
        return cartRepository.findByUser_Id(userId)
                .map(this::mapToResponse)
                .orElseGet(() -> CartResponseDto.builder()
                        .items(List.of())
                        .totalAmount(BigDecimal.ZERO)
                        .build());
    }

    @Override
    public void removeItem(UUID userId, UUID cartItemId) {
        Cart cart = cartRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(i -> i.getCartItemId().equals(cartItemId));
        cartRepository.save(cart);
    }

    @Override
    public void clearCart(UUID userId) {
        cartRepository.deleteByUser_Id(userId);
    }

    private CartResponseDto mapToResponse(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream()
                .map(i -> CartItemDto.builder()
                        .cartItemId(i.getCartItemId())
                        .productId(i.getProduct().getProductId())
                        .productName(i.getProduct().getName())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .build())
                .toList();

        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponseDto.builder()
                .cartId(cart.getCartId())
                .vendorId(cart.getVendor().getVendorId())
                .vendorName(cart.getVendor().getBusinessName())
                .items(items)
                .totalAmount(total)
                .build();
    }
}
