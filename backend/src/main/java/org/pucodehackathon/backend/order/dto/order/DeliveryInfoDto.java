package org.pucodehackathon.backend.order.dto.order;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeliveryInfoDto {
    private String vendorContact;
    private String deliveryAddress;
}
