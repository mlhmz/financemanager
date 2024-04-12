package xyz.mlhmz.financemanager.util;

import org.jetbrains.annotations.Nullable;
import xyz.mlhmz.financemanager.entities.Category;
import xyz.mlhmz.financemanager.entities.Sheet;
import xyz.mlhmz.financemanager.entities.Transaction;

import java.util.Random;

public class FakeDataTestUtil {
    private static final String[] RANDOM_WORD_LIST = new String[]{
            "teacher", "revolution", "ability", "depth", "perception", "inspector", "diamond", "introduction", "basket",
            "breath", "fortune", "food", "data", "ear", "vehicle", "housing", "criticism", "freedom", "bonus",
            "employee", "quality", "perspective", "disaster", "office", "magazine", "bathroom", "piano", "outcome",
            "passenger", "efficiency", "safety", "platform", "thing", "college", "coffee", "obligation", "homework",
            "device", "championship", "industry", "suggestion", "road", "resolution", "sir", "flight"
    };


    private FakeDataTestUtil() {
    }

    public static Sheet createFakeSheet() {
        return Sheet.builder().title(getRandomWord()).build();
    }

    public static Category createFakeCategory() {
        return Category.builder().title(getRandomWord()).description(getRandomSentence()).build();
    }

    public static Transaction createFakeTransaction(@Nullable Double amount) {
        return Transaction.builder()
                .title(getRandomWord())
                .description(getRandomSentence())
                .amount(amount == null ? new Random().nextDouble(500) - new Random().nextDouble(500) : amount)
                .build();
    }

    private static String getRandomWord() {
        Random random = new Random();
        int word = random.nextInt(RANDOM_WORD_LIST.length);
        return RANDOM_WORD_LIST[word - 1];
    }

    private static String getRandomSentence() {
        Random random = new Random();
        int sentenceLength = random.nextInt(10);
        String[] sentence = new String[sentenceLength];
        for (int i = 0; i < sentenceLength; i++) {
            sentence[i] = getRandomWord();
        }
        return String.join(" ", sentence);
    }
}
