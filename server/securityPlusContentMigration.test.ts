import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath = new URL("../drizzle/0009_securityplus_field_content.sql", import.meta.url);
const migrationSql = readFileSync(migrationPath, "utf8");

describe("Migração de conteúdo autoral Security+", () => {
  it("versiona uma aula em campo para cada domínio oficial", () => {
    const titles = [
      "Security+ em campo: princípios, controles e mudanças",
      "Security+ em campo: modelagem de ameaças e mitigação",
      "Security+ em campo: arquitetura híbrida e Zero Trust",
      "Security+ em campo: detecção, resposta e preservação de evidências",
      "Security+ em campo: governança, risco e conformidade aplicada",
    ];

    for (const title of titles) {
      expect(migrationSql).toContain(title);
    }

    for (const domainCode of ["DOM1", "DOM2", "DOM3", "DOM4", "DOM5"]) {
      expect(migrationSql).toContain(`d.\`code\` = '${domainCode}'`);
    }
  });

  it("preserva 25 questões formativas, cinco por domínio, de forma idempotente", () => {
    expect(migrationSql).toContain("INSERT INTO `questions`");
    expect(migrationSql).toContain("JSON_ARRAY(v.`optionA`, v.`optionB`, v.`optionC`, v.`optionD`)");
    expect(migrationSql).toContain("WHERE q.`domainId` = d.`id` AND q.`question` = v.`question`");
    expect((migrationSql.match(/UNION ALL SELECT/g) ?? [])).toHaveLength(24);
  });
});
