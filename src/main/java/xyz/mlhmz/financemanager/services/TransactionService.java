package xyz.mlhmz.financemanager.services;

import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.Transaction;

import java.util.List;
import java.util.UUID;

public interface TransactionService {
    Transaction createTransaction(Transaction transaction);

    List<Transaction> findAllTransactions(Transaction transaction);

    List<Transaction> findTransactionsByCategoryUUID(UUID uuid);

    List<Transaction> findTransactionsByCategory(Category category);

    Transaction findTransactionByUUID(UUID uuid);

    Transaction updateTransaction(UUID uuid, Transaction updateTransaction);

    void deleteTransactionByUuid(UUID uuid);
}
