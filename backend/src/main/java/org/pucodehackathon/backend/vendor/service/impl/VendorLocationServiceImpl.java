package org.pucodehackathon.backend.vendor.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.vendor.dto.UpdateVendorLocationRequestDto;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.model.VendorLocation;
import org.pucodehackathon.backend.vendor.model.VendorType;
import org.pucodehackathon.backend.vendor.model.VerificationStatus;
import org.pucodehackathon.backend.vendor.repositories.VendorLocationRepository;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.pucodehackathon.backend.vendor.service.VendorLocationService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendorLocationServiceImpl implements VendorLocationService {


    private final VendorRepository vendorRepository;
    private final VendorLocationRepository locationRepository;

    @Override
    public void updateLiveLocation(UUID userId, UpdateVendorLocationRequestDto request) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new AccessDeniedException("Vendor not found"));

        if (vendor.getVerificationStatus() != VerificationStatus.APPROVED
                || !vendor.getIsActive()) {
            throw new AccessDeniedException("Vendor not approved");
        }

        if (vendor.getVendorType() != VendorType.MOBILE) {
            throw new IllegalStateException("Only MOBILE vendors can update live location");
        }

        VendorLocation location = locationRepository
                .findByVendor_VendorIdAndIsLiveTrue(vendor.getVendorId())
                .orElse(
                        VendorLocation.builder()
                                .vendor(vendor)
                                .isLive(true)
                                .isPrimary(false)
                                .build()
                );

        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setAccuracy(request.getAccuracy());

        locationRepository.save(location);
    }
}
