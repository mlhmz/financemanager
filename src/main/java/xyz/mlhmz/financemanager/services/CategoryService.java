package xyz.mlhmz.financemanager.services;

import org.springframework.security.oauth2.jwt.Jwt;
import xyz.mlhmz.financemanager.entities.Category;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    Category createCategory(Category category, Jwt jwt);

    List<Category> findAllCategoriesByJwt(Jwt jwt);

    Category findCategoryByUUID(UUID uuid, Jwt jwt);

    Category updateCategory(UUID uuid, Category category, Jwt jwt);

    void deleteCategoryByUuid(UUID uuid, Jwt jwt);
}
