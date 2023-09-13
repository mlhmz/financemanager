package xyz.mlhmz.financemanager.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.entities.Sheet;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.exceptions.SheetNotContainingTransactionException;
import xyz.mlhmz.financemanager.mappers.SheetMapperImpl;
import xyz.mlhmz.financemanager.repositories.SheetRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doReturn;

@SpringBootTest(classes = {
        SheetServiceImpl.class,
        SheetMapperImpl.class
})
class SheetServiceImplTest {
    @Autowired
    SheetService sheetService;
    @MockBean
    SheetRepository sheetRepository;
    @MockBean
    OAuthUserService oAuthUserService;

    @BeforeEach
    void setUp() {
        doReturn(OAuthUser.builder()
                .oauthUserId(UUID.randomUUID())
                .build()
        ).when(oAuthUserService).findUserByJwt(any());
        doAnswer(method -> method.getArguments()[0]).when(sheetRepository).save(any());
    }

    @Test
    void addTransactionToSheet() {
        Transaction firstDummyTransaction = Transaction.builder()
                .uuid(UUID.randomUUID())
                .build();
        Transaction secondDummyTransaction = Transaction.builder()
                .uuid(UUID.randomUUID())
                .build();
        Transaction transactionToAdd = Transaction.builder()
                .uuid(UUID.randomUUID())
                .build();

        Sheet sheet = Sheet.builder()
                .transactions(new ArrayList<>(Arrays.asList(firstDummyTransaction, secondDummyTransaction)))
                .build();

        doReturn(Optional.of(sheet)).when(sheetRepository).findSheetByUuidAndUser(any(), any());

        Sheet result = sheetService.addTransactionToSheet(null, transactionToAdd, null);

        assertThat(result.getTransactions())
                .hasSize(3)
                .contains(firstDummyTransaction, secondDummyTransaction, transactionToAdd);
    }

    @Test
    void removeTransactionFromSheet() {
        Transaction firstDummyTransaction = Transaction.builder()
                .uuid(UUID.randomUUID())
                .build();
        Transaction transactionToRemove = Transaction.builder()
                .uuid(UUID.randomUUID())
                .build();
        Transaction secondDummyTransaction = Transaction.builder()
                .uuid(UUID.randomUUID())
                .build();

        Sheet sheet = Sheet.builder()
                .transactions(new ArrayList<>(Arrays.asList(firstDummyTransaction, transactionToRemove, secondDummyTransaction)))
                .build();

        doReturn(Optional.of(sheet)).when(sheetRepository).findSheetByUuidAndUser(any(), any());

        Sheet result = sheetService.removeTransactionFromSheet(null, transactionToRemove, null);

        assertThat(result.getTransactions())
                .hasSize(2)
                .contains(firstDummyTransaction, secondDummyTransaction)
                .doesNotContain(transactionToRemove);

        Transaction transaction = Transaction.builder().build();
        assertThatThrownBy(() -> sheetService.removeTransactionFromSheet(null, transaction, null))
                .isInstanceOf(SheetNotContainingTransactionException.class);
    }
}