import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (relativePath: string) => readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("auditoria visual e funcional do certificado", () => {
  it("mantém dados dinâmicos e QR Code apontando para a verificação real", () => {
    const document = projectFile("client/src/components/CertificateDocument.tsx");
    ["studentName", "courseTitle", "issuedAt", "identifier", "buildCertificateVerificationUrl", "QRCode.toDataURL", "QR Code para verificar a autenticidade"].forEach((token) => expect(document).toContain(token));
  });

  it("separa ações da interface do documento impresso em A4", () => {
    const document = projectFile("client/src/components/CertificateDocument.tsx");
    ["certificate-actions", "@page { size: A4 portrait", "display: none !important", "210mm", "297mm", "window.print()", "Baixar PDF", "Publicar no LinkedIn"].forEach((token) => expect(document).toContain(token));
  });

  it("usa o documento compartilhado nos certificados de domínio e formação", () => {
    expect(projectFile("client/src/pages/Certificate.tsx")).toContain("<CertificateDocument");
    expect(projectFile("client/src/pages/FormationCertificate.tsx")).toContain("<CertificateDocument");
  });
});
