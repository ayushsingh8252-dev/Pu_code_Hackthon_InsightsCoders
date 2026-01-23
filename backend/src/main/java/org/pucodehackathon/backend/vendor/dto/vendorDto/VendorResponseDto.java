package org.pucodehackathon.backend.vendor.dto.vendorDto;


import lombok.Builder;
import lombok.Data;
import org.pucodehackathon.backend.vendor.model.VendorType;
import org.pucodehackathon.backend.vendor.model.VerificationStatus;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class VendorResponseDto {

    private UUID vendorId;
    private UUID userId;
    private String businessName;
    private VendorType vendorType;
    private VerificationStatus verificationStatus;
    private Boolean isActive;
    private BigDecimal ratingAvg;
    private Integer totalReviews;
}