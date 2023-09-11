package xyz.mlhmz.financemanager.services;

import lombok.AllArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import xyz.mlhmz.financemanager.entities.Sheet;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.exceptions.SheetNotContainingTransactionException;
import xyz.mlhmz.financemanager.exceptions.SheetNotFoundException;
import xyz.mlhmz.financemanager.mappers.SheetMapper;
import xyz.mlhmz.financemanager.repositories.SheetRepository;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class SheetServiceImpl implements SheetService {
    private final SheetRepository sheetRepository;
    private final OAuthUserService oAuthUserService;
    private final SheetMapper sheetMapper;

    @Override
    public Sheet createSheet(Sheet sheet, Jwt jwt) {
        sheet.setUser(this.oAuthUserService.findUserByJwt(jwt));
        return this.sheetRepository.save(sheet);
    }

    @Override
    public List<Sheet> findAllSheets(Jwt jwt) {
        return this.sheetRepository.findSheetsByUser(this.oAuthUserService.findUserByJwt(jwt));
    }

    @Override
    public Sheet findSheetByUUID(UUID uuid, Jwt jwt) {
        return this.sheetRepository.findSheetByUuidAndUser(uuid, this.oAuthUserService.findUserByJwt(jwt))
                .orElseThrow(SheetNotFoundException::new);
    }

    @Override
    public Sheet updateSheet(UUID uuid, Sheet newSheet, Jwt jwt) {
        Sheet existingSheet = this.findSheetByUUID(uuid, jwt);
        this.sheetMapper.updateSheet(existingSheet, newSheet);
        return this.sheetRepository.save(existingSheet);
    }

    @Override
    public void deleteSheetByUUID(UUID uuid, Jwt jwt) {
        Sheet sheet = this.findSheetByUUID(uuid, jwt);
        this.sheetRepository.delete(sheet);
    }

    @Override
    public Sheet addTransactionToSheet(UUID uuid, Transaction transaction, Jwt jwt) {
        Sheet sheet = this.findSheetByUUID(uuid, jwt);
        sheet.getTransactions().add(transaction);
        return this.sheetRepository.save(sheet);
    }

    @Override
    public Sheet removeTransactionFromSheet(UUID uuid, Transaction transaction, Jwt jwt) {
        Sheet sheet = this.findSheetByUUID(uuid, jwt);
        boolean success = sheet.getTransactions().remove(transaction);
        if (!success) {
            throw new SheetNotContainingTransactionException();
        }
        return this.sheetRepository.save(sheet);
    }
}
