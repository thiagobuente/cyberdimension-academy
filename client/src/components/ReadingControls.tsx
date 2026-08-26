import { AlignJustify, ArrowRight, BookOpenText, CheckCircle2, Contrast, Eye, Focus, LoaderCircle, Minus, Moon, Plus, RotateCcw, Sun, Type } from "lucide-react";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import type { ReadingFontScale, ReadingSpacing, ReadingTheme } from "@/lib/readingPreferences";

const fontScaleOrder: ReadingFontScale[] = ["standard", "comfortable", "large"];
const spacingOrder: ReadingSpacing[] = ["compact", "normal", "comfortable"];
const fontScaleLabels = ["Menor", "Confortável", "Maior"];
const spacingLabels = ["Compacto", "Padrão", "Amplo"];
const spacingValues = ["1,55", "1,70", "1,90"];
const themeOptions: Array<{ value: ReadingTheme; label: string; icon: typeof Sun }> = [
  { value: "soft-dark", label: "Escuro", icon: Moon },
  { value: "light", label: "Claro", icon: Sun },
];

type ReadingControlsProps = {
  compact?: boolean;
  onMarkComplete?: () => void;
  isMarkingComplete?: boolean;
  isComplete?: boolean;
  completionDisabled?: boolean;
  onUndoCompletion?: () => void;
  undoAvailable?: boolean;
  onNextLesson?: () => void;
  nextLessonTitle?: string;
};

export function ReadingControls({
  compact = false,
  onMarkComplete,
  isMarkingComplete = false,
  isComplete = false,
  completionDisabled = false,
  onUndoCompletion,
  undoAvailable = false,
  onNextLesson,
  nextLessonTitle,
}: ReadingControlsProps) {
  const { preferences, setFocusMode, setFontScale, setHighContrast, setSpacing, setTheme } = useReadingPreferences();
  const fontIndex = fontScaleOrder.indexOf(preferences.fontScale);
  const spacingIndex = spacingOrder.indexOf(preferences.spacing);
  const setRelativeFontScale = (direction: -1 | 1) =>
    setFontScale(fontScaleOrder[Math.max(0, Math.min(fontScaleOrder.length - 1, fontIndex + direction))]);
  const setRelativeSpacing = (direction: -1 | 1) =>
    setSpacing(spacingOrder[Math.max(0, Math.min(spacingOrder.length - 1, spacingIndex + direction))]);

  return (
    <section aria-label="Ferramentas de leitura" className={`reading-toolbar ${compact ? "reading-toolbar-compact" : ""}`}>
      <div className="reading-toolbar-group" role="group" aria-label="Tamanho do texto">
        <span className="reading-toolbar-label"><Type className="h-3.5 w-3.5" /> Texto</span>
        <button type="button" onClick={() => setRelativeFontScale(-1)} disabled={fontIndex === 0} aria-label="Diminuir fonte" className="reading-toolbar-icon-button"><Minus className="h-4 w-4" /></button>
        <output aria-live="polite" aria-label={`Tamanho ${fontScaleLabels[fontIndex]}`} className="reading-toolbar-scale">A{fontIndex + 1}</output>
        <button type="button" onClick={() => setRelativeFontScale(1)} disabled={fontIndex === fontScaleOrder.length - 1} aria-label="Aumentar fonte" className="reading-toolbar-icon-button"><Plus className="h-4 w-4" /></button>
      </div>
      <div className="reading-toolbar-divider" aria-hidden="true" />
      <div className="reading-toolbar-group" role="group" aria-label="Espaçamento entre linhas">
        <span className="reading-toolbar-label"><AlignJustify className="h-3.5 w-3.5" /> Linhas</span>
        <button type="button" onClick={() => setRelativeSpacing(-1)} disabled={spacingIndex === 0} aria-label="Diminuir espaçamento entre linhas" className="reading-toolbar-icon-button"><Minus className="h-4 w-4" /></button>
        <output aria-live="polite" aria-label={`Espaçamento ${spacingLabels[spacingIndex]}`} className="reading-toolbar-scale">{spacingValues[spacingIndex]}</output>
        <button type="button" onClick={() => setRelativeSpacing(1)} disabled={spacingIndex === spacingOrder.length - 1} aria-label="Aumentar espaçamento entre linhas" className="reading-toolbar-icon-button"><Plus className="h-4 w-4" /></button>
      </div>
      <div className="reading-toolbar-divider" aria-hidden="true" />
      <div className="reading-toolbar-group" role="group" aria-label="Tema de leitura">
        <span className="reading-toolbar-label">Tema</span>
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const selected = preferences.theme === option.value;
          return <button key={option.value} type="button" onClick={() => setTheme(option.value)} aria-pressed={selected} className={`reading-toolbar-button ${selected ? "is-active" : ""}`}><Icon className="h-3.5 w-3.5" /> <span>{option.label}</span></button>;
        })}
      </div>
      <div className="reading-toolbar-divider" aria-hidden="true" />
      <button type="button" onClick={() => setFocusMode(!preferences.focusMode)} aria-pressed={preferences.focusMode} className={`reading-toolbar-focus ${preferences.focusMode ? "is-active" : ""}`}>
        {preferences.focusMode ? <Eye className="h-4 w-4" /> : <Focus className="h-4 w-4" />}
        <span>{preferences.focusMode ? "Foco ativo" : "Modo foco"}</span>
        <BookOpenText className="h-3.5 w-3.5 opacity-70" />
      </button>
      <button type="button" onClick={() => setHighContrast(!preferences.highContrast)} aria-pressed={preferences.highContrast} className={`reading-toolbar-focus ${preferences.highContrast ? "is-high-contrast" : ""}`}>
        <Contrast className="h-4 w-4" />
        <span>{preferences.highContrast ? "Contraste alto" : "Contraste"}</span>
      </button>
      {onMarkComplete && <>
        <div className="reading-toolbar-divider" aria-hidden="true" />
        <button
          type="button"
          onClick={onMarkComplete}
          disabled={isComplete || isMarkingComplete || completionDisabled}
          aria-label={isComplete ? "Aula concluída" : "Marcar aula como concluída"}
          className={`reading-toolbar-focus ${isComplete ? "is-complete" : ""}`}
        >
          {isMarkingComplete ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          <span>{isComplete ? "Concluída" : isMarkingComplete ? "Salvando..." : "Concluir aula"}</span>
        </button>
      </>}
      {isComplete && undoAvailable && onUndoCompletion && <>
        <div className="reading-toolbar-divider" aria-hidden="true" />
        <button type="button" onClick={onUndoCompletion} className="reading-toolbar-focus is-undo">
          <RotateCcw className="h-4 w-4" />
          <span>Desfazer</span>
        </button>
      </>}
      {isComplete && onNextLesson && nextLessonTitle && <>
        <div className="reading-toolbar-divider" aria-hidden="true" />
        <button type="button" onClick={onNextLesson} className="reading-toolbar-focus is-next" aria-label={`Ir para a próxima aula: ${nextLessonTitle}`}>
          <span>Próxima aula</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </>}
    </section>
  );
}
