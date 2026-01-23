package org.pucodehackathon.backend.vendor.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.vendor.dto.VendorRegistrationRequestDto;
import org.pucodehackathon.backend.vendor.dto.VendorRegistrationResponseDto;
import org.pucodehackathon.backend.vendor.dto.vendorDto.VendorLinkedUserDto;
import org.pucodehackathon.backend.vendor.dto.vendorDto.VendorResponseDto;
import org.pucodehackathon.backend.vendor.service.impl.VendorServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final VendorServiceImpl vendorService;


    @PostMapping("/register")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<VendorRegistrationResponseDto> registerVendorPartner(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody VendorRegistrationRequestDto request
    ) {
        if (user == null) {
            throw new AccessDeniedException("Unauthorized");
        }
        return ResponseEntity.ok(vendorService.registerAsVendor(user.getUser().getId(), request));
    }


    @GetMapping("/me")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<VendorResponseDto> getMyVendor(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(
                vendorService.getMyVendorProfile(principal.getUser().getId())
        );
    }

    @GetMapping("/{vendorId}")
    public ResponseEntity<VendorResponseDto> getVendorById(@PathVariable UUID vendorId) {
        return ResponseEntity.ok(vendorService.getVendorById(vendorId));
    }



    @GetMapping("/{vendorId}/user")
    public ResponseEntity<VendorLinkedUserDto> getUserByVendorId(Authentication authentication, @PathVariable UUID vendorId) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(vendorService.getUserByVendorId(principal.getUser().getId(),vendorId));
    }


}
