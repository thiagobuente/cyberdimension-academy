/**
 * CyberCast listener badge system.
 *
 * Badges are earned once per user for learning milestones reached in the
 * podcast series. Verification is always server-side: the UI only displays
 * what the backend confirms through `trpc.podcast.claimListenerBadges`.
 *
 * Each badge declares a pure `check` predicate over the listener's current
 * progress, so adding or tuning badges never touches database code.
 */
import { podcastEpisodes } from "./podcastEpisodes";

export interface ListenerBadge {
  /** Stable code persisted in the `podcastListenerBadges` table. */
  code: string;
  /** Short display name, e.g. "Primeira Estação". */
  name: string;
  /** One-line description of the milestone. */
  description: string;
  /** Icon identifier consumed by the badge card UI. */
  icon: string;
  /** XP bonus granted when this badge is earned. */
  xp: number;
  /**
   * Pure predicate that returns true when the listener has satisfied every
   * requirement for this badge.
   */
  check(context: ListenerBadgeContext): boolean;
}

export interface ListenerBadgeContext {
  /** Episode ids for which the listener has a completed progress record. */
  completedEpisodeIds: ReadonlySet<string>;
  /** Episode ids for which the listener holds a perfect quiz score. */
  perfectQuizEpisodeIds: ReadonlySet<string>;
  /** Episode ids for which the listener submitted the review quiz (any score). */
  quizSubmittedEpisodeIds: ReadonlySet<string>;
  /** Episode ids published in the series (used for season ranges). */
  publishedEpisodeIds: ReadonlySet<string>;
}

export interface BadgeAward {
  code: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
}

/** Splits an episode id like "ep51-forense-custodia-evidencia" into its number. */
export function episodeNumber(episodeId: string): number {
  const match = episodeId.match(/^ep(\d{2})(?:-|$)/);
  return match ? Number(match[1]) : -1;
}

const englishEpisodes = podcastEpisodes
  .filter((episode) => episode.series === "english")
  .map((episode) => episode.id);

