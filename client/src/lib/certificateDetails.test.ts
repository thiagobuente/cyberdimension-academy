import { describe, expect, it } from "vitest";
import { isValidCertificateDisplayName, normalizeCertificateDisplayName } from "./certificateDetails";

describe("certificate details", () => {
  it("normaliza espaços antes de enviar o nome", () => {
    expect(normalizeCertificateDisplayName("  Ana Beatriz  ")).toBe("Ana Beatriz");
  });

  it("aceita nomes dentro do limite do certificado", () => {
    expect(isValidCertificateDisplayName("Ana Beatriz da Silva")).toBe(true);
  });

  it("recusa nome vazio ou curto demais", () => {
    expect(isValidCertificateDisplayName(" ")).toBe(false);
    expect(isValidCertificateDisplayName("A")).toBe(false);
  });

  it("recusa nomes acima do limite público", () => {
    expect(isValidCertificateDisplayName("A".repeat(121))).toBe(false);
  });
});
