package com.bentcam.config;

import com.bentcam.entity.Role;
import com.bentcam.entity.User;
import com.bentcam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements ApplicationRunner {
    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (adminEmail != null && !adminEmail.isBlank() && adminPassword != null && !adminPassword.isBlank()) {
            Optional<User> existing = userRepository.findByEmail(adminEmail.toLowerCase());
            if (existing.isEmpty()) {
                User u = new User();
                u.setEmail(adminEmail.toLowerCase());
                u.setPasswordHash(encoder.encode(adminPassword));
                u.setName("Admin");
                u.setRole(Role.ADMIN);
                userRepository.save(u);
            } else {
                // Ensure configured admin account has ADMIN role and desired password
                User u = existing.get();
                boolean changed = false;
                if (u.getRole() != Role.ADMIN) {
                    u.setRole(Role.ADMIN);
                    changed = true;
                }
                if (!encoder.matches(adminPassword, u.getPasswordHash())) {
                    u.setPasswordHash(encoder.encode(adminPassword));
                    changed = true;
                }
                if (u.getName() == null || u.getName().isBlank()) {
                    u.setName("Admin");
                    changed = true;
                }
                if (changed) {
                    userRepository.save(u);
                }
            }
        }
    }
}
