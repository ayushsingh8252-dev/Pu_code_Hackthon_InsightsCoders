package org.pucodehackathon.backend.auth.service;

import org.pucodehackathon.backend.auth.dto.userDto.VendorCatalogResponseDto;

import java.util.UUID;

public interface UserVendorCatalogService {
    VendorCatalogResponseDto getVendorCatalog(UUID vendorId);
}