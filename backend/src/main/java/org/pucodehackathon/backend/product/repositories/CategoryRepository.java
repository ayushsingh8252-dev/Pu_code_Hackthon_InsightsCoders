package org.pucodehackathon.backend.product.repositories;

import org.pucodehackathon.backend.product.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<List<Category>> findByVendor_VendorId(UUID vendorId);
    Optional<Category> findByCategoryId(UUID categoryId);
    Page<Category> findByVendor_VendorId(UUID vendorId, Pageable pageable);
    Page<Category> findByVendor_VendorIdAndIsActive(UUID vendorId, Boolean isActive, Pageable pageable);
    List<Category> findByVendor_VendorIdAndIsActiveTrue(UUID vendorId);
}