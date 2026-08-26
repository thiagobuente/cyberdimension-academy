import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";
import { orbitCourseSlugs } from "./orbitCourses";

const TEST_USER_EMAIL = `portfolio-test-${Date.now()}@example.test`;

function makeDataUrl(kind: "png" | "pdf" = "png") {
  if (kind === "png") return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
  return "data:application/pdf;base64,JVBERi0xLjAKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoK";
}

function invalidDataUrl() {
  return "data:text/html;base64,PGh0bWw+PC9odG1sPg==";
}

let userCounter = 0;
async function createUser(emailOverride?: string) {
  userCounter += 1;
  const email = emailOverride ?? `portfolio-test-${Date.now()}-${userCounter}@example.test`;
  await db.createEmailUser({
    openId: `portfolio-openid-${Date.now()}-${userCounter}`,
    name: "Aluno Portfólio",
    email,
    passwordHash: null,
  });
  const user = await db.getUserByEmail(email);
  expect(user).toBeTruthy();
  return user!;
}

function createCaller(user: { id: number; email: string; name: string | null; openId: string; loginMethod: string; role: string }) {
  const ctx = {
    user: { ...user, role: "user" as const, loginMethod: "email" as const },
    req: { headers: {} } as unknown as never,
    res: {} as unknown as never,
  };
  return appRouter.createCaller(ctx as never);
}

describe("Portfolio evidence", () => {
  beforeAll(async () => {
    const user = await createUser(TEST_USER_EMAIL);
    // Mark a guided lab as completed so evidence can be attached.
    await db.saveCourseLabProgress({
      userId: user.id,
      courseSlug: orbitCourseSlugs[0],
      labIndex: 0,
      completed: true,
      completedAt: new Date(),
    });
  });

  afterAll(async () => {
    // Clean up users created by this suite, including leftovers from interrupted runs.
    await db.removePortfolioTestUsers().catch(() => undefined);
  });

  it("lists pending labs eligible for evidence attachment", async () => {
    const user = await createUser();
    const run = await db.createCourseLabRun({
      userId: user.id,
      courseSlug: orbitCourseSlugs[1],
      labIndex: 0,
      command: "ls /tmp",
      success: true,
      output: "lab ok",
    });
    await db.markCourseLabRunVerified(run.id, user.id);
    const caller = createCaller(user);
    const evidence = await caller.portfolio.labEvidence();
    const matched = evidence.find(
      (runItem) => runItem.courseSlug === orbitCourseSlugs[1] && runItem.labIndex === 0,
    );
    expect(matched?.verifiedAt).toBeTruthy();
  });

  it("attaches evidence to a completed lab", async () => {
    const user = await db.getUserByEmail(TEST_USER_EMAIL);
    expect(user).toBeTruthy();
    const caller = createCaller(user!);
    const itemsBefore = await caller.portfolio.items();
    await caller.portfolio.attachEvidence({
      courseSlug: orbitCourseSlugs[0],
      labIndex: 0,
      title: "Screenshot do laboratório de contas",
      description: "Contas criadas no inventário de teste.",
      evidenceDataUrl: makeDataUrl("png"),
    });
    const itemsAfter = await caller.portfolio.items();
    expect(itemsAfter.length).toBe(itemsBefore.length + 1);
    const newest = itemsAfter[0];
    expect(newest.title).toBe("Screenshot do laboratório de contas");
    expect(newest.mimeType).toBe("image/png");
    expect(newest.validLab).toBe(true);
  });

  it("rejects evidence when the lab is not completed", async () => {
    const user = await db.getUserByEmail(TEST_USER_EMAIL);
    const caller = createCaller(user!);
    await expect(
      caller.portfolio.attachEvidence({
        courseSlug: orbitCourseSlugs[0],
        labIndex: 7,
        title: "Evidência prematura",
        evidenceDataUrl: makeDataUrl("png"),
      }),
    ).rejects.toThrow(/Conclua o laboratório/);
  });

  it("rejects unsupported file types", async () => {
    const user = await db.getUserByEmail(TEST_USER_EMAIL);
    const caller = createCaller(user!);
    await expect(
      caller.portfolio.attachEvidence({
        courseSlug: orbitCourseSlugs[0],
        labIndex: 0,
        title: "HTML disfarçado",
        evidenceDataUrl: invalidDataUrl(),
      }),
    ).rejects.toThrow();
  });

  it("attaches PDF evidence and reports the mime type", async () => {
    const user = await db.getUserByEmail(TEST_USER_EMAIL);
    const caller = createCaller(user!);
    const itemsBefore = await caller.portfolio.items();
    await caller.portfolio.attachEvidence({
      courseSlug: orbitCourseSlugs[0],
      labIndex: 0,
      title: "Relatório de triagem de eventos",
      evidenceDataUrl: makeDataUrl("pdf"),
    });
    const itemsAfter = await caller.portfolio.items();
    const pdfItem = itemsAfter.find((item) => item.mimeType === "application/pdf");
    expect(pdfItem).toBeTruthy();
    expect(itemsAfter.length).toBe(itemsBefore.length + 1);
  });

  it("removes evidence scoped to the owning user", async () => {
    const user = await db.getUserByEmail(TEST_USER_EMAIL);
    const caller = createCaller(user!);
    const itemsBefore = await caller.portfolio.items();
    expect(itemsBefore.length).toBeGreaterThan(0);
    await caller.portfolio.removeEvidence({ itemId: itemsBefore[0].id });
    const itemsAfter = await caller.portfolio.items();
    expect(itemsAfter.length).toBe(itemsBefore.length - 1);
  });

  it("prevents removal of evidence belonging to other users", async () => {
    const otherUser = await createUser();
    const otherCaller = createCaller(otherUser);
    await db.createPortfolioItem({
      userId: otherUser.id,
      courseSlug: orbitCourseSlugs[2],
      labIndex: 0,
      title: "Evidência de outro usuário",
      fileUrl: "https://example.test/other.png",
      fileKey: "other-key",
      mimeType: "image/png",
    });
    const user = await db.getUserByEmail(TEST_USER_EMAIL);
    const caller = createCaller(user!);
    const otherItems = await otherCaller.portfolio.items();
    const targetId = otherItems[0].id;
    await expect(
      caller.portfolio.removeEvidence({ itemId: targetId }),
    ).rejects.toThrow(/Evidência não encontrada/);
    const stillThere = await otherCaller.portfolio.items();
    expect(stillThere.find((item) => item.id === targetId)).toBeTruthy();
  });
});
