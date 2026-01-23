package org.pucodehackathon.backend.vendor.controller;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.vendor.dto.VendorAvailabilityRequestDto;
import org.pucodehackathon.backend.vendor.service.VendorAvailabilityService;
import org.pucodehackathon.backend.vendor.service.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vendor/availability")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VENDOR')")
public class VendorAvailabilityController {

    private final VendorAvailabilityService availabilityService;
    private final VendorService vendorService;

    @PostMapping
    public ResponseEntity<Void> saveAvailability(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody VendorAvailabilityRequestDto dto
    ) {
        UUID vendorId = vendorService.getVendorIdByUser(principal.getUser());
        availabilityService.saveAvailability(vendorId, dto);
        return ResponseEntity.ok().build();
    }
}