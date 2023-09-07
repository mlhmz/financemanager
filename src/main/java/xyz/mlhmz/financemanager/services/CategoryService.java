package xyz.mlhmz.financemanager.services;

import xyz.mlhmz.financemanager.entities.Category;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    Category createCategory(Category category);

    List<Category> findAllCategories();

    Category findCategoryByUUID(UUID uuid);

    Category updateCategory(UUID uuid, Category category);

    void deleteCategoryByUuid(UUID uuid);
}
