package xyz.mlhmz.financemanager.services;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.jwt.Jwt;
import xyz.mlhmz.financemanager.PostgresContextContainerTest;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.exceptions.CategoryNotFoundException;
import xyz.mlhmz.financemanager.repositories.CategoryRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doReturn;

class CategoryServiceIntegrationTest extends PostgresContextContainerTest {
    private static final UUID USER_UUID = UUID.fromString("02ed4249-ac97-452a-8a74-b1e2af02f35d");

    @Autowired
    CategoryService categoryService;
    @Autowired
    CategoryRepository categoryRepository;
    @MockBean
    Jwt jwt;

    @BeforeEach
    void setUp() {
        doReturn(USER_UUID.toString()).when(jwt).getSubject();
    }

    @AfterEach
    void tearDown() {
        categoryRepository.deleteAll();
    }

    @Test
    @DisplayName("createCategory() succeeds and all automatically filled fields are also filled")
    void createCategory() {
        String title = "Test Category";
        String description = "Test Description";
        Category category = Category.builder()
                .title(title)
                .description(description)
                .build();

        Category savedCategory = this.categoryService.createCategory(category, jwt);

        assertThat(savedCategory.getCreatedAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedCategory.getUpdatedAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedCategory.getTitle()).isEqualTo(title);
        assertThat(savedCategory.getDescription()).isEqualTo(description);
        assertThat(savedCategory.getUser().getOauthUserId()).isEqualTo(USER_UUID);
        assertThat(savedCategory.getTransactions())
                .isNotNull()
                .isEmpty();
    }

    @Test
    @DisplayName("findAllCategories() finds all Created Objects")
    void findAllCategories() {
        List<Category> inputCategories = List.of(
                Category.builder()
                        .title("category")
                        .description("description")
                        .build(),
                Category.builder()
                        .title("category")
                        .description("description")
                        .build(),
                Category.builder()
                        .title("category")
                        .description("description")
                        .build()
        );
        inputCategories.forEach(category -> this.categoryService.createCategory(category, jwt));

        List<Category> categories = this.categoryService.findAllCategoriesByJwt(jwt);

        assertThat(categories)
                .isNotNull()
                .hasSize(3)
                .extracting(Category::getUser)
                .extracting(OAuthUser::getOauthUserId)
                .containsOnly(USER_UUID);
    }

    @Test
    @DisplayName("findCategoryById() finds created object")
    void findCategoryById() {
        String title = "category";
        String description = "description";
        Category inputCategory = Category.builder()
                .title(title)
                .description(description)
                .build();

        UUID categoryUuid = this.categoryService.createCategory(inputCategory, jwt).getUuid();

        Category category = this.categoryService.findCategoryByUUID(categoryUuid, jwt);

        assertThat(category.getUuid()).isEqualTo(categoryUuid);
        assertThat(category.getTitle()).isEqualTo(title);
        assertThat(category.getDescription()).isEqualTo(description);
        assertThat(category.getUser().getOauthUserId()).isEqualTo(USER_UUID);
    }

    @Test
    @DisplayName("findCategoryById() with non-existing UUID result in CategoryNotFoundException")
    void getCategoryById_ThrowsCategoryNotFoundExceptionOnNonExistingCategory() {
        UUID nonExistingCategoryUuid = UUID.randomUUID();
        assertThatThrownBy(() -> this.categoryService.findCategoryByUUID(nonExistingCategoryUuid, jwt))
                .isInstanceOf(CategoryNotFoundException.class);
    }

    @Test
    @DisplayName("updateCategory() succeeds and non updateable fields wont be updated")
    void updateCategory() {
        String title = "Test Category";
        String description = "Test Description";
        Category category = Category.builder()
                .title(title)
                .description(description)
                .build();

        Category savedCategory = this.categoryService.createCategory(category, jwt);
        LocalDateTime existingCreationDate = savedCategory.getCreatedAt();

        String newTitle = "Test Category";
        String newDescription = "Test Description";

        Category updateCategory = Category.builder()
                .title(newTitle)
                .description(newDescription)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(OAuthUser.builder().build())
                .build();

        Category updateResult = this.categoryService.updateCategory(savedCategory.getUuid(), updateCategory, jwt);

        // Check that non-updatable fields didn't get updated
        assertThat(updateResult.getCreatedAt()).isEqualTo(existingCreationDate);
        assertThat(updateResult.getUser().getOauthUserId()).isEqualTo(USER_UUID);

        // Check that updatable fields also got updated
        assertThat(updateResult.getTitle()).isEqualTo(newTitle);
        assertThat(updateResult.getDescription()).isEqualTo(newDescription);
    }

    @Test
    @DisplayName("Delete category succeeds")
    void deleteCategory() {
        Category category = Category.builder()
                .title("Test")
                .description("Test")
                .build();

        UUID categoryUuid = this.categoryService.createCategory(category, jwt).getUuid();

        assertThat(this.categoryRepository.findAll()).hasSize(1);

        this.categoryService.deleteCategoryByUuid(categoryUuid, jwt);

        assertThat(this.categoryRepository.findAll()).isEmpty();
    }
}
