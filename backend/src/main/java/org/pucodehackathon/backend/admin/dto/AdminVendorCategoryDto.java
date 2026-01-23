package org.pucodehackathon.backend.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminVendorCategoryDto {

    private UUID categoryId;
    private String name;
    private String description;
    private Boolean isActive;
}