import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMock = vi.hoisted(() => ({ updateEmailUserProfile: vi.fn() }));
const storageMock = vi.hoisted(() => ({ storagePut: vi.fn() }));
const sdkMock = vi.hoisted(() => ({ createSessionToken: vi.fn().mockResolvedValue("renewed-profile-session") }));

vi.mock("./db", () => dbMock);
vi.mock("./storage", () => storageMock);
vi.mock("./_core/sdk", () => ({ sdk: sdkMock }));

import { appRouter } from "./routers";

const student = {
  id: 48,
  openId: "email_profileuser",
  name: "Ana",
  email: "ana@example.com",
  passwordHash: null,
  avatarUrl: null,
  loginMethod: "email",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createContext() {
  const res = { cookie: vi.fn(), clearCookie: vi.fn() };
  return {
    ctx: { user: student, req: { protocol: "https", headers: {} }, res } as unknown as TrpcContext,
    res,
  };
}

describe("edição de perfil", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.updateEmailUserProfile.mockResolvedValue({ ...student, name: "Ana Estudante" });
  });

  it("atualiza o nome apenas da conta autenticada e renova a sessão", async () => {
    const { ctx, res } = createContext();
    const result = await appRouter.createCaller(ctx).auth.updateProfile({ name: "  Ana Estudante  " });

    expect(dbMock.updateEmailUserProfile).toHaveBeenCalledWith(student.id, { name: "Ana Estudante", avatarUrl: undefined });
    expect(result.user).toMatchObject({ id: student.id, name: "Ana Estudante" });
    expect(res.cookie).toHaveBeenCalled();
  });

  it("envia avatar válido ao armazenamento protegido e registra a URL retornada", async () => {
    storageMock.storagePut.mockResolvedValue({ key: "profile-avatars/48/avatar.png", url: "/manus-storage/profile-avatars/48/avatar.png" });
    dbMock.updateEmailUserProfile.mockResolvedValue({ ...student, avatarUrl: "/manus-storage/profile-avatars/48/avatar.png" });
    const { ctx } = createContext();
    const avatarDataUrl = "data:image/png;base64,aGVsbG8=";

    await appRouter.createCaller(ctx).auth.updateProfile({ name: "Ana", avatarDataUrl });

    expect(storageMock.storagePut).toHaveBeenCalledWith("profile-avatars/48/avatar.png", expect.any(Buffer), "image/png");
    expect(dbMock.updateEmailUserProfile).toHaveBeenCalledWith(student.id, { name: "Ana", avatarUrl: "/manus-storage/profile-avatars/48/avatar.png" });
  });
});
