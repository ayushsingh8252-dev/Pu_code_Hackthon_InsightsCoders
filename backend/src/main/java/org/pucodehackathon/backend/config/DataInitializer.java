package org.pucodehackathon.backend.config;
import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.model.Role;
import org.pucodehackathon.backend.auth.model.RoleType;
import org.pucodehackathon.backend.auth.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        // Initialize roles if they don't exist
        for (RoleType roleType : RoleType.values()) {
            if (roleRepository.findByRoleName(roleType).isEmpty()) {
                Role role = new Role();
                role.setRoleName(roleType);
                roleRepository.save(role);
            }
        }
    }
}