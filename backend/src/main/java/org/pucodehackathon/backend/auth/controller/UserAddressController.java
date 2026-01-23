package org.pucodehackathon.backend.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.dto.*;
import org.pucodehackathon.backend.auth.service.UserAddressService;
import org.pucodehackathon.backend.auth.service.impl.AuthServiceImpl;
import org.pucodehackathon.backend.auth.service.impl.UserServiceImpl;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/addresses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserAddressController {

    private final UserAddressService addressService;

    @PostMapping
    public ResponseEntity<UserAddressResponseDto> addAddress(
            Authentication auth,
            @RequestBody @Valid AddUserAddressRequestDto request
    ) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(
                addressService.addAddress(principal.getUser().getId(), request)
        );
    }

    @GetMapping
    public ResponseEntity<List<UserAddressResponseDto>> getAddresses(
            Authentication auth
    ) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(
                addressService.listAddresses(principal.getUser().getId())
        );
    }
}
