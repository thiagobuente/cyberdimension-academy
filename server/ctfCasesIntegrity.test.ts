import { describe, expect, it } from "vitest";
import { audioLabCtfCases } from "../shared/audioLab/audioLabCtfCases";
import { ctfQuizBank } from "../shared/audioLab/audioLabCtfQuizzes";
import { getAudioLabSeries } from "../shared/audioLabSeries";
import { audioLabEpisodes } from "../shared/audioLabEpisodes";

describe("Temporada 4 — CTF Cases", () => {
  it("define a série ctf-cases no catálogo", () => {
    const series = getAudioLabSeries("ctf-cases");
    expect(series).toBeDefined();
    expect(series?.title).toContain("Temporada 4");
    expect(series?.code).toBe("ctf-cases");
  });

  it("tem 12 episódios com diálogo completo (transcript array)", () => {
    expect(audioLabCtfCases.length).toBe(12);
    for (const episode of audioLabCtfCases) {
      expect(episode.series).toBe("ctf-cases");
      expect(episode.id).toMatch(/^audio-ctf\d{2}-/);
      expect(Array.isArray(episode.transcript)).toBe(true);
      expect(episode.transcript.length).toBeGreaterThanOrEqual(4);
      for (const line of episode.transcript) {
        expect(typeof line.speaker).toBe("string");
        expect(typeof line.text).toBe("string");
        expect(line.text.length).toBeGreaterThan(0);
      }
    }
  });

  it("tem quiz de 5 questões e competência para cada episódio", () => {
    expect(Object.keys(ctfQuizBank).length).toBe(12);
    for (const episode of audioLabCtfCases) {
      const quiz = ctfQuizBank[episode.id];
      expect(quiz, `quiz ausente para ${episode.id}`).toBeDefined();
      expect(quiz.questions.length).toBe(5);
      for (const question of quiz.questions) {
        expect(question.prompt.length).toBeGreaterThan(5);
        expect(question.options.length).toBeGreaterThanOrEqual(3);
        expect(typeof question.correctAnswer).toBe("number");
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(question.correctAnswer).toBeLessThan(question.options.length);
        expect(typeof question.explanation).toBe("string");
      }
      expect(quiz.competency.code).toBeTruthy();
      expect(quiz.competency.label).toBeTruthy();
      expect(quiz.competency.area).toBeTruthy();
    }
  });

  it("tem áudio válido disponível no proxy para todos os episódios", () => {
    for (const episode of audioLabCtfCases) {
      expect(episode.audioUrl).toMatch(/^\/manus-storage\/.*\.wav$/);
    }
  });

  it("todos os episódios da Temporada 4 estão agregados no catálogo geral", () => {
    const ctfIds = audioLabCtfCases.map((episode) => episode.id);
    for (const id of ctfIds) {
      expect(audioLabEpisodes.find((episode) => episode.id === id), `ep ${id} ausente do agregado`).toBeDefined();
    }
  });
});
