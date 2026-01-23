package org.pucodehackathon.backend.vendor.dto;


import lombok.Data;

@Data
public class VendorStatusRequestDto {
    private Boolean isOpen;
    private String reason;
}