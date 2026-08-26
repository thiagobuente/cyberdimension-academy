import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectFile = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), "utf8");

describe("reversão da conclusão de aula", () => {
  it("remove somente o registro da lição e do domínio do aluno atual", () => {
    const db = projectFile("server/db.ts");

    [
      "export async function removeLessonProgress",
      "eq(progress.userId, input.userId)",
      "eq(progress.domainId, input.domainId)",
      "eq(progress.lessonId, input.lessonId)",
    ].forEach((integration) => expect(db).toContain(integration));
  });

  it("valida o vínculo da lição antes de permitir que o progresso seja desfeito", () => {
    const router = projectFile("server/routers.ts");

    [
      "markIncomplete:",
      "db.getLessonById(input.lessonId)",
      "lesson.domainId !== input.domainId",
      "db.removeLessonProgress({ userId: ctx.user.id, domainId: input.domainId, lessonId: input.lessonId })",
    ].forEach((integration) => expect(router).toContain(integration));
  });
});
