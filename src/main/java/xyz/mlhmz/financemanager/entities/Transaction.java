package xyz.mlhmz.financemanager.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Transaction {
    @Id
    @UuidGenerator
    private UUID uuid;

    private String title;

    private String description;

    private Double amount;

    private LocalDateTime timestamp;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinTable(name = "category_transactions", joinColumns = {@JoinColumn(name = "transactions_uuid", referencedColumnName = "uuid")},
            inverseJoinColumns={@JoinColumn(name="category_uuid", referencedColumnName="uuid")})
    private Category category;

    @ManyToOne
    @JoinTable(name = "sheet_transactions", joinColumns = {@JoinColumn(name = "transactions_uuid", referencedColumnName = "uuid")},
            inverseJoinColumns={@JoinColumn(name="sheet_uuid", referencedColumnName="uuid")})
    private Sheet sheet;

    @ManyToOne(optional = false)
    private OAuthUser user;
}
