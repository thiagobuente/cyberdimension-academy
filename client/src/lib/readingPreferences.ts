export const READING_PREFERENCES_STORAGE_KEY = "cyberdimension-reading-preferences";

export type ReadingFontScale = "standard" | "comfortable" | "large";
export type ReadingSpacing = "compact" | "normal" | "comfortable";
export type ReadingTheme = "cyber" | "soft-dark" | "light";

export interface ReadingPreferences {
  fontScale: ReadingFontScale;
  spacing: ReadingSpacing;
  theme: ReadingTheme;
  focusMode: boolean;
  highContrast: boolean;
}

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
  fontScale: "comfortable",
  spacing: "comfortable",
  theme: "cyber",
  focusMode: false,
  highContrast: false,
};

const fontScales: ReadingFontScale[] = ["standard", "comfortable", "large"];
const spacings: ReadingSpacing[] = ["compact", "normal", "comfortable"];
const themes: ReadingTheme[] = ["cyber", "soft-dark", "light"];

export function normalizeReadingPreferences(value: unknown): ReadingPreferences {
  if (!value || typeof value !== "object") return DEFAULT_READING_PREFERENCES;
  const candidate = value as Partial<ReadingPreferences>;

  return {
    fontScale: fontScales.includes(candidate.fontScale as ReadingFontScale) ? candidate.fontScale as ReadingFontScale : DEFAULT_READING_PREFERENCES.fontScale,
    spacing: spacings.includes(candidate.spacing as ReadingSpacing) ? candidate.spacing as ReadingSpacing : DEFAULT_READING_PREFERENCES.spacing,
    theme: themes.includes(candidate.theme as ReadingTheme) ? candidate.theme as ReadingTheme : DEFAULT_READING_PREFERENCES.theme,
    focusMode: typeof candidate.focusMode === "boolean" ? candidate.focusMode : DEFAULT_READING_PREFERENCES.focusMode,
    highContrast: typeof candidate.highContrast === "boolean" ? candidate.highContrast : DEFAULT_READING_PREFERENCES.highContrast,
  };
}

export function getReadingPreferenceClasses(preferences: ReadingPreferences) {
  return `reading-font-${preferences.fontScale} reading-spacing-${preferences.spacing} ${preferences.highContrast ? "reading-contrast-high" : ""}`.trim();
}
