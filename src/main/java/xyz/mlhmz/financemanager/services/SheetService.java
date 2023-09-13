package xyz.mlhmz.financemanager.services;

import org.springframework.security.oauth2.jwt.Jwt;
import xyz.mlhmz.financemanager.entities.Sheet;

import java.util.List;
import java.util.UUID;

public interface SheetService {
    Sheet createSheet(Sheet sheet, Jwt jwt);

    List<Sheet> findAllSheets(Jwt jwt);

    Sheet findSheetByUUID(UUID uuid, Jwt jwt);

    Sheet updateSheet(UUID uuid, Sheet sheet, Jwt jwt);

    void deleteSheetByUUID(UUID uuid, Jwt jwt);
}
