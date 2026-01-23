package org.pucodehackathon.backend.vendor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NearbyVendorResponse {
    private String vendorId;
    private String businessName;
    private String vendorType;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;

}
