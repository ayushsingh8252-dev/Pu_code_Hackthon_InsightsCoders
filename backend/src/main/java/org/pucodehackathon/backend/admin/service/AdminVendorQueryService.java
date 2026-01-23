package org.pucodehackathon.backend.admin.service;


import org.pucodehackathon.backend.admin.dto.AdminVendorListPageResponseDto;

public interface AdminVendorQueryService {

    AdminVendorListPageResponseDto getAllVendors(
            String status,
            Boolean active,
            int page,
            int size
    );
}
