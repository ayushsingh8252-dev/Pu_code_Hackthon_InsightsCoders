package org.pucodehackathon.backend.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminVendorListResponseDto {
    private UUID vendorId;
    private String businessName;
    private String vendorType;

    private String verificationStatus;
    private Boolean isActive;

    private BigDecimal ratingAvg;
    private Integer totalReviews;

    private LocalDateTime createdAt;
}