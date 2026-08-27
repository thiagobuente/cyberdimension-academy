import { describe, expect, it } from "vitest";
import { aiAcademyCourse, aiAcademyModuleTitles, aiAcademyProjects, aiAcademyPromptLab } from "./aiAcademyCourse";

describe("Academia de Inteligência Artificial", () => {
  it("mantém a trilha progressiva com 10 módulos e avaliação final", () => {
    expect(aiAcademyCourse.slug).toBe("ia-do-zero-ao-avancado");
    expect(aiAcademyCourse.modules).toHaveLength(10);
    expect(aiAcademyCourse.modules.map((module) => module.title)).toEqual(aiAcademyModuleTitles);
    expect(aiAcademyCourse.modules.every((module) => module.lessons >= 10)).toBe(true);
    expect(aiAcademyCourse.labsList).toHaveLength(10);
    expect(aiAcademyCourse.assessmentQuestions).toHaveLength(10);
    expect(aiAcademyCourse.assessmentQuestions.every((question) => question.options.length === 4)).toBe(true);
  });

  it("oferece Prompt Lab e projetos seguros sem dados reais", () => {
    expect(aiAcademyPromptLab).toHaveLength(6);
    expect(aiAcademyPromptLab.every((item) => item.prompt.length > 40)).toBe(true);
    expect(aiAcademyProjects).toHaveLength(5);
    expect(aiAcademyProjects.every((project) => project.deliverable.length > 30)).toBe(true);
    expect(JSON.stringify(aiAcademyCourse)).not.toMatch(/api[_-]?key|password|secret|token/i);
  });
});
