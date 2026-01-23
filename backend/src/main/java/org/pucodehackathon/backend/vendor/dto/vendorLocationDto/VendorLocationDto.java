package org.pucodehackathon.backend.vendor.dto.vendorLocationDto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class VendorLocationDto {

    private UUID locationId;
    private String addressLine;
    private String area;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private Boolean isPrimary;
    private Boolean isLive;
    private LocalDateTime createdAt;
}