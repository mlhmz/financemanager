package xyz.mlhmz.financemanager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.mlhmz.financemanager.entities.Sheet;

import java.util.UUID;

public interface SheetRepository extends JpaRepository<Sheet, UUID> {
}
