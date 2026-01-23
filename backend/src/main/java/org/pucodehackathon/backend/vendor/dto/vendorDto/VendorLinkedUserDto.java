package org.pucodehackathon.backend.vendor.dto.vendorDto;

import lombok.Builder;
import lombok.Getter;
import java.util.UUID;

@Getter
@Builder
public class VendorLinkedUserDto {
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Boolean isEnabled;
    private Boolean isEmailVerified;
}