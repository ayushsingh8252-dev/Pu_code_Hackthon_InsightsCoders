package org.pucodehackathon.backend.auth.controller;

import lombok.AllArgsConstructor;
import org.pucodehackathon.backend.auth.dto.ApiResponse;
import org.pucodehackathon.backend.auth.dto.UpdateUserProfileDto;
import org.pucodehackathon.backend.auth.dto.UserDto;

import org.pucodehackathon.backend.auth.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    // get all user api
    @GetMapping
    public ResponseEntity<Iterable<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable("email") String email) {
        ApiResponse apiResponse = userService.getUserByEmail(email);
        if (!apiResponse.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok((UserDto) apiResponse.getData());
    }

    //delete user
    //api/v1/users/{userId}
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable("userId") String userId) {
        userService.deleteUser(userId);
    }

    //update user
    //api/v1/users/{userId}
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(@RequestBody UpdateUserProfileDto userDto, @PathVariable("userId") String userId) {
        ApiResponse apiResponse = userService.updateUser(userDto, userId);
        return ResponseEntity.ok((UserDto) apiResponse.getData());
    }

    //get user by id
    //api/v1/users/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("userId") String userId) {
        ApiResponse apiResponse = userService.getUserById(userId);
        if (!apiResponse.isSuccess()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok((UserDto) apiResponse.getData());
    }
}
