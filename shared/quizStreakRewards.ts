export const QUIZ_STREAK_MILESTONES = [
  { streak: 3, xp: 50, label: "Tríade de Precisão" },
  { streak: 5, xp: 100, label: "Sequência Blindada" },
  { streak: 8, xp: 200, label: "Mestre da Precisão" },
] as const;

export type QuizStreakMilestone = (typeof QUIZ_STREAK_MILESTONES)[number];

export function getQuizStreakMilestone(streakLength: number): QuizStreakMilestone | null {
  return QUIZ_STREAK_MILESTONES.find((milestone) => milestone.streak === streakLength) ?? null;
}

export function getConsecutivePerfectQuizCount(attempts: Array<{ score: number; totalQuestions: number }>) {
  let count = 0;
  for (const attempt of [...attempts].reverse()) {
    if (attempt.totalQuestions <= 0 || attempt.score !== attempt.totalQuestions) break;
    count += 1;
  }
  return count;
}
