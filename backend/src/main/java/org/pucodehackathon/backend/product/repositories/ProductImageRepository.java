package org.pucodehackathon.backend.product.repositories;

import org.pucodehackathon.backend.product.model.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductImageRepository extends JpaRepository<ProductImage, UUID> {

    List<ProductImage> findByProduct_ProductId(UUID productId);

    Optional<ProductImage> findByProduct_ProductIdAndIsPrimaryTrue(UUID productId);

    void deleteByProduct_ProductId(UUID productId);
}