package org.pucodehackathon.backend.vendor.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateVendorLocationRequestDto {

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private Float accuracy;
}
