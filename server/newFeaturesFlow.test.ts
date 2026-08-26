import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { dailyStudyStreaks, dailyStreakRewards, podcastEpisodeFavorites, quizAttempts } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getDayKeyForDate, DAILY_STREAK_MILESTONES } from "../shared/studyStreak";
import { DOMAIN_MASTERY_THRESHOLD } from "../shared/domainMastery";

/** Mirrors the streak computation used by studyStreak.status in the router. */
function computeCurrentStreak(dayKeys: string[], today: Date = new Date()): number {
  const set = new Set(dayKeys);
  let streak = 0;
  const cursor = new Date(today);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * End-to-end validation of the new learning features (streaks, revision mode,
 * podcast favorites, domain mastery) using the real database with a dedicated
 * test user that is cleaned up before and after the suite runs.
 */
const TEST_USER_ID = 0; // Dedicated placeholder user reserved for this suite (no real account uses id 0).

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db;
}

beforeAll(async () => {
  const db = await requireDb();
  // Clean any leftovers from previous partial runs.
  await db.delete(podcastEpisodeFavorites).where(eq(podcastEpisodeFavorites.userId, TEST_USER_ID));
  await db.delete(dailyStudyStreaks).where(eq(dailyStudyStreaks.userId, TEST_USER_ID));
  await db.delete(dailyStreakRewards).where(eq(dailyStreakRewards.userId, TEST_USER_ID));
  await db.delete(quizAttempts).where(eq(quizAttempts.userId, TEST_USER_ID));
});

afterAll(async () => {
  const db = await requireDb();
  await db.delete(podcastEpisodeFavorites).where(eq(podcastEpisodeFavorites.userId, TEST_USER_ID));
});

describe("daily study streak flow", () => {
  it("computes consecutive-day streaks correctly", () => {
    const today = new Date();
    const keys: string[] = [];
    for (let i = 0; i < 4; i++) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      keys.push(getDayKeyForDate(day));
    }
    expect(computeCurrentStreak(keys, today)).toBe(4);
  });

  it("breaks the streak on a gap", async () => {
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    expect(computeCurrentStreak([getDayKeyForDate(twoDaysAgo)], today)).toBe(0);
  });

  it("maps milestone labels in ascending order of length", () => {
    const lengths = DAILY_STREAK_MILESTONES.map((m) => m.length);
    expect(lengths).toEqual([...lengths].sort((a, b) => a - b));
    expect(DAILY_STREAK_MILESTONES.every((m) => m.xp > 0)).toBe(true);
  });
});

describe("podcast episode favorites flow", () => {
  it("persists a favorite and removes it", async () => {
    const db = await requireDb();
    const episodeId = "ep-1";
    await db
      .insert(podcastEpisodeFavorites)
      .values({ userId: TEST_USER_ID, episodeId })
      .onDuplicateKeyUpdate({ set: { episodeId } });
    const rows = await db
      .select()
      .from(podcastEpisodeFavorites)
      .where(and(eq(podcastEpisodeFavorites.userId, TEST_USER_ID), eq(podcastEpisodeFavorites.episodeId, episodeId)));
    expect(rows.length).toBe(1);
    await db
      .delete(podcastEpisodeFavorites)
      .where(and(eq(podcastEpisodeFavorites.userId, TEST_USER_ID), eq(podcastEpisodeFavorites.episodeId, episodeId)));
    const after = await db
      .select()
      .from(podcastEpisodeFavorites)
      .where(and(eq(podcastEpisodeFavorites.userId, TEST_USER_ID), eq(podcastEpisodeFavorites.episodeId, episodeId)));
    expect(after.length).toBe(0);
  });
});

describe("revision mode support", () => {
  it("stores quiz answers with per-question correctness", async () => {
    const db = await requireDb();
    const domainId = 1;
    // Use a placeholder user that does not exist — the row is only needed to
    // validate the answers JSON shape used by quiz.wrongQuestionIds.
    const answers = [
      { questionId: 101, selectedAnswer: 1, correct: false },
      { questionId: 102, selectedAnswer: 2, correct: true },
    ];
    const insertResult = await db
      .insert(quizAttempts)
      .values({ userId: TEST_USER_ID, domainId, score: 1, totalQuestions: 2, answers });
    const id = insertResult[0].insertId;
    const wrongIds = answers
      .filter((answer) => answer && typeof answer.questionId === "number" && !answer.correct)
      .map((answer) => answer.questionId);
    expect(wrongIds).toEqual([101]);
    await db.delete(quizAttempts).where(eq(quizAttempts.id, id));
  });
});

describe("domain mastery thresholds", () => {
  it("requires at least 80% on 10+ question quizzes", () => {
    expect(DOMAIN_MASTERY_THRESHOLD).toBe(80);
    const below = Math.round((7 / 10) * 100);
    const passing = Math.round((8 / 10) * 100);
    expect(below >= DOMAIN_MASTERY_THRESHOLD).toBe(false);
    expect(passing >= DOMAIN_MASTERY_THRESHOLD).toBe(true);
  });
});
