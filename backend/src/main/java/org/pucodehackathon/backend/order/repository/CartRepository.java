package org.pucodehackathon.backend.order.repository;

import org.pucodehackathon.backend.order.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    Optional<Cart> findByUser_Id(UUID userId);
    void deleteByUser_Id(UUID userId);
}