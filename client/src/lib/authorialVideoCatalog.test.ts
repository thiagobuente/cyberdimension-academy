import { describe, expect, it } from "vitest";
import { functionalCourses } from "@/data/courseCatalog";
import { countAuthorialVideoLessons, getAuthorialVideoLessons } from "@/lib/authorialVideoCatalog";

describe("authorial video catalog", () => {
  it("creates ten authorial video lessons for every functional course", () => {
    const allLessons = functionalCourses.flatMap((course) => getAuthorialVideoLessons(course));
    expect(functionalCourses.length).toBeGreaterThan(4);
    expect(allLessons).toHaveLength(functionalCourses.length * 10);
    expect(allLessons.every((lesson) => lesson.status === "roteiro_autoral" || lesson.status === "publicado")).toBe(true);
    expect(allLessons.every((lesson) => lesson.chapters.length >= 3 && lesson.transcript.length === lesson.chapters.length)).toBe(true);
  });

  it("publishes the AI academy lessons with real playable MP4 sources", () => {
    const lessons = getAuthorialVideoLessons(functionalCourses.find((course) => course.slug === "ia-do-zero-ao-avancado")!);
    expect(lessons.every((lesson) => lesson.status === "publicado")).toBe(true);
    expect(lessons.every((lesson) => lesson.mediaUrl?.startsWith("/video-media/") && lesson.mediaUrl.endsWith(".mp4"))).toBe(true);
    expect(lessons[1].duration).toBe("4 min 53 s");
    expect(lessons[2].duration).toBe("5 min 27 s");
    expect(lessons[3].duration).toBe("4 min 05 s");
    expect(lessons[4].duration).toBe("3 min 48 s");
    expect(lessons[5].duration).toBe("3 min 14 s");
    expect(lessons[6].duration).toBe("3 min 40 s");
    expect(lessons[7].duration).toBe("2 min 57 s");
    expect(lessons[8].duration).toBe("3 min 13 s");
    expect(lessons[9].duration).toBe("4 min 20 s");
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
