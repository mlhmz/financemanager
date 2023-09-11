package xyz.mlhmz.financemanager.mappers;

import org.mapstruct.*;
import xyz.mlhmz.financemanager.dtos.MutateSheetDto;
import xyz.mlhmz.financemanager.dtos.QuerySheetDto;
import xyz.mlhmz.financemanager.entities.Sheet;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface SheetMapper {
    QuerySheetDto mapSheetToQuerySheetDto(Sheet sheet);

    Sheet mapMutateSheetDtoToSheet(MutateSheetDto mutateSheetDto);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "title")
    void updateSheet(@MappingTarget Sheet existingSheet, Sheet newSheet);
}
