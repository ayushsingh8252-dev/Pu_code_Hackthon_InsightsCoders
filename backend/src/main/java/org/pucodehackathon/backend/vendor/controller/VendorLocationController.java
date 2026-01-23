package org.pucodehackathon.backend.vendor.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.vendor.dto.UpdateVendorLocationRequestDto;
import org.pucodehackathon.backend.vendor.service.VendorLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vendor/location")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VENDOR')")
public class VendorLocationController {

    private final VendorLocationService vendorLocationService;

    @PutMapping("/live")
    public ResponseEntity<Void> updateLiveLocation(
            Authentication authentication,
            @RequestBody @Valid UpdateVendorLocationRequestDto request
    ) {
        UserPrincipal principal =
                (UserPrincipal) authentication.getPrincipal();

        vendorLocationService.updateLiveLocation(
                principal.getUser().getId(),
                request
        );

        return ResponseEntity.noContent().build();
    }
}