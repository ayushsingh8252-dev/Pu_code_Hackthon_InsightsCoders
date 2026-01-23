package org.pucodehackathon.backend.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminVendorListPageResponseDto {

    private List<AdminVendorListResponseDto> vendors;

    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}