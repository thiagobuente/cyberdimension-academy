import { academies, careerGoals, getCurriculumCourseByTitle, type AcademySlug } from "./curriculumCatalog";

/** Progresso real do aluno vindo do backend (formations.summary ou formations.readiness). */
export interface RealProgress {
  modules: Array<{ courseSlug: string; moduleIndex: number; completed: boolean }>;
  labs?: Array<{ courseSlug: string; labIndex: number; completed: boolean }>;
  certificates?: Array<{ courseSlug: string }>;
}

export type CompetencyStatus = "done" | "in-progress" | "not-started";

export interface CourseReadiness {
  title: string;
  courseTitle: string;
  slug: string | null;
  status: CompetencyStatus;
  competencyName: string;
}

export interface AcademyReadiness {
  academySlug: AcademySlug;
  academyName: string;
  competencies: CourseReadiness[];
  nextStep: { title: string; slug: string | null; isFirst: boolean } | null;
  score: number;
}

/** Resolve títulos da sequência de carreira para cursos do currículo. */
export function resolveCareerSequence(titles: string[]): Array<{ title: string; slug: string | null }> {
  return titles.map((title) => {
    const course = getCurriculumCourseByTitle(title);
    return { title, slug: course?.existingSlug ?? null };
  });
}

/** Calcula o estado de um curso da sequência a partir do progresso real. */
function courseStatus(
  courseSlug: string | null,
  progress: RealProgress,
): CompetencyStatus {
  if (!courseSlug) return "not-started";
  const moduleRows = progress.modules.filter((row) => row.courseSlug === courseSlug);
  if (moduleRows.length === 0) {
    const hasCert = progress.certificates?.some((cert) => cert.courseSlug === courseSlug);
    if (hasCert) return "done";
    return "not-started";
  }
  const allDone = moduleRows.every((row) => row.completed);
  const anyProgress = moduleRows.some((row) => row.completed);
  if (allDone) return "done";
  if (anyProgress) return "in-progress";
  return "not-started";
}

/** Calcula a prontidão de uma academia a partir da sequência de carreira recomendada. */
export function getAcademyReadiness(academySlug: AcademySlug, progress: RealProgress): AcademyReadiness | null {
  const academy = academies.find((item) => item.slug === academySlug);
  if (!academy) return null;
  const goal = careerGoals.find((item) => item.academy === academySlug);
  const sequence = goal?.startSequence ?? academy.route;
  if (!sequence || sequence.length === 0) return null;
  const competencies: CourseReadiness[] = resolveCareerSequence(sequence).map((item) => ({
    title: item.title,
    courseTitle: item.title,
    slug: item.slug,
    status: courseStatus(item.slug, progress),
    competencyName: item.title,
  }));
  const nextIndex = competencies.findIndex((item) => item.status !== "done");
  const total = competencies.length;
  const doneCount = competencies.filter((item) => item.status === "done").length;
  const nextStep =
    nextIndex === -1
      ? null
      : {
          title: competencies[nextIndex].title,
          slug: competencies[nextIndex].slug,
          isFirst: nextIndex === 0,
        };
  return {
    academySlug,
    academyName: academy.name,
    competencies,
    nextStep,
    score: total === 0 ? 0 : Math.round((doneCount / total) * 100),
  };
}

/** A academia recomendada pelo teste vocacional, quando disponível. */
export function getRecommendedAcademy(quizArea: string | null): AcademySlug | null {
  if (!quizArea) return null;
  // O backend persiste topArea nas chaves do teste vocacional (shared/careerQuiz):
  // soc, pentest, grc, cloud, forense, engenharia. Forense também é Blue Team.
  const mapping: Record<string, AcademySlug> = {
    soc: "blue-team",
    pentest: "red-team",
    grc: "grc",
    cloud: "cloud-security",
    forense: "blue-team",
    engenharia: "security-engineering",
  };
  return mapping[quizArea] ?? null;
}

/** Índice de prontidão global do aluno: média da prontidão das academias com progresso. */
export function getOverallReadiness(progress: RealProgress, quizArea: string | null): { score: number; academy: AcademySlug | null } {
  const recommended = getRecommendedAcademy(quizArea);
  const scores = academies.map((academy) => getAcademyReadiness(academy.slug, progress)?.score ?? 0);
  const score = scores.length === 0 ? 0 : Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length);
  return { score, academy: recommended };
}
