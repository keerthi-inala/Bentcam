package com.bentcam.controller;

import com.bentcam.entity.Menu;
import com.bentcam.repository.MenuRepository;
import com.bentcam.repository.ProductRepository;
import com.bentcam.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@Validated
public class MenuController {
    private final MenuRepository menuRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    public MenuController(MenuRepository menuRepository, ProductRepository productRepository, AuthService authService) {
        this.menuRepository = menuRepository;
        this.productRepository = productRepository;
        this.authService = authService;
    }

    @GetMapping("/menus")
    public List<Menu> list() {
        return menuRepository.findAll();
    }

    @PostMapping("/admin/menus")
    public ResponseEntity<?> create(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @RequestBody Map<String, Object> body) {
        if (!isAdmin(auth)) return unauthorized();
        String name = (String) body.get("name");
        String slug = (String) body.get("slug");
        if (name == null || name.isBlank() || slug == null || slug.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid menu payload"));
        }
        if (menuRepository.findBySlug(slug).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Slug already exists"));
        }
        Menu m = new Menu();
        m.setName(name.trim());
        m.setSlug(slug.trim());
        Menu saved = menuRepository.save(m);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/admin/menus/{id}")
    public ResponseEntity<?> update(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @PathVariable Long id,
                                    @RequestBody Map<String, Object> body) {
        if (!isAdmin(auth)) return unauthorized();
        Optional<Menu> existing = menuRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Not found"));
        Menu m = existing.get();
        if (body.containsKey("name")) m.setName(String.valueOf(body.get("name")));
        if (body.containsKey("slug")) {
            String newSlug = String.valueOf(body.get("slug"));
            if (!newSlug.equals(m.getSlug())) {
                if (menuRepository.findBySlug(newSlug).isPresent()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Slug already exists"));
                }
                long inUse = productRepository.countByMenu(m.getSlug());
                if (inUse > 0) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Cannot change slug while in use by products"));
                }
            }
            m.setSlug(newSlug);
        }
        Menu saved = menuRepository.save(m);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/admin/menus/{id}")
    public ResponseEntity<?> delete(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @PathVariable Long id) {
        if (!isAdmin(auth)) return unauthorized();
        Optional<Menu> existing = menuRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Not found"));
        }
        Menu m = existing.get();
        long inUse = productRepository.countByMenu(m.getSlug());
        if (inUse > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Menu in use by products; reassign or remove products first"));
        }
        menuRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring("Bearer ".length());
        AuthService.Session s = authService.validate(token);
        return s != null && "ADMIN".equalsIgnoreCase(s.role);
    }

    private ResponseEntity<?> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Unauthorized"));
    }
}
