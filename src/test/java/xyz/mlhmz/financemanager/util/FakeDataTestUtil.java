package xyz.mlhmz.financemanager.util;

import com.github.javafaker.Faker;
import org.jetbrains.annotations.Nullable;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.Sheet;
import xyz.mlhmz.financemanager.entities.Transaction;

public class FakeDataTestUtil {
    private FakeDataTestUtil() {
    }

    public static Sheet createFakeSheet() {
        Faker faker = new Faker();
        return Sheet.builder().title(faker.animal().name()).build();
    }

    public static Category createFakeCategory() {
        Faker faker = new Faker();
        return Category.builder().title(faker.animal().name()).description(faker.lorem().sentence()).build();
    }

    public static Transaction createFakeTransaction(@Nullable Double amount) {
        Faker faker = new Faker();
        return Transaction.builder()
                .title(faker.animal().name())
                .description(faker.lorem().sentence())
                .amount(amount != null ? amount : faker.random().nextDouble())
                .build();
    }

}
