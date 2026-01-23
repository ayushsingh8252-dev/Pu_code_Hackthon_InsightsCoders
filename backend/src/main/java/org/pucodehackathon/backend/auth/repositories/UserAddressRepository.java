package org.pucodehackathon.backend.auth.repositories;

import org.pucodehackathon.backend.auth.model.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserAddressRepository extends JpaRepository<UserAddress, UUID> {

    List<UserAddress> findByUser_Id(UUID userId);

    Optional<UserAddress> findByUser_IdAndIsDefaultTrue(UUID userId);
}
