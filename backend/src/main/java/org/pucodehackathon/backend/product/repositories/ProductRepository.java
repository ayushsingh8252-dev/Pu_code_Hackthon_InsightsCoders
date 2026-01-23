package org.pucodehackathon.backend.product.repositories;

import org.pucodehackathon.backend.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    Optional<List<Product>> findByVendor_VendorId(UUID vendorId);

    Optional<Product> findByProductId(UUID productId);

    Optional<List<Product>> findByCategory_CategoryId(UUID categoryCategoryId);

    Page<Product> findByVendor_VendorId(UUID vendorId, Pageable pageable);

    Page<Product> findByVendor_VendorIdAndIsAvailable(UUID vendorId, Boolean isAvailable, Pageable pageable);

    Page<Product> findByVendor_VendorIdAndCategory_CategoryId(UUID vendorId, UUID categoryId, Pageable pageable);

    Page<Product> findByVendor_VendorIdAndCategory_CategoryIdAndIsAvailable(UUID vendorId, UUID categoryId, Boolean isAvailable, Pageable pageable);
}