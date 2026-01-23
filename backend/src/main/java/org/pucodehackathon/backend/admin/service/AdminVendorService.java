package org.pucodehackathon.backend.admin.service;



import org.pucodehackathon.backend.admin.dto.AdminVendorActionResponseDto;
import org.pucodehackathon.backend.admin.dto.AdminVendorDetailsResponseDto;
import org.pucodehackathon.backend.admin.dto.AdminVendorListResponseDto;

import java.util.List;
import java.util.UUID;

public interface AdminVendorService {
    AdminVendorActionResponseDto approveVendor(UUID vendorId);
    AdminVendorActionResponseDto rejectVendor(UUID vendorId, String reason);
    public List<AdminVendorListResponseDto> getAllVendorForVerification();
    AdminVendorDetailsResponseDto getVendorDetails(UUID vendorId);
}
