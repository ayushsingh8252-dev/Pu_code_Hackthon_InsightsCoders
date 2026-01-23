package org.pucodehackathon.backend.auth.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.model.OTP;
import org.pucodehackathon.backend.auth.repositories.OTPRepository;
import org.pucodehackathon.backend.auth.service.OTPService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OTPService {

    private final EmailServiceImpl emailService;
    private final OTPRepository otpRepository;

    @Value("${otp.length}")
    private int otpLength;

    @Value("${otp.expiration}")
    private long otpExpiration;

    @Override
    public String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    @Override
    @Transactional
    public void generateAndSendOtp(String email) {
        //Delete Otps of the Email
        otpRepository.deleteOTPByEmail(email);

        //Generate New Otp
        String otpCode = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusSeconds(otpExpiration / 1000);

        OTP otp = OTP.builder()
                .email(email)
                .otpCode(otpCode)
                .expiryTime(expiry)
                .build();

        otpRepository.save(otp);

        emailService.sendOTPEmail(email, otpCode);
    }

    @Override
    @Transactional
    public void generateAndSendPasswordResetOTP(String email) {
        otpRepository.deleteOTPByEmail(email);

        //Generate New Otp
        String otpCode = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusSeconds(otpExpiration / 1000);

        OTP otp = OTP.builder()
                .email(email)
                .otpCode(otpCode)
                .expiryTime(expiry)
                .build();

        otpRepository.save(otp);

        emailService.sendPasswordResetOTPEmail(email, otpCode);
    }

    @Override
    public boolean validateOtp(String email, String otp) {
        Optional<OTP> otp1 = otpRepository.findByEmailAndOtpCodeAndVerifiedFalse(email, otp);

        if (otp1.isEmpty()) return false;

        OTP otp2 = otp1.get();

        if (otp2.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        otp2.setVerified(true);
        otpRepository.save(otp2);
        return true;

    }
}
