package org.pucodehackathon.backend.auth.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.dto.*;
import org.pucodehackathon.backend.auth.service.impl.AuthServiceImpl;
import org.pucodehackathon.backend.auth.service.impl.UserServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl authService;
    private final UserServiceImpl userServiceImpl;


    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(@RequestBody SignupRequestDto requestDto) {
        ApiResponse response = authService.signup(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@RequestBody OtpRequest request) {
        ApiResponse response = authService.verifyOtp(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/resend-otp/{email}")
    public ResponseEntity<ApiResponse> resendOtp(@PathVariable String email) {
        ApiResponse response = authService.resendOtp(email);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequestDto loginRequest, HttpServletResponse response){
        ApiResponse apiResponse = authService.login(loginRequest, response);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest body,
            HttpServletResponse response,
            HttpServletRequest request
    ){
        ApiResponse apiResponse = authService.refreshToken(body, response, request);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }


    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(HttpServletRequest request, HttpServletResponse response) {
        ApiResponse apiResponse = authService.logoutUser(request, response);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(
            @RequestBody(required = false) Map<String, String> request,
            @RequestParam(value = "email", required = false) String emailParam) {
        String email = null;
        if (request != null) {
            email = request.get("email");
        }
        if (email == null || email.isBlank()) {
            email = emailParam;
        }
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is required", null));
        }
        userServiceImpl.requestPasswordReset(email.trim());
        return ResponseEntity.ok(new ApiResponse(true,
                "If an account exists for this email, an OTP has been sent.", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(userServiceImpl.resetPassword(request));
    }

}
