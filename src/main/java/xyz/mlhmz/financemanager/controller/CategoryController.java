package xyz.mlhmz.financemanager.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public QueryCategoryDto createCategory(@RequestBody MutateCategoryDto mutateCategoryDto) {
        Category mappedCategory = this.categoryMapper.mapMutateCategoryDtoToCategory(mutateCategoryDto);
        Category category = categoryService.createCategory(mappedCategory);
        return this.categoryMapper.mapCategoryToQueryCategoryDto(category);
    }

    @GetMapping("/{uuid}")
    public QueryCategoryDto findCategoryByUuid(@PathVariable UUID uuid) {
        Category category = this.categoryService.findCategoryByUUID(uuid);
        return this.categoryMapper.mapCategoryToQueryCategoryDto(category);
    }

    @GetMapping
    public List<QueryCategoryDto> findAllCategories() {
        List<Category> categories = this.categoryService.findAllCategories();
        return this.categoryMapper.mapCategoryListToQueryCategoryList(categories);
    }

    @PutMapping("/{uuid}")
    public QueryCategoryDto updateCategory(@PathVariable UUID uuid, MutateCategoryDto mutateCategoryDto) {
        Category newCategory = this.categoryMapper.mapMutateCategoryDtoToCategory(mutateCategoryDto);
        Category category = this.categoryService.updateCategory(uuid, newCategory);
        return this.categoryMapper.mapCategoryToQueryCategoryDto(category);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategoryByUUID(@PathVariable UUID uuid) {
        this.categoryService.deleteCategoryByUuid(uuid);
    }
}
