import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  cloudSecurityBadgeCode,
  cloudSecurityCourseSlugs,
  cloudSecurityTrackSlug,
  hasCompletedCloudSecurityTrack,
} from "../shared/cloudSecurityBadge";

describe("badge exclusivo da trilha Cloud Security", () => {
  it("só reconhece a trilha quando AWS e Azure foram concluídos", () => {
    expect(hasCompletedCloudSecurityTrack([])).toBe(false);
    expect(hasCompletedCloudSecurityTrack([cloudSecurityCourseSlugs[0]])).toBe(false);
    expect(hasCompletedCloudSecurityTrack([...cloudSecurityCourseSlugs])).toBe(true);
  });

  it("mantém o identificador do badge e da trilha estáveis para persistência e verificação", () => {
    expect(cloudSecurityTrackSlug).toBe("cloud-security-specialization");
    expect(cloudSecurityBadgeCode).toBe("cloud-security-specialist");
  });

  it("sincroniza a conquista no resumo do estudante e após avanços de curso", () => {
    const routerSource = readFileSync("server/routers.ts", "utf8");
    expect(routerSource).toContain("syncCloudSecurityTrackAchievement(userId)");
    expect(routerSource).toContain("await syncCloudSecurityTrackAchievement(ctx.user.id)");
    expect(routerSource).toContain("badgeCode: cloudSecurityBadgeCode");
  });
});
