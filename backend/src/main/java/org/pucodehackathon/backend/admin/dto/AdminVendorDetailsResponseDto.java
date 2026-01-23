package org.pucodehackathon.backend.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AdminVendorDetailsResponseDto {

    private UUID vendorId;
    private String businessName;
    private String vendorType;

    private String verificationStatus;
    private Boolean isActive;

    private BigDecimal ratingAvg;
    private Integer totalReviews;

    private Boolean isOpen;       // availability
    private Boolean isLive;       // location live or not

    private List<AdminVendorLocationDto> locations;
    private List<AdminVendorCategoryDto> categories;
}