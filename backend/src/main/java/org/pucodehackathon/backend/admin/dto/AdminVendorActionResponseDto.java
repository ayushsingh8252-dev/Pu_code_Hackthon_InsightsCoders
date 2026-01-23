package org.pucodehackathon.backend.admin.dto;
import lombok.Builder;
import lombok.Data;
import org.pucodehackathon.backend.vendor.model.VerificationStatus;


import java.util.UUID;

@Data
@Builder
public class AdminVendorActionResponseDto {

    private UUID vendorId;
    private VerificationStatus verificationStatus;
    private String message;
}