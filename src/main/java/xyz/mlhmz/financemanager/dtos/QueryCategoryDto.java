package xyz.mlhmz.financemanager.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record QueryCategoryDto (
        UUID uuid,
        String title,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }
