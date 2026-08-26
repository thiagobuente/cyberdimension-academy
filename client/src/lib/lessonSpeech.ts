/**
 * Narração por voz do conteúdo de uma aula (Modo Estudo).
 *
 * Reutiliza o padrão do Audio Lab: Web Speech API local com voz pt-BR,
 * voz feminina (Ana) por voiceURI confiável, velocidade 1.15 e keepAlive
 * contra a suspensão do Chrome em abas inativas. O conteúdo da aula é
 * convertido em frases faláveis a partir do Markdown (títulos, listas e
 * parágrafos preservam a ordem de leitura).
 */

function stripMarkdownLine(line: string): string {
  let text = line
    .replace(/#{1,6}\s+/, "")
    .replace(/^\s*[-*+]\s+/, "• ")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/_{1,2}(.+?)_{1,2}/g, "$1")
    .trim();
  return text;
}

export function lessonToSpeechLines(markdown: string): string[] {
  return markdown
    .split(/\r?\n/)
    .map(stripMarkdownLine)
    .filter((text) => text.length > 0)
    .filter((text) => !/^\|/.test(text) && !/^---/.test(text))
    .map((text) => text.replace(/\s+/g, " "));
}

export function pickVoice(speakerFemale: boolean, voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const pt = voices.filter((voice) => /^pt-?br?$/i.test(voice.lang));
  const pool = pt.length > 0 ? pt : voices;
  const uri = pool.filter((voice) =>
    speakerFemale ? /female|mulher|pt-BR-FemaleVoice|brasil-female/i.test(voice.voiceURI) : /male|homem|pt-BR-MaleVoice|brasil-male/i.test(voice.voiceURI),
  );
  if (uri[0]) return uri[0];
  const byName = pool.filter((voice) =>
    speakerFemale ? /\bfemale\b|\bwoman\b|helena|luciana|francisca|fernanda/i.test(voice.name) : /\bmale\b|\bman\b|daniel|ricardo|antonio/i.test(voice.name),
  );
  if (byName[0]) return byName[0];
  return pool[0];
}

export interface LessonSpeechHandle {
  play(): void;
  stop(): void;
  setRate(rate: number): void;
  destroy(): void;
}

export interface LessonSpeechCallbacks {
  onLine?: (index: number, total: number) => void;
  onEnd?: () => void;
}

/**
 * Inicia a narração de uma aula e devolve um handle de controle.
 * O callback stop cancela a fala; play retoma do trecho atual.
 */
export function speakLesson(lines: string[], callbacks: LessonSpeechCallbacks = {}): LessonSpeechHandle {
  const synth = window.speechSynthesis;
  let index = 0;
  let stopped = true;
  let rate = 1.15;
  let keepAlive: ReturnType<typeof setInterval> | null = null;
  const callbacksRef = { ...callbacks };

  const updateVoice = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
  };

  const speakLine = (i: number) => {
    if (!("speechSynthesis" in window)) return;
    if (i >= lines.length) {
      stopped = true;
      if (keepAlive) clearInterval(keepAlive);
      keepAlive = null;
      synth.cancel();
      callbacksRef.onEnd?.();
      return;
    }
    index = i;
    const utterance = new SpeechSynthesisUtterance(lines[i]);
    utterance.lang = "pt-BR";
    utterance.rate = rate;
    const voice = pickVoice(true, synth.getVoices());
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      if (stopped) return;
      callbacksRef.onLine?.(i + 1, lines.length);
      setTimeout(() => {
        if (!stopped) speakLine(i + 1);
      }, 300);
    };
    utterance.onerror = () => {
      if (stopped) return;
      stopped = true;
      if (keepAlive) clearInterval(keepAlive);
      keepAlive = null;
      synth.cancel();
    };
    synth.speak(utterance);
  };

  const handle: LessonSpeechHandle = {
    play() {
      if (!("speechSynthesis" in window)) return;
      stopped = false;
      const voices = synth.getVoices();
      if (voices.length === 0) {
        synth.addEventListener("voiceschanged", () => speakLine(index), { once: true });
      }
      synth.cancel();
      if (keepAlive) clearInterval(keepAlive);
      keepAlive = setInterval(() => {
        if (synth.speaking && !synth.paused) {
          synth.pause();
          synth.resume();
        }
      }, 10000);
      speakLine(index);
    },
    stop() {
      stopped = true;
      if (keepAlive) clearInterval(keepAlive);
      keepAlive = null;
      synth.cancel();
    },
    setRate(r: number) {
      rate = Math.max(0.75, Math.min(2, r));
    },
    destroy() {
      handle.stop();
      updateVoice();
    },
  };

  return handle;
}
