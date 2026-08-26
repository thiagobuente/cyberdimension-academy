import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readProject = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("acesso rápido CompTIA+", () => {
  it("aparece na sidebar principal antes de Academias e aponta para a trilha Security+", () => {
    const dashboard = readProject("client/src/pages/Dashboard.tsx");
    const comptia = dashboard.indexOf('>CompTIA+</span>');
    const academias = dashboard.indexOf('> Academias</Link>');
    expect(comptia).toBeGreaterThan(-1);
    expect(dashboard).toContain('href="/securityplus/trilha"');
    expect(comptia).toBeLessThan(academias);
    expect(dashboard).toContain("dashboard-nav-item-comptia");
    expect(dashboard).toContain("SY0-701");
    expect(dashboard).toContain("comptia-sidebar-submenu");
    const weeklyPlan = readProject("client/src/data/securityPlusWeeklyPlan.ts");
    expect(dashboard).toContain("securityPlusWeeklyPlan");
    expect(weeklyPlan).toContain('focus: "General Security Concepts"');
    expect(weeklyPlan).toContain('focus: "Program Management"');
  });

  it("mantém o destino no layout reutilizável e ativa o item nas rotas Security+", () => {
    const layout = readProject("client/src/components/DashboardLayout.tsx");
    expect(layout).toContain('{ icon: ShieldCheck, label: "CompTIA+", path: "/securityplus/trilha" }');
    expect(layout).toContain("isSecurityPlusRoute");
    expect(layout).toContain("comptiaProgress");
    expect(layout).toContain("securityPlusWeeklyPlan");
  });

  it("integra a trilha ao shell e oferece âncoras para cada domínio", () => {
    const path = readProject("client/src/pages/SecurityPlusPath.tsx");
    expect(path).toContain('<DashboardLayout>');
    expect(path).toContain('id={isDomainWeek ? `dominio-${week.domainOrder}` : undefined}');
    expect(path).toContain('scroll-mt-24');
  });

  it("mantém o item legível em largura reduzida e preserva a paleta categorizada", () => {
    const css = readProject("client/src/index.css");
    expect(css).toContain(".dashboard-nav-item-comptia");
    expect(css).toContain(".dashboard-nav-badge");
    expect(css).toContain("font-size: 0.58rem");
    expect(css).toContain(".dashboard-nav-item-accent");
    expect(css).toContain(".dashboard-nav-item-foundation");
    expect(css).toContain(".dashboard-nav-item-audio");
  });
});
