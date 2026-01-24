package org.pucodehackathon.backend.order.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class VendorSummaryDto {
    private UUID vendorId;
    private String businessName;
    private String phone;
}
