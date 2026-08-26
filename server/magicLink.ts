import { createHash, randomBytes } from "node:crypto";
import { ENV } from "./_core/env";

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

export function createMagicLinkToken() {
  return randomBytes(32).toString("base64url");
}

export function hashMagicLinkToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getMagicLinkExpiry(now = new Date()) {
  return new Date(now.getTime() + MAGIC_LINK_TTL_MS);
}

export function getMagicLinkUrl(token: string, baseUrl = ENV.appBaseUrl) {
  const normalizedBaseUrl = baseUrl?.trim().replace(/\/+$/, "");
  if (!normalizedBaseUrl) return undefined;
  return `${normalizedBaseUrl}/confirmar-acesso?token=${encodeURIComponent(token)}`;
}
