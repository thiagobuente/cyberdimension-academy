import type { StarterCourse } from "@/data/courseCatalog";
import { academies, curriculumCourses } from "@/data/curriculumCatalog";

export type VideoSort = "title-asc" | "title-desc" | "lessons-desc" | "level";

export type VideoCatalogEntry = {
  course: StarterCourse;
  academy: string;
  academySlug: string;
  searchText: string;
};

const levelRank: Record<StarterCourse["level"], number> = {
  Iniciante: 1,
  Fundamental: 2,
  Intermediário: 3,
  Avançado: 4,
};

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();

export function buildVideoCatalog(videoCourses: readonly StarterCourse[]): VideoCatalogEntry[] {
  return videoCourses.map((course) => {
    const curriculum = curriculumCourses.find((item) => item.existingSlug === course.slug);
    const academy = academies.find((item) => item.slug === curriculum?.academy);
    const academyName = academy?.name ?? "Formação CyberDimension";
    const topicText = curriculum?.topics.join(" ") ?? "";
    return {
      course,
      academy: academyName,
      academySlug: curriculum?.academy ?? "core",
      searchText: normalize([course.title, course.shortTitle, course.level, course.focus, course.videoLearning?.label ?? "", academyName, topicText].join(" ")),
    };
  });
}

export function filterVideoCatalog(entries: readonly VideoCatalogEntry[], filters: { query?: string; level?: string; academy?: string }): VideoCatalogEntry[] {
  const query = normalize(filters.query ?? "");
  return entries.filter((entry) => {
    const matchesQuery = !query || query.split(/\s+/).every((term) => entry.searchText.includes(term));
    const matchesLevel = !filters.level || filters.level === "all" || entry.course.level === filters.level;
    const matchesAcademy = !filters.academy || filters.academy === "all" || entry.academySlug === filters.academy;
    return matchesQuery && matchesLevel && matchesAcademy;
  });
}

export function sortVideoCatalog(entries: readonly VideoCatalogEntry[], sort: VideoSort): VideoCatalogEntry[] {
  return [...entries].sort((a, b) => {
    if (sort === "title-desc") return b.course.title.localeCompare(a.course.title, "pt-BR");
    if (sort === "lessons-desc") return b.course.lessons - a.course.lessons || a.course.title.localeCompare(b.course.title, "pt-BR");
    if (sort === "level") return levelRank[b.course.level] - levelRank[a.course.level] || a.course.title.localeCompare(b.course.title, "pt-BR");
    return a.course.title.localeCompare(b.course.title, "pt-BR");
  });
}

export function listVideoLevels(entries: readonly VideoCatalogEntry[]) {
  return Array.from(new Set(entries.map((entry) => entry.course.level))).sort((a, b) => levelRank[a] - levelRank[b]);
}

export function listVideoAcademies(entries: readonly VideoCatalogEntry[]) {
  return Array.from(new Map(entries.map((entry) => [entry.academySlug, entry.academy] as [string, string])).entries()).sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
}
