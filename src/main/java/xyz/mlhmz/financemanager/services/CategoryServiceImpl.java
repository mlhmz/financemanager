package xyz.mlhmz.financemanager.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.exceptions.CategoryNotFoundException;
import xyz.mlhmz.financemanager.mappers.CategoryMapper;
import xyz.mlhmz.financemanager.repositories.CategoryRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public Category createCategory(Category category) {
        return this.categoryRepository.save(category);
    }

    @Override
    public List<Category> findAllCategories() {
        return this.categoryRepository.findAll();
    }

    @Override
    public Category findCategoryByUUID(UUID uuid) {
        return this.categoryRepository.findById(uuid).orElseThrow(CategoryNotFoundException::new);
    }

    @Override
    public Category updateCategory(UUID uuid, Category newCategory) {
        Category existingCategory = this.findCategoryByUUID(uuid);
        this.categoryMapper.updateCategory(existingCategory, newCategory);
        return existingCategory;
    }

    @Override
    public void deleteCategoryByUuid(UUID uuid) {
        this.categoryRepository.delete(this.findCategoryByUUID(uuid));
    }
}
