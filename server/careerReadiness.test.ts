import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

function createCaller(user: { id: number; email: string; name: string | null; openId: string; loginMethod: string; role: string } | null) {
  return appRouter.createCaller({ user } as never);
}

describe("formations.readiness", () => {
  it("returns consolidated progress and quiz area for authenticated user", async () => {
    const user = { id: -999, email: "readiness@test.local", name: "Readiness Tester", openId: "readiness-test-oid", loginMethod: "email", role: "user" };
    const caller = createCaller(user);
    const result = await caller.formations.readiness();
    expect(result).toHaveProperty("modules");
    expect(result).toHaveProperty("labs");
    expect(result).toHaveProperty("certificates");
    expect(result).toHaveProperty("quizArea");
    expect(Array.isArray(result.modules)).toBe(true);
  });

  it("rejects unauthenticated user", async () => {
    const caller = createCaller(null);
    await expect(caller.formations.readiness()).rejects.toThrow();
  });
});
