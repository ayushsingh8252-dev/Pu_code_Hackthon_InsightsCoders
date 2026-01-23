package org.pucodehackathon.backend.vendor.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.auth.repositories.UserRepository;
import org.pucodehackathon.backend.exception.vendor_exceptions.VendorNotFoundException;
import org.pucodehackathon.backend.vendor.dto.VendorRegistrationRequestDto;
import org.pucodehackathon.backend.vendor.dto.VendorRegistrationResponseDto;
import org.pucodehackathon.backend.vendor.dto.vendorDto.VendorResponseDto;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.model.VendorLocation;
import org.pucodehackathon.backend.vendor.model.VerificationStatus;
import org.pucodehackathon.backend.vendor.repositories.VendorLocationRepository;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.pucodehackathon.backend.vendor.service.VendorService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final VendorLocationRepository vendorLocationRepository;

    @Override
    @Transactional
    public VendorRegistrationResponseDto registerAsVendor(UUID userId, VendorRegistrationRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));


        if (vendorRepository.existsByUserId(userId)) {
            throw new IllegalStateException("User already registered as vendor");
        }


        Vendor vendor = Vendor.builder()
                .userId(userId)
                .businessName(request.getBusinessName())
                .vendorType(request.getVendorType())
                .verificationStatus(VerificationStatus.PENDING)
                .isActive(false)
                .build();
        vendor = vendorRepository.save(vendor);

        VendorLocation vendorLocation = VendorLocation.builder()
                .vendor(vendor)
                .addressLine(request.getLocation().getAddressLine())
                .area(request.getLocation().getArea())
                .city(request.getLocation().getCity())
                .state(request.getLocation().getState())
                .country(request.getLocation().getCountry())
                .pincode(request.getLocation().getPincode())
                .longitude(request.getLocation().getLongitude())
                .latitude(request.getLocation().getLatitude())
                .isPrimary(true)
                .build();


        vendorLocationRepository.save(vendorLocation);

        // 5. Notify Admin
        // adminNotificationService.notifyVendorRequest(vendor);

        return VendorRegistrationResponseDto.builder()
                .businessName(vendor.getBusinessName())
                .vendorId(vendor.getVendorId())
                .verificationStatus(vendor.getVerificationStatus())
                .message("Vendor request submitted. Awaiting admin approval.")
                .build();
    }

    @Override
    public UUID getVendorIdByUser(User user) {

        Vendor vendor = vendorRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "User is not registered as a vendor or not approved yet"
                        )
                );

        return vendor.getVendorId();
    }

    @Override
    public VendorResponseDto getMyVendorProfile(UUID userId) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new AccessDeniedException("Vendor profile not found for user"));

        return mapToDto(vendor);
    }

    @Override
    public VendorResponseDto getVendorById(UUID vendorId) {
        Vendor vendor = vendorRepository.findByVendorId(vendorId)
                .orElseThrow(() -> new VendorNotFoundException("Vendor not found"));

        return mapToDto(vendor);
    }

    private VendorResponseDto mapToDto(Vendor vendor) {
        return VendorResponseDto.builder()
                .vendorId(vendor.getVendorId())
                .businessName(vendor.getBusinessName())
                .vendorType(vendor.getVendorType())
                .verificationStatus(vendor.getVerificationStatus())
                .isActive(vendor.getIsActive())
                .ratingAvg(vendor.getRatingAvg())
                .totalReviews(vendor.getTotalReviews())
                .build();
    }


}
