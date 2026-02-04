package com.bentcam.controller;

import com.bentcam.entity.Role;
import com.bentcam.entity.User;
import com.bentcam.repository.UserRepository;
import com.bentcam.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public AdminUserController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> setRole(@RequestHeader(value = "Authorization", required = false) String auth,
                                     @PathVariable Long id,
                                     @RequestBody Map<String, String> body) {
        if (!isAdmin(auth)) return unauthorized();
        String roleStr = body.getOrDefault("role", "");
        Role role;
        switch (roleStr == null ? "" : roleStr.trim().toLowerCase()) {
            case "admin": role = Role.ADMIN; break;
            case "user": role = Role.USER; break;
            default: return ResponseEntity.badRequest().body(Map.of("message", "role must be 'admin' or 'user'"));
        }
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        User u = opt.get();
        u.setRole(role);
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("id", u.getId(), "email", u.getEmail(), "role", role.name().toLowerCase()));
    }

    private boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring("Bearer ".length());
        AuthService.Session s = authService.validate(token);
        return s != null && "admin".equalsIgnoreCase(s.role);
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
    }
}
