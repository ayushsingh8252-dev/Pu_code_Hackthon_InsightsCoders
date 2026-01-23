package org.pucodehackathon.backend.order.repository;

import org.pucodehackathon.backend.order.model.Order;
import org.pucodehackathon.backend.order.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUser_Id(UUID userId);

    Collection<Object> findByVendor_VendorId(UUID vendorId);

    Page<Order> findByUser_IdAndStatus(UUID userId, OrderStatus status, Pageable pageable);
}