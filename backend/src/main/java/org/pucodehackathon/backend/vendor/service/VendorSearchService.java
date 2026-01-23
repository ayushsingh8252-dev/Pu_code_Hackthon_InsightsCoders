package org.pucodehackathon.backend.vendor.service;

import org.pucodehackathon.backend.vendor.dto.NearbyVendorCategoryResponse;
import org.pucodehackathon.backend.vendor.dto.NearbyVendorResponse;

import java.util.List;

public interface VendorSearchService {
    List<NearbyVendorResponse> findNearby(
            double lat,
            double lng,
            double radiusKm
    );

    List<NearbyVendorCategoryResponse> findNearbyByCategory(
            double lat,
            double lng,
            double radiusKm,
            String category
    );
}