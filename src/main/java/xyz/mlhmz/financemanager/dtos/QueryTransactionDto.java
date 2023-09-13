package xyz.mlhmz.financemanager.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record QueryTransactionDto (
        UUID uuid,
        String title,
        String description,
        Double amount,
        LocalDateTime timestamp,
        QueryCategoryDto category,
        QueryTransactionSheetDto sheet
) {
}
