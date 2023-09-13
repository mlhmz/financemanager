package xyz.mlhmz.financemanager.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.security.oauth2.jwt.Jwt;
import xyz.mlhmz.financemanager.PostgresContextContainerTest;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.repositories.CategoryRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
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

    @Test
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
    void getAllCategories() {
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
        inputCategories.forEach(category -> categoryService.createCategory(category, jwt));

        List<Category> categories = categoryService.findAllCategoriesByJwt(jwt);

        assertThat(categories)
                .isNotNull()
                .hasSize(3)
                .extracting(Category::getUser)
                .extracting(OAuthUser::getOauthUserId)
                .containsOnly(USER_UUID);
    }

    @Test
    void getCategoryById() {
        String title = "category";
        String description = "description";
        Category inputCategory = Category.builder()
                .title(title)
                .description(description)
                .build();

        UUID categoryUuid = categoryService.createCategory(inputCategory, jwt).getUuid();

        Category category = categoryService.findCategoryByUUID(categoryUuid, jwt);

        assertThat(category.getUuid()).isEqualTo(categoryUuid);
        assertThat(category.getTitle()).isEqualTo(title);
        assertThat(category.getDescription()).isEqualTo(description);
        assertThat(category.getUser().getOauthUserId()).isEqualTo(USER_UUID);
    }
}
