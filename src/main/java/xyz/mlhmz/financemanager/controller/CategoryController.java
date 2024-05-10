package xyz.mlhmz.financemanager.controller;

import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import xyz.mlhmz.financemanager.dtos.MutateCategoryDto;
import xyz.mlhmz.financemanager.dtos.QueryCategoryDto;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.mappers.CategoryMapper;
import xyz.mlhmz.financemanager.services.CategoryService;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @MutationMapping
    public QueryCategoryDto createCategory(@Argument MutateCategoryDto payload,
                                           @AuthenticationPrincipal Jwt jwt) {
        Category mappedCategory = this.categoryMapper.mapMutateCategoryDtoToCategory(payload);
        Category category = categoryService.createCategory(mappedCategory, jwt);
        return this.categoryMapper.mapCategoryToQueryCategoryDto(category);
    }

    @QueryMapping
    public QueryCategoryDto findCategoryByUuid(@Argument UUID uuid,
                                               @AuthenticationPrincipal Jwt jwt) {
        Category category = this.categoryService.findCategoryByUUID(uuid, jwt);
        return this.categoryMapper.mapCategoryToQueryCategoryDto(category);
    }

    @QueryMapping
    public List<QueryCategoryDto> findAllCategories(@AuthenticationPrincipal Jwt jwt) {
        List<Category> categories = this.categoryService.findAllCategoriesByJwt(jwt);
        return this.categoryMapper.mapCategoryListToQueryCategoryList(categories);
    }

    @MutationMapping
    public QueryCategoryDto updateCategory(@Argument UUID uuid, @Argument MutateCategoryDto payload,
                                           @AuthenticationPrincipal Jwt jwt) {
        Category newCategory = this.categoryMapper.mapMutateCategoryDtoToCategory(payload);
        Category category = this.categoryService.updateCategory(uuid, newCategory, jwt);
        return this.categoryMapper.mapCategoryToQueryCategoryDto(category);
    }

    @MutationMapping
    public boolean deleteCategoryByUuid(@Argument UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        this.categoryService.deleteCategoryByUuid(uuid, jwt);
        return true;
    }
}
