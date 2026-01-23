package org.pucodehackathon.backend.auth.repositories;


import org.pucodehackathon.backend.auth.model.OTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OTPRepository extends JpaRepository<OTP, UUID> {
    void deleteOTPByEmail(String email);
    Optional<OTP> findByEmailAndOtpCodeAndVerifiedFalse(String email , String otp);
}