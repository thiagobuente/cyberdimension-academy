import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMock = vi.hoisted(() => ({
  createEmailUser: vi.fn(),
  ensureEmailAdmin: vi.fn(),
  getUserByEmail: vi.fn(),
  markUserSignedIn: vi.fn(),
}));
const sdkMock = vi.hoisted(() => ({ createSessionToken: vi.fn().mockResolvedValue("email-session-token") }));

vi.mock("./db", () => dbMock);
vi.mock("./_core/sdk", () => ({ sdk: sdkMock }));

import { appRouter } from "./routers";

function createContext() {
  const res = { cookie: vi.fn(), clearCookie: vi.fn() };
  const ctx = { user: null, req: { protocol: "https", headers: {} }, res } as unknown as TrpcContext;
  return { ctx, res };
}

const student = {
  id: 31,
  openId: "email_testuser",
  name: "ana",
  email: "ana@example.com",
  passwordHash: null,
  loginMethod: "email",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("entrada automática do aluno por e-mail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.getUserByEmail.mockResolvedValue(undefined);
    dbMock.createEmailUser.mockResolvedValue(student);
  });

  it("cria uma conta estudantil sem senha e inicia a sessão imediatamente", async () => {
    const { ctx, res } = createContext();
    const result = await appRouter.createCaller(ctx).auth.accessWithEmail({ email: "ANA@EXAMPLE.COM" });

    expect(dbMock.createEmailUser).toHaveBeenCalledWith(expect.objectContaining({
      name: "ana",
      email: "ana@example.com",
      passwordHash: null,
    }));
    expect(dbMock.markUserSignedIn).toHaveBeenCalledWith(student.id);
    expect(res.cookie).toHaveBeenCalled();
    expect(result.user).toMatchObject({ id: student.id, email: student.email });
    expect(result.user).not.toHaveProperty("passwordHash");
  });

  it("abre imediatamente a sessão de uma conta estudantil existente", async () => {
    dbMock.getUserByEmail.mockResolvedValue(student);
    const { ctx, res } = createContext();

    const result = await appRouter.createCaller(ctx).auth.accessWithEmail({ email: student.email });

    expect(dbMock.createEmailUser).not.toHaveBeenCalled();
    expect(dbMock.markUserSignedIn).toHaveBeenCalledWith(student.id);
    expect(res.cookie).toHaveBeenCalled();
    expect(result.user).toMatchObject({ id: student.id });
  });

  it("mantém o antigo procedimento de cadastro como atalho para a mesma entrada automática", async () => {
    const { ctx, res } = createContext();

    await appRouter.createCaller(ctx).auth.register({ email: "ana@example.com" });

    expect(dbMock.markUserSignedIn).toHaveBeenCalledWith(student.id);
    expect(res.cookie).toHaveBeenCalled();
  });
});
