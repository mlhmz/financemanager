package xyz.mlhmz.financemanager.services;

import org.springframework.security.oauth2.jwt.Jwt;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.Sheet;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.filter.TransactionFilter;

import java.util.List;
import java.util.UUID;

public interface TransactionService {
    Transaction createTransaction(Transaction transaction, UUID sheet, UUID categoryId, Jwt jwt);

    List<Transaction> findAllTransactions(Jwt jwt);

    List<Transaction> findAllTransactions(TransactionFilter filter, Jwt jwt);

    List<Transaction> findTransactionsByCategoryUUID(UUID uuid, Jwt jwt);

    List<Transaction> findTransactionsByCategory(Category category, Jwt jwt);

    List<Transaction> findTransactionsBySheet(UUID sheetUuid, Jwt jwt);

    List<Transaction> findTransactionsBySheet(Sheet sheet, Jwt jwt);

    Transaction findTransactionByUUID(UUID uuid, Jwt jwt);

    Transaction moveTransactionToSheet(UUID transactionId, UUID sheetId, Jwt jwt);

    Transaction updateTransaction(UUID uuid, Transaction updateTransaction, Jwt jwt);

    Transaction updateTransactionCategory(UUID transactionId, UUID categoryId, Jwt jwt);

    void deleteTransactionByUuid(UUID uuid, Jwt jwt);
}
