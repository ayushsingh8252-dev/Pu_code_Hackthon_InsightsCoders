package org.pucodehackathon.backend.admin.service;



import org.pucodehackathon.backend.admin.dto.AdminVendorStatusResponseDto;

import java.util.UUID;

public interface AdminVendorManagementService {

    AdminVendorStatusResponseDto activateVendor(UUID vendorId);

    AdminVendorStatusResponseDto deactivateVendor(UUID vendorId);

    AdminVendorStatusResponseDto suspendVendor(UUID vendorId, String reason);
}
