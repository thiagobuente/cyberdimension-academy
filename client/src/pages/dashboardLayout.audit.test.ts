import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readProject = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("auditoria do layout horizontal do Dashboard", () => {
  it("reserva o espaço real da sidebar e mantém o main flexível", () => {
    const dashboard = readProject("client/src/pages/Dashboard.tsx");
    const css = readProject("client/src/index.css");
    expect(dashboard).toContain('className="dashboard-main container');
    expect(dashboard).not.toContain('lg:ml-64 lg:max-w-none lg:px-8 xl:px-10');
    expect(css).toContain(".dashboard-main");
    expect(css).toContain("width: calc(100% - 16rem)");
    expect(css).toContain("min-width: 0");
  });

  it("não usa 100vw como largura do conteúdo do Dashboard", () => {
    const dashboard = readProject("client/src/pages/Dashboard.tsx");
    expect(dashboard).not.toMatch(/(?:width|min-width|max-width):\s*100vw/);
  });

  it("mantém quebra para textos e grupos sem esconder overflow da página", () => {
    const css = readProject("client/src/index.css");
    expect(css).toContain("max-width: 100%");
    expect(css).toContain("flex-wrap: wrap");
    expect(css).not.toContain("body { overflow-x: hidden");
  });
});
