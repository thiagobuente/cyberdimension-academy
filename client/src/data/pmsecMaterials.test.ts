import { describe, expect, it } from "vitest";
import { getPmsecModuleMaterial, pmsecMaterials } from "./pmsecMaterials";

describe("materiais autorais da PMSEC-01", () => {
  it("contém cinco módulos em sequência", () => {
    expect(pmsecMaterials).toHaveLength(5);
    expect(pmsecMaterials.map((module) => module.moduleIndex)).toEqual([0, 1, 2, 3, 4]);
  });

  it("oferece cinco aulas detalhadas por módulo", () => {
    for (const module of pmsecMaterials) {
      expect(module.objective.length).toBeGreaterThan(40);
      expect(module.keyTerms.length).toBeGreaterThanOrEqual(5);
      expect(module.lessons).toHaveLength(5);
      for (const lesson of module.lessons) {
        expect(lesson.concept.length).toBeGreaterThan(40);
        expect(lesson.practice.length).toBeGreaterThan(30);
        expect(lesson.checkpoint.length).toBeGreaterThan(20);
      }
    }
  });

  it("localiza o material pelo índice e retorna vazio para índice inválido", () => {
    expect(getPmsecModuleMaterial(2)?.title).toContain("Governança");
    expect(getPmsecModuleMaterial(99)).toBeUndefined();
  });
});
