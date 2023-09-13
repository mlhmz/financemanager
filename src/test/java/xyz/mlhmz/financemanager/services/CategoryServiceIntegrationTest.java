package xyz.mlhmz.financemanager.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.SpyBean;
import xyz.mlhmz.financemanager.PostgresContextContainerTest;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.repositories.CategoryRepository;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;

class CategoryServiceIntegrationTest extends PostgresContextContainerTest {
    private static final String USER_UUID = "02ed4249-ac97-452a-8a74-b1e2af02f35d";

    @Autowired
    CategoryService categoryService;
    @Autowired
    CategoryRepository categoryRepository;
    @SpyBean
    OAuthUserService oAuthUserService;

    @BeforeEach
    void setUp() {
        doReturn(UUID.fromString(USER_UUID)).when(oAuthUserService)
                .extractUuidFromJwt(any());
    }

    @Test
    void createCategory() {
        String title = "Test Category";
        String description = "Test Description";
        Category category = Category.builder()
                .title(title)
                .description(description)
                .build();

        Category savedCategory = this.categoryService.createCategory(category, null);

        assertThat(savedCategory.getCreatedAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedCategory.getUpdatedAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedCategory.getTitle()).isEqualTo(title);
        assertThat(savedCategory.getDescription()).isEqualTo(description);
        assertThat(savedCategory.getUser().getOauthUserId()).isEqualTo(UUID.fromString(USER_UUID));
        assertThat(savedCategory.getTransactions())
                .isNotNull()
                .isEmpty();
    }

}
