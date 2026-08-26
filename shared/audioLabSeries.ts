/**
 * CyberDimension Audio Lab — catálogo oficial das séries de micro-learning.
 *
 * Cada série agrupa episódios curtos (5 a 15 minutos) ligados a uma trilha
 * da academia. O fluxo por episódio é: Ouvir → Responder (quiz) → Ganhar XP
 * → Competência desbloqueada no Career Readiness.
 *
 * Este módulo define as séries; os episódios são importados do módulo
 * `audioLabEpisodes`, que agrega todos os lotes.
 */

export type AudioLabSeriesCode =
  | "securityplus"
  | "english"
  | "soc-radio"
  | "red-team"
  | "blue-team"
  | "cloud-minutes"
  | "ai-security"
  | "grc-minutes"
  | "ctf-cases";

export interface AudioLabSeries {
  code: AudioLabSeriesCode;
  title: string;
  shortTitle: string;
  description: string;
  /** Ícone lucide (nome) renderizado pela UI do Audio Lab. */
  icon: "shield" | "languages" | "radio" | "swords" | "shield-check" | "cloud" | "brain" | "landmark" | "crosshair";
  /** Cor de destaque da série (token CSS da plataforma). */
  accent: "cyan" | "purple" | "green" | "amber";
  /** Trilha da academia à qual a série está vinculada (usado no "Aprofundar"). */
  track: string;
  /** Duração típica dos episódios. */
  typicalDuration: string;
}

export const AUDIO_LAB_SERIES: readonly AudioLabSeries[] = [
  {
    code: "securityplus",
    title: "Security+ em Áudio",
    shortTitle: "Security+",
    description:
      "A prova CompTIA Security+ SY0-701 distribuída por domínio: cada episódio aprofunda os objetivos oficiais e mostra como a banca cobra cada conceito.",
    icon: "shield",
    accent: "cyan",
    track: "/carreira/security",
    typicalDuration: "12–16 min",
  },
  {
    code: "english",
    title: "Technical English for Cybersecurity",
    shortTitle: "Technical English",
    description:
      "Dez palavras técnicas por episódio, diálogos de incidentes, vocabulário de SOC, redes, nuvem, pentest e GRC, e inglês para entrevistas internacionais.",
    icon: "languages",
    accent: "purple",
    track: "/carreira/international",
    typicalDuration: "8–12 min",
  },
  {
    code: "soc-radio",
    title: "SOC Analyst Radio",
    shortTitle: "SOC Analyst Radio",
    description:
      "Cenários reais de plantão de SOC: um alerta no ar, e você treina identificar o indicador, a ameaça, a prioridade e a ação recomendada antes da resolução narrada.",
    icon: "radio",
    accent: "green"
,
    track: "/carreira/blue-team",
    typicalDuration: "7–10 min",
  },
  {
    code: "red-team",
    title: "Red Team Briefing",
    shortTitle: "Red Team",
    description:
      "Reconhecimento, OWASP, segurança web, avaliação de vulnerabilidades e ferramentas clássicas — sempre em laboratório controlado e foco educacional.",
    icon: "swords",
    accent: "amber",
    track: "/carreira/red-team",
    typicalDuration: "9–13 min",
  },
  {
    code: "blue-team",
    title: "Blue Team Briefing",
    shortTitle: "Blue Team",
    description:
      "SIEM, logs, resposta a incidentes, threat hunting, EDR, MITRE ATT&CK, engenharia de detecção e DFIR — a visão do defensor profissional.",
    icon: "shield-check",
    accent: "cyan",
    track: "/carreira/blue-team",
    typicalDuration: "9–13 min",
  },
  {
    code: "cloud-minutes",
    title: "Cloud Security Minutes",
    shortTitle: "Cloud Minutes",
    description:
      "Episódios rápidos de AWS, Azure, IAM, containers, Kubernetes, misconfiguration, Zero Trust em nuvem e DevSecOps.",
    icon: "cloud",
    accent: "purple",
    track: "/carreira/cloud",
    typicalDuration: "6–10 min",
  },
  {
    code: "ai-security",
    title: "AI Security",
    shortTitle: "AI Security",
    description:
      "Prompt injection, segurança de LLMs, RAG, governança de IA, segurança de modelos e o OWASP Top 10 for LLM Applications.",
    icon: "brain",
    accent: "amber",
    track: "/carreira/ai",
    typicalDuration: "8–12 min",
  },
  {
    code: "grc-minutes",
    title: "GRC em 10 Minutos",
    shortTitle: "GRC 10min",
    description:
      "ISO 27001, NIST CSF, CIS Controls, LGPD, gestão de riscos, políticas, compliance, governança e risco de terceiros em cápsulas diretas.",
    icon: "landmark",
    accent: "green",
    track: "/carreira/grc",
    typicalDuration: "8–11 min",
  },
  {
    code: "ctf-cases",
    title: "Temporada 4 — CTF Cases",
    shortTitle: "CTF Cases",
    description:
      "Estudos de caso narrados no formato Capture The Flag: incidentes reais de forense, malware, red team, cloud, identidade e resposta a incidentes dissecados caso a caso.",
    icon: "crosshair",
    accent: "amber",
    track: "/carreira/blue-team",
    typicalDuration: "9–11 min",
  },
] as const;

export const getAudioLabSeries = (code: AudioLabSeriesCode | string | undefined | null): AudioLabSeries | undefined =>
  AUDIO_LAB_SERIES.find((series) => series.code === code);

export const AUDIO_LAB_EPISODE_XP = 50;
export const AUDIO_LAB_QUIZ_XP_PER_CORRECT = 10;
