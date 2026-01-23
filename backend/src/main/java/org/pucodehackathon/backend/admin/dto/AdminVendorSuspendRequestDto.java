package org.pucodehackathon.backend.admin.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminVendorSuspendRequestDto {

    @NotBlank
    private String reason;
}