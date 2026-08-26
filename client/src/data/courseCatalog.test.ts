import { describe, expect, it } from "vitest";
import { getStarterCourse, starterCourses } from "./courseCatalog";

describe("catálogo inicial de formações", () => {
  it("mantém as quatro formações previstas na rota de aprendizado", () => {
    expect(starterCourses.map((course) => course.code)).toEqual(["ORBIT-01", "ORBIT-02", "ORBIT-03", "ORBIT-04"]);
    expect(starterCourses.map((course) => course.shortTitle)).toEqual([
      "Fundamentos de TI",
      "Fundamentos de Cyber",
      "Redes para Cyber",
      "Linux para Segurança",
    ]);
  });

  it("expõe uma estrutura pedagógica completa para cada formação", () => {
    for (const course of starterCourses) {
      expect(course.modules.length).toBeGreaterThan(0);
      expect(course.labsList.length).toBeGreaterThan(0);
      expect(course.lessons).toBeGreaterThan(0);
      expect(course.labs).toBeGreaterThan(0);
      expect(course.assessment).not.toHaveLength(0);
      expect(course.labsList).toHaveLength(course.labs);
      for (const lab of course.labsList) {
        expect(lab.objective).not.toHaveLength(0);
        expect(lab.command).not.toHaveLength(0);
        expect(lab.output).not.toHaveLength(0);
      }
    }
  });

  it("localiza formações por slug e não inventa cursos desconhecidos", () => {
    expect(getStarterCourse("fundamentos-ti")?.code).toBe("ORBIT-01");
    expect(getStarterCourse("curso-inexistente")).toBeUndefined();
  });

  it("oferece sessões em vídeo com capítulos e transcrições de apoio para identidade, redes e Linux", () => {
    const videoCourses = starterCourses.filter((course) => course.videoLearning);
    expect(videoCourses.map((course) => course.slug)).toEqual([
      "redes-para-cyber-security",
      "linux-para-operacoes-de-seguranca",
    ]);

    for (const course of videoCourses) {
      const videoLearning = course.videoLearning;
      expect(videoLearning?.embedUrl).toMatch(/^https:\/\//);
      expect(videoLearning?.sourceUrl).toMatch(/^https:\/\//);
      expect(videoLearning?.sessions.length).toBeGreaterThan(0);
      for (const session of videoLearning?.sessions ?? []) {
        expect(session.chapters.length).toBeGreaterThan(1);
        expect(session.transcript.length).toBeGreaterThan(1);
        expect(session.chapters.every((chapter) => /^\d{2}:\d{2}$/.test(chapter.time))).toBe(true);
        expect(session.transcript.every((entry) => entry.text.length > 20)).toBe(true);
      }
    }
  });

  it("resolve as novas formações audiovisuais ativadas com três sessões de estudo", () => {
    const videoSlugs = ["cloud-security-operations", "software-security-applied", "security-automation-operations", "detection-engineering"];

    for (const slug of videoSlugs) {
      const course = getStarterCourse(slug);
      expect(course?.videoLearning?.provider).toBe("YouTube");
      expect(course?.videoLearning?.sessions).toHaveLength(3);
      expect(course?.videoLearning?.sessions.every((session) => session.chapters.length === 3 && session.transcript.length === 3)).toBe(true);
    }
  });
});
