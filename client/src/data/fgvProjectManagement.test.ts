import { describe, expect, it } from "vitest";
import { fgvProjectManagementCourses, fgvProjectManagementSource } from "./fgvProjectManagement";

describe("FGV project management track", () => {
  it("contains the seven courses from the verified source list", () => {
    expect(fgvProjectManagementCourses).toHaveLength(7);
    expect(fgvProjectManagementCourses.map((course) => course.duration)).toEqual(["5 horas", "10 horas", "6 horas", "5 horas", "5 horas", "8 horas", "5 horas"]);
  });

  it("uses official FGV destinations and declares external ownership", () => {
    expect(fgvProjectManagementCourses.every((course) => course.href.startsWith("https://cursosgratuitos.fgv.br/curso/"))).toBe(true);
    expect(fgvProjectManagementSource.institution).toContain("FGV");
    expect(fgvProjectManagementSource.note).toContain("não emite");
  });
});
