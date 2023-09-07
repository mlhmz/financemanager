package xyz.mlhmz.financemanager.services;

import xyz.mlhmz.financemanager.entities.Sheet;

import java.util.List;
import java.util.UUID;

public interface SheetService {
    Sheet createSheet(Sheet sheet);

    List<Sheet> findAllSheets();

    Sheet findSheetByUUID(UUID uuid);

    Sheet updateSheet(UUID uuid, Sheet sheet);

    void deleteSheetByUUID(UUID uuid);

    Sheet addTransactionToSheet(Sheet sheet);

    Sheet removeTransactionFromSheet(Sheet sheet);
}
