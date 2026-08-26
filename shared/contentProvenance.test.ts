import { describe, expect, it } from "vitest";
import { getContentProvenance, getContentProvenanceSummary } from "./contentProvenance";

describe("content provenance", () => {
  it("registra materiais próprios e explica que não há referência externa quando o curso não usa uma", () => {
    const items = getContentProvenance({ title: "Formação própria" });

    expect(items).toHaveLength(4);
    expect(items.every((item) => item.origin === "proprio")).toBe(true);
    expect(items.map((item) => item.category)).toEqual(expect.arrayContaining([
      "Apostilas e aulas próprias",
      "Código e cenários próprios",
      "Laboratórios e projetos próprios",
      "Quizzes e avaliações próprias",
    ]));
    expect(getContentProvenanceSummary({ title: "Formação própria" })).toEqual({ ownCount: 4, externalCount: 0 });
  });

  it("registra vídeo, documentação e licença como fontes complementares separadas", () => {
    const course = {
      title: "Formação com referências",
      videoLearning: { provider: "YouTube" as const, label: "Canal de referência", sourceUrl: "https://www.youtube.com/watch?v=example" },
      externalResources: [{
        category: "Documentação" as const,
        title: "Guia técnico de referência",
        source: "Projeto de referência",
        license: "Conforme disponibilizada pelo mantenedor.",
        usage: "Leitura complementar para consulta de conceitos.",
        href: "https://example.com/docs",
      }],
    };
    const items = getContentProvenance(course);
    const external = items.filter((item) => item.origin === "externo");

    expect(external).toHaveLength(2);
    expect(external[0]).toMatchObject({ category: "YouTube · vídeo incorporado", href: course.videoLearning.sourceUrl });
    expect(external[1]).toMatchObject({ category: "Documentação", href: course.externalResources[0].href, license: course.externalResources[0].license });
    expect(getContentProvenanceSummary(course)).toEqual({ ownCount: 4, externalCount: 2 });
  });
});
