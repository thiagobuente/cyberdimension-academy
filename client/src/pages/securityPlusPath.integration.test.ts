import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const dashboardSource = readFileSync(new URL("./Dashboard.tsx", import.meta.url), "utf8");
const progressSource = readFileSync(new URL("./Progress.tsx", import.meta.url), "utf8");
const pathSource = readFileSync(new URL("./SecurityPlusPath.tsx", import.meta.url), "utf8");

describe("integração da trilha semanal Security+", () => {
  it("mantém a rota exclusiva registrada no aplicativo", () => {
    expect(appSource).toContain('path={"/securityplus/trilha"}');
    expect(appSource).toContain("component={SecurityPlusPath}");
  });

  it("mantém pontos de entrada no painel e no progresso", () => {
    expect(dashboardSource).toContain('href="/securityplus/trilha"');
    expect(progressSource).toContain('href="/securityplus/trilha"');
  });

  it("preserva CTAs para estudar e praticar em cada checkpoint da página", () => {
    expect(pathSource).toContain("Estudar");
    expect(pathSource).toContain("Praticar");
    expect(pathSource).toContain("Abrir simulado geral");
  });
});
