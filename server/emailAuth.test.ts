import { describe, expect, it } from "vitest";
import { createEmailOpenId, hashPassword, normalizeEmail, verifyPassword } from "./emailAuth";

describe("emailAuth", () => {
  it("normaliza o e-mail e gera uma identidade local não previsível", () => {
    expect(normalizeEmail("  ALUNO@Exemplo.COM ")).toBe("aluno@exemplo.com");
    expect(createEmailOpenId()).toMatch(/^email_[a-f0-9]{32}$/);
  });

  it("armazena senhas como hash e valida somente a senha correta", async () => {
    const password = "UmaSenhaSegura2026";
    const hash = await hashPassword(password);

    expect(hash).toMatch(/^scrypt\$[a-f0-9]+\$[a-f0-9]+$/);
    expect(hash).not.toContain(password);
    await expect(verifyPassword(password, hash)).resolves.toBe(true);
    await expect(verifyPassword("SenhaIncorreta2026", hash)).resolves.toBe(false);
  });
});
