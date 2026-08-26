import { describe, expect, it } from "vitest";
import { WEEKLY_CHALLENGE_BONUS_XP, getIsoWeekKey, getWeeklyChallenge, weeklyChallengeRotation } from "../shared/weeklyChallenges";

describe("desafios semanais", () => {
  it("gera uma chave ISO estável para a mesma semana", () => {
    expect(getIsoWeekKey(new Date("2025-01-06T12:00:00Z"))).toBe("2025-W02");
    expect(getIsoWeekKey(new Date("2025-01-12T12:00:00Z"))).toBe("2025-W02");
  });

  it("rotaciona os desafios de forma determinística e mantém o bônus configurado", () => {
    expect(getWeeklyChallenge(new Date("2025-01-06T12:00:00Z"))).toMatchObject({
      key: "soc-log-triage",
      weekKey: "2025-W02",
      xp: WEEKLY_CHALLENGE_BONUS_XP,
    });
    expect(getWeeklyChallenge(new Date("2025-01-13T12:00:00Z"))).toMatchObject({ key: "dfir-log-timeline" });
    expect(weeklyChallengeRotation).toHaveLength(6);
    expect(weeklyChallengeRotation.every((challenge) => challenge.xp === WEEKLY_CHALLENGE_BONUS_XP)).toBe(true);
    expect(weeklyChallengeRotation.filter((challenge) => challenge.activity === "video")).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: "network-video-exposure", courseSlug: "redes-para-cyber-security", activityIndex: 0, chapterIndex: 2 }),
      expect.objectContaining({ key: "linux-video-hardening", courseSlug: "linux-para-operacoes-de-seguranca", activityIndex: 4, chapterIndex: 1 }),
    ]));
  });
});
