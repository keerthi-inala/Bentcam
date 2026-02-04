package com.bentcam.repository;

import com.bentcam.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByPart(String part);
    long countByMenu(String menu);
    long countByCategory(String category);
    long countByMenuAndCategory(String menu, String category);
}
