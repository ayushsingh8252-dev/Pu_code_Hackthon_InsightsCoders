//package org.localvendor.backend.admin.controller;
//
//import jakarta.validation.Valid;
//import lombok.RequiredArgsConstructor;
//import org.localvendor.backend.admin.dto.AdminVendorActionResponseDto;
//import org.localvendor.backend.admin.dto.AdminVendorDetailsResponseDto;
//import org.localvendor.backend.admin.dto.AdminVendorListPageResponseDto;
//import org.localvendor.backend.admin.dto.AdminVendorListResponseDto;
//import org.localvendor.backend.admin.service.impl.AdminVendorQueryServiceImpl;
//import org.localvendor.backend.admin.service.impl.AdminVendorServiceImpl;
//import org.localvendor.backend.vendor.dto.VendorRejectionRequestDto;
//import org.localvendor.backend.vendor.model.Vendor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.UUID;
//
//@RequestMapping("/api/v1/admin/vendors")
//@RestController
//@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
//public class AdminVendorController {
//
//    private final AdminVendorServiceImpl adminVendorService;
//    private final AdminVendorQueryServiceImpl adminVendorQueryService;
//
//    @PutMapping("/{vendorId}/approve")
//    public ResponseEntity<AdminVendorActionResponseDto> approveVendor(@PathVariable UUID vendorId) {
//        return ResponseEntity.ok(adminVendorService.approveVendor(vendorId));
//    }
//
//    @PutMapping("/{vendorId}/reject")
//    public ResponseEntity<AdminVendorActionResponseDto> rejectVendor(@PathVariable UUID vendorId, @Valid @RequestBody VendorRejectionRequestDto request) {
//        return ResponseEntity.ok(adminVendorService.rejectVendor(vendorId, request.getReason()));
//    }
//
//    @GetMapping
//    public ResponseEntity<List<AdminVendorListResponseDto>> getAllVendorForVerification() {
//        return ResponseEntity.ok(adminVendorService.getAllVendorForVerification());
//    }
//
//    @GetMapping("/{vendorId}")
//    public ResponseEntity<AdminVendorDetailsResponseDto> getVendorDetails(@PathVariable UUID vendorId) {
//        return ResponseEntity.ok(adminVendorService.getVendorDetails(vendorId));
//    }
//
//    @GetMapping
//    public ResponseEntity<AdminVendorListPageResponseDto> getAllVendors(
//            @RequestParam(required = false) String status,
//            @RequestParam(required = false) Boolean active,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "20") int size
//    ) {
//        return ResponseEntity.ok(
//                adminVendorQueryService.getAllVendors(status, active, page, size)
//        );
//    }
//}


package org.pucodehackathon.backend.admin.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.pucodehackathon.backend.admin.dto.AdminVendorActionResponseDto;
import org.pucodehackathon.backend.admin.dto.AdminVendorDetailsResponseDto;
import org.pucodehackathon.backend.admin.dto.AdminVendorListPageResponseDto;
import org.pucodehackathon.backend.admin.dto.AdminVendorListResponseDto;
import org.pucodehackathon.backend.admin.service.impl.AdminVendorQueryServiceImpl;
import org.pucodehackathon.backend.admin.service.impl.AdminVendorServiceImpl;
import org.pucodehackathon.backend.vendor.dto.VendorRejectionRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/admin/vendors")
@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVendorController {

    private final AdminVendorServiceImpl adminVendorService;
    private final AdminVendorQueryServiceImpl adminVendorQueryService;

    @PutMapping("/{vendorId}/approve")
    public ResponseEntity<AdminVendorActionResponseDto> approveVendor(@PathVariable UUID vendorId) {
        return ResponseEntity.ok(adminVendorService.approveVendor(vendorId));
    }

    @PutMapping("/{vendorId}/reject")
    public ResponseEntity<AdminVendorActionResponseDto> rejectVendor(@PathVariable UUID vendorId, @Valid @RequestBody VendorRejectionRequestDto request) {
        return ResponseEntity.ok(adminVendorService.rejectVendor(vendorId, request.getReason()));
    }

    @GetMapping("/for-verification")
    public ResponseEntity<List<AdminVendorListResponseDto>> getAllVendorForVerification() {
        return ResponseEntity.ok(adminVendorService.getAllVendorForVerification());
    }

    @GetMapping("/{vendorId}")
    public ResponseEntity<AdminVendorDetailsResponseDto> getVendorDetails(@PathVariable UUID vendorId) {
        return ResponseEntity.ok(adminVendorService.getVendorDetails(vendorId));
    }

    @GetMapping
    public ResponseEntity<AdminVendorListPageResponseDto> getAllVendors(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(
                adminVendorQueryService.getAllVendors(status, active, page, size)
        );
    }
}
