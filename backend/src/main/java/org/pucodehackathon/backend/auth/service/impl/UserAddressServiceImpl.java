package org.pucodehackathon.backend.auth.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.dto.AddUserAddressRequestDto;
import org.pucodehackathon.backend.auth.dto.UserAddressResponseDto;
import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.auth.model.UserAddress;
import org.pucodehackathon.backend.auth.repositories.UserAddressRepository;
import org.pucodehackathon.backend.auth.repositories.UserRepository;
import org.pucodehackathon.backend.auth.service.UserAddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserAddressServiceImpl implements UserAddressService {

    private final UserRepository userRepository;
    private final UserAddressRepository addressRepository;


    @Override
    public UserAddressResponseDto addAddress(UUID userId, AddUserAddressRequestDto request) {


        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.findByUser_Id(userId)
                    .forEach(a -> a.setIsDefault(false));
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .addressLine(request.getAddressLine())
                .society(request.getSociety())
                .houseNo(request.getHouseNo())
                .area(request.getArea())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .country(request.getCountry())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .isDefault(request.getIsDefault())
                .build();

        addressRepository.save(address);

        return UserAddressResponseDto.builder()
                .addressId(address.getAddressId())
                .addressLine(address.getAddressLine())
                .city(address.getCity())
                .pincode(address.getPincode())
                .isDefault(address.getIsDefault())
                .latitude(address.getLatitude())
                .longitude(address.getLongitude())
                .build();
    }

    public List<UserAddressResponseDto> listAddresses(UUID userId) {
        return addressRepository.findByUser_Id(userId)
                .stream()
                .map(a -> UserAddressResponseDto.builder()
                        .addressId(a.getAddressId())
                        .addressLine(a.getAddressLine())
                        .city(a.getCity())
                        .pincode(a.getPincode())
                        .isDefault(a.getIsDefault())
                        .latitude(a.getLatitude())
                        .longitude(a.getLongitude())
                        .build())
                .toList();
    }
}
