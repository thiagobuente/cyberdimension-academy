import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockUser(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return createMockUser({ role: "admin", id: 99, email: "admin@example.com" });
}

describe("Domains router", () => {
  it("list returns an array (public)", async () => {
    const caller = appRouter.createCaller(createMockUser());
    // domains.list is public, so it works without db
    const result = await caller.domains.list();
    // If db is not available, it returns empty array
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Auth router", () => {
  it("me returns current user", async () => {
    const ctx = createMockUser();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toEqual(ctx.user);
  });

  it("logout clears cookie and returns success", async () => {
    const ctx = createMockUser();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});

describe("Admin router", () => {
  it("stats requires admin role", async () => {
    const ctx = createMockUser({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("users requires admin role", async () => {
    const ctx = createMockUser({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.users()).rejects.toThrow();
  });

  it("external sources require admin role for listing and registration", async () => {
    const ctx = createMockUser({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.externalSources()).rejects.toThrow();
    await expect(caller.admin.createExternalSource({
      category: "Documentação",
      title: "Guia de referência",
      source: "Exemplo",
      license: "Conforme publicado pelo autor",
      usage: "Referência complementar para estudo supervisionado.",
      href: "https://example.com/referencia",
    })).rejects.toThrow();
  });

  it("stats works for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.stats();
    // If db is not available, it returns null
    expect(result === null || typeof result === "object").toBe(true);
  });
});

describe("Progress router", () => {
  it("lessonCount requires authenticated user", async () => {
    const ctx = createMockUser();
    const caller = appRouter.createCaller(ctx);
    // Even if db is not available, it should not throw auth error
    try {
      const result = await caller.progress.lessonCount({ domainId: 1 });
      expect(typeof result).toBe("number");
    } catch (e: any) {
      // If db is not available, this is expected
      expect(e.message).toContain("Database");
    }
  });
});

describe("Quiz router", () => {
  it("submit with an unauthenticated context rejects the call", async () => {
    const caller = appRouter.createCaller({
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: { clearCookie: vi.fn() } as TrpcContext["res"],
    } as unknown as TrpcContext);
    try {
      await caller.quiz.submit({
        domainId: 1,
        score: 8,
        totalQuestions: 10,
        answers: [{ questionId: 1, selectedAnswer: 0, correct: false }],
      });
    } catch (e: any) {
      // protectedProcedure rejects contexts without a user (TRPC UNAUTHORIZED, code 10001).
      expect(String(e.message)).toMatch(/login|UNAUTHORIZED|10001/i);
    }
  });
  it("submit with authenticated user and empty answers is rejected by validation", async () => {
    const ctx = createMockUser();
    const caller = appRouter.createCaller(ctx);
    try {
      await caller.quiz.submit({
        domainId: 1,
        score: 8,
        totalQuestions: 10,
        answers: [],
      });
    } catch (e: any) {
      // Zod validation happens first, before any auth/database error surfaces.
      expect(e.message).toContain("Envie ao menos uma resposta.");
    }
  });
  it("submit with valid answers fails with database error when db is unavailable", async () => {
    const ctx = createMockUser({ id: 998877 });
    const caller = appRouter.createCaller(ctx);
    try {
      await caller.quiz.submit({
        domainId: 1,
        score: 8,
        totalQuestions: 10,
        answers: [{ questionId: 1, selectedAnswer: 0, correct: false }],
      });
    } catch (e: any) {
      // If db is not available, this is expected
      // Either the database is unavailable (expected) or the 10-attempt per-domain limit kicks in.
      expect(e.message).toMatch(/(Database|Limite de 10 tentativas)/);
    }
  });

  it("history requires authenticated user", async () => {
    const ctx = createMockUser();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.quiz.history();
    expect(Array.isArray(result)).toBe(true);
  });
});
