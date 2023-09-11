package xyz.mlhmz.financemanager.services;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.User;
import xyz.mlhmz.financemanager.exceptions.CategoryNotFoundException;
import xyz.mlhmz.financemanager.mappers.CategoryMapper;
import xyz.mlhmz.financemanager.repositories.CategoryRepository;

import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final UserService userService;

    @Override
    public Category createCategory(Category category, Jwt jwt) {
        User user = userService.findUserByJwt(jwt);
        category.setUser(user);
        return this.categoryRepository.save(category);
    }

    @Override
    public List<Category> findAllCategoriesByJwt(Jwt jwt) {
        return this.categoryRepository.findAllByUser(
                this.userService.findUserByJwt(jwt)
        );
    }

    @Override
    public Category findCategoryByUUID(UUID uuid, Jwt jwt) {
        return this.categoryRepository.findByUuidAndUser(uuid, this.userService.findUserByJwt(jwt))
                .orElseThrow(CategoryNotFoundException::new);
    }

    @Override
    public Category updateCategory(UUID uuid, Category newCategory, Jwt jwt) {
        Category existingCategory = this.findCategoryByUUID(uuid, jwt);
        this.categoryMapper.updateCategory(existingCategory, newCategory);
        return existingCategory;
    }

    @Override
    public void deleteCategoryByUuid(UUID uuid, Jwt jwt) {
        this.categoryRepository.delete(this.findCategoryByUUID(uuid, jwt));
    }
}
