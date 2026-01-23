package org.pucodehackathon.backend.order.controller;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.order.dto.order.OrderResponseDto;
import org.pucodehackathon.backend.order.dto.order.PlaceOrderRequestDto;
import org.pucodehackathon.backend.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserOrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<OrderResponseDto> placeOrder(
            Authentication auth,
            @RequestBody PlaceOrderRequestDto request
    ) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(
                orderService.placeOrder(principal.getUser().getId(), request)
        );
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrders(Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(orderService.getUserOrders(principal.getUser().getId()));
    }
}
