import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("PWA install CTA", () => {
  it("is present on the main page and supports browser and iOS guidance", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const cta = readFileSync(resolve(process.cwd(), "client/src/components/PwaInstallCta.tsx"), "utf8");
    expect(home).toContain("<PwaInstallCta />");
    expect(cta).toContain("beforeinstallprompt");
    expect(cta).toContain("Instalar aplicativo");
    expect(cta).toContain("Adicionar à Tela de Início");
  });
});
