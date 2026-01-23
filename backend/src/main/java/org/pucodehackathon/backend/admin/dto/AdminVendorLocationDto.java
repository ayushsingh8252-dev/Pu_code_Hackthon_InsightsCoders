package org.pucodehackathon.backend.admin.dto;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminVendorLocationDto {

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

    private LocalDateTime lastUpdatedAt;
}