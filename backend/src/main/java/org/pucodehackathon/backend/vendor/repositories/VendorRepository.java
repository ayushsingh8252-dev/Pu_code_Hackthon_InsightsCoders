package org.pucodehackathon.backend.vendor.repositories;

import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.model.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VendorRepository extends JpaRepository<Vendor, UUID> {
    Optional<Vendor> findByUserId(UUID userId);
    boolean existsByUserId(UUID userId);
    List<Vendor> findByVerificationStatus(VerificationStatus verificationStatus);
    Optional<Vendor> findByVendorId(UUID vendorId);
    Page<Vendor> findAll(Specification<Vendor> spec, Pageable pageable);
}