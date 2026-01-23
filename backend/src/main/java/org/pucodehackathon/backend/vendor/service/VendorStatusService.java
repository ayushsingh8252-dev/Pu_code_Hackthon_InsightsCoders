package org.pucodehackathon.backend.vendor.service;

import org.pucodehackathon.backend.vendor.dto.VendorStatusRequestDto;
import org.pucodehackathon.backend.vendor.dto.VendorStatusResponseDto;

import java.util.UUID;

public interface VendorStatusService {
    void updateStatus(UUID vendorId, VendorStatusRequestDto dto);
    VendorStatusResponseDto getStatus(UUID vendorId);
}