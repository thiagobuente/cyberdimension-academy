import { describe, expect, it } from "vitest";
import {
  computeFlashcardNextStage,
  FLASHCARD_SRS_INTERVAL_DAYS,
  FLASHCARD_SRS_MAX_STAGE,
} from "./db";

describe("flashcard spaced-repetition logic", () => {
  it("uses a growing interval ladder of six stages", () => {
    expect(FLASHCARD_SRS_INTERVAL_DAYS).toEqual([0, 1, 3, 7, 14, 30]);
    expect(FLASHCARD_SRS_MAX_STAGE).toBe(5);
  });

  it("advances the stage when the learner remembers the card", () => {
    expect(computeFlashcardNextStage(0, true)).toEqual({ stage: 1, intervalDays: 1 });
    expect(computeFlashcardNextStage(1, true)).toEqual({ stage: 2, intervalDays: 3 });
    expect(computeFlashcardNextStage(2, true)).toEqual({ stage: 3, intervalDays: 7 });
    expect(computeFlashcardNextStage(3, true)).toEqual({ stage: 4, intervalDays: 14 });
    expect(computeFlashcardNextStage(4, true)).toEqual({ stage: 5, intervalDays: 30 });
  });

  it("caps the stage at the maximum when the learner remembers a mastered card", () => {
    const result = computeFlashcardNextStage(5, true);
    expect(result.stage).toBe(5);
    expect(result.intervalDays).toBe(30);
  });

  it("drops the stage when the learner forgets the card", () => {
    expect(computeFlashcardNextStage(1, false)).toEqual({ stage: 0, intervalDays: 0 });
    expect(computeFlashcardNextStage(3, false)).toEqual({ stage: 2, intervalDays: 3 });
    expect(computeFlashcardNextStage(5, false)).toEqual({ stage: 4, intervalDays: 14 });
  });

  it("keeps a brand-new forgotten card at stage zero", () => {
    expect(computeFlashcardNextStage(0, false)).toEqual({ stage: 0, intervalDays: 0 });
  });
});
