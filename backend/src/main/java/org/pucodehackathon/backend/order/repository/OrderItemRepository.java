package org.pucodehackathon.backend.order.repository;

import org.pucodehackathon.backend.order.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
}