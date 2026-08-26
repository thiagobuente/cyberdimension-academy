import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { AuthenticatedUser } from "./_core/types";

type AuthenticatedUserTyped = NonNullable<TrpcContext["user"]>;

vi.mock("./db", () => {
  const completions = new Map<string, { ctfId: string; userId: number }>();
  let achievementsAwarded: { userId: number; badgeCode: string }[] = [];
  return {
    getCtfCompletionsByUser: vi.fn(async (userId: number) =>
      Array.from(completions.values()).filter((row) => row.userId === userId),
    ),
    countCtfCompletionsByUser: vi.fn(async (userId: number) =>
      Array.from(completions.values()).filter((row) => row.userId === userId).length,
    ),
    setCtfCompletion: vi.fn(async (userId: number, ctfId: string) => {
      const key = `${userId}:${ctfId}`;
      const created = !completions.has(key);
      completions.set(key, { ctfId, userId });
      return { created };
    }),
    unsetCtfCompletion: vi.fn(async (userId: number, ctfId: string) => {
      completions.delete(`${userId}:${ctfId}`);
      return true;
    }),
    awardCourseAchievements: vi.fn(async (payload: { userId: number; badgeCode: string }[]) => {
      achievementsAwarded.push(...payload);
      return true;
    }),
    getAchievementsAwarded: () => achievementsAwarded,
    resetMockState: () => {
      completions.clear();
      achievementsAwarded = [];
    },
  };
});

const mockedDb = vi.mocked(await import("./db"));

function createMockUser(overrides?: Partial<AuthenticatedUserTyped>): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "ctf-test-user",
      email: "ctf@example.com",
      name: "CTF Test",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      ...overrides,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as TrpcContext["res"],
  };
}

