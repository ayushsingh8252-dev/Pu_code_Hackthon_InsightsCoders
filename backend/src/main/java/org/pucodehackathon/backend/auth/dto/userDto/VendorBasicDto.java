package org.pucodehackathon.backend.auth.dto.userDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class VendorBasicDto {
    private UUID vendorId;
    private String businessName;
    private String vendorType;
    private Double rating;
}
