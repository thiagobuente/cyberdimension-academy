import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(process.cwd(), "client/src/components/ReadingControls.tsx"), "utf8");
const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("barra de ferramentas do leitor", () => {
  it("oferece controles diretos de fonte, tema e modo foco", () => {
    ["aria-label=\"Diminuir fonte\"", "aria-label=\"Aumentar fonte\"", "setFocusMode(!preferences.focusMode)", "setTheme(option.value)", "Ferramentas de leitura"].forEach((control) => expect(source).toContain(control));
  });

  it("permite ajustar persistentemente o espaçamento entre linhas", () => {
    ["Espaçamento entre linhas", "Diminuir espaçamento entre linhas", "Aumentar espaçamento entre linhas", "setSpacing", 'spacingValues = ["1,55", "1,70", "1,90"]'].forEach((control) => expect(source).toContain(control));
    ["line-height: 1.55", "line-height: 1.7", "line-height: 1.9"].forEach((style) => expect(styles).toContain(style));
  });

  it("suporta a conclusão opcional da aula com estados de salvamento e concluída", () => {
    ["onMarkComplete?: () => void", "isMarkingComplete", "Concluir aula", "Aula concluída"].forEach((control) => expect(source).toContain(control));
  });

  it("expõe ações condicionais para desfazer e seguir para a próxima aula", () => {
    ["onUndoCompletion?: () => void", "undoAvailable", "onNextLesson?: () => void", "Próxima aula", "Desfazer"].forEach((control) => expect(source).toContain(control));
  });
});
