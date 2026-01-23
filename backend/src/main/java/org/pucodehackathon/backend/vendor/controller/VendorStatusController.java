package org.pucodehackathon.backend.vendor.controller;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.vendor.dto.VendorStatusRequestDto;
import org.pucodehackathon.backend.vendor.dto.VendorStatusResponseDto;
import org.pucodehackathon.backend.vendor.service.VendorService;
import org.pucodehackathon.backend.vendor.service.VendorStatusService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
public class VendorStatusController {

    private final VendorStatusService statusService;
    private final VendorService vendorService;

    // Vendor toggles open/close
    @PutMapping("/status")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Void> updateStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody VendorStatusRequestDto dto
    ) {
        UUID vendorId = vendorService.getVendorIdByUser(principal.getUser());
        statusService.updateStatus(vendorId, dto);
        return ResponseEntity.ok().build();
    }

    // User checks vendor status
    @GetMapping("/{vendorId}/status")
    public ResponseEntity<VendorStatusResponseDto> getStatus(
            @PathVariable UUID vendorId
    ) {
        return ResponseEntity.ok(statusService.getStatus(vendorId));
    }
}
