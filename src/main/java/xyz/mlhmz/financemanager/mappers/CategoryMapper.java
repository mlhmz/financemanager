package xyz.mlhmz.financemanager.mappers;

import org.mapstruct.*;
import xyz.mlhmz.financemanager.dtos.MutateCategoryDto;
import xyz.mlhmz.financemanager.dtos.QueryCategoryDto;
import xyz.mlhmz.financemanager.entities.Category;

import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface CategoryMapper {
    Category mapMutateCategoryDtoToCategory(MutateCategoryDto mutateCategoryDto);

    QueryCategoryDto mapCategoryToQueryCategoryDto(Category category);

    default List<QueryCategoryDto> mapCategoryListToQueryCategoryList(List<Category> categories) {
        return categories.stream()
                .map(this::mapCategoryToQueryCategoryDto)
                .toList();
    }

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "title")
    @Mapping(target = "description")
    void updateCategory(@MappingTarget Category existingCategory, Category newCategory);
}
