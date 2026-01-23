package org.pucodehackathon.backend.order.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.pucodehackathon.backend.product.model.Product;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "cart_item",
        uniqueConstraints = @UniqueConstraint(columnNames = {"cart_id", "product_id"}))
@Getter
@Setter
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID cartItemId;

    @ManyToOne
    private Cart cart;

    @ManyToOne
    private Product product;

    private Integer quantity;
    private BigDecimal price;
}
