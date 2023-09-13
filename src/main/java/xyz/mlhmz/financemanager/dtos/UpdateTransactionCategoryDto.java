package xyz.mlhmz.financemanager.dtos;

import java.util.UUID;

public record UpdateTransactionCategoryDto(
        UUID transactionUuid,
        UUID categoryUuid
) {
}
