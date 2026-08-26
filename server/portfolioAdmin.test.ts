import { afterAll, describe, expect, it } from "vitest";
import * as db from "./db";
import { appRouter } from "./routers";

const TEST_EMAIL_BASE = `portfolio-test-admin-mod-${Date.now()}@example.test`;
let userCounter = 0;

async function createUser(role: "user" | "admin" = "user") {
  userCounter += 1;
  const openId = `portfolio-admin-openid-${Date.now()}-${userCounter}`;
  const email = `${TEST_EMAIL_BASE}-${userCounter}`;
  await db.createEmailUser({
    openId,
    name: role === "admin" ? `Admin Test ${userCounter}` : `Student Test ${userCounter}`,
    email,
    passwordHash: null,
    role,
  });
  const user = await db.getUserByEmail(email);
  expect(user).toBeTruthy();
  return user!;
}

function createCaller(user: { id: number; email: string; name: string | null; openId: string; loginMethod: string; role: string }) {
  const ctx = {
    user: { ...user, loginMethod: "email" as const, avatarUrl: null, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { headers: {} } as unknown as never,
    res: {} as unknown as never,
  };
  return appRouter.createCaller(ctx as never);
}

async function makeAdminCaller() {
  return createCaller(await createUser("admin"));
}

async function makeStudentCaller() {
  return createCaller(await createUser("user"));
}

afterAll(async () => {
  await db.removePortfolioTestUsers().catch(() => undefined);
});

describe("admin.portfolioEvidence", () => {
  it("lista evidências de todos os alunos com dados do usuário", async () => {
    const student = await createUser("user");
    const evidenceItem = await db.createPortfolioItem({
      userId: student.id,
      courseSlug: "orbit-fundamentos",
      labIndex: 0,
      title: "Flag do lab de enumeração",
      description: "Captura de tela da flag",
      fileUrl: "https://storage.example/evidence.png",
      fileKey: "evidence.png",
      mimeType: "image/png",
    });
    const direct = await db.getPortfolioItemsByUser(student.id);
    const caller = await makeAdminCaller();
    const items = await caller.admin.portfolioEvidence();
    console.log("direct items for student:", direct.length, "admin items total:", items.length);
    const found = items.find((item) => item.id === evidenceItem.id);
    expect(found).toBeDefined();
    expect(found!.userName).toBe(student.name);
    expect(found!.userEmail).toBe(student.email);
    expect(found!.title).toBe("Flag do lab de enumeração");
  });

  it("rejeita usuários comuns no relatório de portfólios", async () => {
    const caller = await makeStudentCaller();
    await expect(caller.admin.portfolioEvidence()).rejects.toThrow();
  });

  it("remove uma evidência específica (qualquer item do banco, sem escopo de usuário)", async () => {
    const student = await createUser("user");
    const evidenceItem = await db.createPortfolioItem({
      userId: student.id,
      courseSlug: "orbit-fundamentos",
      labIndex: 1,
      title: "Relatório de triagem",
      description: null,
      fileUrl: "https://storage.example/report.pdf",
      fileKey: "report.pdf",
      mimeType: "application/pdf",
    });
    const caller = await makeAdminCaller();
    const result = await caller.admin.removePortfolioEvidence({ itemId: evidenceItem.id });
    expect(result.success).toBe(true);
    const items = await caller.admin.portfolioEvidence();
    expect(items.some((item) => item.id === evidenceItem.id)).toBe(false);
  });

  it("rejeita usuários comuns na remoção administrativa", async () => {
    const caller = await makeStudentCaller();
    await expect(caller.admin.removePortfolioEvidence({ itemId: 999 })).rejects.toThrow();
  });
});
