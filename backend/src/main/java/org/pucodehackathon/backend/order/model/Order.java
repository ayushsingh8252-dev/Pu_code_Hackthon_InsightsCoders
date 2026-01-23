package org.pucodehackathon.backend.order.model;

import jakarta.persistence.*;
import lombok.*;
import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.vendor.model.Vendor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private Vendor vendor;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private BigDecimal totalAmount;

    // Delivery details
    private String societyName;
    private String houseNumber;
    private String phoneNumber;


    private LocalDateTime acceptedAt;
    private LocalDateTime outForDeliveryAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime completedAt;
    private LocalDateTime rejectedAt;
    private LocalDateTime updatedAt;


    @Column(nullable = false)
    private String deliveryAddress;

    @Column(nullable = false)
    private String deliveryPhone;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.PLACED;
        this.paymentMethod = PaymentMethod.CASH_ON_DELIVERY;
    }
}

