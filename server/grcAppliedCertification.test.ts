import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMock = vi.hoisted(() => ({
  createCourseCertificate: vi.fn(),
  createStandaloneLessonAssessmentAttempt: vi.fn(),
  getCourseCertificateByUserAndSlug: vi.fn(),
  getStandaloneLessonAssessmentAttempts: vi.fn(),
  getStandaloneLessonProgress: vi.fn(),
  saveStandaloneLessonProgress: vi.fn(),
}));

vi.mock("./db", () => dbMock);

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 91,
    openId: "grc-certificate-test-user",
    email: "aluna.grc@example.com",
    name: "Ana GRC",
    loginMethod: "email",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { clearCookie: vi.fn() } as TrpcContext["res"] };
}

describe("certificação automática da aula de GRC Aplicado", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.getStandaloneLessonProgress.mockResolvedValue([]);
    dbMock.getStandaloneLessonAssessmentAttempts.mockResolvedValue([]);
    dbMock.getCourseCertificateByUserAndSlug.mockResolvedValue(undefined);
  });

  it("exige a conclusão dos cinco módulos antes da avaliação", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.grcApplied.submitAssessment({ answers: [1, 2, 2, 1, 2] }))
      .rejects.toThrow("Conclua os cinco módulos da aula antes de realizar a avaliação");
    expect(dbMock.createStandaloneLessonAssessmentAttempt).not.toHaveBeenCalled();
  });

  it("emite certificado nominal e verificável automaticamente após aprovação", async () => {
    dbMock.getStandaloneLessonProgress.mockResolvedValue([
      { sectionId: "decisao" },
      { sectionId: "risco-politica" },
      { sectionId: "zero-trust" },
      { sectionId: "secure-sdlc" },
      { sectionId: "ia" },
    ]);
    dbMock.createCourseCertificate.mockResolvedValue({ id: 301, identifier: "CDA-GRC-APLICADO-U91-TEST" });
    const caller = appRouter.createCaller(createContext());

    const result = await caller.grcApplied.submitAssessment({ answers: [1, 2, 2, 1, 2] });

    expect(result).toMatchObject({ score: 100, passed: true, certificate: { id: 301, identifier: "CDA-GRC-APLICADO-U91-TEST" } });
    expect(dbMock.createCourseCertificate).toHaveBeenCalledWith(expect.objectContaining({
      userId: 91,
      courseSlug: "grc-aplicado-governanca-zero-trust",
      courseTitle: "GRC Aplicado: Governança, Zero Trust e IA Segura",
      studentName: "Ana GRC",
    }));
  });

  it("retorna o certificado persistido ao revisitar a aula", async () => {
    dbMock.getStandaloneLessonProgress.mockResolvedValue([{ sectionId: "decisao" }]);
    dbMock.getCourseCertificateByUserAndSlug.mockResolvedValue({
      id: 301,
      identifier: "CDA-GRC-APLICADO-U91-TEST",
      courseSlug: "grc-aplicado-governanca-zero-trust",
    });
    const caller = appRouter.createCaller(createContext());

    const state = await caller.grcApplied.state();

    expect(state.certificate).toMatchObject({ id: 301, identifier: "CDA-GRC-APLICADO-U91-TEST" });
    expect(dbMock.getCourseCertificateByUserAndSlug).toHaveBeenCalledWith(91, "grc-aplicado-governanca-zero-trust");
  });

  it("registra a tentativa, mas não emite certificado abaixo da nota mínima", async () => {
    dbMock.getStandaloneLessonProgress.mockResolvedValue([
      { sectionId: "decisao" }, { sectionId: "risco-politica" }, { sectionId: "zero-trust" }, { sectionId: "secure-sdlc" }, { sectionId: "ia" },
    ]);
    const caller = appRouter.createCaller(createContext());

    const result = await caller.grcApplied.submitAssessment({ answers: [0, 0, 0, 0, 0] });

    expect(result).toMatchObject({ passed: false, certificate: null });
    expect(dbMock.createStandaloneLessonAssessmentAttempt).toHaveBeenCalledWith(expect.objectContaining({ userId: 91, passed: false }));
    expect(dbMock.createCourseCertificate).not.toHaveBeenCalled();
  });
});
