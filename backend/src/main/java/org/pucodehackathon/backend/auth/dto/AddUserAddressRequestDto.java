package org.pucodehackathon.backend.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddUserAddressRequestDto {
    private String addressLine;
    private String society;
    private String houseNo;
    private String area;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private Double latitude;
    private Double longitude;
    private Boolean isDefault;
}
