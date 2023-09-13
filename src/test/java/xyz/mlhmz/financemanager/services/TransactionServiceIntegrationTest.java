package xyz.mlhmz.financemanager.services;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.jwt.Jwt;
import xyz.mlhmz.financemanager.PostgresContextContainerTest;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.entities.Sheet;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.exceptions.TransactionNotFoundException;
import xyz.mlhmz.financemanager.repositories.CategoryRepository;
import xyz.mlhmz.financemanager.repositories.SheetRepository;
import xyz.mlhmz.financemanager.repositories.TransactionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doReturn;

class TransactionServiceIntegrationTest extends PostgresContextContainerTest {
    private static final UUID USER_UUID = UUID.fromString("02ed4249-ac97-452a-8a74-b1e2af02f35d");

    @Autowired
    TransactionService transactionService;
    @Autowired
    SheetService sheetService;
    @Autowired
    CategoryService categoryService;
    @Autowired
    TransactionRepository transactionRepository;
    @Autowired
    SheetRepository sheetRepository;
    @Autowired
    CategoryRepository categoryRepository;
    @MockBean
    Jwt jwt;

    // Persisted default entities
    Sheet defaultSheet;
    Category defaultCategory;


    @BeforeEach
    void setUp() {
        doReturn(USER_UUID.toString()).when(jwt).getSubject();

        defaultSheet = this.sheetService.createSheet(Sheet
                .builder()
                .title("Test Title")
                .build(), jwt);
        defaultCategory = this.categoryService.createCategory(Category
                .builder()
                .title("Test Title")
                .description("Test Description")
                .build(), jwt);
    }

    @AfterEach
    void tearDown() {
        sheetRepository.deleteAll();
        transactionRepository.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    @DisplayName("createTransaction() succeeds and all automatically filled fields are also filled")
    void createTransaction() {
        String title = "Test Transaction";
        String description = "Test Description";
        Transaction transaction = Transaction.builder()
                .title(title)
                .description(description)
                .build();

        Transaction savedTransaction = this.transactionService.createTransaction(transaction, defaultSheet.getUuid(), defaultCategory.getUuid(), jwt);

        assertThat(savedTransaction.getCreatedAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedTransaction.getUpdatedAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedTransaction.getTitle()).isEqualTo(title);
        assertThat(savedTransaction.getDescription()).isEqualTo(description);
        assertThat(savedTransaction.getCategory().getUuid()).isEqualTo(defaultCategory.getUuid());
        assertThat(savedTransaction.getSheet().getUuid()).isEqualTo(defaultSheet.getUuid());
        assertThat(savedTransaction.getUser().getOauthUserId()).isEqualTo(USER_UUID);
    }

    @Test
    @DisplayName("findAllTransactions() finds all Created Objects")
    void findAllTransactions() {
        List<Transaction> inputTransactions = List.of(
                Transaction.builder()
                        .title("transaction")
                        .description("description")
                        .build(),
                Transaction.builder()
                        .title("transaction")
                        .description("description")
                        .build(),
                Transaction.builder()
                        .title("transaction")
                        .description("description")
                        .build()
        );
        inputTransactions.forEach(transaction -> this.transactionService.createTransaction(transaction, defaultSheet.getUuid(), defaultCategory.getUuid(), jwt));

        List<Transaction> transactions = this.transactionService.findAllTransactions(jwt);

        assertThat(transactions)
                .isNotNull()
                .hasSize(3)
                .extracting(Transaction::getUser)
                .extracting(OAuthUser::getOauthUserId)
                .containsOnly(USER_UUID);
    }

    @Test
    @DisplayName("findTransactionById() finds created object")
    void findTransactionById() {
        String title = "transaction";
        String description = "description";
        Transaction inputTransaction = Transaction.builder()
                .title(title)
                .description(description)
                .build();

        UUID transactionUuid = this.transactionService.createTransaction(
                inputTransaction, defaultSheet.getUuid(), defaultCategory.getUuid(), jwt
                ).getUuid();

        Transaction transaction = this.transactionService.findTransactionByUUID(transactionUuid, jwt);

        assertThat(transaction.getUuid()).isEqualTo(transactionUuid);
        assertThat(transaction.getTitle()).isEqualTo(title);
        assertThat(transaction.getDescription()).isEqualTo(description);
        assertThat(transaction.getUser().getOauthUserId()).isEqualTo(USER_UUID);
    }

    @Test
    @DisplayName("findTransactionById() with non-existing UUID result in TransactionNotFoundException")
    void getTransactionById_ThrowsTransactionNotFoundExceptionOnNonExistingTransaction() {
        UUID nonExistingTransactionUuid = UUID.randomUUID();
        assertThatThrownBy(() -> this.transactionService.findTransactionByUUID(nonExistingTransactionUuid, jwt))
                .isInstanceOf(TransactionNotFoundException.class);
    }

    @Test
    void moveTransactionToSheet() {
        Transaction transaction = Transaction.builder()
                .title("Test Transaction")
                .description("Test Description")
                .build();

        Transaction savedTransaction = this.transactionService.createTransaction(
                transaction,
                defaultSheet.getUuid(),
                defaultCategory.getUuid(),
                jwt
        );

        Sheet newSheetInput = Sheet.builder().title("New Sheet").build();
        Sheet newSheet = this.sheetService.createSheet(newSheetInput, jwt);

        Transaction movedTransaction = this.transactionService.moveTransactionToSheet(
                savedTransaction.getUuid(), newSheet.getUuid(), jwt
        );

        assertThat(movedTransaction.getSheet().getUuid()).isEqualTo(newSheet.getUuid());
    }

    @Test
    @DisplayName("updateTransaction() succeeds and non updateable fields wont be updated")
    void updateTransaction() {
        String title = "Test Transaction";
        String description = "Test Description";
        Transaction transaction = Transaction.builder()
                .title(title)
                .description(description)
                .build();

        Transaction savedTransaction = this.transactionService.createTransaction(
                transaction, defaultSheet.getUuid(), defaultCategory.getUuid(), jwt
        );
        LocalDateTime existingCreationDate = savedTransaction.getCreatedAt();

        String newTitle = "Test Transaction";
        String newDescription = "Test Description";

        Transaction updateTransaction = Transaction.builder()
                .title(newTitle)
                .description(newDescription)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(OAuthUser.builder().build())
                .build();

        Transaction updateResult = this.transactionService.updateTransaction(savedTransaction.getUuid(), updateTransaction, jwt);

        // Check that non-updatable fields didn't get updated
        assertThat(updateResult.getCreatedAt()).isEqualTo(existingCreationDate);
        assertThat(updateResult.getUser().getOauthUserId()).isEqualTo(USER_UUID);

        // Check that updatable fields also got updated
        assertThat(updateResult.getTitle()).isEqualTo(newTitle);
        assertThat(updateResult.getDescription()).isEqualTo(newDescription);
    }

    @Test
    @DisplayName("Delete transaction succeeds")
    void deleteTransaction() {
        Transaction transaction = Transaction.builder()
                .title("Test")
                .description("Test")
                .build();

        UUID transactionUuid = this.transactionService.createTransaction(
                transaction, defaultSheet.getUuid(), defaultCategory.getUuid(), jwt
        ).getUuid();

        assertThat(this.transactionRepository.findAll()).hasSize(1);

        this.transactionService.deleteTransactionByUuid(transactionUuid, jwt);

        assertThat(this.transactionRepository.findAll()).isEmpty();
    }
}
