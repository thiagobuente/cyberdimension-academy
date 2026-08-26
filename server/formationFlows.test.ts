import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMock = vi.hoisted(() => ({
  createCourseCertificate: vi.fn(),
  createCourseAssessmentAttempt: vi.fn(),
  createCourseLabRun: vi.fn(),
  createCourseModuleQuizAttempt: vi.fn(),
  awardCourseAchievements: vi.fn(),
  getAllCourseAchievementsByUser: vi.fn(),
  getAllCourseProgressByUser: vi.fn(),
  getCertificateByIdentifier: vi.fn(),
  getCertificatesByUser: vi.fn(),
  getCourseAssessment: vi.fn(),
  getCourseAssessmentAttempts: vi.fn(),
  getCourseAchievements: vi.fn(),
  getPublicCourseAchievement: vi.fn(),
  getCourseCertificateByIdentifier: vi.fn(),
  getCourseCertificateByUserAndSlug: vi.fn(),
  getCourseCertificatesByUser: vi.fn(),
  getCourseLabProgress: vi.fn(),
  getCourseLabRunById: vi.fn(),
  getCourseModuleProgress: vi.fn(),
  getCourseModuleQuizAttempts: vi.fn(),
  getCourseVideoProgress: vi.fn(),
  getCourseVideoNotes: vi.fn(),
  getCourseVideoQuizAttempts: vi.fn(),
  getCourseFavorites: vi.fn(),
  getAllCourseQuizAttemptsForStreak: vi.fn(),
  claimQuizStreakReward: vi.fn(),
  getDomains: vi.fn(),
  markCourseLabRunVerified: vi.fn(),
  addCourseFavorite: vi.fn(),
  removeCourseFavorite: vi.fn(),
  saveCourseLabProgress: vi.fn(),
  saveCourseModuleProgress: vi.fn(),
  saveCourseAssessment: vi.fn(),
  saveCourseVideoProgress: vi.fn(),
  saveCourseVideoNote: vi.fn(),
  removeCourseVideoNote: vi.fn(),
  createCourseVideoQuizAttempt: vi.fn(),
  createSpecialtySimulationAttempt: vi.fn(),
  getActiveSpecialtySimulationAttempt: vi.fn(),
  getSpecialtySimulationAttemptById: vi.fn(),
  submitSpecialtySimulationAttempt: vi.fn(),
  getSpecialtySimulationAttemptsByUser: vi.fn(),
  getVerifiedCourseLabRunsByUser: vi.fn(),
}));

vi.mock("./db", () => dbMock);

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 41,
    openId: "formation-test-user",
    email: "aluna@example.com",
    name: "Ana Teste",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { clearCookie: vi.fn() } as TrpcContext["res"] };
}

