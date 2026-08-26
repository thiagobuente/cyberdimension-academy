import { describe, expect, it } from "vitest";

const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL;

describe("configuração do provedor de recuperação de senha", () => {
  it.skipIf(!resendApiKey || !resendFromEmail)("autentica a chave Resend e reconhece o remetente configurado", async () => {
    const response = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${resendApiKey}` },
    });

    expect(response.ok).toBe(true);
    expect(resendFromEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
