package xyz.mlhmz.financemanager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.entities.Sheet;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SheetRepository extends JpaRepository<Sheet, UUID> {
    List<Sheet> findSheetsByUser(OAuthUser user);

    Optional<Sheet> findSheetByUuidAndUser(UUID uuid, OAuthUser user);

    @Query("select sum(t.amount) from Sheet s right join Transaction t on s.uuid = t.sheet.uuid where s.uuid = ?1 and s.user = ?2")
    Double sumSheetTransactionsByUuidAndUser(UUID uuid, OAuthUser oAuthUser);
}
