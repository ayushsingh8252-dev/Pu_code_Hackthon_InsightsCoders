package org.pucodehackathon.backend.admin.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.pucodehackathon.backend.admin.dto.AdminVendorStatusResponseDto;
import org.pucodehackathon.backend.admin.dto.AdminVendorSuspendRequestDto;
import org.pucodehackathon.backend.admin.service.AdminVendorManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/vendors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVendorManagementController {

    private final AdminVendorManagementService vendorManagementService;

    @PutMapping("/{vendorId}/activate")
    public ResponseEntity<AdminVendorStatusResponseDto> activateVendor(
            @PathVariable UUID vendorId
    ) {
        return ResponseEntity.ok(vendorManagementService.activateVendor(vendorId));
    }

    @PutMapping("/{vendorId}/deactivate")
    public ResponseEntity<AdminVendorStatusResponseDto> deactivateVendor(
            @PathVariable UUID vendorId
    ) {
        return ResponseEntity.ok(vendorManagementService.deactivateVendor(vendorId));
    }

    @PutMapping("/{vendorId}/suspend")
    public ResponseEntity<AdminVendorStatusResponseDto> suspendVendor(
            @PathVariable UUID vendorId,
            @Valid @RequestBody AdminVendorSuspendRequestDto request
    ) {
        return ResponseEntity.ok(
                vendorManagementService.suspendVendor(vendorId, request.getReason())
        );
    }
}