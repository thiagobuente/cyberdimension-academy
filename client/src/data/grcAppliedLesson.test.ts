import { describe, expect, it } from "vitest";
import { grcAppliedLesson } from "./grcAppliedLesson";

describe("aula especial de GRC aplicado", () => {
  it("mantém cinco módulos conectados às fontes fornecidas", () => {
    expect(grcAppliedLesson.sections).toHaveLength(5);
    expect(grcAppliedLesson.sources).toHaveLength(9);
    expect(grcAppliedLesson.sections.map((section) => section.id)).toEqual(["decisao", "risco-politica", "zero-trust", "secure-sdlc", "ia"]);
  });

  it("possui uma avaliação verificável com respostas e justificativas", () => {
    expect(grcAppliedLesson.knowledgeCheck).toHaveLength(5);
    grcAppliedLesson.knowledgeCheck.forEach((item) => {
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThan(item.options.length);
      expect(item.rationale.length).toBeGreaterThan(20);
    });
  });
});
