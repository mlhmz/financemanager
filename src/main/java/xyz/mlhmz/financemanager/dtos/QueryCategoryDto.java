package xyz.mlhmz.financemanager.dtos;

import java.time.LocalDateTime;

public record QueryCategoryDto (
        String title,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) { }
