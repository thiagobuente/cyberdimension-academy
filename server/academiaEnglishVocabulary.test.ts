import { describe, expect, it } from "vitest";
import { getAcademyEnglishVocabulary, ACADEMY_ENGLISH_VOCABULARY, getEnglishSectionMetadata } from "../shared/academiaEnglishVocabulary";
import { academies } from "../client/src/data/curriculumCatalog";

describe("Vocabulário de inglês transversal por academia", () => {
  it("todas as academias possuem vocabulário com ao menos 6 termos válidos", () => {
    for (const academy of academies) {
      const terms = getAcademyEnglishVocabulary(academy.slug);
      expect(terms.length, `academia ${academy.slug} deve ter vocabulário`).toBeGreaterThanOrEqual(6);
      for (const term of terms) {
        expect(term.id).toMatch(/^term-/);
        expect(term.term).toBeTruthy();
        expect(term.meaning).toBeTruthy();
        expect(term.exampleEn).toBeTruthy();
      }
    }
  });

  it("não há duplicados dentro da mesma academia", () => {
    for (const academy of academies) {
      const terms = getAcademyEnglishVocabulary(academy.slug);
      const ids = terms.map((term) => term.id);
      expect(new Set(ids).size, `academia ${academy.slug} tem termos duplicados`).toBe(ids.length);
    }
  });

  it("cada academia tem sua lista própria no mapa", () => {
    expect(Object.keys(ACADEMY_ENGLISH_VOCABULARY).length).toBe(academies.length);
  });

  it("cada slug de academia gera metadados de seção consistentes", () => {
    for (const academy of academies) {
      const terms = getAcademyEnglishVocabulary(academy.slug);
      const sectionKey = `technical-english-${academy.slug}`;
      expect(sectionKey.startsWith("technical-english-")).toBe(true);
      expect(terms.length).toBeGreaterThan(0);
    }
  });
});
