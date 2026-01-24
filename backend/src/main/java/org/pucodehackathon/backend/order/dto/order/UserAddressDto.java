package org.pucodehackathon.backend.order.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter @Setter
@Builder
public class UserAddressDto {
    private String addressLine;
    private String area;
    private String city;
    private String state;
    private String pincode;
    private String phone;
}

