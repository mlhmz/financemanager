package xyz.mlhmz.financemanager.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import xyz.mlhmz.financemanager.entities.Category;

@Mapper(
        componentModel = "spring"
)
public interface CategoryMapper {
    void updateCategory(@MappingTarget Category existingCategory, Category newCategory);
}
