package xyz.mlhmz.financemanager.dtos;

import java.util.UUID;

public record MoveTransactionToSheetDto(
        UUID transactionUuid,
        UUID sheetUuid
) {
}
