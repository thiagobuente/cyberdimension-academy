import { describe, expect, it } from "vitest";
import { buildBadgeVerificationUrl, buildCertificateVerificationUrl, buildLinkedInShareUrl } from "./linkedinShare";

describe("links de compartilhamento profissional", () => {
  it("cria o link do LinkedIn com a credencial codificada", () => {
    const sharedUrl = buildLinkedInShareUrl("https://cyberacad.example/verify-certificate?identifier=CDA 01");
    expect(sharedUrl).toBe("https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fcyberacad.example%2Fverify-certificate%3Fidentifier%3DCDA%2001");
  });

  it("cria o link público de validação com o identificador do certificado", () => {
    expect(buildCertificateVerificationUrl("https://cyberacad.example", "CDA-FUNDAMENTOS-TI-001")).toBe("https://cyberacad.example/verify-certificate?identifier=CDA-FUNDAMENTOS-TI-001");
  });

  it("cria o link público individual de um badge conquistado", () => {
    expect(buildBadgeVerificationUrl("https://cyberacad.example", 501)).toBe("https://cyberacad.example/badge/501");
  });
});
