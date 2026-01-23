package org.pucodehackathon.backend.vendor.service;

import org.pucodehackathon.backend.vendor.dto.UpdateVendorLocationRequestDto;
import org.pucodehackathon.backend.vendor.dto.vendorLocationDto.VendorLocationDto;

import java.util.List;
import java.util.UUID;

public interface VendorLocationService {
     void updateLiveLocation(UUID userId, UpdateVendorLocationRequestDto request);
     List<VendorLocationDto> getLocations(UUID loggedInUserId, UUID vendorId);
     VendorLocationDto getPrimaryLocation(UUID loggedInUserId, UUID vendorId);
}
