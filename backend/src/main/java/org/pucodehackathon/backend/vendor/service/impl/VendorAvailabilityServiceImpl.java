package org.pucodehackathon.backend.vendor.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.vendor.dto.VendorAvailabilityRequestDto;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.model.VendorAvailability;
import org.pucodehackathon.backend.vendor.repositories.VendorAvailabilityRepository;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.pucodehackathon.backend.vendor.service.VendorAvailabilityService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendorAvailabilityServiceImpl implements VendorAvailabilityService {

    private final VendorAvailabilityRepository availabilityRepository;
    private final VendorRepository vendorRepository;

    @Override
    public void saveAvailability(UUID vendorId, VendorAvailabilityRequestDto dto) {

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        VendorAvailability availability =
                availabilityRepository.findByVendor_VendorIdAndDayOfWeek(
                        vendorId, dto.getDayOfWeek()
                ).orElse(new VendorAvailability());

        availability.setVendor(vendor);
        availability.setDayOfWeek(dto.getDayOfWeek());
        availability.setOpenTime(dto.getOpenTime());
        availability.setCloseTime(dto.getCloseTime());
        availability.setIsClosed(false);

        availabilityRepository.save(availability);
    }
}
