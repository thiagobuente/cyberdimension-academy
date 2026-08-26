import { technicalEnglishCourse, technicalEnglishCertificateTitle, technicalEnglishLessonSlug, technicalEnglishPassingScore, technicalEnglishSectionIds } from "@shared/technicalEnglishCourse";

export { technicalEnglishCertificateTitle, technicalEnglishLessonSlug, technicalEnglishPassingScore, technicalEnglishSectionIds };

const assessment = technicalEnglishCourse.knowledgeCheck.map((question, index) => ({
  id: `questao-${index + 1}`,
  question: question.question,
  options: [...question.options],
  correctIndex: question.correctIndex,
}));

export function getTechnicalEnglishAssessment() {
  return assessment.map(({ correctIndex: _correctIndex, ...question }) => question);
}

export function gradeTechnicalEnglishAssessment(answers: number[]) {
  const correctAnswers = assessment.filter((question, index) => answers[index] === question.correctIndex).length;
  const score = Math.round((correctAnswers / assessment.length) * 100);
  return { score, totalQuestions: assessment.length, passed: score >= technicalEnglishPassingScore };
}
