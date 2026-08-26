import { describe, expect, it } from "vitest";
import { podcastEpisodes } from "../shared/podcastEpisodes";

describe("Podcast Security+", () => {
  it("cobre as conversas autorais de todos os domínios oficiais da prova", () => {
    expect(podcastEpisodes).toHaveLength(88);
    expect(new Set(podcastEpisodes.map((episode) => episode.id)).size).toBe(88);

    for (const domainCode of ["DOM1", "DOM2", "DOM3", "DOM4", "DOM5"]) {
      expect(podcastEpisodes.filter((episode) => episode.domainCode === domainCode).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("mantém os episódios principais extensos, dialogados e publicados", () => {
    const coreEpisodes = podcastEpisodes.filter((episode) => episode.episodeNumber <= 5);

    for (const episode of coreEpisodes) {
      const speakers = new Set(episode.transcript.map((line) => line.speaker));
      const wordCount = episode.transcript
        .map((line) => line.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;

      expect(speakers).toEqual(new Set(["Ana", "Rafael"]));
      expect(episode.transcript.length).toBeGreaterThanOrEqual(20);
      expect(wordCount).toBeGreaterThanOrEqual(1_200);
      expect(episode.audioUrl).toMatch(/^\/manus-storage\/ep0[1-5]-[a-z-]+_[a-f0-9]{8}\.wav$/);
      expect(episode.provenance.origin).toBe("proprio");
      expect(episode.provenance.category).toBe("Podcast educacional próprio");
    }
  });

  it("inclui roteiros complementares por cenário para a revisão ativa", () => {
    const deepDiveEpisodes = podcastEpisodes.filter((episode) => episode.episodeNumber >= 6 && episode.episodeNumber <= 10);

    expect(deepDiveEpisodes).toHaveLength(5);
    for (const episode of deepDiveEpisodes) {
      const speakers = new Set(episode.transcript.map((line) => line.speaker));
      const wordCount = episode.transcript
        .map((line) => line.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;

      expect(speakers).toEqual(new Set(["Ana", "Rafael"]));
      expect(episode.transcript.length).toBeGreaterThanOrEqual(10);
      expect(wordCount).toBeGreaterThanOrEqual(350);
      expect(episode.provenance.origin).toBe("proprio");
      expect(episode.provenance.usage).toContain("revisão por cenários");
      expect(episode.audioUrl).toMatch(/^\/manus-storage\/ep(0[6-9]|10)-[a-z-]+_[a-f0-9]{8}\.wav$/);
    }
  });

  it("inclui a série completa de aprofundamento, comparativos e simulados comentados", () => {
    const fullSeriesEpisodes = podcastEpisodes.filter((episode) => episode.episodeNumber >= 11 && episode.episodeNumber <= 30);

    expect(fullSeriesEpisodes).toHaveLength(20);
    for (const episode of fullSeriesEpisodes) {
      const speakers = new Set(episode.transcript.map((line) => line.speaker));
      const wordCount = episode.transcript
        .map((line) => line.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;

      expect(speakers).toEqual(new Set(["Ana", "Rafael"]));
      expect(episode.transcript.length).toBeGreaterThanOrEqual(7);
      expect(wordCount).toBeGreaterThanOrEqual(205);
      expect(episode.provenance.origin).toBe("proprio");
      expect(episode.audioUrl).toMatch(/^\/manus-storage\/ep(1[1-9]|2[0-9]|30)-[a-z-0-9]+_[a-f0-9]{8}\.wav$/);
    }
  });

  it("fecha a série com os episódios de aprofundamento final, áudios e marcadores temporais clicáveis", () => {
    const batchFourEpisodes = podcastEpisodes.filter((episode) => episode.episodeNumber >= 31 && episode.episodeNumber <= 40);

    expect(batchFourEpisodes).toHaveLength(10);
    for (const episode of batchFourEpisodes) {
      const speakers = new Set(episode.transcript.map((line) => line.speaker));
      const wordCount = episode.transcript
        .map((line) => line.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;

      expect(speakers).toEqual(new Set(["Ana", "Rafael"]));
      expect(episode.transcript.length).toBeGreaterThanOrEqual(6);
      expect(wordCount).toBeGreaterThanOrEqual(160);
      expect(episode.provenance.origin).toBe("proprio");
      expect(episode.audioUrl).toMatch(/^\/manus-storage\/ep(3[1-9]|40)-[a-z-0-9]+_[a-f0-9]{8}\.wav$/);
      expect(episode.transcript.every((line) => typeof line.timestampSeconds === "number")).toBe(true);
      expect(episode.transcript[0].timestampSeconds).toBe(0);
      const seconds = episode.transcript.map((line) => line.timestampSeconds);
      expect(seconds.every((second, index) => index === 0 || second >= seconds[index - 1])).toBe(true);
    }
  });

  it("abre a segunda temporada com episódios de carreira, aprofundamento e tendências, áudios e marcadores temporais", () => {
    const seasonTwoEpisodes = podcastEpisodes.filter((episode) => episode.episodeNumber >= 41 && episode.episodeNumber <= 50);

    expect(seasonTwoEpisodes).toHaveLength(10);
    for (const episode of seasonTwoEpisodes) {
      const speakers = new Set(episode.transcript.map((line) => line.speaker));
      const wordCount = episode.transcript
        .map((line) => line.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;

      expect(speakers).toEqual(new Set(["Ana", "Rafael"]));
      expect(episode.transcript.length).toBeGreaterThanOrEqual(6);
      expect(wordCount).toBeGreaterThanOrEqual(130);
      expect(episode.provenance.origin).toBe("proprio");
      expect(episode.provenance.category).toBe("Podcast educacional próprio");
      expect(episode.audioUrl).toMatch(/^\/manus-storage\/ep(4[1-9]|50)-[a-z-0-9]+_[a-f0-9]{8}\.wav$/);
      expect(episode.transcript.every((line) => typeof line.timestampSeconds === "number")).toBe(true);
      expect(episode.transcript[0].timestampSeconds).toBe(0);
      const seconds = episode.transcript.map((line) => line.timestampSeconds);
      expect(seconds.every((second, index) => index === 0 || second >= seconds[index - 1])).toBe(true);
    }
  });

  it("abre a terceira temporada com aprofundamentos técnicos, áudios e marcadores temporais", () => {
    const seasonThreeEpisodes = podcastEpisodes.filter((episode) => episode.episodeNumber >= 51 && episode.episodeNumber <= 60);

    expect(seasonThreeEpisodes).toHaveLength(10);
    for (const episode of seasonThreeEpisodes) {
      const speakers = new Set(episode.transcript.map((line) => line.speaker));
      const wordCount = episode.transcript
        .map((line) => line.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;

      expect(speakers).toEqual(new Set(["Ana", "Rafael"]));
      expect(episode.transcript.length).toBeGreaterThanOrEqual(6);
      expect(wordCount).toBeGreaterThanOrEqual(120);
      expect(episode.provenance.origin).toBe("proprio");
      expect(episode.provenance.category).toBe("Podcast educacional próprio");
      expect(episode.audioUrl).toMatch(/^\/manus-storage\/ep(5[1-9]|60)-[a-z-0-9]+_[a-f0-9]{8}\.wav$/);
      expect(episode.transcript.every((line) => typeof line.timestampSeconds === "number")).toBe(true);
      expect(episode.transcript[0].timestampSeconds).toBe(0);
      const seconds = episode.transcript.map((line) => line.timestampSeconds);
      expect(seconds.every((second, index) => index === 0 || second >= seconds[index - 1])).toBe(true);
    }
  });

  it("abre a minissérie Raio-X da Questão, com três questões dissecadas por episódio, áudios e quizzes", () => {
    const raioXEpisodes = podcastEpisodes.filter((episode) => episode.episodeNumber >= 63 && episode.episodeNumber <= 67);

    expect(raioXEpisodes).toHaveLength(5);
    const ids = new Set(raioXEpisodes.map((episode) => episode.id));
    for (const domainCode of ["DOM1", "DOM2", "DOM3", "DOM4", "DOM5"]) {
      expect(raioXEpisodes.some((episode) => episode.domainCode === domainCode)).toBe(true);
    }
    for (const episode of raioXEpisodes) {
      expect(ids.has(episode.id)).toBe(true);
      const speakers = new Set(episode.transcript.map((line) => line.speaker));
      const fullText = episode.transcript.map((line) => line.text).join(" ");

      expect(speakers).toEqual(new Set(["Ana", "Rafael"]));
      expect(episode.transcript.length).toBeGreaterThanOrEqual(8);
      expect(fullText).toContain("Raio-X");
      expect(fullText).toContain("Alternativa A");
      expect(fullText).toContain("Alternativa D");
      expect(episode.provenance.origin).toBe("proprio");
      expect(episode.audioUrl).toMatch(/^\/manus-storage\/ep6[3-7]-raio-x-[a-z-0-9]+_[a-f0-9]{8}\.wav$/);
      expect(episode.transcript.every((line) => typeof line.timestampSeconds === "number")).toBe(true);
    }
  });

  it("suporta o filtro da página do CyberCast por domínio do exame, com contagem exata por botão", () => {
    const domainMeta = [
      { code: "DOM1", weightPercent: 12 },
      { code: "DOM2", weightPercent: 22 },
      { code: "DOM3", weightPercent: 18 },
      { code: "DOM4", weightPercent: 28 },
      { code: "DOM5", weightPercent: 20 },
    ];

    expect(domainMeta.reduce((sum, entry) => sum + entry.weightPercent, 0)).toBe(100);
    for (const { code } of domainMeta) {
      const filtered = podcastEpisodes.filter((episode) => episode.domainCode === code);
      expect(filtered.length).toBeGreaterThanOrEqual(2);
      expect(filtered.every((episode) => episode.domainCode === code)).toBe(true);
      expect(new Set(filtered.map((episode) => episode.id)).size).toBe(filtered.length);
    }

    const totalFiltered = domainMeta.reduce((sum, { code }) => sum + podcastEpisodes.filter((episode) => episode.domainCode === code).length, 0);
    expect(totalFiltered).toBe(podcastEpisodes.length);
  });
});
