package xyz.mlhmz.financemanager.dtos;

import java.util.UUID;

public record QueryTransactionSheetDto (
    UUID uuid,
    String title
) {}
