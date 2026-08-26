import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { User } from "../drizzle/schema";
import { evaluatePodcastListenerBadges, PODCAST_LISTENER_BADGES, episodeNumber } from "../shared/podcastListenerBadges";
import { podcastEpisodes } from "../shared/podcastEpisodes";

const testUser: User = {
  id: 77,
  openId: "badge-test-open-id",
  name: "Badge Test User",
  email: "badge.test@example.com",
  role: "user",
} as User;

const adminUser: User = {
  id: 1,
  openId: "admin-open-id",
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
} as User;

function makeCaller(user: User | null) {
  return appRouter.createCaller({
    user,
    req: {} as never,
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as never,
  });
}

describe("CyberCast listener badge evaluation", () => {
  it("exposes a stable set of listener milestones", () => {
    const codes = PODCAST_LISTENER_BADGES.map((badge) => badge.code);
    expect(codes).toHaveLength(new Set(codes).size);
    expect(codes).toContain("podcast-first-hop");
    expect(codes).toContain("podcast-full-series");
    expect(codes).toContain("podcast-season-three");
  });

  it("resolves the episode number from published ids", () => {
    expect(episodeNumber("ep51-forense-custodia-evidencia")).toBe(51);
    expect(episodeNumber("ep01-general-security")).toBe(1);
    expect(episodeNumber("not-an-episode")).toBe(-1);
  });

  it("awards entry milestones as episodes complete", () => {
    const completed = new Set(podcastEpisodes.slice(0, 10).map((episode) => episode.id));
    const awarded = evaluatePodcastListenerBadges(
      { completedEpisodeIds: completed, perfectQuizEpisodeIds: new Set(), quizSubmittedEpisodeIds: new Set(), publishedEpisodeIds: new Set(podcastEpisodes.map((episode) => episode.id)) },
      new Set()
    );
    const codes = awarded.map((badge) => badge.code);
    expect(codes).toContain("podcast-first-hop");
    expect(codes).toContain("podcast-decadia");
    expect(codes).not.toContain("podcast-veteran");
    expect(codes).not.toContain("podcast-full-series");
  });

  it("rewards perfect quiz streaks and the season three arc", () => {
    const completed = new Set(podcastEpisodes.map((episode) => episode.id));
    const perfect = new Set(podcastEpisodes.slice(0, 15).map((episode) => episode.id));
    const awarded = evaluatePodcastListenerBadges(
      { completedEpisodeIds: completed, perfectQuizEpisodeIds: perfect, quizSubmittedEpisodeIds: new Set(), publishedEpisodeIds: new Set(podcastEpisodes.map((episode) => episode.id)) },
      new Set()
    );
    const codes = awarded.map((badge) => badge.code);
    expect(codes).toContain("podcast-full-series");
    expect(codes).toContain("podcast-perfect-streak-5");
    expect(codes).toContain("podcast-perfect-streak-15");
    expect(codes).toContain("podcast-season-three");
  });

  it("never re-awards badges already held", () => {
    const completed = new Set(podcastEpisodes.map((episode) => episode.id));
    const awarded = evaluatePodcastListenerBadges(
      { completedEpisodeIds: completed, perfectQuizEpisodeIds: new Set(), quizSubmittedEpisodeIds: new Set(), publishedEpisodeIds: new Set(podcastEpisodes.map((episode) => episode.id)) },
      new Set(PODCAST_LISTENER_BADGES.map((badge) => badge.code))
    );
    expect(awarded).toEqual([]);
  });

  it("awards Polyglot Cyber only when every English episode and quiz is complete", () => {
    const englishIds = [
      "ep68-english-for-cyber-pros",
      "ep69-network-security-interview",
      "ep70-cloud-security-interview",
      "ep71-incident-response-interview",
      "ep72-penetration-testing-interview",
    ];
    const allCompleted = new Set(podcastEpisodes.map((episode) => episode.id));
    expect(
      evaluatePodcastListenerBadges(
        { completedEpisodeIds: allCompleted, perfectQuizEpisodeIds: new Set(), quizSubmittedEpisodeIds: allCompleted, publishedEpisodeIds: new Set(podcastEpisodes.map((episode) => episode.id)) },
        new Set()
      ).map((badge) => badge.code)
    ).toContain("polyglot-cyber");

    const missingOneCompleted = new Set(podcastEpisodes.map((episode) => episode.id).filter((id) => id !== "ep72-penetration-testing-interview"));
    expect(
      evaluatePodcastListenerBadges(
        { completedEpisodeIds: missingOneCompleted, perfectQuizEpisodeIds: new Set(), quizSubmittedEpisodeIds: new Set(), publishedEpisodeIds: new Set(podcastEpisodes.map((episode) => episode.id)) },
        new Set()
      ).map((badge) => badge.code)
    ).not.toContain("polyglot-cyber");

    const completedNoQuiz = new Set(podcastEpisodes.map((episode) => episode.id));
    expect(
      evaluatePodcastListenerBadges(
        { completedEpisodeIds: completedNoQuiz, perfectQuizEpisodeIds: new Set(), quizSubmittedEpisodeIds: new Set(englishIds.slice(0, 4)), publishedEpisodeIds: new Set(podcastEpisodes.map((episode) => episode.id)) },
        new Set()
      ).map((badge) => badge.code)
    ).not.toContain("polyglot-cyber");
  });

  it("grants the Polyglot Cyber badge with its published xp", () => {
    const badge = PODCAST_LISTENER_BADGES.find((current) => current.code === "polyglot-cyber");
    expect(badge).toBeDefined();
    expect(badge!.xp).toBe(300);
    expect(badge!.icon).toBe("languages");
  });
});

describe("podcast.listenerBadges endpoint", () => {
  it("lists the badges already granted to the authenticated listener", async () => {
    const caller = makeCaller(testUser);
    const { badges } = await caller.podcast.listenerBadges();
    expect(Array.isArray(badges)).toBe(true);
    for (const badge of badges) {
      expect(badge).toHaveProperty("code");
      expect(badge).toHaveProperty("awardedAt");
    }
  });
});

describe("podcast.claimListenerBadges endpoint", () => {
  it("refuses anonymous callers", async () => {
    const caller = makeCaller(null);
    await expect(caller.podcast.claimListenerBadges()).rejects.toThrow();
  });

  it("returns an empty award list for a fresh listener", async () => {
    const caller = makeCaller(testUser);
    const result = await caller.podcast.claimListenerBadges();
    expect(result.newlyAwarded).toEqual([]);
    expect(result.xpGranted).toBe(0);
  });
});

describe("admin.podcastListening report", () => {
  it("rejects non-admin users", async () => {
    const caller = makeCaller(testUser);
    await expect(caller.admin.podcastListening()).rejects.toThrow();
  });

  it("aggregates one row per listener with podcast XP", async () => {
    const caller = makeCaller(adminUser);
    const { listeners } = await caller.admin.podcastListening();
    expect(Array.isArray(listeners)).toBe(true);
    for (const listener of listeners) {
      expect(listener).toHaveProperty("userId");
      expect(listener).toHaveProperty("completedEpisodes");
      expect(listener).toHaveProperty("quizAttempts");
      expect(listener).toHaveProperty("podcastXp");
    }
  });
});
