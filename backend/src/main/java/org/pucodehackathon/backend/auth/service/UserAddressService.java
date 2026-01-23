package org.pucodehackathon.backend.auth.service;

import org.pucodehackathon.backend.auth.dto.AddUserAddressRequestDto;
import org.pucodehackathon.backend.auth.dto.UserAddressResponseDto;

import java.util.List;
import java.util.UUID;

public interface UserAddressService {
    UserAddressResponseDto addAddress(UUID userId, AddUserAddressRequestDto request);
    public List<UserAddressResponseDto> listAddresses(UUID userId);
}
