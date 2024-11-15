package xyz.mlhmz.financemanager.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.entities.Sheet;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.exceptions.TransactionNotFoundException;
import xyz.mlhmz.financemanager.filter.TransactionFilter;
import xyz.mlhmz.financemanager.mappers.TransactionMapper;
import xyz.mlhmz.financemanager.repositories.TransactionRepository;

import java.util.List;
import java.util.UUID;

import static xyz.mlhmz.financemanager.specifications.TransactionSpecification.fromTransactionFilter;
import static xyz.mlhmz.financemanager.specifications.TransactionSpecification.withUserInTransaction;

@Service
@AllArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final SheetService sheetService;
    private final CategoryService categoryService;
    private final OAuthUserService oAuthUserService;
    private final TransactionMapper transactionMapper;

    @Override
    public Transaction createTransaction(Transaction input, UUID sheetId, UUID categoryId, Jwt jwt) {
        OAuthUser user = oAuthUserService.findUserByJwt(jwt);
        input.setUser(user);
        input.setSheet(this.sheetService.findSheetByUUID(sheetId, jwt));
        setCategoryIntoTransactionOnCategoryIdNotNull(categoryId, jwt, input);
        return this.transactionRepository.save(input);
    }

    @Override
    public List<Transaction> findAllTransactions(Jwt jwt) {
        OAuthUser user = oAuthUserService.findUserByJwt(jwt);
        return this.transactionRepository.findTransactionsByUser(user);
    }

    @Override
    public List<Transaction> findAllTransactions(TransactionFilter filter, Jwt jwt) {
        OAuthUser user = oAuthUserService.findUserByJwt(jwt);
        Specification<Transaction> specification = withUserInTransaction(user);
        if (filter != null) {
            specification = specification.and(fromTransactionFilter(filter));
        }
        return this.transactionRepository.findAll(specification);
    }

    @Override
    public List<Transaction> findTransactionsByCategoryUUID(UUID uuid, Jwt jwt) {
        Category category = this.categoryService.findCategoryByUUID(uuid, jwt);
        return findTransactionsByCategory(category, jwt);
    }

    @Override
    public List<Transaction> findTransactionsByCategory(Category category, Jwt jwt) {
        OAuthUser user = oAuthUserService.findUserByJwt(jwt);
        return this.transactionRepository.findTransactionsByCategoryAndUser(category, user);
    }

    @Override
    @Transactional
    public List<Transaction> findTransactionsBySheet(UUID sheetUuid, Jwt jwt) {
        Sheet sheet = this.sheetService.findSheetByUUID(sheetUuid, jwt);
        return this.findTransactionsBySheet(sheet, jwt);
    }

    @Override
    @Transactional
    public List<Transaction> findTransactionsBySheet(Sheet sheet, Jwt jwt) {
        Hibernate.initialize(sheet.getTransactions());
        return sheet.getTransactions();
    }

    @Override
    public Transaction findTransactionByUUID(UUID uuid, Jwt jwt) {
        OAuthUser user = oAuthUserService.findUserByJwt(jwt);
        return this.transactionRepository.findTransactionByUuidAndUser(uuid, user)
                .orElseThrow(TransactionNotFoundException::new);
    }

    @Override
    public Transaction moveTransactionToSheet(UUID transactionId, UUID sheetId, Jwt jwt) {
        Transaction transaction = this.findTransactionByUUID(transactionId, jwt);
        transaction.setSheet(this.sheetService.findSheetByUUID(sheetId, jwt));
        return this.transactionRepository.save(transaction);
    }

    @Override
    public Transaction updateTransaction(UUID uuid, Transaction updateTransaction, Jwt jwt) {
        Transaction existingTransaction = this.findTransactionByUUID(uuid, jwt);
        this.transactionMapper.updateTransaction(existingTransaction, updateTransaction);
        return this.transactionRepository.save(existingTransaction);
    }

    @Override
    public Transaction updateTransactionCategory(UUID transactionId, UUID categoryId, Jwt jwt) {
        Transaction transaction = this.findTransactionByUUID(transactionId, jwt);
        Category category = this.categoryService.findCategoryByUUID(categoryId, jwt);
        transaction.setCategory(category);
        return this.transactionRepository.save(transaction);
    }

    @Override
    public void deleteTransactionByUuid(UUID uuid, Jwt jwt) {
        Transaction transaction = this.findTransactionByUUID(uuid, jwt);
        this.transactionRepository.delete(transaction);
    }

    private void setCategoryIntoTransactionOnCategoryIdNotNull(UUID categoryId, Jwt jwt, Transaction transaction) {
        if (categoryId != null) {
            Category category = this.categoryService.findCategoryByUUID(categoryId, jwt);
            transaction.setCategory(category);
        }
    }
}
