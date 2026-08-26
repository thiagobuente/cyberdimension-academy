import { calculateGamificationXp, GAMIFICATION_RULES, getGamificationLevel } from "@shared/gamification";

export { GAMIFICATION_RULES };

export function calculateMissionXp(input: {
  completedLessons: number;
  approvedQuizzes: number;
  completedLabs: number;
  certificates: number;
  completedPodcastEpisodes?: number;
  streakBonusXp?: number;
}) {
  return calculateGamificationXp(input) + (input.streakBonusXp ?? 0);
}

export function getMissionLevel(xp: number) {
  return getGamificationLevel(xp);
}

export function getStudyRecommendation(input: { title: string; progress: number; latestScore: number | null }) {
  if (input.latestScore !== null && input.latestScore < 70) {
    return { eyebrow: "REVISÃO RECOMENDADA", title: `Reforce ${input.title}`, detail: `Último resultado: ${input.latestScore}%. Revise o conteúdo antes de tentar novamente.`, action: "Revisar conteúdo" };
  }
  if (input.progress > 0 && input.progress < 100) {
    return { eyebrow: "CONTINUE A MISSÃO", title: `Avance em ${input.title}`, detail: `${input.progress}% das aulas desta missão já foram concluídas.`, action: "Continuar estudo" };
  }
  return { eyebrow: "PRÓXIMA MISSÃO", title: `Inicie ${input.title}`, detail: "Comece pelo conteúdo guiado e avance no seu ritmo.", action: "Iniciar missão" };
}
