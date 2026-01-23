package org.pucodehackathon.backend.vendor.service;

import org.pucodehackathon.backend.vendor.dto.UpdateVendorLocationRequestDto;

import java.util.UUID;

public interface VendorLocationService {
     void updateLiveLocation(UUID userId, UpdateVendorLocationRequestDto request);
}
