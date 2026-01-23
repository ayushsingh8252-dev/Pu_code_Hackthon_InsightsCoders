package org.pucodehackathon.backend.auth.repositories;


import org.pucodehackathon.backend.auth.model.Role;
import org.pucodehackathon.backend.auth.model.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByRoleName(RoleType roleName);
}