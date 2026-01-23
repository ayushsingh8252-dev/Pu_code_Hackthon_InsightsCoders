package org.pucodehackathon.backend.admin.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.admin.dto.*;
import org.pucodehackathon.backend.admin.service.AdminVendorService;
import org.pucodehackathon.backend.auth.model.Role;
import org.pucodehackathon.backend.auth.model.RoleType;
import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.auth.repositories.RoleRepository;
import org.pucodehackathon.backend.auth.repositories.UserRepository;
import org.pucodehackathon.backend.exception.UserNotFoundException;
import org.pucodehackathon.backend.exception.vendor_exceptions.VendorAlreadyVerifiedException;
import org.pucodehackathon.backend.exception.vendor_exceptions.VendorNotFoundException;
import org.pucodehackathon.backend.product.repositories.CategoryRepository;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.model.VerificationStatus;
import org.pucodehackathon.backend.vendor.repositories.VendorLocationRepository;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminVendorServiceImpl implements AdminVendorService {

    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final VendorLocationRepository locationRepository;
    private final CategoryRepository categoryRepository;


    @Override
    @Transactional
    public AdminVendorActionResponseDto approveVendor(UUID vendorId) {
        Vendor vendor = vendorRepository.findByVendorId(vendorId).orElseThrow(
                ()-> new VendorNotFoundException("Vendor Is not Found by this id " + vendorId)
        );

        if (vendor.getVerificationStatus() == VerificationStatus.APPROVED){
            throw new VendorAlreadyVerifiedException("Vendor already approved");
        }

        //approve the vendor
        vendor.setVerificationStatus(VerificationStatus.APPROVED);
        vendor.setIsActive(true);
        vendorRepository.save(vendor);

        User user = userRepository.findById(vendor.getUserId()).orElseThrow(
                () -> new UserNotFoundException("User not found by this userid " +  vendor.getUserId())
        );

        Role userRole = roleRepository.findByRoleName(RoleType.ROLE_VENDOR)
                .orElseThrow(() -> new RuntimeException("ROLE VENDOR not found"));

        user.getRoles().add(userRole);


        return AdminVendorActionResponseDto.builder()
                .vendorId(vendor.getVendorId())
                .verificationStatus(vendor.getVerificationStatus())
                .message("Vendor approved and user promoted to VENDOR")
                .build();
    }

    @Override
    public AdminVendorActionResponseDto rejectVendor(UUID vendorId, String reason) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found"));

        if (vendor.getVerificationStatus() == VerificationStatus.APPROVED) {
            throw new IllegalStateException("Approved vendor cannot be rejected");
        }

        vendor.setVerificationStatus(VerificationStatus.REJECTED);
        vendor.setIsActive(false);
        vendorRepository.save(vendor);

        // Optional: store rejection reason in a separate table
        // vendorRejectionRepository.save(...)

        return AdminVendorActionResponseDto.builder()
                .vendorId(vendor.getVendorId())
                .verificationStatus(vendor.getVerificationStatus())
                .message("Vendor rejected. Reason: " + reason)
                .build();
    }

    @Override
    public AdminVendorDetailsResponseDto getVendorDetails(UUID vendorId) {

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new VendorNotFoundException("Vendor not found"));

        var locations = locationRepository.findByVendor_VendorId(vendorId)
                .stream()
                .map(loc -> AdminVendorLocationDto.builder()
                        .locationId(loc.getLocationId())
                        .addressLine(loc.getAddressLine())
                        .area(loc.getArea())
                        .city(loc.getCity())
                        .state(loc.getState())
                        .country(loc.getCountry())
                        .pincode(loc.getPincode())
                        .latitude(loc.getLatitude())
                        .longitude(loc.getLongitude())
                        .isPrimary(loc.getIsPrimary())
                        .isLive(loc.getIsLive())
                        .lastUpdatedAt(loc.getLastUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        var categories = categoryRepository.findByVendor_VendorId(vendorId)
                .stream()
                .map(cat -> AdminVendorCategoryDto.builder()
                        .categoryId(cat.getFirst().getCategoryId())
                        .name(cat.getFirst().getName())
                        .description(cat.getFirst().getDescription())
                        .isActive(cat.getFirst().getIsActive())
                        .build())
                .collect(Collectors.toList());

        boolean isLive = locations.stream().anyMatch(AdminVendorLocationDto::getIsLive);

        return AdminVendorDetailsResponseDto.builder()
                .vendorId(vendor.getVendorId())
                .businessName(vendor.getBusinessName())
                .vendorType(vendor.getVendorType().name())
                .verificationStatus(vendor.getVerificationStatus().name())
                .isActive(vendor.getIsActive())
                .ratingAvg(vendor.getRatingAvg())
                .totalReviews(vendor.getTotalReviews())
                .isOpen(vendor.getIsActive())       // assuming availability flag exists
                .isLive(isLive)
                .locations(locations)
                .categories(categories)
                .build();
    }


    @Override
    @Transactional
    public List<AdminVendorListResponseDto> getAllVendorForVerification() {
        List<Vendor> vendors = vendorRepository.findByVerificationStatus(VerificationStatus.PENDING);

        return vendors.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AdminVendorListResponseDto mapToDto(Vendor vendor) {
        return AdminVendorListResponseDto.builder()
                .vendorId(vendor.getVendorId())
                .businessName(vendor.getBusinessName())
                .vendorType(vendor.getVendorType() != null ? vendor.getVendorType().toString() : null)
                .verificationStatus(vendor.getVerificationStatus() != null ? vendor.getVerificationStatus().toString() : null)
                .isActive(vendor.getIsActive())
                .build();
    }

}
