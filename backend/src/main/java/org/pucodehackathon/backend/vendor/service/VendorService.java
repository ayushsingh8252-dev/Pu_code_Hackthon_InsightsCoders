package org.pucodehackathon.backend.vendor.service;

import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.vendor.dto.VendorRegistrationRequestDto;
import org.pucodehackathon.backend.vendor.dto.VendorRegistrationResponseDto;
import org.pucodehackathon.backend.vendor.dto.vendorDto.VendorResponseDto;

import java.util.UUID;

public interface VendorService {
    VendorRegistrationResponseDto registerAsVendor(UUID userId, VendorRegistrationRequestDto request);
    UUID getVendorIdByUser(User user);
    VendorResponseDto getMyVendorProfile(UUID userId);
    VendorResponseDto getVendorById(UUID vendorId);
}