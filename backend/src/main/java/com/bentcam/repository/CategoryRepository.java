package com.bentcam.repository;

import com.bentcam.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByMenuSlug(String menuSlug);
    Optional<Category> findByMenuSlugAndSlug(String menuSlug, String slug);
}
