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
import xyz.mlhmz.financemanager.exceptions.SheetNotFoundException;
import xyz.mlhmz.financemanager.repositories.SheetRepository;
import xyz.mlhmz.financemanager.util.FakeDataTestUtil;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doReturn;

class SheetServiceIntegrationTest extends PostgresContextContainerTest {
    private static final UUID USER_UUID = UUID.fromString("02ed4249-ac97-452a-8a74-b1e2af02f35d");

    @Autowired
    SheetService sheetService;
    @Autowired
    SheetRepository sheetRepository;
    @Autowired
    TransactionService transactionService;
    @MockBean
    Jwt jwt;

    @BeforeEach
    void setUp() {
        doReturn(USER_UUID.toString()).when(jwt).getSubject();
    }

    @AfterEach
    void tearDown() {
        sheetRepository.deleteAll();
    }

    @Test
    @DisplayName("createSheet() succeeds and all automatically filled fields are also filled")
    void createSheet() {
        String title = "Test Sheet";

        Sheet sheet = Sheet.builder()
                .title(title)
                .build();

        Sheet savedSheet = this.sheetService.createSheet(sheet, jwt);

        assertThat(savedSheet.getCreatedAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedSheet.getUpdatedAt()).isEqualToIgnoringMinutes(LocalDateTime.now());
        assertThat(savedSheet.getTitle()).isEqualTo(title);
        assertThat(savedSheet.getUser().getOauthUserId()).isEqualTo(USER_UUID);
        assertThat(savedSheet.getTransactions())
                .isNotNull()
                .isEmpty();
    }

    @Test
    @DisplayName("findAllCategories() finds all Created Objects")
    void findAllCategories() {
        List<Sheet> inputCategories = List.of(
                Sheet.builder()
                        .title("sheet")
                        .build(),
                Sheet.builder()
                        .title("sheet")
                        .build(),
                Sheet.builder()
                        .title("sheet")
                        .build()
        );
        inputCategories.forEach(sheet -> this.sheetService.createSheet(sheet, jwt));

        List<Sheet> categories = this.sheetService.findAllSheets(jwt);

        assertThat(categories)
                .isNotNull()
                .hasSize(3)
                .extracting(Sheet::getUser)
                .extracting(OAuthUser::getOauthUserId)
                .containsOnly(USER_UUID);
    }

    @Test
    @DisplayName("findSheetById() finds created object")
    void findSheetById() {
        String title = "sheet";
        Sheet inputSheet = Sheet.builder()
                .title(title)
                .build();

        UUID sheetUuid = this.sheetService.createSheet(inputSheet, jwt).getUuid();

        Sheet sheet = this.sheetService.findSheetByUUID(sheetUuid, jwt);

        assertThat(sheet.getUuid()).isEqualTo(sheetUuid);
        assertThat(sheet.getTitle()).isEqualTo(title);
        assertThat(sheet.getUser().getOauthUserId()).isEqualTo(USER_UUID);
    }

    @Test
    @DisplayName("findSheetById() with non-existing UUID result in SheetNotFoundException")
    void getSheetById_ThrowsSheetNotFoundExceptionOnNonExistingSheet() {
        UUID nonExistingSheetUuid = UUID.randomUUID();
        assertThatThrownBy(() -> this.sheetService.findSheetByUUID(nonExistingSheetUuid, jwt))
                .isInstanceOf(SheetNotFoundException.class);
    }

    @Test
    @DisplayName("updateSheet() succeeds and non updateable fields wont be updated")
    void updateSheet() {
        String title = "Test Sheet";
        Sheet sheet = Sheet.builder()
                .title(title)
                .build();

        Sheet savedSheet = this.sheetService.createSheet(sheet, jwt);
        LocalDateTime existingCreationDate = savedSheet.getCreatedAt();

        String newTitle = "Test Sheet";

        Sheet updateSheet = Sheet.builder()
                .title(newTitle)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .user(OAuthUser.builder().build())
                .build();

        Sheet updateResult = this.sheetService.updateSheet(savedSheet.getUuid(), updateSheet, jwt);

        // Check that non-updatable fields didn't get updated
        assertThat(updateResult.getCreatedAt()).isEqualTo(existingCreationDate);
        assertThat(updateResult.getUser().getOauthUserId()).isEqualTo(USER_UUID);

        // Check that updatable fields also got updated
        assertThat(updateResult.getTitle()).isEqualTo(newTitle);
    }

    @Test
    @DisplayName("Delete sheet succeeds")
    void deleteSheet() {
        Sheet sheet = Sheet.builder()
                .title("Test")
                .build();

        UUID sheetUuid = this.sheetService.createSheet(sheet, jwt).getUuid();

        assertThat(this.sheetRepository.findAll()).hasSize(1);

        this.sheetService.deleteSheetByUUID(sheetUuid, jwt);

        assertThat(this.sheetRepository.findAll()).isEmpty();
    }

    @Test
    void sumSheetTransactionsByUuidAndUser() {
        Sheet sheet = FakeDataTestUtil.createFakeSheet();

        sheet = this.sheetService.createSheet(sheet, jwt);

        Category category = FakeDataTestUtil.createFakeCategory();

        double firstAmount = 150.50;
        Transaction firstTransaction = FakeDataTestUtil.createFakeTransaction(firstAmount);
        double secondAmount = -40.00;
        Transaction secondTransaction = FakeDataTestUtil.createFakeTransaction( secondAmount);
        double thirdAmount = 20.00;
        Transaction thirdTransaction = FakeDataTestUtil.createFakeTransaction(thirdAmount);

        this.transactionService.createTransaction(firstTransaction, sheet.getUuid(), category.getUuid(), jwt);
        this.transactionService.createTransaction(secondTransaction, sheet.getUuid(), category.getUuid(), jwt);
        this.transactionService.createTransaction(thirdTransaction, sheet.getUuid(), category.getUuid(), jwt);

        assertThat(sheetService.sumSheetTransactionsByUuidAndUser(sheet.getUuid(), jwt))
                .isEqualTo(firstAmount + secondAmount + thirdAmount);
    }
}
