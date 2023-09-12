package xyz.mlhmz.financemanager.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class OAuthUser {
    @Id
    @NotNull
    private UUID oauthUserId;

    @OneToMany(mappedBy = "user")
    private List<Category> categories;

    @OneToMany(mappedBy = "user")
    private List<Sheet> sheets;

    @OneToMany(mappedBy = "user")
    private List<Transaction> transactions;
}
