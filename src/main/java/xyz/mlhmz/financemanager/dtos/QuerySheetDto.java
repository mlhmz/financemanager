package xyz.mlhmz.financemanager.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record QuerySheetDto (
        UUID uuid,
        String title,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }
