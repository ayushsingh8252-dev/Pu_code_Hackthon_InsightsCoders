package org.pucodehackathon.backend.admin.controller;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.admin.dto.AdminProfileResponse;
import org.pucodehackathon.backend.admin.service.AdminProfileService;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProfileResponse> getProfile(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(adminProfileService.getProfile(principal));
    }
}