package org.pucodehackathon.backend.vendor.controller;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.vendor.dto.NearbyVendorCategoryResponse;
import org.pucodehackathon.backend.vendor.dto.NearbyVendorResponse;
import org.pucodehackathon.backend.vendor.service.VendorSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class VendorSearchController {

    private final VendorSearchService vendorSearchService;

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyVendorResponse>> getNearbyVendors(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radiusKm
    ) {
        return ResponseEntity.ok(
                vendorSearchService.findNearby(lat, lng, radiusKm)
        );
    }


    @GetMapping("/nearby/category")
    public ResponseEntity<List<NearbyVendorCategoryResponse>> getNearbyByCategory(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radiusKm,
            @RequestParam String category
    ) {
        return ResponseEntity.ok(
                vendorSearchService.findNearbyByCategory(
                        lat, lng, radiusKm, category
                )
        );
    }
}
