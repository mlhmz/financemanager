package xyz.mlhmz.financemanager.mappers;

import xyz.mlhmz.financemanager.entities.Category;

public interface CategoryMapper {
    void updateCategory(Category existingCategory, Category newCategory);
}
