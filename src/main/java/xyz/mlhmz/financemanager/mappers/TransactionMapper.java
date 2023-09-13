package xyz.mlhmz.financemanager.mappers;

import org.mapstruct.*;
import xyz.mlhmz.financemanager.dtos.MutateTransactionDto;
import xyz.mlhmz.financemanager.dtos.QueryTransactionDto;
import xyz.mlhmz.financemanager.entities.Transaction;

import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface TransactionMapper {
    @Mapping(source = "sheet.uuid", target = "sheet.uuid")
    @Mapping(source = "sheet.title", target = "sheet.title")
    QueryTransactionDto mapTransactionToQueryTransactionDto(Transaction transaction);

    default List<QueryTransactionDto> mapTransactionListToQueryTransactionDtoList(List<Transaction> transactions) {
        return transactions.stream()
                .map(this::mapTransactionToQueryTransactionDto)
                .toList();
    }

    Transaction mapMutateTransactionDtoToTransaction(MutateTransactionDto mutateTransactionDto);

    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "title")
    @Mapping(target = "description")
    @Mapping(target = "amount")
    @Mapping(target = "timestamp")
    void updateTransaction(@MappingTarget Transaction existingTransaction, Transaction transaction);
}
