import { describe, expect, it } from "vitest";
import { buildAdminUserRowKey } from "./adminRowKeys";

describe("chaves das linhas do painel administrativo", () => {
  it("gera uma chave estável e distinta para cada usuário", () => {
    expect(buildAdminUserRowKey(1)).toBe("admin-user-1");
    expect(new Set([buildAdminUserRowKey(1), buildAdminUserRowKey(2)])).toHaveLength(2);
  });
});
