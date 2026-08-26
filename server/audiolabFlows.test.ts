import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { User } from "../drizzle/schema";
import { deleteAudioLabProgress as deleteProgress } from "./db";
const db = { deleteAudioLabProgress: deleteProgress };

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

const SOC_EPISODE = "audio-soc01-powershell-suspeito";
const SOC_ALT_EPISODE = "audio-soc05-dns-exfiltracao";
const SEC_EPISODE = "audio-sec01-identidade-acesso";
const AI_EPISODE = "audio-ai01-mapa-ameacas-ia";
const GRC_EPISODE = "audio-grc01-o-que-e-grc";

describe("CyberDimension Audio Lab flows", () => {
  it("listSeries exposes all nine micro-learning series", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as never, res: {} as never });
    const series = await caller.audiolab.listSeries();
    expect(series.length).toBe(9);
    const codes = series.map((current) => current.code);
    for (const code of ["securityplus", "english", "soc-radio", "red-team", "blue-team", "cloud-minutes", "ai-security", "grc-minutes", "ctf-cases"] as const) {
      expect(codes).toContain(code);
    }
  });

  it("episodes endpoint returns the full catalog and filters by series", async () => {
    const caller = makeCaller();
    const all = await caller.audiolab.episodes();
    expect(all.episodes.length).toBe(172);
    const ctf = await caller.audiolab.episodes({ series: "ctf-cases" });
    expect(ctf.episodes.length).toBe(12);
    expect(ctf.episodes.every((episode) => episode.series === "ctf-cases")).toBe(true);
    const soc = await caller.audiolab.episodes({ series: "soc-radio" });
    expect(soc.episodes.length).toBe(20);
    expect(soc.episodes.every((episode) => episode.series === "soc-radio")).toBe(true);
  });

  it("episodes endpoint returns an empty list for unknown series filters", async () => {
    const caller = makeCaller();
    const unknown = await caller.audiolab.episodes({ series: "nuclear-submarine" });
    expect(unknown.episodes).toEqual([]);
  });

  it("quiz query returns five public questions without the answer key", async () => {
    const caller = makeCaller();
    const { questions, competency } = await caller.audiolab.quiz({ episodeId: SOC_EPISODE });
    expect(questions.length).toBe(5);
    for (const question of questions) {
      expect(question.prompt).toBeTruthy();
      expect((question as Record<string, unknown>).correctAnswer).toBeUndefined();
    }
    expect(competency?.code).toBeTruthy();
  });

  it("quiz query rejects unknown episode ids", async () => {
    const caller = makeCaller();
    await expect(caller.audiolab.quiz({ episodeId: "does-not-exist" })).rejects.toThrow();
  });

  it("submitQuiz grades answers and awards per-correct-answer bonus XP", async () => {
    const caller = makeCaller();
    await caller.audiolab.saveProgress({ episodeId: SEC_EPISODE, positionSeconds: 0, completed: true });
    const { questions } = await caller.audiolab.quiz({ episodeId: SEC_EPISODE });
    const answers = questions.map(() => 0);
    const result = await caller.audiolab.submitQuiz({ episodeId: SEC_EPISODE, answers });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(5);
    expect(result.quizXp).toBe(result.score * 10);
    expect(result.attemptId).toBeGreaterThan(0);
  });

  it("submitQuiz rejects submission before episode completion", async () => {
    const caller = makeCaller();
    await expect(caller.audiolab.submitQuiz({ episodeId: AI_EPISODE, answers: [1, 2, 0, 3, 1] })).rejects.toThrow();
  });

  it("submitQuiz rejects mismatched answer counts", async () => {
    const caller = makeCaller();
    await expect(caller.audiolab.submitQuiz({ episodeId: SEC_EPISODE, answers: [0, 1] })).rejects.toThrow();
  });

  it("quizStatus reflects the latest recorded attempt after submission", async () => {
    const caller = makeCaller();
    await caller.audiolab.saveProgress({ episodeId: SEC_EPISODE, positionSeconds: 0, completed: true });
    const { questions } = await caller.audiolab.quiz({ episodeId: SEC_EPISODE });
    const perfect = await caller.audiolab.submitQuiz({ episodeId: SEC_EPISODE, answers: questions.map(() => 0) });
    const latest = await caller.audiolab.quizStatus({ episodeId: SEC_EPISODE });
    expect(latest.submitted).toBe(true);
    expect(latest.totalQuestions).toBe(5);
    expect(latest.percentage).toBe(perfect.percentage);
  });

  it("saveProgress awards 50 XP only on the first completion", async () => {
    const caller = makeCaller();
    // Reset qualquer progresso prévio do usuário para este episódio (testes compartilham o mesmo BD).
    await db.deleteAudioLabProgress(42, GRC_EPISODE);
    const first = await caller.audiolab.saveProgress({ episodeId: GRC_EPISODE, positionSeconds: 0, completed: true });
    expect(first.justCompleted).toBe(true);
    expect(first.awardedXp).toBe(50);
    const second = await caller.audiolab.saveProgress({ episodeId: GRC_EPISODE, positionSeconds: 300, completed: true });
    expect(second.justCompleted).toBe(false);
    expect(second.awardedXp).toBe(0);
  });

  it("getProgress lists recorded listening state per episode", async () => {
    const caller = makeCaller();
    const progress = await caller.audiolab.getProgress();
    expect(Array.isArray(progress)).toBe(true);
    const completed = progress.filter((entry) => entry.completed).map((entry) => entry.episodeId);
    expect(completed.length).toBeGreaterThanOrEqual(3);
  });

  it("claimSeriesBadges awards nothing until a series is fully completed", async () => {
    const caller = makeCaller();
    const first = await caller.audiolab.claimSeriesBadges();
    expect(first.newlyAwarded.length).toBe(0);
    expect(first.xpGranted).toBe(0);
  });

  it("quiz review exposes explanations with per-question correctness", async () => {
    const caller = makeCaller();
    await caller.audiolab.saveProgress({ episodeId: SOC_ALT_EPISODE, positionSeconds: 0, completed: true });
    const { questions } = await caller.audiolab.quiz({ episodeId: SOC_ALT_EPISODE });
    const result = await caller.audiolab.submitQuiz({ episodeId: SOC_ALT_EPISODE, answers: questions.map(() => 0) });
    expect(result.review.length).toBe(5);
    for (const review of result.review) {
      expect(review.explanation).toBeTruthy();
      expect(review.correctAnswer).toBeGreaterThanOrEqual(0);
    }
  });
});
