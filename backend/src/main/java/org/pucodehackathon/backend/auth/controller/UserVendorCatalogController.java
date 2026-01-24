package org.pucodehackathon.backend.auth.controller;


import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.dto.userDto.VendorCatalogResponseDto;
import org.pucodehackathon.backend.auth.service.UserVendorCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/vendors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserVendorCatalogController {

    private final UserVendorCatalogService catalogService;

    @GetMapping("/{vendorId}/catalog")
    public ResponseEntity<VendorCatalogResponseDto> getVendorCatalog(
            @PathVariable UUID vendorId
    ) {
        return ResponseEntity.ok(
                catalogService.getVendorCatalog(vendorId)
        );
    }
}