import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { User } from "../drizzle/schema";
import { englishVocabulary, getEnglishTerm, getTermsByEpisode } from "../shared/englishVocabulary";
import { getQuestionsByRole, interviewQuestions, interviewRoles } from "../shared/englishInterviewSimulator";
import { podcastEpisodes } from "../shared/podcastEpisodes";

const regularUser: User = {
  id: 88,
  openId: "english-test-open-id",
  name: "English Test User",
  email: "english.test@example.com",
  role: "user",
} as User;

function makeCaller(user: User | null) {
  return appRouter.createCaller({
    user,
    req: {} as never,
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as never,
  });
}

describe("Vocabulário English for Cyber Pros", () => {
  it("expõe 48 termos de vocabulário cobrindo os cinco episódios English", () => {
    expect(englishVocabulary).toHaveLength(48);
    expect(getTermsByEpisode("ep68-english-for-cyber-pros")).toHaveLength(13);
    expect(getTermsByEpisode("ep69-network-security-interview")).toHaveLength(11);
    expect(getTermsByEpisode("ep70-cloud-security-interview")).toHaveLength(5);
    expect(getTermsByEpisode("ep71-incident-response-interview")).toHaveLength(10);
    expect(getTermsByEpisode("ep72-penetration-testing-interview")).toHaveLength(11);
    expect(getTermsByEpisode("ep01-general-security")).toHaveLength(0);
  });

  it("reconhece apenas ids válidos via getEnglishTerm", () => {
    expect(getEnglishTerm("term-phishing")?.term).toBe("phishing");
    expect(getEnglishTerm("inexistent-term")).toBeUndefined();
  });
});

describe("Simulado de entrevista (dados)", () => {
  it("reúne 9 perguntas cobrindo as três vagas", () => {
    expect(interviewQuestions).toHaveLength(9);
    for (const role of ["soc", "pentester", "network"] as const) {
      expect(getQuestionsByRole(role)).toHaveLength(3);
    }
  });

  it("lista as três vagas com metadados completos", () => {
    expect(interviewRoles).toHaveLength(3);
    for (const role of interviewRoles) {
      const questions = getQuestionsByRole(role.id);
      for (const question of questions) {
        expect(question.idealAnswerEn.length).toBeGreaterThan(50);
        expect(question.idealAnswerPt.length).toBeGreaterThan(50);
        expect(question.keywords.length).toBeGreaterThanOrEqual(6);
        expect(question.recruiterTranslation.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("Simulado de entrevista (procedimentos)", () => {
  it("bloqueia o acesso ao simulado sem autenticação", async () => {
    const caller = makeCaller(null);
    await expect(caller.podcast.submitEnglishInterviewAnswer({ questionId: "interview-soc-1", answerText: "I would triage the alert first." })).rejects.toThrow();
  });

  it("rejeita ids de pergunta inexistentes", async () => {
    const caller = makeCaller(regularUser);
    await expect(caller.podcast.submitEnglishInterviewAnswer({ questionId: "interview-soc-99", answerText: "I would triage the alert first." })).rejects.toThrow();
  });

  it("avalia a resposta por palavras-chave com pontuação e XP", async () => {
    const caller = makeCaller(regularUser);
    const question = getQuestionsByRole("soc")[0];
    const result = await caller.podcast.submitEnglishInterviewAnswer({
      questionId: question.id,
      answerText: "First I triage the alert, correlate logs, and escalate according to the playbook documenting everything.",
    });
    expect(result.keywordsFound).toContain("triage");
    expect(result.keywordsFound).toContain("correlate");
    expect(result.keywordsFound).toContain("escalate");
    expect(result.keywordsFound).toContain("playbook");
    expect(result.keywordsFound).toContain("document");
    expect(result.score).toBe(result.keywordsFound.length);
    expect(result.xp).toBe(Math.min(result.score, 5) * 10);
  });

  it("reconhece palavras-chave de forma case-insensitive", async () => {
    const caller = makeCaller(regularUser);
    const result = await caller.podcast.submitEnglishInterviewAnswer({
      questionId: "interview-network-3",
      answerText: "I enable RATE LIMITING on the EDGE and activate DDoS mitigation with the CDN.",
    });
    expect(result.keywordsFound).toContain("rate limiting");
    expect(result.keywordsFound).toContain("edge");
    expect(result.keywordsFound).toContain("CDN");
  });
});

describe("Favoritos de vocabulário (procedimentos)", () => {
  it("bloqueia a leitura de favoritos sem autenticação", async () => {
    const caller = makeCaller(null);
    await expect(caller.podcast.englishVocabulary()).rejects.toThrow();
  });

  it("alterna o favoritamento de um termo válido e rejeita ids inválidos", async () => {
    const caller = makeCaller(regularUser);
    const first = await caller.podcast.toggleEnglishFavorite({ termId: "term-vulnerability" });
    expect(first.favorited).toBe(true);
    const second = await caller.podcast.toggleEnglishFavorite({ termId: "term-vulnerability" });
    expect(second.favorited).toBe(false);
    await expect(caller.podcast.toggleEnglishFavorite({ termId: "invalid-term" })).rejects.toThrow();
  });
});

describe("Episódios English — Network, Cloud, Incident Response e Penetration Testing", () => {
  it("registra os episódios English no catálogo com áudio, transcrição e quiz", () => {
    const episode = podcastEpisodes.find((current) => current.id === "ep72-penetration-testing-interview");
    expect(episode).toBeDefined();
    expect(episode?.audioUrl?.startsWith("/manus-storage/")).toBe(true);
    expect((episode?.transcript.length ?? 0)).toBeGreaterThan(5);
    expect(episode?.topics.length).toBeGreaterThan(0);
    const ep68 = podcastEpisodes.find((current) => current.id === "ep68-english-for-cyber-pros");
    const englishEpisodes = podcastEpisodes.filter((current) => ["ep68-english-for-cyber-pros", "ep69-network-security-interview", "ep70-cloud-security-interview", "ep71-incident-response-interview", "ep72-penetration-testing-interview"].includes(current.id));
    expect(englishEpisodes).toHaveLength(5);
    expect(podcastEpisodes).toHaveLength(88);
  });
});
