import { describe, expect, it } from "vitest";
import { publicCatalogGroups } from "./publicCatalog";

describe("public catalog composition", () => {
  it("mantém as quatro formações ORBIT ao lado dos 56 cursos curriculares disponíveis", () => {
    expect(publicCatalogGroups.orbitFormations).toHaveLength(4);
    expect(publicCatalogGroups.orbitFormations.map((course) => course.code)).toEqual(["ORBIT-01", "ORBIT-02", "ORBIT-03", "ORBIT-04"]);
    expect(publicCatalogGroups.curriculumCourses).toHaveLength(66);
    expect(publicCatalogGroups.curriculumCourses.filter((course) => course.level === "Avançado")).toHaveLength(12);
    expect(publicCatalogGroups.curriculumCourses.find((course) => course.existingSlug === "identidade-autenticacao-segura")?.status).toBe("Disponível");
    expect(publicCatalogGroups.curriculumCourses.find((course) => course.existingSlug === "detection-engineering")?.status).toBe("Disponível");
    expect(publicCatalogGroups.curriculumCourses.find((course) => course.existingSlug === "iot-security-foundations")?.status).toBe("Disponível");
  });
});
