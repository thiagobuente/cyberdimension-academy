// Busca global de episódios do Podcast: localiza por título, série/trilha ou número do episódio,
// cobrindo os dois acervos (CyberCast e CyberDimension Podcast).
import type { AudioLabEpisode } from "@shared/audioLabEpisodes";
import { getAudioLabSeries, AUDIO_LAB_SERIES } from "@shared/audioLabSeries";
import type { PodcastEpisode } from "@shared/podcastEpisodes";

const ACCENT_MAP: Record<string, string> = {
  á: "a", à: "a", â: "a", ã: "a", ä: "a",
  é: "e", è: "e", ê: "e", ë: "e",
  í: "i", ì: "i", î: "i", ï: "i",
  ó: "o", ò: "o", ô: "o", õ: "o", ö: "o",
  ú: "u", ù: "u", û: "u", ü: "u",
  ç: "c", ñ: "n",
};

/** Remove acentos, elimina pontuação e converte para minúsculas. */
export function normalizeTerm(raw: string): string {
  return raw
    .toLowerCase()
    .split("")
    .map((char) => ACCENT_MAP[char] ?? char)
    .join("")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Separa a busca em termos de texto e números de episódio. */
export function parseSearchTerms(query: string): { textTerms: string[]; episodeNumbers: number[] } {
  const tokens = normalizeTerm(query).split(" ").filter(Boolean);
  const textTerms: string[] = [];
  const episodeNumbers: number[] = [];
  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      episodeNumbers.push(Number(token));
    } else {
      textTerms.push(token);
    }
  }
  return { textTerms, episodeNumbers };
}

/** Aliases de trilha que a busca global reconhece no acervo CyberCast. */
const CYBERCAST_SERIES_ALIASES: Record<string, string[]> = {
  english: ["ingles", "inglês", "english", "entrevista", "vocabulary", "pronuncia"],
  securityplus: ["security", "comptia", "sy0-701", "security+"],
};

/** Aliases que a busca global reconhece para as séries do CyberDimension Podcast. */
function audioLabSeriesAliases(): Record<string, string[]> {
  const aliases: Record<string, string[]> = {};
  for (const series of AUDIO_LAB_SERIES) {
    aliases[series.code] = [series.code, ...normalizeTerm(series.title).split(" ").filter(Boolean)];
  }
  return aliases;
}

/** Indica se um termo de texto corresponde ao nome/alias de uma trilha do CyberCast. */
export function termMatchesCybercastSeries(term: string): boolean {
  const needle = normalizeTerm(term);
  for (const [, words] of Object.entries(CYBERCAST_SERIES_ALIASES)) {
    if (words.some((word) => word.includes(needle) || needle.includes(word))) {
      return true;
    }
  }
  return false;
}

/** Retorna a série do CyberDimension Podcast cujo código/alias/descrição contém o termo, ou null.
 * Prioridade: código exato > palavras do título > descrição (evita falsos positivos, ex. "soc" não deve casar com a descrição da série English). */
export function matchingAudioLabSeries(term: string): string | null {
  const needle = normalizeTerm(term);
  const aliases = audioLabSeriesAliases();
  const wordBoundary = new RegExp(`(?:^|\\s)${needle}(?:$|\\s)`);
  const descriptionMatches: string[] = [];
  for (const [code, words] of Object.entries(aliases)) {
    if (code === needle || words.some((word) => word.includes(needle) || needle.includes(word))) {
      return code;
    }
    const description = normalizeTerm(getAudioLabSeries(code)?.description ?? "");
    if (wordBoundary.test(description)) {
      descriptionMatches.push(code);
    } else if (description.includes(needle)) {
      descriptionMatches.push(code);
    }
  }
  return descriptionMatches.length > 0 ? descriptionMatches[0] : null;
}

/** Indica se um episódio do CyberCast pertence à trilha de inglês. */
export const isEnglishEpisode = (episode: PodcastEpisode | undefined | null): boolean =>
  Boolean(episode) && episode!.series === "english";

/**
 * Filtra episódios do CyberCast por busca global (título, descrição, domínio, trilha e número).
 */
export function filterCybercastEpisodes(
  episodes: ReadonlyArray<PodcastEpisode>,
  query: string,
): PodcastEpisode[] {
  if (!query.trim()) return [...episodes];
  const { textTerms, episodeNumbers } = parseSearchTerms(query);
  return episodes.filter((episode) => {
    const title = normalizeTerm(episode.title);
    const description = normalizeTerm(episode.description);
    const domain = normalizeTerm(episode.domainTitle);
    const number = episode.episodeNumber;
    const isEnglish = isEnglishEpisode(episode);
    const textMatch =
      textTerms.length === 0 ||
      textTerms.every((term) => {
        // Alias de trilha do CyberCast: casa somente com episódios da trilha correspondente.
        const seriesMatch =
          termMatchesCybercastSeries(term) &&
          ((isEnglish && term !== "security" && term !== "comptia" && term !== "sy0701") ||
            (!isEnglish && (term === "security" || term === "comptia" || term === "sy0701")));
        if (seriesMatch) return true;
        return title.includes(term) || description.includes(term) || domain.includes(term);
      });
    const numberMatch = episodeNumbers.length === 0 || episodeNumbers.includes(number);
    return textMatch && numberMatch;
  });
}

/**
 * Filtra episódios do CyberDimension Podcast por busca global (título, descrição, série e número).
 * O número do episódio é extraído do ID (ex.: audio-sec14...) e do campo duration não é numérico.
 */
export function filterAudioLabEpisodes(
  episodes: ReadonlyArray<AudioLabEpisode>,
  query: string,
): AudioLabEpisode[] {
  if (!query.trim()) return [...episodes];
  const { textTerms, episodeNumbers } = parseSearchTerms(query);
  const aliases = audioLabSeriesAliases();
  // Se algum termo de texto casa com uma série, a busca fica restrita a essa série (evita falsos
  // positivos de palavras comuns como "cloud" ou "soc" em títulos de outras séries).
  const seriesScope = textTerms
    .map((term) => matchingAudioLabSeries(term))
    .find((matched) => matched !== null);
  return episodes.filter((episode) => {
    if (seriesScope && episode.series !== seriesScope) return false;
    const title = normalizeTerm(episode.title);
    const description = normalizeTerm(episode.description ?? "");
    const seriesCode = episode.series;
    const seriesTitle = normalizeTerm(getAudioLabSeries(seriesCode)?.title ?? "");
    const seriesWords = aliases[seriesCode] ?? [seriesCode];
    const textMatch =
      textTerms.length === 0 ||
      textTerms.some((term) => {
        if (seriesCode === term || seriesWords.some((word) => word.includes(term) || term.includes(word))) {
          return true;
        }
        return title.includes(term) || description.includes(term) || seriesTitle.includes(term);
      });
    // O número do episódio do CyberDimension Podcast aparece no ID (audio-sec14-..., audio-eng05-...).
    const numberMatch =
      episodeNumbers.length === 0 ||
      episodeNumbers.some((num) => new RegExp(`-[a-z]{2,6}${String(num).padStart(2, "0")}-`).test(episode.id));
    return textMatch && numberMatch;
  });
}
