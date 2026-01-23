package org.pucodehackathon.backend.admin.service.impl;


import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.admin.dto.AdminVendorStatusResponseDto;
import org.pucodehackathon.backend.admin.service.AdminVendorManagementService;
import org.pucodehackathon.backend.exception.vendor_exceptions.VendorNotFoundException;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.model.VerificationStatus;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminVendorManagementServiceImpl implements AdminVendorManagementService {

    private final VendorRepository vendorRepository;

    @Override
    public AdminVendorStatusResponseDto activateVendor(UUID vendorId) {
        Vendor vendor = getVendor(vendorId);

        vendor.setIsActive(true);

        return buildResponse(vendor, "Vendor activated successfully");
    }

    @Override
    public AdminVendorStatusResponseDto deactivateVendor(UUID vendorId) {
        Vendor vendor = getVendor(vendorId);

        vendor.setIsActive(false);

        return buildResponse(vendor, "Vendor deactivated successfully");
    }

    @Override
    public AdminVendorStatusResponseDto suspendVendor(UUID vendorId, String reason) {
        Vendor vendor = getVendor(vendorId);

        vendor.setVerificationStatus(VerificationStatus.SUSPENDED);
        vendor.setIsActive(false);

        // Optional: persist suspension reason in audit/log table
        // auditService.logVendorSuspension(vendorId, reason);

        return buildResponse(vendor, "Vendor suspended: " + reason);
    }

    private Vendor getVendor(UUID vendorId) {
        return vendorRepository.findById(vendorId)
                .orElseThrow(() -> new VendorNotFoundException("Vendor not found"));
    }

    private AdminVendorStatusResponseDto buildResponse(Vendor vendor, String message) {
        return AdminVendorStatusResponseDto.builder()
                .vendorId(vendor.getVendorId())
                .businessName(vendor.getBusinessName())
                .status(vendor.getVerificationStatus().name())
                .isActive(vendor.getIsActive())
                .message(message)
                .build();
    }
}