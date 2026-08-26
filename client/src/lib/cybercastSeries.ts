// Hub unificado do CyberCast: 9 séries de áudio que combinam os episódios do
// CyberCast (88) e do CyberDimension Podcast (172) em um único catálogo visual.
// Os dados continuam vindo de podcastEpisodes e audioLabEpisodes; este módulo
// apenas mapeia cada episódio à sua série de exibição no hub.
import type { AudioLabEpisode } from "@shared/audioLabEpisodes";
import { AUDIO_LAB_SERIES } from "@shared/audioLabSeries";
import type { PodcastEpisode } from "@shared/podcastEpisodes";
import {
  BookOpen,
  Brain,
  Briefcase,
  Cloud,
  Crosshair,
  Languages,
  Layers,
  Shield,
  Target,
} from "lucide-react";
import type { ComponentType } from "react";

export interface CybercastSeries {
  /** Chave estável usada como filtro do hub. */
  key: string;
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
  icon: ComponentType<{ className?: string }>;
  /** Código da série do CyberDimension Podcast que pertence a esta série do hub (ou null). */
  audioLabCode: string | null;
  /** Série do CyberCast que pertence a este hub (ou null). */
  cybercastSeries: "english" | "securityplus" | null;
}

export const CYBERCAST_HUB_SERIES: readonly CybercastSeries[] = [
  {
    key: "security-plus",
    label: "Security+ em Áudio",
    shortLabel: "Security+",
    description: "A prova completa SY0-701 narrada por Ana e Rafael: os 5 domínios, profundidades, raio-x de questões e revisões relâmpago.",
    accent: "neon-purple",
    icon: Shield,
    audioLabCode: "securityplus",
    cybercastSeries: "securityplus",
  },
  {
    key: "technical-english",
    label: "Technical English",
    shortLabel: "Inglês",
    description: "English for Cyber Pros: pronúncia técnica, entrevistas simuladas e vocabulário profissional de cibersegurança.",
    accent: "neon-cyan",
    icon: Languages,
    audioLabCode: "english",
    cybercastSeries: "english",
  },
  {
    key: "soc-analyst",
    label: "SOC Analyst",
    shortLabel: "SOC",
    description: "Radio do SOC: situações reais de triagem de alertas, prioridade de resposta e decisões de analista.",
    accent: "neon-green",
    icon: Target,
    audioLabCode: "soc-radio",
    cybercastSeries: null,
  },
  {
    key: "red-team",
    label: "Red Team",
    shortLabel: "Red Team",
    description: "Briefings de Red Team: reconhecimento, OWASP, avaliação de vulnerabilidades e exploração responsável em laboratório.",
    accent: "neon-amber",
    icon: Crosshair,
    audioLabCode: "red-team",
    cybercastSeries: null,
  },
  {
    key: "blue-team",
    label: "Blue Team",
    shortLabel: "Blue Team",
    description: "Briefings de Blue Team: SIEM, logs, incident response, threat hunting, EDR e MITRE ATT&CK.",
    accent: "neon-cyan",
    icon: Shield,
    audioLabCode: "blue-team",
    cybercastSeries: null,
  },
  {
    key: "cloud-security",
    label: "Cloud Security",
    shortLabel: "Cloud",
    description: "Cloud Security Minutes: AWS, Azure, IAM, containers, zero trust e configurações comuns de risco.",
    accent: "neon-purple",
    icon: Cloud,
    audioLabCode: "cloud-minutes",
    cybercastSeries: null,
  },
  {
    key: "ai-security",
    label: "AI Security",
    shortLabel: "AI",
    description: "Segurança de IA: prompt injection, LLM security, RAG, governança de modelos e OWASP Top 10 para LLM.",
    accent: "neon-amber",
    icon: Brain,
    audioLabCode: "ai-security",
    cybercastSeries: null,
  },
  {
    key: "grc",
    label: "GRC",
    shortLabel: "GRC",
    description: "GRC em 10 minutos: ISO 27001, NIST CSF, CIS Controls, LGPD, riscos e governança de segurança.",
    accent: "neon-green",
    icon: Briefcase,
    audioLabCode: "grc-minutes",
    cybercastSeries: null,
  },
  {
    key: "ctf-cases",
    label: "CTF Cases",
    shortLabel: "CTF",
    description: "Temporada 4: estudos de caso narrados tipo CTF sobre incidentes reais, com quiz e XP ao final.",
    accent: "neon-amber",
    icon: Layers,
    audioLabCode: "ctf-cases",
    cybercastSeries: null,
  },
];

/** Série do hub à qual um episódio do CyberCast pertence. */
export const cybercastEpisodeSeriesKey = (episode: PodcastEpisode): string =>
  episode.series === "english" ? "technical-english" : "security-plus";

/** Série do hub à qual um episódio do CyberDimension Podcast pertence (ou null). */
export const cdpEpisodeSeriesKey = (episode: AudioLabEpisode): string =>
  CYBERCAST_HUB_SERIES.find((series) => series.audioLabCode === episode.series)?.key ?? episode.series;

/** Código de áudio do CyberDimension Podcast para o hub key (audio-secNN-...) — prefixo do ID. */
export const cdpEpisodeIdPrefix: Record<string, string> = {
  "security-plus": "sec",
  "technical-english": "eng",
  "soc-analyst": "soc",
  "red-team": "red",
  "blue-team": "blue",
  "cloud-security": "cld",
  "ai-security": "ai",
  grc: "grc",
  "ctf-cases": "ctf",
};

/** Título da série do AUDIO_LAB_SERIES para um hub key (descrição). */
export const audioLabSeriesMeta = (hubKey: string) =>
  AUDIO_LAB_SERIES.find(
    (series) => CYBERCAST_HUB_SERIES.find((hub) => hub.key === hubKey)?.audioLabCode === series.code,
  ) ?? null;

export const hubSeriesByKey = (key: string): CybercastSeries | undefined =>
  CYBERCAST_HUB_SERIES.find((series) => series.key === key);
