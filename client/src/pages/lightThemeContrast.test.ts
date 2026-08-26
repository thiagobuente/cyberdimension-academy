import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readProjectFile = (path: string) => readFileSync(path, "utf8");

describe("contraste do tema claro nas áreas de estudo", () => {
  const styles = readProjectFile("client/src/index.css");
  const formationStudy = readProjectFile("client/src/pages/FormationStudy.tsx");
  const course = readProjectFile("client/src/pages/Course.tsx");
  const quiz = readProjectFile("client/src/pages/Quiz.tsx");
  const weeklyPath = readProjectFile("client/src/pages/SecurityPlusPath.tsx");
  const controls = readProjectFile("client/src/components/ReadingControls.tsx");

  it("mantém o cabeçalho e a missão escuros com tokens de texto claros locais", () => {
    expect(styles).toContain('html[data-reading-theme="light"] .study-session-header,');
    expect(styles).toContain('html[data-reading-theme="light"] .study-hero,');
    expect(styles).toContain("--foreground: oklch(0.96 0.008 260);");
    expect(formationStudy).toContain("study-session-header");
    expect(formationStudy).toContain("study-hero");
    expect(course).toContain("study-session-header");
  });

  it("substitui superfícies pretas translúcidas por superfícies claras legíveis", () => {
    expect(styles).toContain('html[data-reading-theme="light"] .formation-study .study-surface-subtle');
    expect(styles).toContain('html[data-reading-theme="light"] .formation-study .study-surface-soft');
    expect(formationStudy).toContain("study-surface-subtle");
    expect(formationStudy).toContain("study-surface-soft");
  });

  it("preserva títulos e cópia didática em tons escuros sobre o painel claro", () => {
    expect(styles).toContain('html[data-reading-theme="light"] .study-copy,');
    expect(styles).toContain('html[data-reading-theme="light"] .study-copy h1,');
    expect(styles).toContain("html[data-reading-theme=\"light\"] .study-module-title");
  });

  it("não mantém a inversão escura nem texto claro dentro da lição em tema claro", () => {
    expect(course).not.toContain("study-copy prose prose-invert");
    expect(styles).toContain('html[data-reading-theme="light"] .reading-panel {');
    expect(styles).toContain("--tw-prose-body: oklch(0.28 0.018 260);");
    expect(styles).toContain(".reading-panel .study-copy :is(p, li, blockquote, td, dd)");
    expect(styles).toContain("color: oklch(0.28 0.018 260) !important;");
    expect(styles).toContain(".reading-panel .study-copy :is(h1, h2, h3, h4, strong, th)");
    expect(styles).toContain("color: oklch(0.18 0.02 260) !important;");
  });

  it("estende superfícies claras legíveis ao simulado e à trilha semanal", () => {
    expect(styles).toContain('html[data-reading-theme="light"] .quiz-study .quiz-study-surface');
    expect(styles).toContain('html[data-reading-theme="light"] .weekly-path-study .weekly-goal-surface');
    expect(quiz).toContain("quiz-study-surface");
    expect(quiz).toContain("quiz-answer-option");
    expect(weeklyPath).toContain("weekly-goal-surface");
    expect(weeklyPath).toContain("weekly-card-action");
  });

  it("oferece contraste elevado persistente e transição que respeita redução de movimento", () => {
    expect(controls).toContain("setHighContrast");
    expect(controls).toContain("Contraste alto");
    expect(styles).toContain('html[data-reading-contrast="high"]');
    expect(styles).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(styles).toContain(".reading-theme-transition");
    expect(course).toContain("reading-theme-transition");
    expect(formationStudy).toContain("reading-theme-transition");
    expect(quiz).toContain("reading-theme-transition");
    expect(weeklyPath).toContain("reading-theme-transition");
  });
});
