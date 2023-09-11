package xyz.mlhmz.financemanager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.mlhmz.financemanager.entities.OAuthUser;

import java.util.UUID;

public interface UserRepository extends JpaRepository<OAuthUser, UUID> {
}
