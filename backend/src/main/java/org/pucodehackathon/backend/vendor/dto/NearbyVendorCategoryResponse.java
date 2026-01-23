package org.pucodehackathon.backend.vendor.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NearbyVendorCategoryResponse {
    private String vendorId;
    private String businessName;
    private String vendorType;
    private String categoryName;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
}
