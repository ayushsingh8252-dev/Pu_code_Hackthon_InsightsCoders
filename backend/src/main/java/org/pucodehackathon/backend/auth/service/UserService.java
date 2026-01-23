package org.pucodehackathon.backend.auth.service;


import org.pucodehackathon.backend.auth.dto.ApiResponse;
import org.pucodehackathon.backend.auth.dto.ResetPasswordRequest;
import org.pucodehackathon.backend.auth.dto.UpdateUserProfileDto;
import org.pucodehackathon.backend.auth.dto.UserDto;


public interface UserService {

    //get user by email
    ApiResponse getUserByEmail(String email);

    //update user
    ApiResponse updateUser(UpdateUserProfileDto userDto, String userId);

    //delete user
    void deleteUser(String userId);

    //get user by id
    ApiResponse getUserById(String userId);

    //get all users
    Iterable<UserDto> getAllUsers();

    //reset password
    ApiResponse resetPassword(ResetPasswordRequest request);


}