export const PODCAST_LISTENER_BADGES: ListenerBadge[] = [
  {
    code: "podcast-first-hop",
    name: "Primeiro Salto",
    description: "Concluiu o primeiro episódio do CyberCast.",
    icon: "rocket",
    xp: 50,
    check: (context) => context.completedEpisodeIds.size >= 1,
  },
  {
    code: "podcast-decadia",
    name: "Década de Ouvidos",
    description: "Concluiu 10 episódios da série.",
    icon: "headphones",
    xp: 100,
    check: (context) => context.completedEpisodeIds.size >= 10,
  },
  {
    code: "podcast-quarter",
    name: "Um Quarto da Órbita",
    description: "Concluiu 15 episódios do CyberCast.",
    icon: "satellite",
    xp: 100,
    check: (context) => context.completedEpisodeIds.size >= 15,
  },
  {
    code: "podcast-veteran",
    name: "Ouvinte Veterano",
    description: "Concluiu 25 episódios da série.",
    icon: "star",
    xp: 150,
    check: (context) => context.completedEpisodeIds.size >= 25,
  },
  {
    code: "podcast-half-orbit",
    name: "Meia Órbita",
    description: "Concluiu 30 episódios do CyberCast.",
    icon: "globe",
    xp: 150,
    check: (context) => context.completedEpisodeIds.size >= 30,
  },
  {
    code: "podcast-scholar",
    name: "Estudioso do Éter",
    description: "Concluiu 50 episódios da série.",
    icon: "book",
    xp: 200,
    check: (context) => context.completedEpisodeIds.size >= 50,
  },
  {
    code: "podcast-full-series",
    name: "Série Completa",
    description: "Concluiu os 60 episódios do CyberCast Security+.",
    icon: "trophy",
    xp: 500,
    check: (context) => context.completedEpisodeIds.size >= 60,
  },
  {
    code: "podcast-perfect-streak-5",
    name: "Precisão de Laser",
    description: "Acertou 5 quizzes de revisão com nota máxima.",
    icon: "crosshair",
    xp: 200,
    check: (context) => context.perfectQuizEpisodeIds.size >= 5,
  },
  {
    code: "podcast-perfect-streak-15",
    name: "Ouvido Absoluto",
    description: "Acertou 15 quizzes de revisão com nota máxima.",
    icon: "badge-check",
    xp: 300,
    check: (context) => context.perfectQuizEpisodeIds.size >= 15,
  },
  {
    code: "podcast-season-three",
    name: "Explorador da Temporada 3",
    description: "Concluiu os dez episódios de forense, malware e cloud avançado.",
    icon: "microscope",
    xp: 250,
    check: (context) =>
      [51, 52, 53, 54, 55, 56, 57, 58, 59, 60].every(
        (number) => context.completedEpisodeIds.has(`ep${String(number).padStart(2, "0")}`)
          || Array.from(context.publishedEpisodeIds).some(
            (published) => episodeNumber(published) === number && context.completedEpisodeIds.has(published)
          )
      ),
  },
  {
    code: "english-for-cyber-pros",
    name: "English for Cyber Pros",
    description: "Concluiu o episódio especial de inglês técnico e o quiz de vocabulário.",
    icon: "languages",
    xp: 150,
    check: (context) =>
      context.completedEpisodeIds.has("ep68-english-for-cyber-pros") && context.quizSubmittedEpisodeIds.has("ep68-english-for-cyber-pros"),
  },
  {
    code: "english-for-network-security",
    name: "English for Network Security",
    description: "Concluiu o especial de entrevista para vagas de Network Security e o quiz de vocabulário.",
    icon: "languages",
    xp: 150,
    check: (context) =>
      context.completedEpisodeIds.has("ep69-network-security-interview") && context.quizSubmittedEpisodeIds.has("ep69-network-security-interview"),
  },
  {
    code: "english-for-cloud-security",
    name: "English for Cloud Security",
    description: "Concluiu o especial de entrevista para vagas de Cloud Security e o quiz de vocabulário.",
    icon: "languages",
    xp: 150,
    check: (context) =>
      context.completedEpisodeIds.has("ep70-cloud-security-interview") && context.quizSubmittedEpisodeIds.has("ep70-cloud-security-interview"),
  },
  {
    code: "english-for-incident-response",
    name: "English for Incident Response",
    description: "Concluiu o especial de entrevista para vagas de Incident Response e o quiz de vocabulário.",
    icon: "languages",
    xp: 150,
    check: (context) =>
      context.completedEpisodeIds.has("ep71-incident-response-interview") && context.quizSubmittedEpisodeIds.has("ep71-incident-response-interview"),
  },
  {
    code: "english-for-penetration-testing",
    name: "English for Penetration Testing",
    description: "Concluiu o especial de entrevista para vagas de Penetration Testing e o quiz de vocabulário.",
    icon: "languages",
    xp: 150,
    check: (context) =>
      context.completedEpisodeIds.has("ep72-penetration-testing-interview") && context.quizSubmittedEpisodeIds.has("ep72-penetration-testing-interview"),
  },
  {
    code: "polyglot-cyber",
    name: "Polyglot Cyber",
    description: "Concluiu todos os episódios e quizzes da trilha English for Cyber Pros.",
    icon: "languages",
    xp: 300,
    check: (context) =>
      englishEpisodes.every(
        (episodeId) =>
          context.completedEpisodeIds.has(episodeId) && context.quizSubmittedEpisodeIds.has(episodeId)
      ),
  },
];

/**
 * Idempotent badge evaluation: returns the badges the listener just earned
 * on this check, regardless of badges already granted before.
 */
export function evaluatePodcastListenerBadges(
  context: ListenerBadgeContext,
  alreadyAwarded: ReadonlySet<string>
): BadgeAward[] {
  const earned: BadgeAward[] = [];
  for (const badge of PODCAST_LISTENER_BADGES) {
    if (!alreadyAwarded.has(badge.code) && badge.check(context)) {
      earned.push({
        code: badge.code,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        xp: badge.xp,
      });
    }
  }
  return earned;
}
