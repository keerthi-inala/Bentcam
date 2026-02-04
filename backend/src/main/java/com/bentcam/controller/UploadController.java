package com.bentcam.controller;

import com.bentcam.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@Validated
public class UploadController {
    private final AuthService authService;
    public UploadController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/admin/upload")
    public ResponseEntity<?> upload(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @RequestParam("file") MultipartFile file) throws IOException {
        if (!isAdmin(auth)) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "No file provided"));
        }
        String original = file.getOriginalFilename();
        String ext = "";
        if (original != null && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.')).toLowerCase();
        }
        String allowed = ".png,.jpg,.jpeg,.gif,.webp,.avif";
        if (!allowed.contains(ext)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Unsupported file type"));
        }
        // Ensure uploads dir exists
        Path uploadDir = Paths.get("uploads").toAbsolutePath();
        Files.createDirectories(uploadDir);
        // Save with UUID filename
        String filename = UUID.randomUUID().toString().replace("-", "") + ext;
        Path target = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), target);
        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/").path(filename).toUriString();
        return ResponseEntity.ok(Map.of("url", url, "filename", filename));
    }

    private boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring("Bearer ".length());
        AuthService.Session s = authService.validate(token);
        return s != null && "ADMIN".equalsIgnoreCase(s.role);
    }
}
