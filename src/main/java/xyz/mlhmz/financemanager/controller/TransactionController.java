package xyz.mlhmz.financemanager.controller;

import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;
import xyz.mlhmz.financemanager.dtos.MoveTransactionToSheetDto;
import xyz.mlhmz.financemanager.dtos.MutateTransactionDto;
import xyz.mlhmz.financemanager.dtos.QueryTransactionDto;
import xyz.mlhmz.financemanager.dtos.UpdateTransactionCategoryDto;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.filter.TransactionFilterInput;
import xyz.mlhmz.financemanager.mappers.TransactionMapper;
import xyz.mlhmz.financemanager.services.TransactionService;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final TransactionMapper transactionMapper;

    @MutationMapping
    public QueryTransactionDto createTransaction(@Argument MutateTransactionDto payload,
                                                 @AuthenticationPrincipal Jwt jwt) {
        Transaction input = this.transactionMapper.mapMutateTransactionDtoToTransaction(payload);
        Transaction transaction = this.transactionService.createTransaction(
                input,
                payload.sheetId(),
                payload.categoryId(),
                jwt
        );
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }

    @QueryMapping
    public List<QueryTransactionDto> findAllTransactions(
            @Argument TransactionFilterInput filter,
            @AuthenticationPrincipal Jwt jwt
    ) {
        List<Transaction> transactions = this.transactionService.findAllTransactions(filter, jwt);
        return this.transactionMapper.mapTransactionListToQueryTransactionDtoList(transactions);
    }

    @QueryMapping
    public QueryTransactionDto findTransactionByUUID(@Argument UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        Transaction transaction = this.transactionService.findTransactionByUUID(uuid, jwt);
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }

    @MutationMapping
    public QueryTransactionDto updateTransactionByUUID(
            @Argument UUID uuid,
            @Argument MutateTransactionDto payload,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Transaction input = this.transactionMapper.mapMutateTransactionDtoToTransaction(payload);
        Transaction transaction = this.transactionService.updateTransaction(uuid, input, jwt);
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }

    @MutationMapping
    public QueryTransactionDto updateTransactionCategory(
            @Argument UpdateTransactionCategoryDto payload,
            @AuthenticationPrincipal Jwt jwt
            ) {
        Transaction transaction = this.transactionService.updateTransactionCategory(
                payload.transactionUuid(),
                payload.categoryUuid(),
                jwt
        );
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }

    @MutationMapping
    public QueryTransactionDto moveTransactionToSheet(
            @Argument MoveTransactionToSheetDto payload,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Transaction transaction = this.transactionService.moveTransactionToSheet(
                payload.transactionUuid(), payload.sheetUuid(), jwt
        );
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }

    @MutationMapping
    public boolean deleteTransactionByUUID(
            @Argument UUID uuid,
            @AuthenticationPrincipal Jwt jwt
    ) {
        this.transactionService.deleteTransactionByUuid(uuid, jwt);
        return true;
    }
}
