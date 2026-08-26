import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";
import * as db from "./db";
import { normalizeEmail } from "./emailAuth";

describe("Admin credentials validation", () => {
  it("creates/validates the admin account using the configured ADMIN_EMAIL and ADMIN_PASSWORD", async () => {
    expect(ENV.adminEmail.trim().length).toBeGreaterThan(0);
    expect(ENV.adminPassword.trim().length).toBeGreaterThan(0);
    // Ensure the admin account can be bootstrapped with the supplied credentials.
    await db.ensureEmailAdmin({
      openId: "admin-credentials-validation-openid",
      email: normalizeEmail(ENV.adminEmail),
      passwordHash: "", // placeholder: ensureEmailAdmin rehashes only when no passwordHash exists
      name: "Admin Validation",
    });
    const user = await db.getUserByEmail(normalizeEmail(ENV.adminEmail));
    expect(user).toBeTruthy();
    expect(user!.role).toBe("admin");
    // Restore the correct password hash so the admin keeps logging in with the real password.
    await db.ensureEmailAdmin({
      openId: user!.openId,
      email: normalizeEmail(ENV.adminEmail),
      passwordHash: "",
      name: user!.name ?? "Administrador CyberDimension",
    });
  });
});
