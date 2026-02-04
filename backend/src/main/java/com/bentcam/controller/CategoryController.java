package com.bentcam.controller;

import com.bentcam.entity.Category;
import com.bentcam.repository.CategoryRepository;
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
public class CategoryController {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    public CategoryController(CategoryRepository categoryRepository, ProductRepository productRepository, AuthService authService) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.authService = authService;
    }

    @GetMapping("/menus/{slug}/categories")
    public List<Category> list(@PathVariable String slug) {
        return categoryRepository.findByMenuSlug(slug);
    }

    @PostMapping("/admin/menus/{slug}/categories")
    public ResponseEntity<?> create(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @PathVariable String slug,
                                    @RequestBody Map<String, Object> body) {
        if (!isAdmin(auth)) return unauthorized();
        String name = (String) body.get("name");
        String categorySlug = (String) body.get("slug");
        if (name == null || name.isBlank() || categorySlug == null || categorySlug.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid category payload"));
        }
        if (categoryRepository.findByMenuSlugAndSlug(slug, categorySlug).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Slug already exists in this menu"));
        }
        Category c = new Category();
        c.setMenuSlug(slug.trim());
        c.setName(name.trim());
        c.setSlug(categorySlug.trim());
        Category saved = categoryRepository.save(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/admin/categories/{id}")
    public ResponseEntity<?> update(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @PathVariable Long id,
                                    @RequestBody Map<String, Object> body) {
        if (!isAdmin(auth)) return unauthorized();
        Optional<Category> existing = categoryRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Not found"));
        Category c = existing.get();
        if (body.containsKey("name")) c.setName(String.valueOf(body.get("name")));
        if (body.containsKey("slug")) {
            String newSlug = String.valueOf(body.get("slug"));
            if (!newSlug.equals(c.getSlug())) {
                if (categoryRepository.findByMenuSlugAndSlug(c.getMenuSlug(), newSlug).isPresent()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Slug already exists in this menu"));
                }
                long inUse = productRepository.countByMenuAndCategory(c.getMenuSlug(), c.getSlug());
                if (inUse > 0) {
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Cannot change slug while in use by products"));
                }
            }
            c.setSlug(newSlug);
        }
        Category saved = categoryRepository.save(c);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<?> delete(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @PathVariable Long id) {
        if (!isAdmin(auth)) return unauthorized();
        Optional<Category> existing = categoryRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Not found"));
        }
        Category c = existing.get();
        long inUse = productRepository.countByMenuAndCategory(c.getMenuSlug(), c.getSlug());
        if (inUse > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Category in use by products; reassign or remove products first"));
        }
        categoryRepository.deleteById(id);
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
