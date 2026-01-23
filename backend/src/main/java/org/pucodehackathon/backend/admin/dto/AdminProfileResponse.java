package org.pucodehackathon.backend.admin.dto;


import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminProfileResponse {
    private UUID userId;
    private String name;
    private String email;
}