import { describe, expect, it } from "vitest";
import { calculateMissionXp, getMissionLevel, getStudyRecommendation } from "./commandCenter";

describe("Command Center", () => {
  it("calcula XP somente a partir de marcos reais da conta", () => {
    expect(calculateMissionXp({ completedLessons: 3, approvedQuizzes: 2, completedLabs: 1, certificates: 0 })).toBe(600);
  });

  it("informa o nível e o progresso até a próxima promoção", () => {
    expect(getMissionLevel(780)).toMatchObject({ level: 2, progressToNextLevel: 280, xpPerLevel: 500, title: "Cyber Cadet" });
    expect(getMissionLevel(1500)).toMatchObject({ level: 4, title: "Network Sentinel" });
  });

  it("prioriza revisão quando o último simulado ficou abaixo da meta", () => {
    const recommendation = getStudyRecommendation({ title: "Security Architecture", progress: 42, latestScore: 64 });
    expect(recommendation.eyebrow).toBe("REVISÃO RECOMENDADA");
    expect(recommendation.action).toBe("Revisar conteúdo");
  });

  it("orienta a continuidade ou o início conforme o progresso", () => {
    expect(getStudyRecommendation({ title: "Threats & Vulnerabilities", progress: 32, latestScore: null }).eyebrow).toBe("CONTINUE A MISSÃO");
    expect(getStudyRecommendation({ title: "Security Operations", progress: 0, latestScore: null }).eyebrow).toBe("PRÓXIMA MISSÃO");
  });
});
