import { describe, expect, it } from "vitest";
import { getConsecutivePerfectQuizCount, getQuizStreakMilestone, QUIZ_STREAK_MILESTONES } from "./quizStreakRewards";

describe("recompensas de sequência em quizzes", () => {
  it("mantém os marcos de XP progressivos configurados", () => {
    expect(QUIZ_STREAK_MILESTONES).toEqual([
      { streak: 3, xp: 50, label: "Tríade de Precisão" },
      { streak: 5, xp: 100, label: "Sequência Blindada" },
      { streak: 8, xp: 200, label: "Mestre da Precisão" },
    ]);
  });

  it("conta apenas acertos perfeitos consecutivos a partir da tentativa mais recente", () => {
    expect(getConsecutivePerfectQuizCount([
      { score: 2, totalQuestions: 2 },
      { score: 1, totalQuestions: 2 },
      { score: 2, totalQuestions: 2 },
      { score: 2, totalQuestions: 2 },
      { score: 2, totalQuestions: 2 },
    ])).toBe(3);
  });

  it("não concede marco fora das sequências elegíveis", () => {
    expect(getQuizStreakMilestone(2)).toBeNull();
    expect(getQuizStreakMilestone(3)).toMatchObject({ xp: 50, label: "Tríade de Precisão" });
    expect(getQuizStreakMilestone(5)).toMatchObject({ xp: 100, label: "Sequência Blindada" });
    expect(getQuizStreakMilestone(8)).toMatchObject({ xp: 200, label: "Mestre da Precisão" });
  });
});
