import { describe, expect, it } from "vitest";
import { securityPlusWeeklyPlan } from "@/data/securityPlusWeeklyPlan";
import { getSecurityPlusWeeklyProgress } from "./securityPlusWeeklyProgress";

const emptyDomains = [1, 2, 3, 4, 5].map((order) => ({ order, totalLessons: 10, completedLessons: 0, bestScore: null }));

describe("getSecurityPlusWeeklyProgress", () => {
  it("mantém a primeira semana ativa até que aulas e a meta de quiz sejam cumpridas", () => {
    const state = getSecurityPlusWeeklyProgress({ plan: securityPlusWeeklyPlan, domains: emptyDomains, hasConsolidationAttempt: false });

    expect(state.currentWeekNumber).toBe(1);
    expect(state.weekStates[0]).toMatchObject({ lessonProgress: 0, complete: false });
  });

  it("exige 100% das aulas e 70% no simulado para concluir um domínio", () => {
    const incompleteQuiz = getSecurityPlusWeeklyProgress({ plan: securityPlusWeeklyPlan, domains: [{ order: 1, totalLessons: 10, completedLessons: 10, bestScore: 69 }, ...emptyDomains.slice(1)], hasConsolidationAttempt: false });
    const completeWeek = getSecurityPlusWeeklyProgress({ plan: securityPlusWeeklyPlan, domains: [{ order: 1, totalLessons: 10, completedLessons: 10, bestScore: 70 }, ...emptyDomains.slice(1)], hasConsolidationAttempt: false });

    expect(incompleteQuiz.weekStates[0].complete).toBe(false);
    expect(completeWeek.weekStates[0].complete).toBe(true);
    expect(completeWeek.currentWeekNumber).toBe(2);
  });

  it("libera a consolidação somente depois de todos os domínios e um simulado geral", () => {
    const preparedDomains = [1, 2, 3, 4, 5].map((order) => ({ order, totalLessons: 10, completedLessons: 10, bestScore: 80 }));
    const withoutGeneralQuiz = getSecurityPlusWeeklyProgress({ plan: securityPlusWeeklyPlan, domains: preparedDomains, hasConsolidationAttempt: false });
    const withGeneralQuiz = getSecurityPlusWeeklyProgress({ plan: securityPlusWeeklyPlan, domains: preparedDomains, hasConsolidationAttempt: true });

    expect(withoutGeneralQuiz.currentWeekNumber).toBe(6);
    expect(withoutGeneralQuiz.weekStates[5].complete).toBe(false);
    expect(withGeneralQuiz.weekStates[5].complete).toBe(true);
    expect(withGeneralQuiz.totalProgress).toBe(100);
  });
});
