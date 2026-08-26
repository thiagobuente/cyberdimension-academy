import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { hashPassword } from "./emailAuth";

const dbMock = vi.hoisted(() => ({
  ensureEmailAdmin: vi.fn(),
  getPlatformStats: vi.fn(),
  getUserByEmail: vi.fn(),
  markUserSignedIn: vi.fn(),
}));
const sdkMock = vi.hoisted(() => ({ createSessionToken: vi.fn().mockResolvedValue("admin-email-session") }));

vi.mock("./db", () => dbMock);
vi.mock("./_core/sdk", () => ({ sdk: sdkMock }));

import { appRouter } from "./routers";

function createContext(user: TrpcContext["user"] = null) {
  return {
    user,
    req: { protocol: "https", headers: {} },
    res: { cookie: vi.fn(), clearCookie: vi.fn() },
  } as unknown as TrpcContext;
}

describe("acesso administrativo por e-mail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("autentica o administrador por e-mail e permite a procedure protegida", async () => {
    const password = "AdminSenhaSegura2026";
    const admin = {
      id: 1,
      openId: "email_admin",
      name: "Administrador",
      email: "admin@example.com",
      passwordHash: await hashPassword(password),
      loginMethod: "email",
      role: "admin" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };
    dbMock.getUserByEmail.mockResolvedValue(admin);
    dbMock.getPlatformStats.mockResolvedValue({ users: 3, certificates: 1 });

    const login = await appRouter.createCaller(createContext()).auth.login({ email: admin.email, password });
    expect(login.user).toMatchObject({ id: 1, email: admin.email, role: "admin" });

    const result = await appRouter.createCaller(createContext({ ...admin, passwordHash: undefined } as TrpcContext["user"])).admin.stats();
    expect(result).toEqual({ users: 3, certificates: 1 });
    expect(dbMock.getPlatformStats).toHaveBeenCalledOnce();
  });
});
