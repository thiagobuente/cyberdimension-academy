import { createHash, randomBytes } from "node:crypto";

export const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000;

export function createPasswordResetToken() {
  return randomBytes(32).toString("base64url");
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getPasswordResetExpiry(now = Date.now()) {
  return new Date(now + PASSWORD_RESET_TTL_MS);
}

export function getPasswordResetUrl(token: string) {
  if (!process.env.APP_BASE_URL) return null;
  const url = new URL("/redefinir-senha", process.env.APP_BASE_URL);
  url.searchParams.set("token", token);
  return url.toString();
}
