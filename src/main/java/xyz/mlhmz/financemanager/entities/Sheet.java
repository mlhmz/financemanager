package xyz.mlhmz.financemanager.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Sheet {
    @Id
    @UuidGenerator
    private UUID uuid;

    private String title;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @Builder.Default
    private List<Transaction> transactions = new ArrayList<>();

    @ManyToOne(optional = false)
    private OAuthUser user;
}