describe("Hub CTFs", () => {
  beforeEach(() => {
    mockedDb.resetMockState();
    vi.clearAllMocks();
  });

  it("list retorna o catálogo público sem exigir login", async () => {
    const caller = appRouter.createCaller({ user: null } as TrpcContext);
    const catalog = await caller.ctf.list();
    expect(catalog.length).toBeGreaterThan(0);
    expect(catalog[0]).toHaveProperty("id");
    expect(catalog[0]).toHaveProperty("url");
    expect(catalog[0]).toHaveProperty("xp");
    expect(["iniciante", "intermediario", "avancado"]).toContain(catalog[0].level);
  });

  const VALID_BANDIT_ANSWER = "ssh bandit1@localhost -p 2220";

  it("toggleComplete marca um desafio como concluído e concede XP", async () => {
    const caller = appRouter.createCaller(createMockUser());
    const result = await caller.ctf.toggleComplete({ ctfId: "bandit", completed: true, answer: VALID_BANDIT_ANSWER });
    expect(result.completed).toBe(true);
    expect(result.xp).toBeGreaterThan(0);
    expect(result.totalCompleted).toBe(1);
    expect(mockedDb.setCtfCompletion).toHaveBeenCalledWith(1, "bandit");
  });

  it("toggleComplete é idempotente: marcar o mesmo desafio não concede XP de novo", async () => {
    const caller = appRouter.createCaller(createMockUser());
    const first = await caller.ctf.toggleComplete({ ctfId: "bandit", completed: true, answer: VALID_BANDIT_ANSWER });
    const second = await caller.ctf.toggleComplete({ ctfId: "bandit", completed: true, answer: VALID_BANDIT_ANSWER });
    expect(second.xp).toBe(0);
    expect(second.totalCompleted).toBe(1);
  });

  it("marca e desmarca um desafio, ajustando o total", async () => {
    const caller = appRouter.createCaller(createMockUser());
    await caller.ctf.toggleComplete({ ctfId: "bandit", completed: true, answer: VALID_BANDIT_ANSWER });
    await caller.ctf.toggleComplete({ ctfId: "bandit", completed: false });
    expect(mockedDb.unsetCtfCompletion).toHaveBeenCalledWith(1, "bandit");
    const completions = await caller.ctf.completions();
    expect(completions).not.toContain("bandit");
  });

  it("desbloqueia a badge Primeiro Flag no primeiro desafio", async () => {
    const caller = appRouter.createCaller(createMockUser());
    await caller.ctf.toggleComplete({ ctfId: "bandit", completed: true, answer: VALID_BANDIT_ANSWER });
    expect(mockedDb.awardCourseAchievements).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ userId: 1, badgeCode: "primeiro-flag" })]),
    );
  });

  it("desbloqueia a badge Flag Hunter no décimo desafio", async () => {
    const caller = appRouter.createCaller(createMockUser());
    const tenValid = [
      { ctfId: "bandit", answer: "ssh bandit1@localhost -p 2220" },
      { ctfId: "leviathan", answer: "ltrace" },
      { ctfId: "natas", answer: "basic" },
      { ctfId: "picoctf", answer: "picoCTF{...}" },
      { ctfId: "cyberdefenders", answer: "memory dump" },
      { ctfId: "letsdefend", answer: "tickets" },
      { ctfId: "blueteamlabs", answer: "networkminer" },
      { ctfId: "webacademy", answer: "sql injection" },
      { ctfId: "juice-shop", answer: "node" },
      { ctfId: "cryptohack", answer: "xor" },
    ];
    for (const item of tenValid) {
      await caller.ctf.toggleComplete({ ctfId: item.ctfId, completed: true, answer: item.answer });
    }
    expect(mockedDb.awardCourseAchievements).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ userId: 1, badgeCode: "flag-hunter" })]),
    );
  });

  it("rejeita ctfId inexistente no catálogo", async () => {
    const caller = appRouter.createCaller(createMockUser());
    await expect(caller.ctf.toggleComplete({ ctfId: "nao-existe", completed: true })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("rejeita acesso anônimo ao toggle", async () => {
    const caller = appRouter.createCaller({ user: null } as TrpcContext);
    await expect(caller.ctf.toggleComplete({ ctfId: "bandit", completed: true })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  describe("verificação de resposta antes de conceder XP", () => {
    it("concede XP quando a resposta da verificação está correta (com tolerância a caixa/acento)", async () => {
      const caller = appRouter.createCaller(createMockUser());
      const result = await caller.ctf.toggleComplete({
        ctfId: "bandit",
        completed: true,
        answer: "SSH Bandit1@localhost  -p  2220",
      });
      expect(result.completed).toBe(true);
      expect(result.xp).toBeGreaterThan(0);
      expect(mockedDb.setCtfCompletion).toHaveBeenCalledWith(1, "bandit");
    });

    it("rejeita a conclusão quando a resposta está errada e não concede XP", async () => {
      const caller = appRouter.createCaller(createMockUser());
      await expect(
        caller.ctf.toggleComplete({ ctfId: "bandit", completed: true, answer: "resposta totalmente errada" }),
      ).rejects.toMatchObject({ code: "BAD_REQUEST" });
      expect(mockedDb.setCtfCompletion).not.toHaveBeenCalled();
    });

    it("rejeita quando a resposta fica em branco", async () => {
      const caller = appRouter.createCaller(createMockUser());
      await expect(
        caller.ctf.toggleComplete({ ctfId: "bandit", completed: true, answer: "   " }),
      ).rejects.toMatchObject({ code: "BAD_REQUEST" });
      expect(mockedDb.setCtfCompletion).not.toHaveBeenCalled();
    });

    it("verification expõe as perguntas sem revelar as respostas", async () => {
      const caller = appRouter.createCaller({ user: null } as TrpcContext);
      const questions = await caller.ctf.verification();
      expect(questions.length).toBeGreaterThan(0);
      const bandit = questions.find((q) => q.ctfId === "bandit");
      expect(bandit).toHaveProperty("question");
      expect(bandit).toHaveProperty("answerHint");
      expect(bandit).not.toHaveProperty("answer");
    });

    it("desmarcar conclusão não exige resposta", async () => {
      const caller = appRouter.createCaller(createMockUser());
      await caller.ctf.toggleComplete({ ctfId: "bandit", completed: true, answer: "ssh bandit1@localhost -p 2220" });
      const result = await caller.ctf.toggleComplete({ ctfId: "bandit", completed: false });
      expect(result.completed).toBe(false);
      expect(mockedDb.unsetCtfCompletion).toHaveBeenCalledWith(1, "bandit");
    });
  });
});
