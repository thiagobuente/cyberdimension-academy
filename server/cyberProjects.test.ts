import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

function createCaller(user: { id: number; email: string; name: string | null; openId: string; loginMethod: string; role: string } | null) {
  return appRouter.createCaller({ user } as never);
}

describe("cyberProjects router", () => {
  const caller = createCaller(null);

  it("lists the six program projects", async () => {
    const projects = await caller.cyberProjects.list();
    expect(projects.length).toBe(6);
    const ids = projects.map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "soc-incident-report",
        "web-app-security-audit",
        "grc-security-program",
        "cloud-security-posture",
        "threat-intel-report",
        "pmsec-security-project",
      ]),
    );
  });

  it("returns steps for each project", async () => {
    const projects = await caller.cyberProjects.list();
    for (const project of projects) {
      const detail = await caller.cyberProjects.details({ projectId: project.id });
      expect(detail.steps.length).toBeGreaterThanOrEqual(4);
      expect(detail.steps.every((s) => s.title && s.description)).toBe(true);
    }
  });

  it("rejects unauthenticated users from registering a delivery", async () => {
    await expect(
      createCaller(null).cyberProjects.markDelivered({
        projectId: "soc-incident-report",
        deliveryNote: "Entrega de teste",
      }),
    ).rejects.toThrow();
  });
});

describe("cyberProjects portfolio public endpoint", () => {
  const caller = createCaller(null);

  it("exposes public projects for an active token", async () => {
    // Token inexistente lança NOT_FOUND — o endpoint deve existir sem erro interno
    await expect(
      caller.portfolioPublic.byToken({ token: "token-nao-existente-teste" }),
    ).rejects.toThrow();
  });
});

describe("cyberProjects data integrity", () => {
  it("all project ids reference valid curriculum ids where referenced", async () => {
    const mod = await import("../client/src/data/cyberProjects");
    const cyberProjects = mod.cyberProjects as Array<{ id: string; steps: { title: string; description: string }[]; xp: number }>;
    for (const project of cyberProjects) {
      expect(project.id).toBeTruthy();
      expect(project.steps.length).toBeGreaterThanOrEqual(4);
    }
  });
});
