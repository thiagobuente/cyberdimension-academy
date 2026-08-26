import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { User } from "../drizzle/schema";

function makeCaller() {
  return appRouter.createCaller({
    user: {
      id: 42,
      openId: "test-open-id",
      name: "Test User",
      email: "test@example.com",
      role: "user",
    } as unknown as User,
    req: {} as never,
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as never,
  });
}

describe("Podcast quiz and weekly ranking flows", () => {
  it("public list still exposes the full 88-episode catalog (sessenta regulares, dois especiais, cinco Raio-X e vinte e um especiais English)", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });
    const list = await caller.podcast.list();
    expect(list.length).toBe(88);
  });

  it("quiz query returns five public questions without the answer key", async () => {
    const caller = makeCaller();
    const { questions } = await caller.podcast.quiz({ episodeId: "ep01-general-security" });
    expect(questions.length).toBe(5);
    for (const question of questions) {
      expect((question as Record<string, unknown>).prompt).toBeTruthy();
      expect((question as Record<string, unknown>).correctAnswer).toBeUndefined();
    }
  });

  it("quiz query rejects unknown episode ids", async () => {
    const caller = makeCaller();
    await expect(caller.podcast.quiz({ episodeId: "does-not-exist" })).rejects.toThrow();
  });

  it("submitQuiz grades answers and awards per-correct-answer bonus XP", async () => {
    const caller = makeCaller();
    await caller.podcast.saveProgress({ episodeId: "ep01-general-security", positionSeconds: 0, completed: true });
    const { questions } = await caller.podcast.quiz({ episodeId: "ep01-general-security" });
    const answers = questions.map((_question, index) => (index === 0 ? 0 : 1));
    const result = await caller.podcast.submitQuiz({ episodeId: "ep01-general-security", answers });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThan(5);
    expect(result.quizXp).toBe(result.score * 10);
    expect(result.attemptId).toBeGreaterThan(0);
  });

  it("submitQuiz rejects submission before episode completion", async () => {
    const caller = makeCaller();
    const answers = [1, 2, 0, 3, 1];
    await expect(caller.podcast.submitQuiz({ episodeId: "ep40-revisao-final-serie", answers })).rejects.toThrow();
  });

  it("submitQuiz rejects mismatched answer counts", async () => {
    const caller = makeCaller();
    await expect(caller.podcast.submitQuiz({ episodeId: "ep01-general-security", answers: [0, 1] })).rejects.toThrow();
  });

  it("quizStatus reflects the latest recorded attempt after submission", async () => {
    const caller = makeCaller();
    const episodeId = "ep03-security-architecture";
    await caller.podcast.saveProgress({ episodeId, positionSeconds: 0, completed: true });
    const { questions } = await caller.podcast.quiz({ episodeId });
    const perfect = await caller.podcast.submitQuiz({ episodeId, answers: questions.map(() => 0) });
    const latest = await caller.podcast.quizStatus({ episodeId });
    expect(latest.submitted).toBe(true);
    expect(latest.percentage).toBe(perfect.percentage);
    expect(latest.totalQuestions).toBe(5);
  });

  it("weeklyRanking returns a weekKey and a bounded leaderboard", async () => {
    const caller = makeCaller();
    const { weekKey, ranking } = await caller.podcast.weeklyRanking();
    expect(weekKey).toMatch(/^\d{4}-W\d{2}$/);
    expect(ranking.length).toBeLessThanOrEqual(20);
    for (let index = 1; index < ranking.length; index += 1) {
      expect(ranking[index - 1].xp).toBeGreaterThanOrEqual(ranking[index].xp);
    }
  });
});
