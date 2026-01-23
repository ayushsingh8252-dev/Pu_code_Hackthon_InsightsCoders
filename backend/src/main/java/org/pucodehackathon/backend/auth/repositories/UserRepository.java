package org.pucodehackathon.backend.auth.repositories;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import org.pucodehackathon.backend.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmail(@Email @NotNull(message = "Email Should no be Empty") String email);
    Optional<User> findByEmail(String email);
}