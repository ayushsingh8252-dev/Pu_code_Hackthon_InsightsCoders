package org.pucodehackathon.backend.vendor.repositories;

import org.pucodehackathon.backend.vendor.model.VendorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.Optional;
import java.util.UUID;

public interface VendorAvailabilityRepository extends JpaRepository<VendorAvailability, UUID> {

    Optional<VendorAvailability> findByVendor_VendorIdAndDayOfWeek(UUID vendorId, DayOfWeek day);
}