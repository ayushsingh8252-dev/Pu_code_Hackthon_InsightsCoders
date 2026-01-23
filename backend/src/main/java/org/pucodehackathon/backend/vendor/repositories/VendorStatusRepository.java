package org.pucodehackathon.backend.vendor.repositories;

import org.pucodehackathon.backend.vendor.model.VendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VendorStatusRepository extends JpaRepository<VendorStatus, UUID> {
}