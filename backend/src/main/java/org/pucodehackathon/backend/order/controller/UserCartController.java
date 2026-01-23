package org.pucodehackathon.backend.order.controller;


import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.order.dto.cart.AddToCartRequestDto;
import org.pucodehackathon.backend.order.dto.cart.CartResponseDto;
import org.pucodehackathon.backend.order.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/user/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserCartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartResponseDto> addToCart(
            Authentication auth,
            @RequestBody AddToCartRequestDto request
    ) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(cartService.addToCart(principal.getUser().getId(), request));
    }

    @GetMapping
    public ResponseEntity<CartResponseDto> getCart(Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(cartService.getCart(principal.getUser().getId()));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Void> removeItem(
            Authentication auth,
            @PathVariable UUID itemId
    ) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        cartService.removeItem(principal.getUser().getId(), itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        cartService.clearCart(principal.getUser().getId());
        return ResponseEntity.noContent().build();
    }
}
