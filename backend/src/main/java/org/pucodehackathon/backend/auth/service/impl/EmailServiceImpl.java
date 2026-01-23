package org.pucodehackathon.backend.auth.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pucodehackathon.backend.auth.service.EmailService;
import org.pucodehackathon.backend.exception.EmailSendingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;


    public void sendOTPEmail(String to, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Email Verification Otp");
            message.setText(
                    "Your OTP for email verification is: " + otpCode + "\n\n" +
                            "This OTP will expire in 5 minutes.\n\n" +
                            "If you didn't request this, please ignore this email."
            );
            mailSender.send(message);
            log.debug("SuccessFull send the Otp to User");
        } catch (Exception e) {
            log.error("Failed To send the Otp to User" + e.getMessage());
            throw new EmailSendingException("Otp failed To Send ");
        }
    }

    @Override
    public void sendPasswordResetOTPEmail(String to, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Password Reset - OTP");
            message.setText(
                    "Your OTP for password reset is: " + otpCode + "\n\n" +
                            "This OTP will expire in 5 minutes.\n\n" +
                            "If you didn't request this, please ignore this email."
            );
            mailSender.send(message);
            log.debug("SuccessFull send the Password Reset - OTP");
        } catch (Exception e) {
            log.error("Failed To send the Password Reset - OTP");
            throw new EmailSendingException("Otp failed To Send ");
        }
    }
}
