export const WEEKLY_CHALLENGE_BONUS_XP = 120;

export type WeeklyChallengeActivity = "module" | "lab" | "video";

export type WeeklyChallengeDefinition = {
  key: string;
  courseSlug: string;
  activity: WeeklyChallengeActivity;
  activityIndex: number;
  chapterIndex?: number;
  title: string;
  description: string;
  xp: number;
};

export const weeklyChallengeRotation: WeeklyChallengeDefinition[] = [
  {
    key: "soc-log-triage",
    courseSlug: "soc-analyst",
    activity: "lab",
    activityIndex: 2,
    title: "Triagem de logs SOC",
    description: "Conclua o laboratório de análise de logs de autenticação do SOC.",
    xp: WEEKLY_CHALLENGE_BONUS_XP,
  },
  {
    key: "dfir-log-timeline",
    courseSlug: "digital-forensics-fundamentals",
    activity: "lab",
    activityIndex: 2,
    title: "Linha do tempo forense",
    description: "Conclua o laboratório de correlação de logs para montar uma linha do tempo.",
    xp: WEEKLY_CHALLENGE_BONUS_XP,
  },
  {
    key: "aws-iam-baseline",
    courseSlug: "aws-security-fundamentals",
    activity: "module",
    activityIndex: 0,
    title: "Base IAM na AWS",
    description: "Conclua o primeiro módulo de segurança e identidade na AWS.",
    xp: WEEKLY_CHALLENGE_BONUS_XP,
  },
  {
    key: "azure-identity-baseline",
    courseSlug: "azure-security-fundamentals",
    activity: "module",
    activityIndex: 0,
    title: "Base de identidade no Azure",
    description: "Conclua o primeiro módulo de identidade e proteção no Azure.",
    xp: WEEKLY_CHALLENGE_BONUS_XP,
  },
  {
    key: "network-video-exposure",
    courseSlug: "redes-para-cyber-security",
    activity: "video",
    activityIndex: 0,
    chapterIndex: 2,
    title: "Vídeo de Redes: portas e exposição",
    description: "Avance até o capítulo “Portas e contexto” na trilha de vídeo de Redes e registre um ponto de revisão.",
    xp: WEEKLY_CHALLENGE_BONUS_XP,
  },
  {
    key: "linux-video-hardening",
    courseSlug: "linux-para-operacoes-de-seguranca",
    activity: "video",
    activityIndex: 4,
    chapterIndex: 1,
    title: "Vídeo de Linux: atualizações e logs",
    description: "Avance até o capítulo “Atualizações e logs” na trilha de vídeo de Linux e conecte o conceito ao checklist de hardening.",
    xp: WEEKLY_CHALLENGE_BONUS_XP,
  },
];

export function getIsoWeekKey(date = new Date()): string {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function getWeeklyChallenge(date = new Date()): WeeklyChallengeDefinition & { weekKey: string } {
  const weekKey = getIsoWeekKey(date);
  const epoch = Date.UTC(2025, 0, 6);
  const offset = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - epoch) / (7 * 86400000));
  const index = ((offset % weeklyChallengeRotation.length) + weeklyChallengeRotation.length) % weeklyChallengeRotation.length;
  return { ...weeklyChallengeRotation[index], weekKey };
}
