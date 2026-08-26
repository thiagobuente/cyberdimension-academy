import { describe, expect, it } from "vitest";
import { SECURITY_PLUS_WEEKLY_TARGET, securityPlusWeeklyPlan } from "./securityPlusWeeklyPlan";

describe("securityPlusWeeklyPlan", () => {
  it("organiza seis semanas com os cinco domínios antes da consolidação", () => {
    expect(securityPlusWeeklyPlan).toHaveLength(6);
    expect(securityPlusWeeklyPlan.slice(0, 5).map((week) => week.domainOrder)).toEqual([1, 2, 3, 4, 5]);
    expect(securityPlusWeeklyPlan[5].focus).toContain("simulado geral");
  });

  it("usa uma meta mínima consistente para as semanas de domínio", () => {
    expect(securityPlusWeeklyPlan.slice(0, 5).every((week) => week.quizTarget === SECURITY_PLUS_WEEKLY_TARGET)).toBe(true);
  });
});