describe("fluxos tRPC das formações ORBIT", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.getCourseModuleProgress.mockResolvedValue([]);
    dbMock.getCourseModuleQuizAttempts.mockResolvedValue([]);
    dbMock.getCourseLabProgress.mockResolvedValue([]);
    dbMock.getCourseAssessment.mockResolvedValue(undefined);
    dbMock.getCourseAssessmentAttempts.mockResolvedValue([]);
    dbMock.getCourseAchievements.mockResolvedValue([]);
    dbMock.getCourseVideoProgress.mockResolvedValue([]);
    dbMock.getCourseVideoNotes.mockResolvedValue([]);
    dbMock.getCourseVideoQuizAttempts.mockResolvedValue([]);
    dbMock.getCourseFavorites.mockResolvedValue([]);
    dbMock.getAllCourseQuizAttemptsForStreak.mockResolvedValue([]);
    dbMock.claimQuizStreakReward.mockResolvedValue({ claimed: false });
    dbMock.createCourseVideoQuizAttempt.mockResolvedValue({ id: 301 });
    dbMock.createCourseModuleQuizAttempt.mockResolvedValue({ id: 302 });
    dbMock.getAllCourseAchievementsByUser.mockResolvedValue([]);
    dbMock.getCourseCertificatesByUser.mockResolvedValue([]);
    dbMock.getCertificatesByUser.mockResolvedValue([]);
    dbMock.getDomains.mockResolvedValue([]);
    dbMock.getCourseCertificateByUserAndSlug.mockResolvedValue(undefined);
    dbMock.getCourseCertificateByIdentifier.mockResolvedValue(undefined);
    dbMock.getCertificateByIdentifier.mockResolvedValue(undefined);
    dbMock.getPublicCourseAchievement.mockResolvedValue(undefined);
  });

  it("retorna o progresso persistido da formação autenticada", async () => {
    dbMock.getCourseModuleProgress.mockResolvedValue([{ moduleIndex: 0, completed: true }]);
    dbMock.getCourseLabProgress.mockResolvedValue([{ labIndex: 0, completed: true }]);
    const caller = appRouter.createCaller(createContext());

    const result = await caller.formations.progress({ courseSlug: "fundamentos-ti" });

    expect(result.modules).toHaveLength(1);
    expect(result.labs).toHaveLength(1);
    expect(dbMock.getCourseModuleProgress).toHaveBeenCalledWith(41, "fundamentos-ti");
  });

  it("salva capítulo de retomada e favoritos para uma formação em vídeo", async () => {
    const caller = appRouter.createCaller(createContext());

    await caller.formations.saveVideoProgress({ courseSlug: "redes-para-cyber-security", moduleIndex: 1, chapterIndex: 2 });
    const favorite = await caller.formations.setFavorite({ courseSlug: "redes-para-cyber-security", favorite: true });
    const removed = await caller.formations.setFavorite({ courseSlug: "redes-para-cyber-security", favorite: false });

    expect(dbMock.saveCourseVideoProgress).toHaveBeenCalledWith(expect.objectContaining({ userId: 41, courseSlug: "redes-para-cyber-security", moduleIndex: 1, chapterIndex: 2 }));
    expect(dbMock.addCourseFavorite).toHaveBeenCalledWith(41, "redes-para-cyber-security");
    expect(dbMock.removeCourseFavorite).toHaveBeenCalledWith(41, "redes-para-cyber-security");
    expect(favorite).toEqual({ favorite: true });
    expect(removed).toEqual({ favorite: false });
  });

  it("salva e remove uma nota privada no capítulo selecionado", async () => {
    const caller = appRouter.createCaller(createContext());

    await caller.formations.saveVideoNote({ courseSlug: "redes-para-cyber-security", moduleIndex: 0, chapterIndex: 2, content: "Revisar portas antes do laboratório." });
    await caller.formations.removeVideoNote({ courseSlug: "redes-para-cyber-security", moduleIndex: 0, chapterIndex: 2 });

    expect(dbMock.saveCourseVideoNote).toHaveBeenCalledWith(expect.objectContaining({ userId: 41, courseSlug: "redes-para-cyber-security", moduleIndex: 0, chapterIndex: 2, content: "Revisar portas antes do laboratório." }));
    expect(dbMock.removeCourseVideoNote).toHaveBeenCalledWith(41, "redes-para-cyber-security", 0, 2);
  });

  it("corrige o quiz rápido de vídeo sem expor respostas e persiste a tentativa", async () => {
    const caller = appRouter.createCaller(createContext());

    const quiz = await caller.formations.videoQuiz({ courseSlug: "redes-para-cyber-security", moduleIndex: 0 });
    const result = await caller.formations.submitVideoQuiz({ courseSlug: "redes-para-cyber-security", moduleIndex: 0, answers: [0, 0] });

    expect(quiz.questions).toHaveLength(2);
    expect(quiz.questions[0]).not.toHaveProperty("correctAnswer");
    expect(result.totalQuestions).toBe(2);
    expect(result.streak).toEqual({ currentStreak: 0, bonusXp: 0, milestone: null });
    expect(dbMock.createCourseVideoQuizAttempt).toHaveBeenCalledWith(expect.objectContaining({ userId: 41, courseSlug: "redes-para-cyber-security", moduleIndex: 0, totalQuestions: 2 }));
  });

  it("entrega e corrige o quiz de uma nova formação audiovisual", async () => {
    const caller = appRouter.createCaller(createContext());

    const quiz = await caller.formations.videoQuiz({ courseSlug: "cloud-security-operations", moduleIndex: 1 });
    const result = await caller.formations.submitVideoQuiz({ courseSlug: "cloud-security-operations", moduleIndex: 1, answers: [0, 0] });

    expect(quiz.questions).toHaveLength(2);
    expect(quiz.questions[0]).not.toHaveProperty("correctAnswer");
    expect(result).toMatchObject({ score: 2, totalQuestions: 2, percentage: 100 });
    expect(dbMock.createCourseVideoQuizAttempt).toHaveBeenCalledWith(expect.objectContaining({ userId: 41, courseSlug: "cloud-security-operations", moduleIndex: 1, totalQuestions: 2 }));
  });

  it("concede o bônus do marco ao atingir uma sequência perfeita", async () => {
    dbMock.getAllCourseQuizAttemptsForStreak.mockResolvedValue([
      { score: 2, totalQuestions: 2 },
      { score: 2, totalQuestions: 2 },
      { score: 2, totalQuestions: 2 },
    ]);
    dbMock.claimQuizStreakReward.mockResolvedValue({ claimed: true });
    const caller = appRouter.createCaller(createContext());

    const result = await caller.formations.submitVideoQuiz({ courseSlug: "redes-para-cyber-security", moduleIndex: 0, answers: [0, 0] });

    expect(result.streak).toEqual({ currentStreak: 3, bonusXp: 50, milestone: { label: "Tríade de Precisão", xp: 50 } });
    expect(dbMock.claimQuizStreakReward).toHaveBeenCalledWith(expect.objectContaining({ userId: 41, attemptType: "video", attemptId: 301, streakLength: 3, awardedXp: 50 }));
  });

  it("explica o erro e só registra a conclusão do módulo após uma nova tentativa perfeita", async () => {
    const caller = appRouter.createCaller(createContext());

    const quiz = await caller.formations.moduleQuiz({ courseSlug: "fundamentos-ti", moduleIndex: 0 });
    const wrongResult = await caller.formations.submitModuleQuiz({ courseSlug: "fundamentos-ti", moduleIndex: 0, answers: [0, 0] });

    expect(quiz.questions).toHaveLength(2);
    expect(quiz.questions[0]).not.toHaveProperty("correctAnswer");
    expect(quiz.questions[0]).not.toHaveProperty("explanation");
    expect(wrongResult).toMatchObject({ score: 1, totalQuestions: 2, percentage: 50, completed: false });
    expect(wrongResult.review).toEqual(expect.arrayContaining([expect.objectContaining({ correct: false, explanation: expect.any(String) })]));
    expect(dbMock.createCourseModuleQuizAttempt).toHaveBeenCalledWith(expect.objectContaining({ courseSlug: "fundamentos-ti", moduleIndex: 0, totalQuestions: 2 }));
    expect(dbMock.saveCourseModuleProgress).not.toHaveBeenCalled();

    const correctResult = await caller.formations.submitModuleQuiz({ courseSlug: "fundamentos-ti", moduleIndex: 0, answers: [0, 1] });
    expect(correctResult).toMatchObject({ score: 2, totalQuestions: 2, percentage: 100, completed: true });
    expect(dbMock.saveCourseModuleProgress).toHaveBeenCalledWith(expect.objectContaining({ courseSlug: "fundamentos-ti", moduleIndex: 0, completed: true }));
  });

  it("bloqueia o certificado quando ainda faltam módulos ou laboratórios", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.formations.issueCertificate({ courseSlug: "fundamentos-ti" }))
      .rejects.toThrow("Conclua os 5 módulos, os 4 laboratórios guiados e seja aprovado na avaliação final");
    expect(dbMock.createCourseCertificate).not.toHaveBeenCalled();
  });

  it("emite certificado nominal após todos os requisitos e o torna verificável publicamente", async () => {
    dbMock.getCourseModuleProgress.mockResolvedValue([0, 1, 2, 3, 4].map((moduleIndex) => ({ moduleIndex, completed: true })));
    dbMock.getCourseLabProgress.mockResolvedValue([0, 1, 2, 3].map((labIndex) => ({ labIndex, completed: true })));
    dbMock.getCourseAssessment.mockResolvedValue({ passed: true, score: 100 });
    dbMock.createCourseCertificate.mockResolvedValue({ id: 77, identifier: "CDA-ORBIT-01-U41-TEST" });
    const caller = appRouter.createCaller(createContext());

    const certificate = await caller.formations.issueCertificate({ courseSlug: "fundamentos-ti" });

    expect(certificate).toEqual({ id: 77, identifier: "CDA-ORBIT-01-U41-TEST", achievements: [] });
    expect(dbMock.createCourseCertificate).toHaveBeenCalledWith(expect.objectContaining({ studentName: "Ana Teste", courseSlug: "fundamentos-ti" }));

    dbMock.getCourseCertificateByIdentifier.mockResolvedValue({
      identifier: certificate.identifier,
      studentName: "Ana Teste",
      courseTitle: "Fundamentos de TI para Segurança",
      issuedAt: new Date("2026-08-14T00:00:00Z"),
    });
    const publicResult = await caller.certificates.verify({ identifier: certificate.identifier });
    expect(publicResult).toMatchObject({ identifier: certificate.identifier, studentName: "Ana Teste", type: "formation" });
  });

  it("reúne certificados ORBIT e Security+ no histórico com rotas próprias de download", async () => {
    dbMock.getCourseCertificatesByUser.mockResolvedValue([{ id: 77, courseTitle: "Fundamentos de TI para Segurança", identifier: "CDA-ORBIT-01-U41-TEST", issuedAt: new Date("2026-08-14T00:00:00Z") }]);
    dbMock.getCertificatesByUser.mockResolvedValue([{ id: 12, domainId: 8, identifier: "CDA-SY0-701-U41-TEST", issuedAt: new Date("2026-08-13T00:00:00Z") }]);
    dbMock.getDomains.mockResolvedValue([{ id: 8, title: "Security Operations" }]);
    const caller = appRouter.createCaller(createContext());

    const history = await caller.certificates.history();

    expect(history).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: "formation", downloadUrl: "/certificate/course/77" }),
      expect.objectContaining({ type: "security-plus", downloadUrl: "/certificate/12" }),
    ]));
  });

  it("verifica publicamente um badge específico, com aluno, formação e data de conquista", async () => {
    dbMock.getPublicCourseAchievement.mockResolvedValue({
      id: 501,
      courseSlug: "fundamentos-ti",
      badgeCode: "first-module",
      studentName: "Ana Teste",
      unlockedAt: new Date("2026-08-14T00:00:00Z"),
    });
    const caller = appRouter.createCaller(createContext());

    const badge = await caller.badges.verify({ id: 501 });

    expect(badge).toMatchObject({
      id: 501,
      badgeCode: "first-module",
      studentName: "Ana Teste",
      courseTitle: "Fundamentos de TI para Segurança",
    });
    expect(dbMock.getPublicCourseAchievement).toHaveBeenCalledWith(501);
  });

  it("exige uma execução registrada e evidência correta antes de registrar o laboratório", async () => {
    dbMock.createCourseLabRun.mockResolvedValue({ id: 501 });
    dbMock.getCourseLabRunById.mockResolvedValue({ id: 501, userId: 41, courseSlug: "fundamentos-ti", labIndex: 0, success: true });
    const caller = appRouter.createCaller(createContext());

    const run = await caller.formations.runLab({ courseSlug: "fundamentos-ti", labIndex: 0, command: "verificar ambiente --vm --rede-isolada" });
    await caller.formations.verifyLab({ courseSlug: "fundamentos-ti", labIndex: 0, runId: run.runId, answer: "registrar-evidencia" });

    expect(run.success).toBe(true);
    expect(dbMock.markCourseLabRunVerified).toHaveBeenCalledWith(501, 41);
    expect(dbMock.saveCourseLabProgress).toHaveBeenCalledWith(expect.objectContaining({ courseSlug: "fundamentos-ti", labIndex: 0, completed: true }));
  });

  it("cria uma sessão cronometrada sem expor as respostas corretas e persiste a correção", async () => {
    const startedAt = new Date("2026-08-15T12:00:00Z");
    const expiresAt = new Date("2099-08-15T12:18:00Z");
    dbMock.getActiveSpecialtySimulationAttempt.mockResolvedValue(undefined);
    dbMock.createSpecialtySimulationAttempt.mockResolvedValue({ id: 701, startedAt, expiresAt });
    dbMock.getSpecialtySimulationAttemptById.mockResolvedValue({
      id: 701, userId: 41, simulationSlug: "cloud-security", expiresAt, submittedAt: null,
    });
    dbMock.submitSpecialtySimulationAttempt.mockResolvedValue({ id: 701, score: 8, passed: true });
    const caller = appRouter.createCaller(createContext());

    const session = await caller.specialtySimulations.start({ simulationSlug: "cloud-security" });
    const grade = await caller.specialtySimulations.submit({ attemptId: 701, answers: [1, 0, 2, 1, 0, 3, 2, 1] });

    expect(session.simulation.questions).toHaveLength(8);
    expect(session.simulation.questions[0]).not.toHaveProperty("correctAnswer");
    expect(dbMock.createSpecialtySimulationAttempt).toHaveBeenCalledWith(expect.objectContaining({ simulationSlug: "cloud-security", totalQuestions: 8 }));
    expect(dbMock.submitSpecialtySimulationAttempt).toHaveBeenCalledWith(expect.objectContaining({ id: 701, userId: 41, answers: expect.any(Array) }));
    expect(grade).toMatchObject({ totalQuestions: 8, timedOut: false });
    expect(grade.review[0]).toHaveProperty("explanation");
  });

  it("constrói o portfólio apenas com laboratórios previamente verificados", async () => {
    dbMock.getVerifiedCourseLabRunsByUser.mockResolvedValue([
      { id: 801, courseSlug: "soc-analyst", labIndex: 0, verifiedAt: new Date("2026-08-15T10:00:00Z") },
      { id: 802, courseSlug: "curso-inexistente", labIndex: 0, verifiedAt: new Date("2026-08-15T11:00:00Z") },
    ]);
    const caller = appRouter.createCaller(createContext());

    const evidence = await caller.portfolio.labEvidence();

    expect(dbMock.getVerifiedCourseLabRunsByUser).toHaveBeenCalledWith(41);
    expect(evidence).toEqual([expect.objectContaining({ id: 801, courseSlug: "soc-analyst", courseTitle: "SOC Analyst", labIndex: 0 })]);
  });
});
