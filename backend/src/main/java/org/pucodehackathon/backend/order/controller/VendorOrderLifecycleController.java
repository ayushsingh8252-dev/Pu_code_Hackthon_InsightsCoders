package org.pucodehackathon.backend.order.controller;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.order.dto.order.OrderStatusUpdateResponseDto;
import org.pucodehackathon.backend.order.service.VendorOrderLifecycleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vendor/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VENDOR')")
public class VendorOrderLifecycleController {

    private final VendorOrderLifecycleService lifecycleService;

    @PutMapping("/{orderId}/out-for-delivery")
    public ResponseEntity<OrderStatusUpdateResponseDto> outForDelivery(
            Authentication auth,
            @PathVariable UUID orderId
    ) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(
                lifecycleService.markOutForDelivery(
                        principal.getUser().getId(),
                        orderId
                )
        );
    }

    @PutMapping("/{orderId}/delivered")
    public ResponseEntity<OrderStatusUpdateResponseDto> delivered(
            Authentication auth,
            @PathVariable UUID orderId
    ) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(
                lifecycleService.markDelivered(
                        principal.getUser().getId(),
                        orderId
                )
        );
    }
}
