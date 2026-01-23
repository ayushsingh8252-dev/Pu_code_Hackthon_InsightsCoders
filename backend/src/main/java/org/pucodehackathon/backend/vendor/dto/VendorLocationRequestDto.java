package org.pucodehackathon.backend.vendor.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VendorLocationRequestDto {

    @NotBlank
    private String addressLine;

    private String area;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String country;

    @NotBlank
    private String pincode;

    private Double latitude;
    private Double longitude;
}
