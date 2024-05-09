package xyz.mlhmz.financemanager.specifications;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import xyz.mlhmz.financemanager.entities.OAuthUser;
import xyz.mlhmz.financemanager.entities.Transaction;
import xyz.mlhmz.financemanager.filter.TransactionFilter;

import java.util.Optional;
import java.util.stream.Stream;

public class TransactionSpecification {
    public static Specification<Transaction> fromTransactionFilter(TransactionFilter filter) {
        return (root, query, criteriaBuilder) -> {
            Optional<Predicate> categoryIdPredicate = filter.getCategoryId().map(uuid -> criteriaBuilder.equal(root.join("category").get("uuid"), uuid));
            Optional<Predicate> sheetIdPredicate = filter.getSheetId().map(uuid -> criteriaBuilder.equal(root.join("sheet").get("uuid"), uuid));
            return Stream.of(categoryIdPredicate, sheetIdPredicate)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .reduce(criteriaBuilder::and)
                    .orElse(criteriaBuilder.conjunction());
        };
    }

    public static Specification<Transaction> withUserInTransaction(OAuthUser oAuthUser) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.join("user").get("oauthUserId"),
                oAuthUser.getOauthUserId());
    }
}
