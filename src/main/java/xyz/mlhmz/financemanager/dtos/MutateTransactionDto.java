package xyz.mlhmz.financemanager.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record MutateTransactionDto(
        String title,
        String description,
        Double amount,
        LocalDateTime timestamp,
        UUID sheetId
) {
}
