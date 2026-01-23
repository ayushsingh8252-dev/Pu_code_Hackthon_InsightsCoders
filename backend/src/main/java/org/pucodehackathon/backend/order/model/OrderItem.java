package org.pucodehackathon.backend.order.model;

import jakarta.persistence.*;
import lombok.*;
import org.pucodehackathon.backend.product.model.Product;

import java.math.BigDecimal;
import java.util.UUID;


@Entity
@Table(name = "order_item")
@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID orderItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    private Integer quantity;
    private BigDecimal price;
}
