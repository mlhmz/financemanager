package xyz.mlhmz.financemanager.filter;

import java.util.Optional;
import java.util.UUID;

public record TransactionFilterInput(UUID sheetId, UUID categoryId) implements TransactionFilter {
    public Optional<UUID> getSheetId() {
        return Optional.ofNullable(sheetId);
    }

    public Optional<UUID> getCategoryId() {
        return Optional.ofNullable(categoryId);
    }
}
