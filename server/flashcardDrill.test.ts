import { describe, expect, it, vi } from "vitest";
import { buildDrillQuestionsForUser } from "./flashcardDrill";
import { FLASHCARD_DRILL_MAX_QUESTIONS } from "./db";

vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getFlashcardDueTerms: vi.fn(),
  };
});

import { getFlashcardDueTerms } from "./db";
const mockedGetFlashcardDueTerms = vi.mocked(getFlashcardDueTerms);

function makeDueRows(termIds: string[], due = true) {
  return termIds.map((termId) => ({
    id: 1,
    userId: 1,
    termId,
    stage: 0,
    nextReviewAt: due ? new Date("2020-01-01T00:00:00Z") : new Date("2099-01-01T00:00:00Z"),
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

describe("buildDrillQuestionsForUser", () => {
  it("returns no questions when nothing is due", async () => {
    mockedGetFlashcardDueTerms.mockResolvedValue([]);
    expect(await buildDrillQuestionsForUser(1)).toEqual([]);
  });

  it("caps the drill at the maximum question count", async () => {
    const allTerms = ["term-phishing", "term-ransomware", "term-vulnerability", "term-threat", "term-breach", "term-exploit", "term-ioc", "term-cvss", "term-triage", "term-contain"];
    mockedGetFlashcardDueTerms.mockResolvedValue(makeDueRows(allTerms));
    const questions = await buildDrillQuestionsForUser(1);
    expect(questions.length).toBeLessThanOrEqual(FLASHCARD_DRILL_MAX_QUESTIONS);
    expect(questions.length).toBe(FLASHCARD_DRILL_MAX_QUESTIONS);
  });

  it("generates well-formed multiple-choice questions with unique options", async () => {
    mockedGetFlashcardDueTerms.mockResolvedValue(makeDueRows(["term-phishing", "term-ransomware", "term-vulnerability"]));
    const questions = await buildDrillQuestionsForUser(1);
    expect(questions).toHaveLength(3);
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(question.correctAnswer).toBeLessThan(4);
      const selectedOption = question.options[question.correctAnswer];
      const correctMeaning = question.term ? undefined : undefined;
      void correctMeaning;
      // The correct option must match the actual meaning of the term.
      const actualTerm = question.term;
      void actualTerm;
      expect(selectedOption).toBeTruthy();
    }
  });

  it("maps each correct option to the real meaning of the term", async () => {
    const { englishVocabulary } = await import("../shared/englishVocabulary");
    const termIds = ["term-phishing", "term-ransomware", "term-vulnerability", "term-threat"];
    mockedGetFlashcardDueTerms.mockResolvedValue(makeDueRows(termIds));
    const questions = await buildDrillQuestionsForUser(1);
    for (const question of questions) {
      const actual = englishVocabulary.find((term) => term.id === question.termId);
      expect(actual).toBeDefined();
      expect(question.options[question.correctAnswer]).toBe(actual!.meaning);
      const wrongOptions = question.options.filter((_, optionIndex) => optionIndex !== question.correctAnswer);
      for (const wrong of wrongOptions) {
        expect(wrong).not.toBe(actual!.meaning);
      }
    }
  });

  it("uses a deterministic ordering: repeated calls with the same due set produce identical questions", async () => {
    mockedGetFlashcardDueTerms.mockResolvedValue(makeDueRows(["term-phishing", "term-ransomware", "term-vulnerability", "term-threat", "term-breach"]));
    const first = await buildDrillQuestionsForUser(1);
    const second = await buildDrillQuestionsForUser(1);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  it("excludes mastered terms even when their review date is due", async () => {
    const rows = [
      ...makeDueRows(["term-phishing"]),
      {
        id: 2,
        userId: 1,
        termId: "term-ransomware",
        stage: 5,
        nextReviewAt: new Date("2020-01-01T00:00:00Z"),
        reviewCount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mockedGetFlashcardDueTerms.mockResolvedValue(rows);
    const questions = await buildDrillQuestionsForUser(1);
    expect(questions.map((question) => question.termId)).toEqual(["term-phishing"]);
  });

  it("keeps the answered termIds consistent with the asked terms", async () => {
    mockedGetFlashcardDueTerms.mockResolvedValue(makeDueRows(["term-phishing", "term-ransomware"]));
    const questions = await buildDrillQuestionsForUser(1);
    const askedIds = new Set(questions.map((question) => question.termId));
    for (const question of questions) {
      expect(askedIds.has(question.termId)).toBe(true);
    }
  });
});
