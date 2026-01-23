package org.pucodehackathon.backend.vendor.service;

import org.pucodehackathon.backend.vendor.dto.VendorAvailabilityRequestDto;

import java.util.UUID;

public interface VendorAvailabilityService {
    void saveAvailability(UUID vendorId, VendorAvailabilityRequestDto dto);
}
