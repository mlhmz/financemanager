package xyz.mlhmz.financemanager.filter;

import java.util.Optional;
import java.util.UUID;

public interface TransactionFilter {
    Optional<UUID> getSheetId();
    Optional<UUID> getCategoryId();
}
