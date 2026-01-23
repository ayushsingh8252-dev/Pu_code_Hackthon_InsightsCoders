package org.pucodehackathon.backend.auth.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.dto.ApiResponse;
import org.pucodehackathon.backend.auth.dto.ResetPasswordRequest;
import org.pucodehackathon.backend.auth.dto.UpdateUserProfileDto;
import org.pucodehackathon.backend.auth.dto.UserDto;

import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.auth.repositories.UserRepository;
import org.pucodehackathon.backend.auth.service.UserService;
import org.pucodehackathon.backend.exception.InvalidOtpException;
import org.pucodehackathon.backend.exception.UserNotFoundException;
import org.pucodehackathon.backend.helper.UserHelper;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper mapper;
    private final OtpServiceImpl otpService;
    private final PasswordEncoder passwordEncoder;


    @Override
    public ApiResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return ApiResponse.builder()
                .message("User not found")
                .success(false)
                .build();
    }

    @Override
    public ApiResponse updateUser(UpdateUserProfileDto userDto, String userId) {
        UUID uId = UserHelper.parseUUID(userId);

        User existingUser = userRepository
                .findById(uId)
                .orElseThrow(() -> new UserNotFoundException("User not found with given id"));

        if (userDto.getFirstName() != null)
            existingUser.setFirstName(userDto.getFirstName());

        if (userDto.getLastName() != null)
            existingUser.setLastName(userDto.getLastName());

        if (userDto.getPhoneNumber() != null)
            existingUser.setPhoneNumber(userDto.getPhoneNumber());

        if (userDto.getImage() != null)
            existingUser.setImage(userDto.getImage());

        existingUser.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(existingUser);

        return ApiResponse.builder()
                .success(true)
                .message("User updated successfully")
                .data(mapper.map(updatedUser, UserDto.class)) // response DTO is OK
                .build();
    }


    @Transactional
    public ApiResponse resetPassword(ResetPasswordRequest request) {

        boolean isValid = otpService.validateOtp(request.getEmail(), request.getOtp());

        if (!isValid) {
            throw new InvalidOtpException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new ApiResponse(true,
                "Password reset successful! Please login with your new password.",
                null);
    }


    @Transactional
    public void requestPasswordReset(String email) {
        userRepository.findByEmail(email)
                .ifPresent(user -> {
                    // Send OTP for password reset without revealing whether the email exists to the caller
                    otpService.generateAndSendPasswordResetOTP(email);
                });
    }

    @Override
    public void deleteUser(String userId) {
        UUID uId = UserHelper.parseUUID(userId);
        User user = userRepository.findById(uId).orElseThrow(() -> new UserNotFoundException("User not found with given id"));
        userRepository.delete(user);
    }

    @Override
    public ApiResponse getUserById(String userId) {
        User user = userRepository.findById(UserHelper.parseUUID(userId)).orElseThrow(() -> new UserNotFoundException("User not found with given id"));
        return ApiResponse.builder()
                .message("User fetched successfully")
                .success(true)
                .data(mapper.map(user, UserDto.class))
                .build();
    }

    @Override
    @Transactional
    public Iterable<UserDto> getAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(user -> mapper.map(user, UserDto.class))
                .toList();
    }
}
