package xyz.mlhmz.financemanager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.entities.Transaction;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findTransactionsByUser(OAuthUser user);

    List<Transaction> findTransactionsByCategoryAndUser(Category category, OAuthUser user);

    Optional<Transaction> findTransactionByUuidAndUser(UUID uuid, OAuthUser user);
}
