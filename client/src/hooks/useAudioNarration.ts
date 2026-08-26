/**
 * CyberDimension Audio Lab — síntese de voz local (Web Speech API).
 *
 * Os 160+ episódios do Audio Lab são micro-learning textual (transcrição de
 * Ana e Rafael). Em vez de exigir 160 arquivos WAV, o player reproduz a
 * transcrição com Web Speech API, dando voz a cada falante por meio de
 * vozes distintas para Ana e Rafael. A Web Speech API está disponível em
 * Chrome, Edge e Safari; em navegadores sem suporte, o episódio abre no
 * modo leitura.
 *
 * A escolha é intencional: síntese local garante disponibilidade imediata de
 * todo o catálogo, sem custo de armazenamento, e o sistema de XP/quiz não
 * depende do formato do áudio (apenas da conclusão da escuta).
 */
import { useCallback, useEffect, useRef, useState } from "react";

export interface NarrationState {
  playing: boolean;
  /** Índice da fala atual na transcrição. */
  lineIndex: number;
  /** Fraction do episódio (0..1) para a barra de progresso. */
  progress: number;
  supported: boolean;
}

export function useAudioNarration(transcript: readonly { speaker: string; text: string }[]) {
  const [state, setState] = useState<NarrationState>({
    playing: false,
    lineIndex: -1,
    progress: 0,
    supported: typeof window !== "undefined" && "speechSynthesis" in window,
  });
  const indexRef = useRef(0);
  const stoppedRef = useRef(true);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Troca de episódio: quando a transcrição muda (o aluno seleciona outro
  // episódio), a fala anterior é cancelada e o estado é zerado. A página
  // decide se inicia automaticamente a narração do novo episódio.
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stoppedRef.current = true;
    indexRef.current = 0;
    if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    keepAliveRef.current = null;
    setState({ playing: false, lineIndex: -1, progress: 0, supported: state.supported });
  }, [transcript]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Escolha de voz por falante.
   *
   * Regras (em ordem de prioridade):
   * 1. Voz em português (pt-BR preferido) — evita "Ana" falando em inglês.
   * 2. Gênero pelo voiceURI (identificador técnico do Google/Microsoft): nomes
   *    como Google-brasil-female ou pt-BR-FemaleVoice são confiáveis, ao
   *    contrário do voice.name (que pode conter "Man"/"Female" em contexto
   *    de fabricante e causar gênero trocado).
   * 3. Fallback: qualquer voz pt para Ana (feminino) ou Rafael (masculino)
   *    por heurística de nome apenas em voz pt.
   */
  const pickVoice = useCallback((voices: readonly SpeechSynthesisVoice[], speaker: string): SpeechSynthesisVoice | undefined => {
    const isAna = speaker === "Ana";
    const pt = voices.filter((voice) => /^pt-?br?$/i.test(voice.lang));
    const pool = pt.length > 0 ? pt : voices;
    const uri = pool.filter((voice) =>
      isAna ? /female|mulher|pt-BR-FemaleVoice|brasil-female/i.test(voice.voiceURI) : /male|homem|pt-BR-MaleVoice|brasil-male/i.test(voice.voiceURI),
    );
    if (uri[0]) return uri[0];
    const byName = pool.filter((voice) =>
      isAna ? /\bfemale\b|\bwoman\b|helena|luciana|francisca|fernanda/i.test(voice.name) : /\bmale\b|\bman\b|daniel|ricardo|antonio/i.test(voice.name),
    );
    if (byName[0]) return byName[0];
    return pool[0];
  }, []);

  const speakLine = useCallback(
    (index: number) => {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const line = transcript[index];
      if (!line) {
        setState((current) => ({ ...current, playing: false, lineIndex: Math.max(0, transcript.length - 1), progress: 1 }));
        stoppedRef.current = true;
        if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
        return;
      }
      indexRef.current = index;
      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.lang = "pt-BR";
      utterance.rate = 1.15;
      utterance.volume = 1;
      const voice = pickVoice(synth.getVoices(), line.speaker);
      if (voice) utterance.voice = voice;
      utterance.onend = () => {
        if (stoppedRef.current) return;
        const next = index + 1;
        setState((current) => ({ ...current, lineIndex: next, progress: next / transcript.length }));
        setTimeout(() => {
          if (!stoppedRef.current) speakLine(next);
        }, 320);
      };
      utterance.onerror = () => {
        if (stoppedRef.current) return;
        stoppedRef.current = true;
        if (keepAliveRef.current) clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
        setState((current) => ({ ...current, playing: false }));
      };
      synth.speak(utterance);
    },
    [transcript, pickVoice],
  );

  const start = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    stoppedRef.current = false;
    const synth = window.speechSynthesis;
    // As vozes podem não estar carregadas na primeira chamada; forçar a
    // atualização do catálogo antes de escolher a voz do falante.
    if (synth.getVoices().length === 0) {
      synth.addEventListener("voiceschanged", () => speakLine(indexRef.current >= 0 ? indexRef.current : 0), { once: true });
    }
    synth.cancel();
    // Chrome suspende a síntese em abas inativas; o keepAlive mantém vivo.
    keepAliveRef.current = setInterval(() => {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 10000);
    setState((current) => ({ ...current, playing: true }));
    const from = indexRef.current >= 0 ? indexRef.current : 0;
    speakLine(from);
  }, [speakLine]);

  const toggle = useCallback(() => {
    if (!("speechSynthesis" in window)) return () => undefined;
    if (state.playing) {
      stoppedRef.current = true;
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
      window.speechSynthesis.cancel();
      setState((current) => ({ ...current, playing: false }));
      return () => undefined;
    }
    start();
    return () => undefined;
  }, [state.playing, start]);

  const seekToLine = useCallback(
    (lineIndex: number) => {
      if (!("speechSynthesis" in window)) return;
      const wasPlaying = state.playing;
      stoppedRef.current = true;
      if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
      window.speechSynthesis.cancel();
      const target = Math.max(0, Math.min(lineIndex, transcript.length - 1));
      indexRef.current = target;
      setState((current) => ({ ...current, lineIndex: target, progress: target / transcript.length }));
      if (wasPlaying) {
        stoppedRef.current = false;
        keepAliveRef.current = setInterval(() => {
          const synth = window.speechSynthesis;
          if (synth.speaking && !synth.paused) {
            synth.pause();
            synth.resume();
          }
        }, 10000);
        speakLine(target);
      }
    },
    [state.playing, transcript.length, speakLine],
  );

  return { state, toggle, seekToLine };
}
