package org.pucodehackathon.backend.vendor.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VendorRejectionRequestDto {

    @NotBlank
    private String reason;
}