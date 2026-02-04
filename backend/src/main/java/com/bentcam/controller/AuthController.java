package com.bentcam.controller;

import com.bentcam.dto.LoginRequest;
import com.bentcam.dto.RegisterRequest;
import com.bentcam.entity.Role;
import com.bentcam.entity.User;
import com.bentcam.repository.UserRepository;
import com.bentcam.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final UserRepository userRepository;
    private final AuthService authService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${app.admin.email:}")
    private String adminEmail;

    public AuthController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Validated RegisterRequest req) {
        Optional<User> existing = userRepository.findByEmail(req.getEmail().toLowerCase());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }
        User u = new User();
        u.setEmail(req.getEmail().toLowerCase());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        if (req.getName() != null && !req.getName().trim().isEmpty()) {
            u.setName(req.getName().trim());
        }
        // If configured admin email matches, assign ADMIN role
        if (adminEmail != null && !adminEmail.isBlank() && adminEmail.equalsIgnoreCase(req.getEmail())) {
            u.setRole(Role.ADMIN);
        } else {
            u.setRole(Role.USER);
        }
        User saved = userRepository.save(u);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("id", saved.getId(), "email", saved.getEmail(), "name", saved.getName(), "role", saved.getRole().name().toLowerCase()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail().toLowerCase());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }
        User user = userOpt.get();
        boolean matches = passwordEncoder.matches(req.getPassword(), user.getPasswordHash());
        if (!matches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }
        String roleStr = user.getRole().name().toLowerCase();
        String token = authService.issueToken(user.getId(), roleStr);
        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "token", token,
            "user", Map.of("id", user.getId(), "email", user.getEmail(), "name", user.getName(), "role", roleStr)
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        if (auth == null || !auth.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }
        String token = auth.substring("Bearer ".length());
        // Idempotent revoke: remove if present
        authService.revoke(token);
        return ResponseEntity.noContent().build();
    }
}
