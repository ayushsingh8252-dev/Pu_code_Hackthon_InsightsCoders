package org.pucodehackathon.backend.order.dto.order;

import lombok.Data;

@Data
public class PlaceOrderRequestDto {
    private String societyName;
    private String houseNumber;
    private String phoneNumber;
}
