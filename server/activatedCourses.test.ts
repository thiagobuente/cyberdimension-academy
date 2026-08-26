import { describe, expect, it } from "vitest";
import { activatedCatalogCourses } from "@shared/activatedCatalogCourses";
import { curriculumCourses } from "../client/src/data/curriculumCatalog";
import { getStarterCourse } from "../client/src/data/courseCatalog";

describe("cursos especializados ativados", () => {
  it("não mantém cursos especializados em planejamento", () => {
    const planned = curriculumCourses.filter((course) => course.status === "Em planejamento");
    expect(planned).toHaveLength(0);
  });

  it("direciona cada curso do catálogo para uma experiência funcional", () => {
    expect(activatedCatalogCourses).toHaveLength(56);
    for (const course of activatedCatalogCourses) {
      const catalogEntry = curriculumCourses.find((entry) => entry.existingSlug === course.slug);
      expect(catalogEntry?.status).toBe("Disponível");
      expect(getStarterCourse(course.slug)).toMatchObject({ title: course.title, labs: course.labs });
      expect(course.modules.length).toBeGreaterThanOrEqual(3);
      expect(course.assessmentQuestions.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("inclui laboratórios de análise de logs no SOC e em Forense Digital", () => {
    for (const slug of ["soc-analyst", "digital-forensics-fundamentals"]) {
      const course = activatedCatalogCourses.find((item) => item.slug === slug);
      expect(course?.labsList).toHaveLength(3);
      expect(course?.labsList.some((lab) => /log/i.test(`${lab.title} ${lab.description} ${lab.objective} ${lab.command}`))).toBe(true);
    }
  });

  it("oferece novas formações do iniciante ao avançado sem duplicar slugs", () => {
    const expectedSlugs = [
      "identidade-autenticacao-segura",
      "privacidade-protecao-dados",
      "active-directory-security",
      "vulnerability-management",
      "email-security-phishing-defense",
      "container-security",
      "threat-hunting-avancado",
      "security-architecture-threat-modeling",
      "ics-scada-security",
      "seguranca-pessoal-digital",
      "introducao-hacking-etico",
      "fundamentos-cloud-iniciante",
      "red-team-fundamentals",
      "api-security",
      "mobile-security",
      "database-security",
      "purple-team-operations",
      "red-team-operations",
      "seguranca-memoria-mitigacoes",
      "adversary-simulation",
      "security-program-management",
      "cloud-security-operations",
      "software-security-applied",
      "security-automation-operations",
      "detection-engineering",
      "iot-security-foundations",
      "software-supply-chain-security",
      "cyber-crisis-communication",
    ];
    expect(activatedCatalogCourses.map((course) => course.slug)).toEqual(expect.arrayContaining(expectedSlugs));
    expect(new Set(activatedCatalogCourses.map((course) => course.slug)).size).toBe(activatedCatalogCourses.length);
    expect(activatedCatalogCourses.filter((course) => course.level === "Avançado")).toHaveLength(11);
  });

  it("mantém o piloto de vídeo externo complementar com módulos e progresso existentes", () => {
    const videoCourse = getStarterCourse("identidade-autenticacao-segura");
    expect(videoCourse?.videoLearning).toMatchObject({
      provider: "YouTube",
      sourceUrl: expect.stringContaining("youtube.com/playlist"),
      embedUrl: expect.stringContaining("youtube-nocookie.com/embed"),
    });
    expect(videoCourse?.videoLearning?.sessions).toHaveLength(videoCourse?.modules.length);
  });

  it("mantém todas as novas formações audiovisuais com capítulos e fonte externa incorporável", () => {
    const videoSlugs = ["cloud-security-operations", "software-security-applied", "security-automation-operations", "detection-engineering", "iot-security-foundations", "software-supply-chain-security", "cyber-crisis-communication"];
    for (const slug of videoSlugs) {
      const course = getStarterCourse(slug);
      expect(course?.videoLearning).toMatchObject({ provider: "YouTube", embedUrl: expect.stringContaining("youtube-nocookie.com/embed") });
      expect(course?.videoLearning?.sessions).toHaveLength(3);
      expect(course?.videoLearning?.sessions.every((session) => session.chapters.length === 3 && session.transcript.length === 3)).toBe(true);
    }
  });

  it("mantém audioguias autorais publicados separadamente das referências externas", () => {
    for (const slug of ["iot-security-foundations", "software-supply-chain-security", "cyber-crisis-communication"]) {
      const course = getStarterCourse(slug);
      expect(course?.audioGuide).toMatchObject({
        narration: expect.stringContaining("CyberDimension Academy"),
        sourceUrl: expect.stringContaining("/manus-storage/"),
      });
    }
  });
});
