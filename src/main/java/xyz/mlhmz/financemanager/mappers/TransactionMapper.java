package xyz.mlhmz.financemanager.mappers;

import org.mapstruct.*;
import xyz.mlhmz.financemanager.dtos.MutateTransactionDto;
import xyz.mlhmz.financemanager.dtos.QueryTransactionDto;
import xyz.mlhmz.financemanager.entities.Transaction;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface TransactionMapper {
    QueryTransactionDto mapTransactionToQueryTransactionDto(Transaction transaction);

    Transaction mapMutateTransactionDtoToTransaction(MutateTransactionDto mutateTransactionDto);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "title")
    @Mapping(target = "description")
    @Mapping(target = "amount")
    @Mapping(target = "timestamp")
    void updateTransaction(@MappingTarget Transaction existingTransaction, Transaction transaction);
}
