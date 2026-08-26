import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMock = vi.hoisted(() => ({
  getPodcastProgress: vi.fn(),
  getLatestPodcastQuizAttempt: vi.fn(),
  getPodcastListenerBadges: vi.fn(),
  awardPodcastListenerBadge: vi.fn(),
  getPodcastListeningReport: vi.fn(),
  getPodcastWeeklyRanking: vi.fn(),
  savePodcastQuizAttempt: vi.fn(),
  createPodcastQuizAttempt: vi.fn(),
  savePodcastProgress: vi.fn(),
  getUserByOpenId: vi.fn(),
  markUserSignedIn: vi.fn(),
}));

vi.mock("./db", () => dbMock);

import { appRouter } from "./routers";
import { PODCAST_LISTENER_BADGES } from "../shared/podcastListenerBadges";
import { podcastEpisodes } from "../shared/podcastEpisodes";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

const flowUser: AuthenticatedUser = {
  id: 88,
  openId: "badge-flow-open-id",
  name: "Badge Flow User",
  email: "badge.flow@example.com",
  loginMethod: "email",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const adminUser: AuthenticatedUser = {
  ...flowUser,
  id: 1,
  openId: "admin-open-id",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
};

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return { user, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: { clearCookie: vi.fn() } as TrpcContext["res"] };
}

describe("CyberCast badge flow integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMock.getPodcastProgress.mockResolvedValue([]);
    dbMock.getLatestPodcastQuizAttempt.mockResolvedValue(null);
    dbMock.getPodcastListenerBadges.mockResolvedValue([]);
    dbMock.awardPodcastListenerBadge.mockResolvedValue({});
  });

  it("claims a badge after completing the first episode", async () => {
    dbMock.getPodcastProgress.mockResolvedValue([
      {
        id: 1,
        userId: flowUser.id,
        episodeId: "ep01-general-security",
        positionSeconds: 240,
        completed: true,
        updatedAt: new Date(),
      },
    ]);

    const caller = appRouter.createCaller(createContext(flowUser));
    const result = await caller.podcast.claimListenerBadges();
    expect(result.newlyAwarded.some((badge) => badge.code === "podcast-first-hop")).toBe(true);
  });

  it("claims badges after quiz completion and surfaces XP", async () => {
    dbMock.getPodcastProgress.mockResolvedValue([
      {
        id: 2,
        userId: flowUser.id,
        episodeId: "ep01-general-security",
        positionSeconds: 240,
        completed: true,
        updatedAt: new Date(),
      },
    ]);
    dbMock.getLatestPodcastQuizAttempt.mockResolvedValue({
      id: 1,
      userId: flowUser.id,
      episodeId: "ep01-general-security",
      score: 5,
      totalQuestions: 5,
      answers: [0, 1, 2, 3, 0],
      createdAt: new Date(),
    });

    const caller = appRouter.createCaller(createContext(flowUser));
    const result = await caller.podcast.claimListenerBadges();
    const codes = result.newlyAwarded.map((badge) => badge.code);
    expect(codes).toContain("podcast-first-hop");
    expect(codes).not.toContain("podcast-perfect-streak-5");
    expect(result.xpGranted).toBeGreaterThan(0);
  });

  it("awards the full-series badge only after all published episodes", async () => {
    dbMock.getPodcastProgress.mockResolvedValue(
      podcastEpisodes.map((episode, index) => ({
        id: index + 10,
        userId: flowUser.id,
        episodeId: episode.id,
        positionSeconds: 300,
        completed: true,
        updatedAt: new Date(),
      }))
    );

    const caller = appRouter.createCaller(createContext(flowUser));
    const result = await caller.podcast.claimListenerBadges();
    const codes = result.newlyAwarded.map((badge) => badge.code);
    expect(codes).toContain("podcast-full-series");
    expect(codes).toContain("podcast-season-three");
    expect(codes.length).toBeGreaterThan(1);
  });

  it("includes all badge definitions in the published catalog", () => {
    const codes = PODCAST_LISTENER_BADGES.map((badge) => badge.code);
    for (const code of codes) {
      const definition = PODCAST_LISTENER_BADGES.find((badge) => badge.code === code);
      expect(definition?.name).toBeTruthy();
      expect(definition?.xp).toBeGreaterThan(0);
    }
  });
});

describe("admin.podcastListening report integration", () => {
  it("aggregates listeners ordered by podcast XP", async () => {
    dbMock.getPodcastListeningReport.mockResolvedValue({ listeners: [] });

    const caller = appRouter.createCaller(createContext(adminUser));
    const { listeners } = await caller.admin.podcastListening();
    for (let index = 1; index < listeners.length; index += 1) {
      expect(listeners[index].podcastXp).toBeLessThanOrEqual(listeners[index - 1].podcastXp);
    }
  });

  it("exposes listener identity fields", async () => {
    dbMock.getPodcastListeningReport.mockResolvedValue({
      listeners: [
        {
          userId: 3,
          name: "Aluno Teste",
          email: "aluno.teste@example.com",
          completedEpisodes: 5,
          quizAttempts: 2,
          quizPercentage: 100,
          podcastXp: 60,
          lastActivityAt: new Date(),
        },
      ],
    });

    const caller = appRouter.createCaller(createContext(adminUser));
    const { listeners } = await caller.admin.podcastListening();
    expect(listeners).toHaveLength(1);
    for (const listener of listeners) {
      expect(listener).toHaveProperty("name");
      expect(listener).toHaveProperty("email");
      expect(listener).toHaveProperty("quizPercentage");
      expect(listener).toHaveProperty("lastActivityAt");
    }
  });
});
