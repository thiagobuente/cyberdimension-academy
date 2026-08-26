import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_READING_PREFERENCES,
  normalizeReadingPreferences,
  READING_PREFERENCES_STORAGE_KEY,
  type ReadingFontScale,
  type ReadingPreferences,
  type ReadingSpacing,
  type ReadingTheme,
} from "@/lib/readingPreferences";

interface ReadingPreferencesContextValue {
  preferences: ReadingPreferences;
  setFontScale: (fontScale: ReadingFontScale) => void;
  setSpacing: (spacing: ReadingSpacing) => void;
  setTheme: (theme: ReadingTheme) => void;
  setFocusMode: (focusMode: boolean) => void;
  setHighContrast: (highContrast: boolean) => void;
}

const ReadingPreferencesContext = createContext<ReadingPreferencesContextValue | undefined>(undefined);

function readStoredPreferences(): ReadingPreferences {
  if (typeof window === "undefined") return DEFAULT_READING_PREFERENCES;
  try {
    const value = window.localStorage.getItem(READING_PREFERENCES_STORAGE_KEY);
    return value ? normalizeReadingPreferences(JSON.parse(value)) : DEFAULT_READING_PREFERENCES;
  } catch {
    return DEFAULT_READING_PREFERENCES;
  }
}

export function ReadingPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<ReadingPreferences>(readStoredPreferences);

  useEffect(() => {
    document.documentElement.dataset.readingTheme = preferences.theme;
    document.documentElement.dataset.readingContrast = preferences.highContrast ? "high" : "standard";
    window.localStorage.setItem(READING_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  const update = (patch: Partial<ReadingPreferences>) => setPreferences((current) => ({ ...current, ...patch }));

  return (
    <ReadingPreferencesContext.Provider value={{
      preferences,
      setFontScale: (fontScale) => update({ fontScale }),
      setSpacing: (spacing) => update({ spacing }),
      setTheme: (theme) => update({ theme }),
      setFocusMode: (focusMode) => update({ focusMode }),
      setHighContrast: (highContrast) => update({ highContrast }),
    }}>
      {children}
    </ReadingPreferencesContext.Provider>
  );
}

export function useReadingPreferences() {
  const context = useContext(ReadingPreferencesContext);
  if (!context) throw new Error("useReadingPreferences must be used within ReadingPreferencesProvider");
  return context;
}
