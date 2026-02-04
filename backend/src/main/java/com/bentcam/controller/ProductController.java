package com.bentcam.controller;

import com.bentcam.entity.Product;
import com.bentcam.repository.ProductRepository;
import com.bentcam.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@Validated
public class ProductController {

    private final ProductRepository productRepository;
    private final AuthService authService;

    public ProductController(ProductRepository productRepository, AuthService authService) {
        this.productRepository = productRepository;
        this.authService = authService;
    }

    // Public list
    @GetMapping("/products")
    public List<Product> list() {
        return productRepository.findAll();
    }

    // Public detail
    @GetMapping("/products/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        Optional<Product> p = productRepository.findById(id);
        return p.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Not found")));
    }

    // Admin create
    @PostMapping("/admin/products")
    public ResponseEntity<?> create(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @RequestBody Map<String, Object> body) {
        if (!isAdmin(auth)) return unauthorized();
        try {
            String name = (String) body.get("name");
            String part = (String) body.get("part");
            BigDecimal price = new BigDecimal(String.valueOf(body.get("price")));
            String description = (String) body.getOrDefault("description", null);
            String imageUrl = (String) body.getOrDefault("imageUrl", null);
            String menu = (String) body.getOrDefault("menu", "uncategorized");
            String category = (String) body.getOrDefault("category", null);

            if (name == null || name.isBlank() || part == null || part.isBlank() || price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid product payload"));
            }
            if (productRepository.findByPart(part).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Part already exists"));
            }
            Product p = new Product();
            p.setName(name);
            p.setPart(part);
            p.setPrice(price);
            p.setDescription(description);
            p.setImageUrl(imageUrl);
            p.setMenu(menu);
            p.setCategory(category);
            Product saved = productRepository.save(p);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid product payload"));
        }
    }

    // Admin update
    @PutMapping("/admin/products/{id}")
    public ResponseEntity<?> update(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @PathVariable Long id,
                                    @RequestBody Map<String, Object> body) {
        if (!isAdmin(auth)) return unauthorized();
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Not found"));
        Product p = existing.get();
        if (body.containsKey("name")) p.setName(String.valueOf(body.get("name")));
        if (body.containsKey("part")) p.setPart(String.valueOf(body.get("part")));
        if (body.containsKey("price")) {
            try { p.setPrice(new BigDecimal(String.valueOf(body.get("price")))); } catch (Exception ignored) {}
        }
        if (body.containsKey("description")) p.setDescription((String) body.get("description"));
        if (body.containsKey("imageUrl")) p.setImageUrl((String) body.get("imageUrl"));
        if (body.containsKey("menu")) p.setMenu(String.valueOf(body.get("menu")));
        if (body.containsKey("category")) p.setCategory(String.valueOf(body.get("category")));
        Product saved = productRepository.save(p);
        return ResponseEntity.ok(saved);
    }

    // Admin delete
    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<?> delete(@RequestHeader(value = "Authorization", required = false) String auth,
                                    @PathVariable Long id) {
        if (!isAdmin(auth)) return unauthorized();
        if (!productRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Not found"));
        }
        productRepository.deleteById(id);
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
