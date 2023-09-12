package xyz.mlhmz.financemanager.mappers;

import org.mapstruct.*;
import xyz.mlhmz.financemanager.entities.Transaction;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface TransactionMapper {
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "title")
    @Mapping(target = "description")
    @Mapping(target = "amount")
    @Mapping(target = "timestamp")
    void updateTransaction(@MappingTarget Transaction existingTransaction, Transaction transaction);
}
