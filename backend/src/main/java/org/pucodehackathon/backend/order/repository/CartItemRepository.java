package org.pucodehackathon.backend.order.repository;

import org.pucodehackathon.backend.order.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    Optional<CartItem> findByCart_CartIdAndProduct_ProductId(UUID cartId, UUID productId);
}