import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMock = vi.hoisted(() => ({
  getPodcastProgress: vi.fn(),
  savePodcastProgress: vi.fn(),
}));

vi.mock("./db", () => dbMock);

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 77,
    openId: "podcast-test-user",
    email: "ouvinte@example.com",
    name: "Rafael Teste",
    loginMethod: "email",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { clearCookie: vi.fn() } as TrpcContext["res"] };
}

describe("fluxos tRPC do Podcast Security+", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.getPodcastProgress.mockResolvedValue([]);
    dbMock.savePodcastProgress.mockResolvedValue({ justCompleted: false, completed: false, positionSeconds: 0 });
  });

  it("publica os setenta e dois episódios autorais (sessenta regulares, dois especiais ao vivo, cinco Raio-X e cinco especiais English for Cyber Pros) para a página de escuta", async () => {
    const caller = appRouter.createCaller(createContext());

    const episodes = await caller.podcast.list();

    expect(episodes).toHaveLength(88);
    expect(episodes.every((episode) => episode.audioUrl?.startsWith("/manus-storage/") && episode.transcript.length > 0)).toBe(true);
  });

  it("retorna somente o progresso de escuta do usuário autenticado", async () => {
    dbMock.getPodcastProgress.mockResolvedValue([{ episodeId: "ep01-general-security", positionSeconds: 91, completed: false }]);
    const caller = appRouter.createCaller(createContext());

    await expect(caller.podcast.getProgress()).resolves.toEqual([{ episodeId: "ep01-general-security", positionSeconds: 91, completed: false }]);
    expect(dbMock.getPodcastProgress).toHaveBeenCalledWith(77);
  });

  it("salva uma conclusão nova e retorna os XP que devem ser exibidos ao estudante", async () => {
    dbMock.savePodcastProgress.mockResolvedValue({ justCompleted: true, completed: true, positionSeconds: 900 });
    const caller = appRouter.createCaller(createContext());

    const result = await caller.podcast.saveProgress({ episodeId: "ep01-general-security", positionSeconds: 900, completed: true });

    expect(dbMock.savePodcastProgress).toHaveBeenCalledWith({ userId: 77, episodeId: "ep01-general-security", positionSeconds: 900, completed: true });
    expect(result).toEqual({ success: true, completed: true, justCompleted: true, awardedXp: 50 });
  });

  it("recusa tentativas de salvar progresso para um episódio inexistente", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.podcast.saveProgress({ episodeId: "episodio-invalido", positionSeconds: 0, completed: false })).rejects.toThrow("Episódio de Podcast inválido");
    expect(dbMock.savePodcastProgress).not.toHaveBeenCalled();
  });
});
