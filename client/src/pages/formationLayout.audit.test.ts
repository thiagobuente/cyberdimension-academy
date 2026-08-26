import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readProject = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("auditoria do layout compartilhado de formações", () => {
  it("usa somente as colunas correspondentes aos filhos diretos do Course", () => {
    const course = readProject("client/src/pages/Course.tsx");
    expect(course).toContain('lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]');
    expect(course).not.toContain("lg:grid-cols-[19rem_minmax(0,1fr)_19rem]");
  });

  it("mantém conteúdo e colunas encolhíveis nos dois templates", () => {
    const css = readProject("client/src/index.css");
    expect(css).toContain(".course-layout > *");
    expect(css).toContain(".formation-layout > *");
    expect(css).toContain(".course-content");
    expect(css).toContain("overflow-wrap: anywhere");
  });
});
