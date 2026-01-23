package org.pucodehackathon.backend.order.controller;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.order.dto.order.OrderStatusUpdateResponseDto;
import org.pucodehackathon.backend.order.service.UserOrderLifecycleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserOrderLifecycleController {

    private final UserOrderLifecycleService lifecycleService;

    @PutMapping("/{orderId}/complete")
    public ResponseEntity<OrderStatusUpdateResponseDto> complete(
            Authentication auth,
            @PathVariable UUID orderId
    ) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(
                lifecycleService.completeOrder(
                        principal.getUser().getId(),
                        orderId
                )
        );
    }
}

