package org.pucodehackathon.backend.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminVendorStatusResponseDto {

    private UUID vendorId;
    private String businessName;
    private String status;
    private Boolean isActive;
    private String message;
}