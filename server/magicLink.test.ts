import { describe, expect, it } from "vitest";
import { createMagicLinkToken, getMagicLinkExpiry, getMagicLinkUrl, hashMagicLinkToken } from "./magicLink";

describe("utilitários de link mágico", () => {
  it("gera um token aleatório, armazena apenas seu hash e define validade de 15 minutos", () => {
    const token = createMagicLinkToken();
    const now = new Date("2026-08-14T15:00:00.000Z");

    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(hashMagicLinkToken(token)).toMatch(/^[a-f0-9]{64}$/);
    expect(getMagicLinkExpiry(now).getTime() - now.getTime()).toBe(15 * 60 * 1000);
  });

  it("cria uma URL de confirmação e não inventa endereço quando a base não foi configurada", () => {
    expect(getMagicLinkUrl("token-seguro", "https://cyberacad.example/")).toBe("https://cyberacad.example/confirmar-acesso?token=token-seguro");
    expect(getMagicLinkUrl("token-seguro", "")).toBeUndefined();
  });
});
