package xyz.mlhmz.financemanager.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findAllByUser(User user);
    Optional<Category> findByUuidAndUser(UUID uuid, User user);
}
