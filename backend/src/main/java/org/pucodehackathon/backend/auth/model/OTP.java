package org.pucodehackathon.backend.auth.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "otps")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OTP {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otpCode;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Column(nullable = false)
    private boolean verified = false;

    @CreationTimestamp
    @Column(nullable = false , updatable = false)
    private LocalDateTime createdAt;
}
