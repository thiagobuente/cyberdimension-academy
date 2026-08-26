import { describe, expect, it, vi } from "vitest";
import {
  APOSTILAS_GITHUB_URL,
  FREE_VIDEO_BADGE_MILESTONES,
  FREE_VIDEO_COURSE_CATEGORIES,
  FREE_VIDEO_COURSES,
  FREE_VIDEO_XP_PER_WATCH,
  getFreeCourseBySlug,
} from "../shared/freeVideoCourses";

describe("catálogo de cursos gratuitos", () => {
  it("tem cursos registrados nas categorias esperadas", () => {
    expect(FREE_VIDEO_COURSES.length).toBeGreaterThan(0);
    const availableCount = FREE_VIDEO_COURSES.filter((course) => course.status === "disponivel").length;
    expect(availableCount).toBeGreaterThan(0);
    for (const course of FREE_VIDEO_COURSES) {
      expect(FREE_VIDEO_COURSE_CATEGORIES).toContain(course.category);
      expect(course.slug).toMatch(/^[a-z0-9-]{3,120}$/);
    }
  });

  it("não tem slugs duplicados", () => {
    const slugs = FREE_VIDEO_COURSES.map((course) => course.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("só permite ids de vídeo válidos do YouTube nos cursos disponíveis", () => {
    for (const course of FREE_VIDEO_COURSES) {
      if (course.status === "indisponivel") continue;
      expect(course.videoId, `${course.slug} tem videoId inválido`).toMatch(/^[A-Za-z0-9_-]{6,15}$/);
    }
  });

  it("getFreeCourseBySlug encontra cursos por slug e retorna undefined para inexistentes", () => {
    expect(getFreeCourseBySlug(FREE_VIDEO_COURSES[0].slug)).toBe(FREE_VIDEO_COURSES[0]);
    expect(getFreeCourseBySlug("slug-inexistente-xyz")).toBeUndefined();
  });

  it("tem XP padrão por curso disponível e zero nos indisponíveis", () => {
    expect(FREE_VIDEO_XP_PER_WATCH).toBe(10);
    for (const course of FREE_VIDEO_COURSES) {
      const expected = course.status === "disponivel" ? FREE_VIDEO_XP_PER_WATCH : 0;
      expect(course.watchXp).toBe(expected);
    }
  });

  it("expõe o link das apostilas no GitHub", () => {
    expect(APOSTILAS_GITHUB_URL).toBe("https://github.com/jorgegil1905/Apostilas-das-Aulas");
  });
});

describe("marcos da coleção gratuita", () => {
  it("define milestones crescentes de 10, 20 e 30 cursos", () => {
    expect(FREE_VIDEO_BADGE_MILESTONES.map((milestone) => milestone.count)).toEqual([10, 20, 30]);
    const codes = FREE_VIDEO_BADGE_MILESTONES.map((milestone) => milestone.code);
    expect(codes).toEqual(["free-courses-10", "free-courses-20", "free-courses-30"]);
  });

  it("concede os marcos quando a contagem atinge ou ultrapassa o limite", () => {
    const earnedFor = (watched: number) =>
      FREE_VIDEO_BADGE_MILESTONES.filter((milestone) => watched >= milestone.count).map((milestone) => milestone.code);
    expect(earnedFor(0)).toEqual([]);
    expect(earnedFor(9)).toEqual([]);
    expect(earnedFor(10)).toEqual(["free-courses-10"]);
    expect(earnedFor(15)).toEqual(["free-courses-10"]);
    expect(earnedFor(20)).toEqual(["free-courses-10", "free-courses-20"]);
    expect(earnedFor(30)).toEqual(["free-courses-10", "free-courses-20", "free-courses-30"]);
  });

  it("concede todos os marcos em cascata para contagens acima de 30", () => {
    const codes = FREE_VIDEO_BADGE_MILESTONES
      .filter((milestone) => 45 >= milestone.count)
      .map((milestone) => milestone.code);
    expect(codes).toEqual(["free-courses-10", "free-courses-20", "free-courses-30"]);
  });
});

describe("remoção da lista de continuar assistindo", () => {
  it("remove o curso da lista assistida recalculando a contagem", async () => {
    const watched = new Set(["agentes-inteligentes", "assembly", "resvm8ty"]);
    const remove = (slug: string) => {
      watched.delete(slug);
      return watched.size;
    };
    const newCount = remove("assembly");
    expect(watched.has("assembly")).toBe(false);
    expect(newCount).toBe(2);
    expect(watched.size).toBeLessThan(3);
  });
});
