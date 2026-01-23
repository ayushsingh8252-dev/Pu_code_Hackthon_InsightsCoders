package org.pucodehackathon.backend.auth.service;

public interface OTPService {
    String generateOtp();
    void generateAndSendOtp(String email);
    void generateAndSendPasswordResetOTP(String email);
    boolean validateOtp(String email , String otp);

}
