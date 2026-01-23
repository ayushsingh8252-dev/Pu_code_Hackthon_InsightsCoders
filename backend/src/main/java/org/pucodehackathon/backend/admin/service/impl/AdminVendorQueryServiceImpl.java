package org.pucodehackathon.backend.admin.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.admin.dto.AdminVendorListPageResponseDto;
import org.pucodehackathon.backend.admin.dto.AdminVendorListResponseDto;
import org.pucodehackathon.backend.admin.service.AdminVendorQueryService;
import org.pucodehackathon.backend.admin.specification.VendorSpecifications;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminVendorQueryServiceImpl implements AdminVendorQueryService {

    private final VendorRepository vendorRepository;

    @Override
    public AdminVendorListPageResponseDto getAllVendors(
            String status,
            Boolean active,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Specification<Vendor> spec = Specification
                .where(VendorSpecifications.hasStatus(status))
                .and(VendorSpecifications.isActive(active));

        Page<Vendor> vendorPage = vendorRepository.findAll(spec, pageable);

        return AdminVendorListPageResponseDto.builder()
                .vendors(
                        vendorPage.getContent().stream()
                                .map(v -> AdminVendorListResponseDto.builder()
                                        .vendorId(v.getVendorId())
                                        .businessName(v.getBusinessName())
                                        .vendorType(v.getVendorType().name())
                                        .verificationStatus(v.getVerificationStatus().name())
                                        .isActive(v.getIsActive())
                                        .ratingAvg(v.getRatingAvg())
                                        .totalReviews(v.getTotalReviews())
                                        .createdAt(v.getCreatedAt())
                                        .build())
                                .collect(Collectors.toList())
                )
                .page(vendorPage.getNumber())
                .size(vendorPage.getSize())
                .totalElements(vendorPage.getTotalElements())
                .totalPages(vendorPage.getTotalPages())
                .build();
    }
}