package xyz.mlhmz.financemanager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.entities.Sheet;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SheetRepository extends JpaRepository<Sheet, UUID> {
    List<Sheet> findSheetsByUser(OAuthUser user);

    Optional<Sheet> findSheetByUuidAndUser(UUID uuid, OAuthUser user);
}
