package org.pucodehackathon.backend.vendor.dto;


import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
public class VendorStatusResponseDto {
    private Boolean isOpen;
    private LocalTime openTime;
    private LocalTime closeTime;
    private String reason;
}