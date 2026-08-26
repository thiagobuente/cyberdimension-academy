export const GAMIFICATION_RULES = {
  completedLesson: 50,
  approvedQuiz: 100,
  completedLab: 250,
  certificateIssued: 500,
  completedPodcastEpisode: 50,
  levelThreshold: 500,
} as const;

export function calculateGamificationXp(input: {
  completedLessons: number;
  approvedQuizzes: number;
  completedLabs: number;
  certificates: number;
  completedPodcastEpisodes?: number;
}) {
  return input.completedLessons * GAMIFICATION_RULES.completedLesson
    + input.approvedQuizzes * GAMIFICATION_RULES.approvedQuiz
    + input.completedLabs * GAMIFICATION_RULES.completedLab
    + input.certificates * GAMIFICATION_RULES.certificateIssued
    + (input.completedPodcastEpisodes ?? 0) * GAMIFICATION_RULES.completedPodcastEpisode;
}

export function getGamificationLevel(xp: number) {
  const level = Math.floor(xp / GAMIFICATION_RULES.levelThreshold) + 1;
  const progressToNextLevel = xp % GAMIFICATION_RULES.levelThreshold;
  const title = level >= 8 ? "Security Vanguard" : level >= 5 ? "Threat Hunter" : level >= 3 ? "Network Sentinel" : "Cyber Cadet";
  return { level, progressToNextLevel, xpPerLevel: GAMIFICATION_RULES.levelThreshold, title };
}
