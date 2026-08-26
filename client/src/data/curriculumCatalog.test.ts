import { describe, expect, it } from "vitest";
import { academies, curriculumCourses, getCoursesForAcademy } from "./curriculumCatalog";

describe("curriculum catalog", () => {
  it("mantém a expansão com cinquenta e seis cursos e níveis definidos", () => {
    expect(curriculumCourses).toHaveLength(66);
    expect(curriculumCourses.filter((course) => course.level === "Iniciante")).toHaveLength(17);
    expect(curriculumCourses.filter((course) => course.level === "Intermediário")).toHaveLength(37);
    expect(curriculumCourses.filter((course) => course.level === "Avançado")).toHaveLength(12);
  });

  it("mantém sete academias com uma rota curricular", () => {
    expect(academies).toHaveLength(7);
    expect(academies.every((academy) => academy.route.length >= 4)).toBe(true);
    expect(getCoursesForAcademy("blue-team").length).toBeGreaterThan(0);
  });

  it("direciona as novas formações em vídeo para academias disponíveis", () => {
    const videoSlugs = ["cloud-security-operations", "software-security-applied", "security-automation-operations", "detection-engineering", "iot-security-foundations", "software-supply-chain-security", "cyber-crisis-communication"];
    const aiSecurityIds = ["ai-security-fundamentals", "ai-red-team", "ai-governance"];
    const aiCourses = curriculumCourses.filter((course) => aiSecurityIds.includes(course.id));
    expect(aiCourses).toHaveLength(3);
    expect(aiCourses.every((course) => course.academy === "ai-security")).toBe(true);
    expect(academies.some((academy) => academy.slug === "ai-security")).toBe(true);
    const videoCourses = curriculumCourses.filter((course) => videoSlugs.includes(course.existingSlug ?? ""));

    expect(videoCourses).toHaveLength(7);
    expect(videoCourses.every((course) => course.status === "Disponível")).toBe(true);
    expect(videoCourses.map((course) => course.academy)).toEqual(expect.arrayContaining(["cloud-security", "security-engineering", "blue-team"]));
  });
});
