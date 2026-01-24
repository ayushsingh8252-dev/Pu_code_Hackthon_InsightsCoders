package org.pucodehackathon.backend.order.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pucodehackathon.backend.order.dto.cart.CartResponseDto;
import org.pucodehackathon.backend.order.repository.CartRepository;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    @Test
    void getCart_WhenCartEmpty_ShouldReturnEmptyCartResponse() {
        UUID userId = UUID.randomUUID();
        when(cartRepository.findByUser_Id(userId)).thenReturn(Optional.empty());

        CartResponseDto response = cartService.getCart(userId);

        assertNotNull(response);
        assertTrue(response.getItems().isEmpty());
        assertEquals(java.math.BigDecimal.ZERO, response.getTotalAmount());
        assertNull(response.getCartId());
        assertNull(response.getVendorId());
    }
}
