import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";
import { orbitCourseSlugs } from "./orbitCourses";
import { CAREER_QUESTIONS, CAREER_XP_REWARD, gradeCareerQuiz } from "../shared/careerQuiz";
import { desc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";

const TEST_EMAIL = `career-portfolio-test-${Date.now()}@example.test`;

let userCounter = 0;
async function createUser(emailOverride?: string) {
  userCounter += 1;
  const email = emailOverride ?? `career-portfolio-test-${Date.now()}-${userCounter}@example.test`;
  await db.createEmailUser({
    openId: `career-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    name: "Aluno Carreira",
    email,
    passwordHash: null,
  });
  return db.getUserByEmail(email);
}

afterAll(async () => {
  // Clean up test users (email pattern `career-portfolio-test-`).
  await db.removeCareerQuizTestUsers().catch(() => undefined);
});

function createCaller(user: { id: number; email: string; name: string | null; openId: string; loginMethod: string; role: string }) {
  const ctx = {
    user: { ...user, role: "user" as const, loginMethod: "email" as const },
    req: { headers: {} } as unknown as never,
    res: {} as unknown as never,
  };
  return appRouter.createCaller(ctx as never);
}

function createAdminCaller() {
  const ctx = {
    user: { id: 0, email: "admin@example.test", name: "Admin", openId: "career-admin-openid", loginMethod: "email", role: "admin" as const },
    req: { headers: {} } as unknown as never,
    res: {} as unknown as never,
  };
  return appRouter.createCaller(ctx as never);
}

function buildAnswers(): Record<number, "soc" | "pentest" | "grc" | "cloud" | "forense" | "engenharia"> {
  const answers: Record<number, "soc" | "pentest" | "grc" | "cloud" | "forense" | "engenharia"> = {};
  CAREER_QUESTIONS.forEach((question) => {
    answers[question.id] = question.options[0].area;
  });
  return answers;
}

describe("Career quiz backend", () => {
  it("exposes the ten vocational questions publicly", async () => {
    const caller = appRouter.createCaller({ user: null } as never);
    const questions = await caller.career.questions();
    expect(questions.length).toBe(10);
    for (const question of questions) {
      expect(question.options.length).toBeGreaterThan(0);
      for (const option of question.options) expect(["soc", "pentest", "grc", "cloud", "forense", "engenharia"]).toContain(option.area);
    }
  });

  it("persists the result and grants XP after submission", async () => {
    const user = await createUser();
    expect(user).toBeTruthy();
    const caller = createCaller(user!);
    const submitted = await caller.career.submit({ answers: buildAnswers() });
    expect(submitted.xp).toBe(CAREER_XP_REWARD);
    expect(["soc", "pentest", "grc", "cloud", "forense", "engenharia"]).toContain(submitted.result.topArea);

    const stored = await db.getCareerQuizResultByUser(user!.id);
    expect(stored).toBeTruthy();
    expect(stored!.topArea).toBe(submitted.result.topArea);
    expect(stored!.awardedXp).toBe(CAREER_XP_REWARD);

    // The quiz submission stores the granted XP; the users table accumulates it as `xp`.
    const storedAgain = await db.getCareerQuizResultByUser(user!.id);
    expect(storedAgain?.awardedXp).toBe(CAREER_XP_REWARD);
  });

  it("rejects submission with missing questions", async () => {
    const user = await createUser();
    const caller = createCaller(user!);
    const partial: Record<number, "soc"> = {};
    CAREER_QUESTIONS.slice(0, -2).forEach((question) => {
      partial[question.id] = "soc";
    });
    await expect(caller.career.submit({ answers: partial })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("returns the saved result for the current user", async () => {
    const user = await createUser();
    const caller = createCaller(user!);
    await caller.career.submit({ answers: buildAnswers() });
    const result = await caller.career.myResult();
    expect(result).toBeTruthy();
    expect(result!.topArea).toBe(buildAnswers()[1]);
  });

  it("issues a named certificate after the quiz is submitted", async () => {
    const user = await createUser();
    expect(user).toBeTruthy();
    const caller = createCaller(user!);

    // Before submission there is no certificate.
    expect(await caller.career.myCertificate()).toBeUndefined();

    const submitted = await caller.career.submit({ answers: buildAnswers() });
    expect(submitted.certificate).toBeTruthy();
    expect(submitted.certificate!.identifier).toMatch(/^CDA-CAREER-/);

    const cert = await caller.career.myCertificate();
    expect(cert).toBeTruthy();
    expect(cert!.courseSlug).toBe("descubra-sua-carreira");
    expect(cert!.courseTitle).toContain("Descubra Sua Carreira");
    expect(cert!.studentName).toBe("Aluno Carreira");
    expect(cert!.identifier).toBe(submitted.certificate!.identifier);

    // A second submission keeps the same certificate (idempotent, without duplicating).
    await caller.career.submit({ answers: buildAnswers() });
    const certAgain = await caller.career.myCertificate();
    expect(certAgain!.id).toBe(cert!.id);

    // Anonymous callers cannot see the certificate.
    await expect(appRouter.createCaller({ user: null } as never).career.myCertificate()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("updates the name on all certificates when the profile name changes", async () => {
    const user = await createUser();
    const caller = createCaller(user!);
    await caller.career.submit({ answers: buildAnswers() });

    // Rename the user in the database (simulating auth.updateProfile).
    const dbRef = await db.getDb();
    expect(dbRef).toBeTruthy();
    await dbRef!.update(users).set({ name: "Aluno Carreira Completo" }).where(eq(users.id, user!.id));

    const refreshed = await caller.certificatesRefreshName();
    expect(refreshed.updated).toBe(true);
    expect(refreshed.studentName).toBe("Aluno Carreira Completo");

    const cert = await caller.career.myCertificate();
    expect(cert!.studentName).toBe("Aluno Carreira Completo");
  });
});

describe("Public portfolio sharing", () => {
  it("requires authentication to toggle the public portfolio", async () => {
    const caller = appRouter.createCaller({ user: null } as never);
    await expect(caller.portfolio.setPublic({ enabled: true })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("creates a public token and serves the gallery anonymously", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const caller = createCaller(user!);
    const otherCaller = createCaller(user2!);

    // Give the user a completed guided lab eligible for evidence.
    await db.saveCourseLabProgress({
      userId: user!.id,
      courseSlug: orbitCourseSlugs[0],
      labIndex: 0,
      completed: true,
      completedAt: new Date(),
    });

    const enabled = await caller.portfolio.setPublic({ enabled: true });
    expect(enabled.token).toBeTruthy();

    const gallery = await appRouter.createCaller({ user: null } as never).portfolioPublic.byToken({ token: enabled.token! });
    expect(gallery.userName).toBe(user!.name);
    expect(gallery.badges).toBeDefined();

    // The token works for any caller while enabled (public by token), including the owner.
    const ownGallery = await caller.portfolioPublic.byToken({ token: enabled.token! });
    expect(ownGallery.userName).toBe(user!.name);

    // Disabling invalidates access for everyone.
    await caller.portfolio.setPublic({ enabled: false });
    await expect(
      appRouter.createCaller({ user: null } as never).portfolioPublic.byToken({ token: enabled.token! }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    // A random token is rejected.
    await expect(
      appRouter.createCaller({ user: null } as never).portfolioPublic.byToken({ token: "inexistente-token-aleatorio" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    // A different user's token is not exposed as belonging to someone else.
    const otherEnabled = await otherCaller.portfolio.setPublic({ enabled: true });
    const otherGallery = await appRouter.createCaller({ user: null } as never).portfolioPublic.byToken({ token: otherEnabled.token! });
    expect(otherGallery.userName).toBe(user2!.name);
    await otherCaller.portfolio.setPublic({ enabled: false });
  });
});

describe("Admin portfolio filters", () => {
  it("filters moderation list by search text and course slug", async () => {
    const admin = createAdminCaller();
    const list = await admin.admin.portfolioEvidence();
    expect(Array.isArray(list)).toBe(true);

    const filteredBySlug = await admin.admin.portfolioEvidence({ courseSlug: orbitCourseSlugs[0] });
    for (const item of filteredBySlug) expect(item.courseSlug).toBe(orbitCourseSlugs[0]);

    const emptySearch = await admin.admin.portfolioEvidence({ search: "nobody-with-this-email-xyz" });
    expect(emptySearch.length).toBe(0);

    const unauthenticated = appRouter.createCaller({ user: null } as never);
    await expect(unauthenticated.admin.portfolioEvidence()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(unauthenticated.admin.portfolioEvidence({ search: "x" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
