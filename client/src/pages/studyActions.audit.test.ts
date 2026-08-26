import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("auditoria dos fluxos de estudo", () => {
  it("protege a recuperação do carregamento do simulado e sua ação visível", () => {
    const quiz = projectFile("client/src/pages/Quiz.tsx");

    expect(quiz).toContain("retryQuestionLoad");
    expect(quiz).toContain("questionsQuery.refetch()");
    expect(quiz).toContain("allQuestionsQuery.refetch()");
    expect(quiz).toContain("Tentar novamente");
    expect(quiz).toContain("submitQuiz.mutateAsync");
  });

  it("mantém conectadas as ações principais da formação", () => {
    const study = projectFile("client/src/pages/FormationStudy.tsx");

    [
      "trpc.formations.progress.useQuery",
      "trpc.formations.moduleQuiz.useQuery",
      "submitModuleQuiz.mutateAsync",
      "runLab.mutateAsync",
      "verifyLab.mutateAsync",
      "submitAssessment.mutateAsync",
      "issueCertificate.mutateAsync",
      "ReadingControls",
      "studyHeadingRef",
      "scrollIntoView({ behavior: \"smooth\", block: \"start\" })",
      "focus({ preventScroll: true })",
    ].forEach((integration) => expect(study).toContain(integration));
  });

  it("mantém a conclusão de aula reversível, celebrada e orientada ao próximo conteúdo", () => {
    const course = projectFile("client/src/pages/Course.tsx");

    [
      "trpc.progress.markIncomplete.useMutation",
      "duration: 5000",
      "label: \"Desfazer\"",
      "GAMIFICATION_RULES.completedLesson",
      "lesson-completion-celebration",
      "lesson-next-step",
      "Próxima aula",
      "studyHeadingRef",
      "previousLessonIdRef",
      "scrollIntoView({ behavior: \"smooth\", block: \"start\" })",
      "focus({ preventScroll: true })",
    ].forEach((integration) => expect(course).toContain(integration));
  });

  it("mantém o layout de aulas amplo sem esticar a coluna de leitura", () => {
    const css = projectFile("client/src/index.css");
    const course = projectFile("client/src/pages/Course.tsx");
    const formation = projectFile("client/src/pages/FormationStudy.tsx");
    expect(css).toContain("max-width: 1600px");
    expect(css).toContain(".study-copy");
    expect(course).toContain("lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]");
    expect(formation).toContain("xl:grid-cols-[19rem_minmax(0,1fr)]");
  });

  it("mantém a busca global conectada aos catálogos e controles de teclado", () => {
    const search = projectFile("client/src/components/GlobalSearch.tsx");
    ["functionalCourses", "curriculumCourses", "academies", "cyberProjects", "podcastEpisodes", "setTimeout", "Escape", "Enter", "Nenhum conteúdo encontrado", "aria-label"].forEach((integration) => expect(search).toContain(integration));
  });

  it("mantém a central de notificações com eventos reais, filtros e ações", () => {
    const notifications = projectFile("client/src/pages/Notifications.tsx");
    ["progress.list.useQuery", "certificates.list.useQuery", "podcast.getProgress.useQuery", "Marcar todas como lidas", "Marcar como lida", "Dispensar", "Preferências", "Nenhuma notificação"].forEach((integration) => expect(notifications).toContain(integration));
  });

  it("mantém a rota de notificações e as rotas de curso disponíveis", () => {
    const app = projectFile("client/src/App.tsx");

    ["/notificacoes", "/course/:domainId", "/quiz/:domainId", "/quiz", "/formation/:slug", "/formacoes/:slug/estudar"].forEach((route) =>
      expect(app).toContain(route),
    );
  });
});
