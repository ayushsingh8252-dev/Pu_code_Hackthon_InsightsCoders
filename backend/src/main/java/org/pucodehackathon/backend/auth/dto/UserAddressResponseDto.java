package org.pucodehackathon.backend.auth.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class UserAddressResponseDto {
    private UUID addressId;
    private String addressLine;
    private String city;
    private String pincode;
    private Boolean isDefault;
    private Double latitude;
    private Double longitude;
}
