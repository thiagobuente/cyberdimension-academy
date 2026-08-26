import { describe, expect, it } from "vitest";
import {
  filterAudioLabEpisodes,
  filterCybercastEpisodes,
  matchingAudioLabSeries,
  normalizeTerm,
  parseSearchTerms,
  termMatchesCybercastSeries,
} from "./podcastSearch";
import { audioLabEpisodes } from "@shared/audioLabEpisodes";
import { podcastEpisodes } from "@shared/podcastEpisodes";

describe("normalizeTerm", () => {
  it("remove acentos, pontuação e normaliza espaços", () => {
    expect(normalizeTerm("SIEM — triagem de alertas!")).toBe("siem triagem de alertas");
    expect(normalizeTerm("Inglês para Cyber Pros")).toBe("ingles para cyber pros");
    expect(normalizeTerm("  SY0-701  ")).toBe("sy0701");
  });
});

describe("parseSearchTerms", () => {
  it("separa texto e números", () => {
    expect(parseSearchTerms("siem 15")).toEqual({ textTerms: ["siem"], episodeNumbers: [15] });
    expect(parseSearchTerms("1 2")).toEqual({ textTerms: [], episodeNumbers: [1, 2] });
    expect(parseSearchTerms("")).toEqual({ textTerms: [], episodeNumbers: [] });
  });
});

describe("aliases de trilha", () => {
  it("reconhece séries do CyberCast", () => {
    expect(termMatchesCybercastSeries("inglês")).toBe(true);
    expect(termMatchesCybercastSeries("english")).toBe(true);
    expect(termMatchesCybercastSeries("security")).toBe(true);
    expect(termMatchesCybercastSeries("comptia")).toBe(true);
    expect(termMatchesCybercastSeries("python")).toBe(false);
  });

  it("reconhece séries do CyberDimension Podcast", () => {
    expect(matchingAudioLabSeries("soc")).toBe("soc-radio");
    expect(matchingAudioLabSeries("cloud")).toBe("cloud-minutes");
    // "governança" aparece na descrição de mais de uma série; o match por descrição retorna a primeira (ai-security). Para buscar a série GRC, use o nome da série.
    expect(matchingAudioLabSeries("grc")).toBe("grc-minutes");
    expect(matchingAudioLabSeries("10 minutos")).toBe("grc-minutes");
    // "pentest" só aparece na descrição da série English ("vocabulário de SOC, redes, nuvem, pentest e GRC").
    expect(matchingAudioLabSeries("pentest")).toBe("english");
    expect(matchingAudioLabSeries("owasp")).toBe("red-team");
    expect(matchingAudioLabSeries("red team")).toBe("red-team");
    expect(matchingAudioLabSeries("llm")).toBe("ai-security");
    expect(matchingAudioLabSeries("prompt injection")).toBe("ai-security");
    expect(matchingAudioLabSeries("nadaquixer")).toBeNull();
  });
});

describe("filterCybercastEpisodes", () => {
  it("sem busca retorna todos", () => {
    expect(filterCybercastEpisodes(podcastEpisodes, "")).toHaveLength(podcastEpisodes.length);
  });

  it("encontra por título", () => {
    const results = filterCybercastEpisodes(podcastEpisodes, "criptografia");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((ep) => ep.title.toLowerCase().includes("criptografia") || ep.description.toLowerCase().includes("criptografia"))).toBe(true);
  });

  it("encontra por trilha inglês", () => {
    const results = filterCybercastEpisodes(podcastEpisodes, "inglês");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((ep) => ep.series === "english")).toBe(true);
  });

  it("encontra por trilha security", () => {
    const results = filterCybercastEpisodes(podcastEpisodes, "comptia security");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((ep) => ep.series !== "english")).toBe(true);
  });

  it("combina texto e número", () => {
    const results = filterCybercastEpisodes(podcastEpisodes, "powershell 7");
    expect(results.every((ep) => ep.episodeNumber === 7)).toBe(true);
  });

  it("retorna vazio para termo inexistente", () => {
    expect(filterCybercastEpisodes(podcastEpisodes, "termoxyzinexistente")).toHaveLength(0);
  });
});

describe("filterAudioLabEpisodes", () => {
  it("sem busca retorna todos", () => {
    expect(filterAudioLabEpisodes(audioLabEpisodes, "")).toHaveLength(audioLabEpisodes.length);
  });

  it("encontra por título", () => {
    const results = filterAudioLabEpisodes(audioLabEpisodes, "powershell");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((ep) => ep.title.toLowerCase().includes("powershell"))).toBe(true);
  });

  it("encontra por série", () => {
    const soc = filterAudioLabEpisodes(audioLabEpisodes, "soc");
    expect(soc.every((ep) => ep.series === "soc-radio")).toBe(true);
    const cloud = filterAudioLabEpisodes(audioLabEpisodes, "cloud");
    expect(cloud.every((ep) => ep.series === "cloud-minutes")).toBe(true);
  });

  it("encontra por número", () => {
    const n14 = filterAudioLabEpisodes(audioLabEpisodes, "14");
    expect(n14.every((ep) => /-(sec|eng|soc|red|blue|cloud|ai|grc)14-/.test(ep.id))).toBe(true);
  });

  it("combina série e número", () => {
    const results = filterAudioLabEpisodes(audioLabEpisodes, "english 5");
    expect(results.every((ep) => ep.series === "english" && /-eng05-/.test(ep.id))).toBe(true);
  });

  it("retorna vazio para termo inexistente", () => {
    expect(filterAudioLabEpisodes(audioLabEpisodes, "termoxyzinexistente")).toHaveLength(0);
  });

  it("cobre as 9 séries com 172 episódios, incluindo a Temporada 4 CTF Cases", () => {
    expect(audioLabEpisodes.length).toBe(172);
    const ctf = filterAudioLabEpisodes(audioLabEpisodes, "ctf");
    expect(ctf.length).toBeGreaterThan(0);
    expect(ctf.every((ep) => ep.series === "ctf-cases")).toBe(true);
  });
});
