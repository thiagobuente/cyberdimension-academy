import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createEmailOpenId() {
  return `email_${randomUUID().replaceAll("-", "")}`;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, encodedHash: string | null | undefined) {
  if (!encodedHash) return false;
  const [algorithm, salt, expectedKey] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedKey) return false;

  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  const expectedBuffer = Buffer.from(expectedKey, "hex");
  return expectedBuffer.length === derivedKey.length && timingSafeEqual(expectedBuffer, derivedKey);
}
