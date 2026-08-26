import { describe, expect, it } from "vitest";
import { DEFAULT_READING_PREFERENCES, getReadingPreferenceClasses, normalizeReadingPreferences } from "./readingPreferences";

describe("preferências de leitura", () => {
  it("preserva apenas valores suportados e usa uma configuração confortável como padrão", () => {
    expect(normalizeReadingPreferences({ fontScale: "large", spacing: "normal", theme: "light", focusMode: true, highContrast: true })).toEqual({ fontScale: "large", spacing: "normal", theme: "light", focusMode: true, highContrast: true });
    expect(normalizeReadingPreferences({ fontScale: "gigante", theme: "ultraviolet" })).toEqual(DEFAULT_READING_PREFERENCES);
  });

  it("gera classes determinísticas para aplicar tamanho e espaçamento no conteúdo", () => {
    expect(getReadingPreferenceClasses(DEFAULT_READING_PREFERENCES)).toBe("reading-font-comfortable reading-spacing-comfortable");
  });

  it("inclui uma classe explícita quando o leitor exige contraste elevado", () => {
    expect(getReadingPreferenceClasses({ ...DEFAULT_READING_PREFERENCES, highContrast: true })).toBe("reading-font-comfortable reading-spacing-comfortable reading-contrast-high");
  });
});
