import { describe, expect, it } from "vitest";
import { functionalCourses } from "@/data/courseCatalog";
import { countAuthorialVideoLessons, getAuthorialVideoLessons } from "@/lib/authorialVideoCatalog";

describe("authorial video catalog", () => {
  it("creates ten authorial video lessons for every functional course", () => {
    const allLessons = functionalCourses.flatMap((course) => getAuthorialVideoLessons(course));
    expect(functionalCourses.length).toBeGreaterThan(4);
    expect(allLessons).toHaveLength(functionalCourses.length * 10);
    expect(allLessons.every((lesson) => lesson.status === "roteiro_autoral" || lesson.status === "publicado")).toBe(true);
    expect(allLessons.every((lesson) => lesson.chapters.length === 3 && lesson.transcript.length === 3)).toBe(true);
  });

  it("publishes the AI academy pilot with a playable MP4 source", () => {
    const lesson = getAuthorialVideoLessons(functionalCourses.find((course) => course.slug === "ia-do-zero-ao-avancado")!)[0];
    expect(lesson.status).toBe("publicado");
    expect(lesson.mediaUrl).toContain("/video-media/");
    expect(lesson.mediaUrl).toMatch(/\.mp4$/);
  });

  it("keeps lesson identifiers unique and ordered inside each course", () => {
    for (const course of functionalCourses) {
      const lessons = getAuthorialVideoLessons(course);
      expect(countAuthorialVideoLessons(course)).toBe(10);
      expect(lessons.map((lesson) => lesson.lessonNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(10);
      expect(lessons.every((lesson) => lesson.courseSlug === course.slug)).toBe(true);
    }
  });
});
