package xyz.mlhmz.financemanager.controller;

import io.micrometer.common.util.StringUtils;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import xyz.mlhmz.financemanager.dtos.MoveTransactionToSheetDto;
import xyz.mlhmz.financemanager.dtos.MutateTransactionDto;
import xyz.mlhmz.financemanager.dtos.QueryTransactionDto;
import xyz.mlhmz.financemanager.dtos.UpdateTransactionCategoryDto;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.mappers.TransactionMapper;
import xyz.mlhmz.financemanager.services.TransactionService;

import java.util.List;
import java.util.UUID;

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

    @GetMapping
    public List<QueryTransactionDto> findAllTransactions(
            @RequestParam(name = "categoryUuid", required = false) String categoryUuid,
            @AuthenticationPrincipal Jwt jwt
    ) {
        List<Transaction> transactions;
        if (StringUtils.isNotEmpty(categoryUuid)) {
            transactions = this.transactionService.findTransactionsByCategoryUUID(UUID.fromString(categoryUuid), jwt);
        } else {
            transactions = this.transactionService.findAllTransactions(jwt);
        }
        return this.transactionMapper.mapTransactionListToQueryTransactionDtoList(transactions);
    }

    @GetMapping("/{uuid}")
    public QueryTransactionDto findTransactionByUUID(@PathVariable UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        Transaction transaction = this.transactionService.findTransactionByUUID(uuid, jwt);
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }

    @PutMapping("/{uuid}")
    public QueryTransactionDto updateTransactionByUUID(
            @PathVariable UUID uuid,
            @RequestBody MutateTransactionDto mutateTransactionDto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Transaction input = this.transactionMapper.mapMutateTransactionDtoToTransaction(mutateTransactionDto);
        Transaction transaction = this.transactionService.updateTransaction(uuid, input, jwt);
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }

    @PatchMapping("/category")
    public QueryTransactionDto updateTransactionCategory(
            @RequestBody UpdateTransactionCategoryDto updateTransactionCategoryDto,
            @AuthenticationPrincipal Jwt jwt
            ) {
        Transaction transaction = this.transactionService.updateTransactionCategory(
                updateTransactionCategoryDto.transactionUuid(),
                updateTransactionCategoryDto.categoryUuid(),
                jwt
        );
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }

    @PatchMapping("/sheet")
    public QueryTransactionDto moveTransactionToSheet(
            @RequestBody MoveTransactionToSheetDto moveTransactionToSheetDto,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Transaction transaction = this.transactionService.moveTransactionToSheet(
                moveTransactionToSheetDto.transactionUuid(), moveTransactionToSheetDto.sheetUuid(), jwt
        );
        return this.transactionMapper.mapTransactionToQueryTransactionDto(transaction);
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransactionByUUID(
            @PathVariable UUID uuid,
            @AuthenticationPrincipal Jwt jwt
    ) {
        this.transactionService.deleteTransactionByUuid(uuid, jwt);
    }
}
