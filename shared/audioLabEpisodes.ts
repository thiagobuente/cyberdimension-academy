/**
 * CyberDimension Audio Lab — Agregador de séries.
 * Importa os episódios das 9 séries de micro-learning em áudio (incluindo a
 * Temporada 4 "CTF Cases") e exporta o catálogo consolidado com metadados.
 */
import { audioLabSecurityPlus } from "./audioLab/audioLabSecurityPlus";
import { audioLabEnglish } from "./audioLab/audioLabEnglish";
import { audioLabSocRadio } from "./audioLab/audioLabSocRadio";
import { audioLabRedTeam } from "./audioLab/audioLabRedTeam";
import { audioLabBlueTeam } from "./audioLab/audioLabBlueTeam";
import { audioLabCloud } from "./audioLab/audioLabCloud";
import { audioLabAI } from "./audioLab/audioLabAI";
import { audioLabGRC } from "./audioLab/audioLabGRC";
import { audioLabCtfCases } from "./audioLab/audioLabCtfCases";

export {
  audioLabSecurityPlus,
  audioLabEnglish,
  audioLabSocRadio,
  audioLabRedTeam,
  audioLabBlueTeam,
  audioLabCloud,
  audioLabAI,
  audioLabGRC,
  audioLabCtfCases,
};

export const audioLabEpisodes = [
  ...audioLabSecurityPlus,
  ...audioLabEnglish,
  ...audioLabSocRadio,
  ...audioLabRedTeam,
  ...audioLabBlueTeam,
  ...audioLabCloud,
  ...audioLabAI,
  ...audioLabGRC,
  ...audioLabCtfCases,
] as const;

export type AudioLabEpisode = (typeof audioLabEpisodes)[number];
