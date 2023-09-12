package xyz.mlhmz.financemanager.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/v1/categories")
@AllArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QueryCategoryDto createCategory(@RequestBody MutateCategoryDto mutateCategoryDto,
                                           @AuthenticationPrincipal Jwt jwt) {
        Category mappedCategory = this.categoryMapper.mapMutateCategoryDtoToCategory(mutateCategoryDto);
        Category category = categoryService.createCategory(mappedCategory, jwt);
        return this.categoryMapper.mapCategoryToQueryCategoryDto(category);
    }

    @GetMapping("/{uuid}")
    public QueryCategoryDto findCategoryByUuid(@PathVariable UUID uuid,
                                               @AuthenticationPrincipal Jwt jwt) {
        Category category = this.categoryService.findCategoryByUUID(uuid, jwt);
        return this.categoryMapper.mapCategoryToQueryCategoryDto(category);
    }

    @GetMapping
    public List<QueryCategoryDto> findAllCategories(@AuthenticationPrincipal Jwt jwt) {
        List<Category> categories = this.categoryService.findAllCategoriesByJwt(jwt);
        return this.categoryMapper.mapCategoryListToQueryCategoryList(categories);
    }

    @PutMapping("/{uuid}")
    public QueryCategoryDto updateCategory(@PathVariable UUID uuid, @RequestBody MutateCategoryDto mutateCategoryDto,
                                           @AuthenticationPrincipal Jwt jwt) {
        Category newCategory = this.categoryMapper.mapMutateCategoryDtoToCategory(mutateCategoryDto);
        Category category = this.categoryService.updateCategory(uuid, newCategory, jwt);
        return this.categoryMapper.mapCategoryToQueryCategoryDto(category);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategoryByUUID(@PathVariable UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        this.categoryService.deleteCategoryByUuid(uuid, jwt);
    }
}
