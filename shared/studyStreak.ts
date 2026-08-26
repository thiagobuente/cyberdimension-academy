/**
 * Daily study streak milestones: bonus XP awarded once per streak length
 * reached in a single uninterrupted study run.
 */
export const DAILY_STREAK_MILESTONES = [
  { length: 3, xp: 15, label: "Tríade Diária" },
  { length: 7, xp: 40, label: "Semana Inquebrável" },
  { length: 14, xp: 75, label: "Constância Lunar" },
  { length: 30, xp: 150, label: "Mês de Órbita" },
] as const;

export type DailyStreakMilestone = (typeof DAILY_STREAK_MILESTONES)[number];

export function getDailyStreakMilestone(streakLength: number): DailyStreakMilestone | null {
  const hit = [...DAILY_STREAK_MILESTONES].reverse().find((milestone) => streakLength >= milestone.length);
  return hit ?? null;
}

/** Formats a UTC date into the YYYY-MM-DD day key used for streak storage. */
export function getDayKeyForDate(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}
