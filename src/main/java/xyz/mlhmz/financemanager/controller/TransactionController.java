package xyz.mlhmz.financemanager.controller;

import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.mlhmz.financemanager.dtos.MutateTransactionDto;
import xyz.mlhmz.financemanager.dtos.QueryTransactionDto;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.mappers.TransactionMapper;
import xyz.mlhmz.financemanager.services.TransactionService;

@RestController
@RequestMapping("/api/v1/transactions")
@AllArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final TransactionMapper transactionMapper;

    @PostMapping
    public QueryTransactionDto createTransaction(@RequestBody MutateTransactionDto mutateTransactionDto,
                                                 @AuthenticationPrincipal Jwt jwt) {
        Transaction input = this.transactionMapper.mapMutateTransactionDtoToTransaction(mutateTransactionDto);
        Transaction transaction = this.transactionService.createTransaction(
                input,
                mutateTransactionDto.sheetId(),
                mutateTransactionDto.categoryId(),
                jwt
        );
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }
}
