import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("área Favoritos", () => {
  const page = readFileSync(resolve(process.cwd(), "client/src/pages/Favorites.tsx"), "utf8");
  const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
  const layout = readFileSync(resolve(process.cwd(), "client/src/components/DashboardLayout.tsx"), "utf8");

  it("expõe página dedicada com consulta autenticada e remoção persistente", () => {
    expect(page).toContain("trpc.formations.summary.useQuery");
    expect(page).toContain("trpc.formations.setFavorite.useMutation");
    expect(page).toContain("favorite: false");
    expect(page).toContain("Sua biblioteca ainda está vazia");
  });

  it("registra a rota e o acesso da sidebar", () => {
    expect(app).toContain('path={"/favorites"} component={Favorites}');
    expect(layout).toContain('{ icon: Star, label: "Favoritos", path: "/favorites" }');
  });
});
