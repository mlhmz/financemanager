package xyz.mlhmz.financemanager.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.repositories.TransactionRepository;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest(classes = {
        TransactionServiceImpl.class
})
class TransactionServiceImplTest {
    @Autowired
    TransactionService transactionService;
    @MockBean
    TransactionRepository transactionRepository;
    @MockBean
    SheetService sheetService;
    @MockBean
    CategoryService categoryService;
    @MockBean
    OAuthUserService oAuthUserService;

    @BeforeEach
    void setUp() {
        doReturn(OAuthUser.builder()
                .oauthUserId(UUID.randomUUID())
                .build()
        ).when(oAuthUserService).findUserByJwt(any());
    }

    @Test
    void createTransaction_GetsAddedToSheet() {
        Transaction transaction = Transaction.builder().build();
        UUID sheetId = UUID.randomUUID();
        transactionService.createTransaction(transaction, sheetId, , null, );
        verify(sheetService, times(1)).addTransactionToSheet(sheetId, transaction, null);
    }
}