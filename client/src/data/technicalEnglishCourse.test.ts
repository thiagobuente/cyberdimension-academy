import { describe, expect, it } from "vitest";
import { technicalEnglishCourse } from "@shared/technicalEnglishCourse";

describe("curso de inglês técnico para cibersegurança", () => {
  it("mantém seis módulos progressivos com quizzes e laboratórios", () => {
    expect(technicalEnglishCourse.sections).toHaveLength(6);
    technicalEnglishCourse.sections.forEach((section) => {
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.keyPoints.length).toBeGreaterThan(0);
    });
    expect(technicalEnglishCourse.labs).toHaveLength(4);
    technicalEnglishCourse.labs.forEach((lab) => {
      expect(lab.scenario.length).toBeGreaterThan(30);
      expect(lab.solutionNotes.length).toBeGreaterThanOrEqual(1);
      lab.solutionNotes.forEach((note) => {
        expect(note.length).toBeGreaterThan(10);
      });
    });
  });

  it("possui uma avaliação final certificável com respostas e justificativas", () => {
    expect(technicalEnglishCourse.knowledgeCheck.length).toBeGreaterThanOrEqual(5);
    technicalEnglishCourse.knowledgeCheck.forEach((item) => {
      expect(item.correctIndex).toBeGreaterThanOrEqual(0);
      expect(item.correctIndex).toBeLessThan(item.options.length);
      expect(item.rationale.length).toBeGreaterThan(20);
    });
    expect(technicalEnglishCourse.passingScore).toBe(80);
    expect(technicalEnglishCourse.totalModules).toBe(6);
  });

  it("valida o vocabulário essencial de cada módulo de estudo", () => {
    technicalEnglishCourse.sections.slice(0, 5).forEach((section) => {
      section.vocabulary.forEach((entry) => {
        expect(entry.term.length).toBeGreaterThan(1);
        expect(entry.translation.length).toBeGreaterThan(1);
        expect(entry.context.length).toBeGreaterThan(10);
      });
    });
  });
});
