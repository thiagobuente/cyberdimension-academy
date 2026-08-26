import { describe, expect, it } from "vitest";
import { gradeModuleQuestion, gradeModuleQuiz, getPublicModuleQuiz } from "./orbitCourses";

describe("quizzes de fixação por módulo", () => {
  it("expõe duas perguntas sem respostas nem explicações ao estudante", () => {
    const questions = getPublicModuleQuiz("fundamentos-cyber-security", 0);
    expect(questions).toHaveLength(2);
    expect(questions[0]).not.toHaveProperty("correctAnswer");
    expect(questions[0]).not.toHaveProperty("explanation");
  });

  it("corrige o quiz e devolve feedback pedagógico por questão", () => {
    const result = gradeModuleQuiz("windows-security", 0, [0, 1]);
    expect(result).toMatchObject({ score: 2, totalQuestions: 2, percentage: 100 });
    expect(result?.review.every((item) => item.correct && item.explanation.length > 0)).toBe(true);
  });

  it("corrige uma questão isolada e devolve explicação quando a resposta está errada", () => {
    const result = gradeModuleQuestion("fundamentos-cyber-security", 0, 0, 1);
    expect(result).toMatchObject({ correct: false, correctAnswer: 0 });
    expect(result?.explanation).toContain("Este módulo consolida");
    expect(gradeModuleQuestion("fundamentos-cyber-security", 0, 9, 0)).toBeNull();
  });

  it("rejeita uma tentativa incompleta ou módulo inexistente", () => {
    expect(gradeModuleQuiz("windows-security", 0, [0])).toBeNull();
    expect(gradeModuleQuiz("windows-security", 9, [0, 1])).toBeNull();
  });
});
