import { describe, expect, it } from "vitest";
import { functionalCourses } from "@/data/courseCatalog";
import { buildVideoCatalog, filterVideoCatalog, listVideoAcademies, listVideoLevels, sortVideoCatalog } from "@/lib/videoLibrary";

describe("videoLibrary", () => {
  const entries = buildVideoCatalog(functionalCourses.filter((course) => Boolean(course.videoLearning)));

  it("mantém somente cursos com Modo Vídeo e associa academia quando houver metadado curricular", () => {
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.every((entry) => Boolean(entry.course.videoLearning))).toBe(true);
    expect(entries.some((entry) => entry.academy.includes("Academy"))).toBe(true);
  });

  it("busca por múltiplos termos em título, tema ou academia", () => {
    const result = filterVideoCatalog(entries, { query: "redes cyber" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((entry) => entry.course.slug === "redes-para-cyber-security")).toBe(true);
  });

  it("filtra por nível e academia", () => {
    const cloud = filterVideoCatalog(entries, { academy: "cloud-security", level: "Intermediário" });
    expect(cloud.length).toBeGreaterThan(0);
    expect(cloud.every((entry) => entry.academySlug === "cloud-security" && entry.course.level === "Intermediário")).toBe(true);
  });

  it("expõe opções derivadas do catálogo e ordena sem mutar a lista original", () => {
    const originalFirst = entries[0].course.slug;
    const sorted = sortVideoCatalog(entries, "lessons-desc");
    expect(entries[0].course.slug).toBe(originalFirst);
    expect(sorted[0].course.lessons).toBeGreaterThanOrEqual(sorted.at(-1)!.course.lessons);
    expect(listVideoLevels(entries).length).toBeGreaterThan(0);
    expect(listVideoAcademies(entries).length).toBeGreaterThan(0);
  });
});
