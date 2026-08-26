import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BadgeCheck,
  ArrowDownToLine,
  Brain,
  CheckCircle2,
  CirclePause,
  CirclePlay,
  FileText,
  Sparkles,
  Star,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import type { AudioLabEpisode } from "@shared/audioLabEpisodes";
import { getAudioLabSeries } from "@shared/audioLabSeries";

export type AudioLabQuizResult = {
  score: number;
  totalQuestions: number;
  percentage: number;
  quizXp: number;
  attemptId: number;
  competency: { code: string; label: string; area: string };
  review: Array<{ id: string; correct: boolean; explanation: string }>;
};

export const AUDIO_LAB_EPISODE_XP = 50;
export const AUDIO_LAB_QUIZ_XP_PER_CORRECT = 10;

export type AccentKey = "cyan" | "purple" | "green" | "amber";

export const AUDIO_LAB_SERIES_META: Record<string, { label: string; short: string; accent: string }> = {
  securityplus: { label: "Security+ em Áudio", short: "Security+", accent: "cyan" },
  english: { label: "Technical English", short: "English", accent: "purple" },
  "soc-radio": { label: "SOC Analyst Radio", short: "SOC Radio", accent: "green" },
  "red-team": { label: "Red Team Briefing", short: "Red Team", accent: "amber" },
  "blue-team": { label: "Blue Team Briefing", short: "Blue Team", accent: "cyan" },
  "cloud-minutes": { label: "Cloud Security Minutes", short: "Cloud", accent: "green" },
  "ai-security": { label: "AI Security", short: "AI Security", accent: "amber" },
  "grc-minutes": { label: "GRC em 10 Minutos", short: "GRC 10min", accent: "purple" },
  "ctf-cases": { label: "CTF Cases — Temporada 4", short: "CTF Cases", accent: "amber" },
};

export function seriesMeta(seriesCode: string | undefined) {
  if (!seriesCode) return null;
  const series = getAudioLabSeries(seriesCode);
  return {
    label: series?.title ?? AUDIO_LAB_SERIES_META[seriesCode]?.label ?? seriesCode,
    short: series?.shortTitle ?? AUDIO_LAB_SERIES_META[seriesCode]?.short ?? seriesCode.slice(0, 8).toUpperCase(),
    accent: series?.accent ?? AUDIO_LAB_SERIES_META[seriesCode]?.accent ?? "cyan",
  };
}

export const ACCENT_BORDER: Record<AccentKey, string> = { cyan: "border-neon-cyan/50", purple: "border-neon-purple/50", green: "border-neon-green/50", amber: "border-neon-amber/50" };
export const ACCENT_BG: Record<AccentKey, string> = { cyan: "bg-neon-cyan/15", purple: "bg-neon-purple/15", green: "bg-neon-green/15", amber: "bg-neon-amber/15" };
export const ACCENT_TEXT: Record<AccentKey, string> = {
  cyan: "text-neon-cyan",
  purple: "text-neon-purple",
  green: "text-neon-green",
  amber: "text-neon-amber",
};
export const ACCENT_SELECTED_BORDER: Record<AccentKey, string> = {
  cyan: "border-neon-cyan/45",
  purple: "border-neon-purple/45",
  green: "border-neon-green/45",
  amber: "border-neon-amber/45",
};
export const ACCENT_SELECTED_BG: Record<AccentKey, string> = {
  cyan: "bg-neon-cyan/[0.09]",
  purple: "bg-neon-purple/[0.09]",
  green: "bg-neon-green/[0.09]",
  amber: "bg-neon-amber/[0.09]",
};
export const ACCENT_DOT_BORDER: Record<AccentKey, string> = {
  cyan: "border-neon-cyan/35",
  purple: "border-neon-purple/35",
  green: "border-neon-green/35",
  amber: "border-neon-amber/35",
};
export const ACCENT_DOT_BG: Record<AccentKey, string> = {
  cyan: "bg-neon-cyan/10",
  purple: "bg-neon-purple/10",
  green: "bg-neon-green/10",
  amber: "bg-neon-amber/10",
};

export function getAccent(accent: string | undefined): AccentKey {
  return accent === "purple" || accent === "green" || accent === "amber" ? accent : "cyan";
}

export function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

const AUDIO_PLAYBACK_RATES: readonly number[] = [0.75, 1, 1.25, 1.5, 2];

export function estimateCueTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const minutes = Math.floor(safeSeconds / 60);
  const hours = Math.floor(safeSeconds / 3600);
  return hours > 0 ? `${hours}:${String(minutes % 60).padStart(2, "0")}:${String(safeSeconds % 60).padStart(2, "0")}` : `${minutes}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

export function speakerTone(speaker: string) {
  return speaker === "Ana"
    ? "border-neon-cyan/35 bg-neon-cyan/[0.08] text-neon-cyan"
    : "border-neon-purple/35 bg-neon-purple/[0.08] text-neon-purple";
}

/** Reproduz o áudio do áudio lab diretamente pelo proxy do servidor,
 * evitando redirects 307 que falham em algumas redes e extensões. */
export function getAudioLabAudioSrc(audioUrl: string | undefined) {
  return audioUrl ? audioUrl.replace(/^\/manus-storage\//, "/podcast-audio/") : undefined;
}

/** Estilos do seek clicável do player (thumb + trilhas), equivalentes ao CyberCast. */
const CDP_SEEK_CSS = `
input.cdp-seek::-webkit-slider-runnable-track { height: 8px; border-radius: 9999px; background: transparent; }
input.cdp-seek::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: oklch(0.78 0.15 190); border: 2px solid oklch(0.25 0.05 260); margin-top: -3px; cursor: pointer; box-shadow: 0 0 8px oklch(0.78 0.15 190 / 0.5); }
input.cdp-seek::-moz-range-track { height: 8px; border-radius: 9999px; background: transparent; border: none; }
input.cdp-seek::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: oklch(0.78 0.15 190); border: 2px solid oklch(0.25 0.05 260); cursor: pointer; }
`;

let cdpSeekInjected = false;
export function ensureCdpSeekStyles() {
  if (typeof document === "undefined" || cdpSeekInjected) return;
  const style = document.createElement("style");
  style.id = "cdp-seek-styles";
  style.textContent = CDP_SEEK_CSS;
  document.head.appendChild(style);
  cdpSeekInjected = true;
}

if (typeof window !== "undefined" && document.readyState !== "loading") ensureCdpSeekStyles();
else if (typeof window !== "undefined") document.addEventListener("DOMContentLoaded", ensureCdpSeekStyles);

type QuizPanelProps = {
  episodeId: string;
  quizSubmitted: boolean;
  quizReview: { score: number; totalQuestions: number; percentage: number; review: Array<{ id: string; correct: boolean; explanation: string }> } | null;
  quizAnswers: number[];
  setQuizAnswers: (answers: number[]) => void;
  submit: () => void;
  submitQuiz: ReturnType<typeof trpc.audiolab.submitQuiz.useMutation>;
  onClose: () => void;
};

type QuizQuestion = { id: string; prompt: string; options: readonly string[] };
type QuizCompetency = { code: string; label: string; area: string };

function QuizPanel({ episodeId, quizSubmitted, quizReview, quizAnswers, setQuizAnswers, submit, submitQuiz, onClose }: QuizPanelProps) {
  const quizQuery = trpc.audiolab.quiz.useQuery({ episodeId }, { enabled: Boolean(episodeId) });
  const quizStatusQuery = trpc.audiolab.quizStatus.useQuery({ episodeId }, { enabled: Boolean(episodeId) });
  const { data: quizData, isLoading } = quizQuery;
  const { data: statusData } = quizStatusQuery;
  const alreadySubmitted = statusData?.submitted ?? false;
  const showReview = quizSubmitted && quizReview;
  const questions = quizData ? (quizData.questions as QuizQuestion[]) : [];
  const competency = quizData ? (quizData.competency as QuizCompetency | null) : null;
  if (isLoading || !quizData) {
    return (
      <div className="mt-5 rounded-2xl border border-neon-purple/30 bg-[linear-gradient(135deg,oklch(0.13_0.055_295/0.45),oklch(0.08_0.025_260/0.96))] p-5 md:p-7">
        <p className="text-sm font-bold text-neon-cyan">CARREGANDO QUIZ…</p>
      </div>
    );
  }
  return (
    <div className="mt-5 rounded-2xl border border-neon-purple/30 bg-[linear-gradient(135deg,oklch(0.13_0.055_295/0.45),oklch(0.08_0.025_260/0.96))] p-5 md:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-neon-purple"><Brain className="h-4 w-4" /> QUIZ DE REVISÃO</p>
          <h3 className="mt-2 font-orbitron text-base font-black text-foreground md:text-lg">{quizSubmitted ? "Resultado do quiz" : "Teste rápido — 5 questões"}</h3>
          {competency && <p className="mt-1 text-xs text-muted-foreground">Competência registrada ao concluir: <span className="font-bold text-neon-cyan">{competency.label} ({competency.area})</span></p>}
        </div>
        <button type="button" onClick={onClose} className="rounded-lg border border-white/10 p-2 text-muted-foreground hover:text-foreground" aria-label="Fechar quiz"><X className="h-4 w-4" /></button>
      </div>
      {showReview ? (
        <div className="mt-5">
          <div className="rounded-xl border border-neon-green/30 bg-neon-green/[0.08] p-4 text-center">
            <p className="font-orbitron text-2xl font-black text-neon-green">{quizReview.score}/{quizReview.totalQuestions}</p>
            <p className="mt-1 text-xs font-bold text-neon-green">+{quizReview.score * AUDIO_LAB_QUIZ_XP_PER_CORRECT} XP registrados{quizReview.percentage === 100 ? " · Quiz perfeito!" : ""}</p>
          </div>
          <div className="mt-4 space-y-3">{quizReview.review.map((review, index) => (
            <div key={review.id} className={`rounded-xl border p-4 ${review.correct ? "border-neon-green/30 bg-neon-green/[0.06]" : "border-neon-amber/30 bg-neon-amber/[0.06]"}`}>
              <p className="text-xs font-bold tracking-[0.1em] text-muted-foreground">QUESTÃO {index + 1}{review.correct ? " · ACERTOU" : " · ERROU"}</p>
              <p className="mt-1 text-sm font-bold text-foreground">{questions[index]?.prompt ?? ""}</p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{review.explanation}</p>
            </div>
          ))}</div>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="rounded-xl border border-white/10 bg-black/15 p-4">
              <p className="text-sm font-bold text-foreground">{index + 1}. {question.prompt}</p>
              <div className="mt-3 space-y-2">{question.options.map((option, optionIndex) => (
                <button type="button" key={optionIndex} onClick={() => setQuizAnswers(quizAnswers.map((answer, answerIndex) => (answerIndex === index ? optionIndex : answer)))} className={`w-full rounded-lg border p-2.5 text-left text-xs font-medium transition-colors ${quizAnswers[index] === optionIndex ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan" : "border-white/10 bg-black/10 text-foreground hover:border-white/25"}`}>{option}</button>
              ))}</div>
            </div>
          ))}
          <button type="button" onClick={submit} disabled={submitQuiz.isPending || quizAnswers.length !== questions.length} className="orbit-button w-full rounded-xl border border-neon-green/40 bg-neon-green/[0.12] py-3 text-sm font-bold text-neon-green hover:bg-neon-green/20 disabled:opacity-50">{submitQuiz.isPending ? "ENVIANDO…" : `Enviar quiz · ${AUDIO_LAB_QUIZ_XP_PER_CORRECT} XP por acerto`}</button>
          {alreadySubmitted ? <p className="text-center text-[0.68rem] font-bold text-neon-green">Quiz já submetido anteriormente · sua nota foi registrada.</p> : null}
        </div>
      )}
    </div>
  );
}

/** Player do episódio do CyberDimension Podcast — Ouvir → Quiz → XP. */
export function AudioLabEpisodePlayer({ initialEpisodeId }: { initialEpisodeId?: string }) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const [activeEpisodeId, setActiveEpisodeId] = useState<string>(initialEpisodeId ?? "");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPersistedAt = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [audioLoadError, setAudioLoadError] = useState(false);
  const [bufferedSeconds, setBufferedSeconds] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const [seekValue, setSeekValue] = useState(0);
  const episodesQuery = trpc.audiolab.episodes.useQuery();
  const progressQuery = trpc.audiolab.getProgress.useQuery(undefined, { enabled: isAuthenticated });
  const saveProgress = trpc.audiolab.saveProgress.useMutation();
  const [quizEpisodeId, setQuizEpisodeId] = useState<string | null>(null);
  const submitQuiz = trpc.audiolab.submitQuiz.useMutation();
  const claimBadges = trpc.audiolab.claimSeriesBadges.useMutation();
  const episodes = episodesQuery.data?.episodes ?? [];
  const progress = progressQuery.data ?? [];
  const progressByEpisode = useMemo(() => new Map(progress.map((entry) => [entry.episodeId, entry])), [progress]);
  const activeEpisode: AudioLabEpisode | undefined = useMemo(
    () => episodes.find((episode) => episode.id === activeEpisodeId) ?? episodes[0],
    [episodes, activeEpisodeId],
  );
  const transcript = activeEpisode?.transcript ?? [];
  const activeAudioSrc = getAudioLabAudioSrc(activeEpisode?.audioUrl);
  const cueTimes = useMemo(() => {
    const duration = Number.isFinite(mediaDuration) && mediaDuration > 0 ? mediaDuration : 0;
    return transcript.map((_: { speaker: string; text: string }, index: number) => duration > 0 ? (index / transcript.length) * duration : 0);
  }, [transcript.length, mediaDuration]);
  const episodeProgress = activeEpisode ? progressByEpisode.get(activeEpisode.id) : undefined;
  const progressPercent = mediaDuration > 0 ? Math.min(1, Math.max(0, position / mediaDuration)) : 0;
  const activeCue = transcript.length > 0 ? Math.floor(progressPercent * transcript.length) : 0;
  const favoritesQuery = trpc.audiolab.favorites.useQuery(undefined, { enabled: isAuthenticated });
  const favoriteIds = new Set(favoritesQuery.data?.episodeIds ?? []);
  const toggleFavorite = trpc.audiolab.toggleFavorite.useMutation({
    onSuccess: () => void utils.audiolab.favorites.invalidate(),
  });
  const handleToggleFavorite = (episodeId: string) => {
    if (!isAuthenticated) {
      toast.info("Entre com seu e-mail para salvar episódios nos seus favoritos.");
      return;
    }
    void toggleFavorite.mutateAsync({ episodeId });
    toast.success(favoriteIds.has(episodeId) ? "Episódio removido dos favoritos." : "Episódio adicionado aos favoritos.");
  };
  const episodeFavoriteIds = favoriteIds;
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizReview, setQuizReview] = useState<AudioLabQuizResult | null>(null);
  const [competencyToastShown, setCompetencyToastShown] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(() => {
    try {
      const stored = window.localStorage.getItem("cdp-playback-rate");
      if (stored && AUDIO_PLAYBACK_RATES.includes(Number(stored))) return Number(stored);
    } catch {
      // Armazenamento local indisponível; usar o padrão 1x.
    }
    return 1;
  });
  const resumeLabel = episodeProgress?.positionSeconds ? `Retomar em ${formatTime(episodeProgress.positionSeconds)}` : "Ouvir agora";

  // Fila de reprodução automática: avança para o próximo episódio da mesma
  // série, mantendo a ordem do catálogo, e permanece null no fim da série.
  // Autoplay unificado do CyberCast (mesma preferência do hub e do CyberCast).
  const autoplayEnabled = useState<boolean>(() => {
    try {
      const stored = window.localStorage.getItem("cybercast-autoplay-enabled");
      if (stored === "true") return true;
      if (stored === "false") return false;
    } catch {
      // Persistência indisponível; segue com o padrão desativado.
    }
    return false;
  })[0];
  const [, setAutoplayEnabled] = useState<boolean>(() => {
    try {
      const stored = window.localStorage.getItem("cybercast-autoplay-enabled");
      if (stored === "true") return true;
      if (stored === "false") return false;
    } catch {
      // Persistência indisponível; segue com o padrão desativado.
    }
    return false;
  });
  const nextEpisode = useMemo(() => {
    if (!activeEpisode) return null;
    const sameSeries = episodes.filter((episode) => episode.series === activeEpisode.series);
    if (sameSeries.length <= 1) return null;
    const currentIndex = sameSeries.findIndex((episode) => episode.id === activeEpisode.id);
    if (currentIndex === -1) return null;
    return sameSeries[currentIndex + 1] ?? null;
  }, [activeEpisode, episodes]);

  const setAutoplay = (enabled: boolean) => {
    setAutoplayEnabled(enabled);
    try {
      window.localStorage.setItem("cybercast-autoplay-enabled", String(enabled));
    } catch {
      // Persistência indisponível; a preferência vale para a sessão.
    }
  };

  const playNextEpisode = async (episode: AudioLabEpisode) => {
    try {
      if (!audioRef.current) return;
      await waitForReady(audioRef.current);
      selectEpisode(episode);
      if (audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play();
        } catch {
          audioRef.current.load();
          await waitForReady(audioRef.current);
          await audioRef.current.play();
        }
        setIsPlaying(true);
      }
      toast.success(`Próximo episódio: ${episode.title}`);
    } catch (nextError) {
      showAudioError(nextError instanceof Error ? nextError.message : "Não foi possível iniciar o próximo episódio. Tente novamente.");
    }
  };

  // Rola o player para o topo do viewport quando o episódio ativo muda
  // (clicando em um episódio na aba Todos ou em outra série).
  const scrollToPlayer = useCallback(() => {
    try {
      const element = playerContainerRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.top < 0 || rect.top > window.innerHeight * 0.55) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      element.focus({ preventScroll: true });
    } catch {
      // Scroll indisponível no ambiente; a troca de episódio continua funcional.
    }
  }, []);

  useEffect(() => {
    if (initialEpisodeId && initialEpisodeId !== activeEpisodeId) {
      setActiveEpisodeId(initialEpisodeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEpisodeId]);

  // Rola o player para o topo sempre que o episódio ativo troca.
  useEffect(() => {
    if (activeEpisode) scrollToPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEpisode?.id]);

  // Sincroniza a velocidade de reprodução ao trocar de episódio ou alterar o seletor.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.playbackRate) && Math.abs(audio.playbackRate - playbackRate) > 0.001) {
      try {
        audio.playbackRate = playbackRate;
      } catch {
        // PlaybackRate indisponível no ambiente (raro); ignorar silenciosamente.
      }
    }
  }, [activeEpisodeId, playbackRate]);

  const persistEpisode = useCallback(async (episodeId: string, positionSeconds: number, completed = false, notify = false) => {
    if (!isAuthenticated || !episodeId) return null;
    try {
      const result = await saveProgress.mutateAsync({ episodeId, positionSeconds: Math.max(0, Math.round(positionSeconds)), completed });
      await utils.audiolab.getProgress.invalidate();
      if (notify && result.justCompleted) {
        toast.success(`Episódio concluído! +${AUDIO_LAB_EPISODE_XP} XP registrados no seu progresso.`);
        void checkBadges();
      }
      return result;
    } catch {
      if (notify) toast.error("Não foi possível registrar a conclusão. Tente novamente.");
      return null;
    }
  }, [isAuthenticated, saveProgress, utils]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkBadges = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const result = await claimBadges.mutateAsync();
      if (result.newlyAwarded.length > 0) {
        const names = result.newlyAwarded.map((badge) => badge.badgeCode.replace("audiolab-", "").replace("-completion", "").replace("-listener-10", " (10 eps)")).join(" · ");
        toast.success(`${result.newlyAwarded.length === 1 ? "Nova conquista desbloqueada: " : "Novas conquistas desbloqueadas: "}${names}`);
      }
    } catch {
      // Conquistas são consultivas; falhas nunca bloqueiam o fluxo.
    }
  }, [isAuthenticated, claimBadges]);

  const selectEpisode = (episode: AudioLabEpisode) => {
    if (episode.id === activeEpisode?.id) return;
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    }
    setShowQuiz(false);
    setActiveEpisodeId(episode.id);
    setShowTranscript(true);
  };

  const waitForReady = (audio: HTMLAudioElement, timeoutMs = 30000) =>
    new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error("Aguardando o áudio. Se o problema persistir, verifique sua conexão e tente novamente."));
      }, timeoutMs);
      const onCanPlay = () => {
        window.clearTimeout(timer);
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("error", onError);
        resolve();
      };
      const onError = () => {
        window.clearTimeout(timer);
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("error", onError);
        reject(new Error("O navegador não conseguiu carregar o áudio."));
      };
      audio.addEventListener("canplay", onCanPlay, { once: true });
      audio.addEventListener("error", onError, { once: true });
      if (audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        audio.load();
      }
    });

  // Dedupe do toast de falha de áudio: um erro por episódio, por tentativa de play.
  const lastAudioErrorToast = useRef<string>("");
  const showAudioError = (message: string) => {
    const key = `${activeEpisodeId}:${message}`;
    if (lastAudioErrorToast.current === key) return;
    lastAudioErrorToast.current = key;
    toast.error(message);
    window.setTimeout(() => {
      if (lastAudioErrorToast.current === key) lastAudioErrorToast.current = "";
    }, 30000);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !activeAudioSrc) return;
    try {
      if (audio.paused) {
        await waitForReady(audio);
        try {
          await audio.play();
        } catch (playError) {
          const error = playError instanceof DOMException ? playError : new Error("Falha ao reproduzir.");
          if (error.name === "NotAllowedError") {
            toast.info("A reprodução foi bloqueada pelo navegador. Clique novamente em reproduzir.");
            return;
          }
          // Tentativa de recuperação: recarrega o áudio e espera novamente.
          audio.load();
          await waitForReady(audio);
          await audio.play();
        }
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (retryError) {
      // Última tentativa de recuperação automática antes de reportar ao aluno.
      try {
        audio?.load();
        await new Promise((resolve) => window.setTimeout(resolve, 750));
        if (audio) await waitForReady(audio);
        await audio?.play();
        setIsPlaying(true);
        return;
      } catch {
        // Falhou de novo: notifica uma única vez (dedupe).
      }
      showAudioError(retryError instanceof Error ? retryError.message : "Não foi possível iniciar o áudio. Tente novamente.");
    }
  };

  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio || !activeEpisode) return;
    const resumeAt = Math.max(0, episodeProgress?.positionSeconds ?? 0);
    // O CyberCast não autoretoma: mantém no início e deixa o botão "Retomar"
    // a cargo do aluno — evita surpresas ao trocar de episódio na aba Todos.
    audio.currentTime = 0;
    setPosition(0);
    setMediaDuration(audio.duration);
    setAudioLoadError(false);
  };

  // Atalhos de teclado: espaço = play/pause · seta esquerda = −10s · seta direita = +15s.
  // Ignora quando o foco está em campo de texto, botão ou link.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName ?? "";
      const isTextField = tagName === "INPUT" || tagName === "TEXTAREA" || Boolean(target?.isContentEditable);
      if (isTextField || tagName === "BUTTON" || tagName === "A") return;
      if (!audioRef.current || !activeAudioSrc || !activeEpisode) return;
      const audio = audioRef.current;
      if (event.key === " ") {
        event.preventDefault();
        void togglePlayback();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        audio.currentTime = Math.max(0, audio.currentTime - 10);
        setPosition(audio.currentTime);
        setSeekValue(audio.currentTime);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        audio.currentTime = Math.min(audio.duration || audio.currentTime, audio.currentTime + 15);
        setPosition(audio.currentTime);
        setSeekValue(audio.currentTime);
      } else if (event.key.toLowerCase() === "a" && (event.shiftKey || event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        const next = !autoplayEnabled;
        setAutoplay(next);
        toast.info(next ? "Reprodução automática ativada. O próximo episódio será reproduzido ao final." : "Reprodução automática desativada.");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAudioSrc, activeEpisode, autoplayEnabled]);

  const onAudioError = () => {
    setAudioLoadError(true);
    setIsPlaying(false);
    toast.error("O áudio não pôde ser carregado. Recarregue a página e tente novamente.");
  };

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !activeEpisode) return;
    setPosition(audio.currentTime);
    setSeekValue(audio.currentTime);
    if (audio.buffered.length > 0 && Number.isFinite(audio.duration)) {
      setBufferedSeconds(audio.buffered.end(audio.buffered.length - 1));
    }
    if (isAuthenticated && Date.now() - lastPersistedAt.current > 15000) {
      lastPersistedAt.current = Date.now();
      void persistEpisode(activeEpisode.id, audio.currentTime);
    }
  };

  const seekToCue = (cueSeconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = Math.min(Math.max(0, cueSeconds), audio.duration - 0.1);
    setPosition(audio.currentTime);
    if (audio.paused) {
      void togglePlayback();
    }
  };

  /** Busca por posição absoluta na barra de progresso clicável. */
  const seekTo = (fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const target = Math.min(Math.max(0, fraction), 1) * audio.duration;
    audio.currentTime = Math.max(0, target);
    setPosition(audio.currentTime);
  };

  /** Retoma a escuta na posição salva no progresso do aluno (como no CyberCast). */
  const resumeFromProgress = () => {
    const resumeAt = Math.max(0, episodeProgress?.positionSeconds ?? 0);
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration) && resumeAt > 0 && resumeAt < audio.duration - 3) {
      seekTo(resumeAt / audio.duration);
    }
    if (!isPlaying) void togglePlayback();
  };

  /** Duplo clique no player reproduz ou pausa o áudio. */
  const onPlayerDoubleClick = () => {
    void togglePlayback();
  };

  const downloadAudio = async () => {
    const audioSrc = activeAudioSrc ?? getAudioLabAudioSrc(activeEpisode?.audioUrl);
    if (!activeEpisode || !audioSrc) return;
    try {
      const response = await fetch(audioSrc);
      if (!response.ok) throw new Error(`Falha ao baixar (HTTP ${response.status}).`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${activeEpisode.id}.wav`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast.success("Áudio do episódio baixado para ouvir offline.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível baixar o áudio. Tente novamente.");
    }
  };

  const onAudioEnded = () => {
    setIsPlaying(false);
    if (activeEpisode) void persistEpisode(activeEpisode.id, mediaDuration || audioRef.current?.duration || 0, true, true);
    if (autoplayEnabled && nextEpisode) void playNextEpisode(nextEpisode);
  };

  const completeEpisode = useCallback(async (episode: AudioLabEpisode, silent = false) => {
    if (!isAuthenticated || !episode) return;
    const currentProgress = progressByEpisode.get(episode.id);
    if (currentProgress?.completed) return;
    await persistEpisode(episode.id, mediaDuration, true, !silent);
  }, [isAuthenticated, progressByEpisode, persistEpisode, mediaDuration]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-conclusão quando a escuta chega ao fim do episódio.
  useEffect(() => {
    if (!activeEpisode || !isAuthenticated || !isPlaying || !mediaDuration) return;
    if (position >= mediaDuration - 1.5) {
      void completeEpisode(activeEpisode);
    }
  }, [position, isPlaying, mediaDuration, activeEpisode]); // eslint-disable-line react-hooks/exhaustive-deps

  const openQuiz = async () => {
    if (!isAuthenticated) {
      toast.info("Entre com seu e-mail para salvar o quiz e ganhar XP.");
      return;
    }
    const currentProgress = progressByEpisode.get(activeEpisode?.id ?? "");
    if (!currentProgress?.completed) {
      toast.error("Conclua a escuta do episódio antes de abrir o quiz de revisão.");
      return;
    }
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizReview(null);
    setCompetencyToastShown(false);
    setQuizEpisodeId(activeEpisode.id);
    setShowQuiz(true);
  };

  const submit = async () => {
    if (!activeEpisode) return;
    const entry = quizEpisodeId ? episodesQuery.data?.episodes.find((episode) => episode.id === quizEpisodeId) : null;
    const quizQuestions = quizEpisodeId ? (trpc.useUtils().audiolab.quiz.getData({ episodeId: quizEpisodeId })?.questions ?? []) : [];
    void entry;
    if (quizAnswers.length !== quizQuestions.length) {
      toast.error("Responda todas as cinco questões antes de enviar.");
      return;
    }
    try {
      const result = await submitQuiz.mutateAsync({ episodeId: activeEpisode.id, answers: quizAnswers });
      setQuizReview(result);
      setQuizSubmitted(true);
      toast.success(`Quiz de revisão: ${result.score}/${result.totalQuestions} acertos · +${result.quizXp} XP${result.percentage === 100 ? " · Conquista: Mestre do episódio!" : ""}`);
      void utils.audiolab.quizStatus.invalidate({ episodeId: activeEpisode.id });
      if (result.competency && !competencyToastShown) {
        setCompetencyToastShown(true);
        toast.success(`Competência registrada: ${result.competency.label} (${result.competency.area})`, { icon: <Award className="h-4 w-4 text-neon-purple" /> });
      }
    } catch {
      toast.error("Não foi possível enviar o quiz. Tente novamente.");
    }
  };

  const meta = seriesMeta(activeEpisode?.series);
  const ak = getAccent(meta?.accent);
  if (!activeEpisode) {
    return <p className="rounded-xl border border-white/10 bg-black/15 p-5 text-center text-sm text-muted-foreground">Nenhum episódio disponível.</p>;
  }
  return (
    <div>
      <audio ref={audioRef} key={activeEpisode.id} preload="none" src={activeAudioSrc} hidden onLoadedMetadata={onLoadedMetadata} onError={onAudioError} onTimeUpdate={onTimeUpdate} onEnded={onAudioEnded} />
      <div ref={playerContainerRef} onDoubleClick={onPlayerDoubleClick} tabIndex={-1} className="rounded-2xl border border-white/10 bg-black/15 p-5 outline-none focus-visible:border-neon-cyan/60" title="Duplo clique para reproduzir ou pausar">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={`inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.14em] ${ACCENT_TEXT[ak]}`}>{`${meta?.short ?? activeEpisode.series} · PODCAST`}</p>
            <h2 className="mt-2 font-orbitron text-lg font-black leading-6 text-foreground md:text-xl">{activeEpisode.title}</h2>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-muted-foreground md:text-sm">{activeEpisode.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void togglePlayback()} className="orbit-button grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan" aria-label={isPlaying ? "Pausar episódio" : "Reproduzir episódio"}>{isPlaying ? <CirclePause className="h-7 w-7" /> : <CirclePlay className="h-7 w-7" />}</button>
            {(episodeProgress?.positionSeconds ?? 0) > 5 ? (
              <button type="button" onClick={resumeFromProgress} className="orbit-button hidden h-14 shrink-0 place-items-center rounded-2xl border border-neon-amber/35 bg-neon-amber/[0.08] px-3.5 text-center text-[0.62rem] font-bold leading-4 text-neon-amber md:grid" aria-label={resumeLabel} title={resumeLabel}>Retomar<br />{formatTime(episodeProgress!.positionSeconds)}</button>
            ) : null}
            <button type="button" onClick={() => {
              const nextIndex = (AUDIO_PLAYBACK_RATES.indexOf(playbackRate) + 1) % AUDIO_PLAYBACK_RATES.length;
              const nextRate = AUDIO_PLAYBACK_RATES[nextIndex];
              setPlaybackRate(nextRate);
              try {
                window.localStorage.setItem("cdp-playback-rate", String(nextRate));
              } catch {
                // Armazenamento local indisponível; a preferência dura apenas a sessão.
              }
              toast.success(`Velocidade de reprodução: ${nextRate}x`);
            }} className="orbit-button hidden h-14 w-[4.25rem] shrink-0 place-items-center rounded-2xl border border-neon-purple/35 bg-neon-purple/[0.08] text-neon-purple md:grid" aria-label={`Alterar velocidade de reprodução (atual ${playbackRate}x)`} title={`Velocidade atual: ${playbackRate}x`}>{playbackRate}x</button>
            <button type="button" onClick={() => { const next = !autoplayEnabled; setAutoplay(next); toast.info(next ? "Reprodução automática ativada. O próximo episódio será reproduzido ao final." : "Reprodução automática desativada."); }} className={`orbit-button hidden h-14 shrink-0 place-items-center rounded-2xl border px-3.5 text-[0.62rem] font-bold leading-4 md:grid ${autoplayEnabled ? "border-neon-green/40 bg-neon-green/[0.1] text-neon-green" : "border-neon-purple/35 bg-neon-purple/[0.08] text-neon-purple"}`} aria-label={autoplayEnabled ? "Desativar reprodução automática" : "Ativar reprodução automática"} title={autoplayEnabled ? "Autoplay ativado · Shift+A para alternar" : "Autoplay desativado · Shift+A para alternar"}>AUTOP<br />{autoplayEnabled ? "LIG" : "DESL"}</button>
            <div className="min-w-[10rem] flex-1">
              <div className="flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground"><span>{isPlaying ? `${formatTime(position)} / ${formatTime(mediaDuration)}` : mediaDuration ? `Pronto · ${formatTime(mediaDuration)}` : audioLoadError ? "Falha ao carregar o áudio" : "Parado"}</span><span>{activeEpisode.duration}</span></div>
              <div className="mt-2 relative h-3"><input type="range" min={0} max={Number.isFinite(mediaDuration) && mediaDuration > 0 ? mediaDuration : 0} step={0.1} value={seekValue} onChange={(event) => seekTo(Number(event.target.value) / mediaDuration)} disabled={!Number.isFinite(mediaDuration) || mediaDuration <= 0} className="cdp-seek absolute inset-y-0 h-3 w-full cursor-pointer appearance-none bg-transparent focus:outline-none" aria-label="Progresso do episódio — clique para pular" />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex w-full items-center"><div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10"><div className="absolute inset-y-0 left-0 h-full bg-neon-cyan/30" style={{ width: `${Math.min(100, Math.round(mediaDuration > 0 ? (bufferedSeconds / mediaDuration) * 100 : 0))}%` }} /><div className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-150" style={{ width: `${Math.round(progressPercent * 100)}%` }} /></div></div></div>
              <p className="mt-1 text-[0.62rem] font-bold tracking-[0.08em] text-muted-foreground">{bufferedSeconds > 0 && mediaDuration > 0 ? `${Math.round(Math.min(100, (bufferedSeconds / mediaDuration) * 100))}% carregado` : "Pronto"}</p>
            </div>
          </div>
        </div>
        {episodeProgress?.completed ? (
          <div className="mt-4 rounded-xl border border-neon-green/25 bg-neon-green/[0.08] px-4 py-3 text-xs font-bold text-neon-green"><CheckCircle2 className="mr-1.5 inline h-4 w-4" />Episódio concluído — quiz de revisão disponível abaixo.</div>
        ) : (
          <div className="mt-4 rounded-xl border border-neon-amber/25 bg-neon-amber/[0.08] px-4 py-3 text-xs font-bold text-neon-amber"><Volume2 className="mr-1.5 inline h-4 w-4" />Ouça o episódio até a última fala para concluir e liberar o quiz.</div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={downloadAudio} className="orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border border-neon-cyan/30 bg-neon-cyan/[0.08] px-3 py-2 text-xs font-bold text-neon-cyan hover:bg-neon-cyan/20"><ArrowDownToLine className="h-3.5 w-3.5" />Baixar episódio</button>
          <button type="button" onClick={() => setPlaybackRate(playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1)} className="orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border border-neon-purple/35 bg-neon-purple/[0.08] px-3 py-2 text-xs font-bold text-neon-purple hover:bg-neon-purple/20 md:hidden" aria-label={`Velocidade de reprodução ${playbackRate}x`}>{playbackRate}x</button>
          <button type="button" onClick={() => { const next = !autoplayEnabled; setAutoplay(next); toast.info(next ? "Reprodução automática ativada. O próximo episódio será reproduzido ao final." : "Reprodução automática desativada."); }} className={`orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold md:hidden ${autoplayEnabled ? "border-neon-green/40 bg-neon-green/[0.1] text-neon-green" : "border-neon-purple/35 bg-neon-purple/[0.08] text-neon-purple"}`} aria-label={autoplayEnabled ? "Desativar reprodução automática" : "Ativar reprodução automática"} title={autoplayEnabled ? "Autoplay ativado · Shift+A para alternar" : "Autoplay desativado · Shift+A para alternar"}>AUTOP {autoplayEnabled ? "LIG" : "DESL"}</button>
          {autoplayEnabled && nextEpisode ? <span className="inline-flex items-center gap-1.5 rounded-lg border border-neon-green/30 bg-neon-green/[0.07] px-3 py-2 text-xs font-bold text-neon-green" title={`Próximo: ${nextEpisode.title}`}>A seguir: {nextEpisode.title}</span> : null}
          <button type="button" onClick={() => setShowTranscript((current) => !current)} className={`orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold ${showTranscript ? "border-neon-cyan/45 bg-neon-cyan/10 text-neon-cyan" : "border-white/12 bg-black/15 text-foreground hover:border-neon-cyan/40 hover:text-neon-cyan"}`}><FileText className="h-3.5 w-3.5" />{showTranscript ? "Ocultar" : "Mostrar"} transcrição</button>
          <button type="button" onClick={() => handleToggleFavorite(activeEpisode.id)} className={`orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold ${episodeFavoriteIds.has(activeEpisode.id) ? "border-neon-amber/50 bg-neon-amber/15 text-neon-amber" : "border-white/12 bg-black/15 text-muted-foreground hover:border-neon-amber/40 hover:text-neon-amber"}`} aria-label={episodeFavoriteIds.has(activeEpisode.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"} title={episodeFavoriteIds.has(activeEpisode.id) ? "Remover dos favoritos" : "Favoritar episódio"}><Star className={`h-3.5 w-3.5 ${episodeFavoriteIds.has(activeEpisode.id) ? "fill-current" : ""}`} />{episodeFavoriteIds.has(activeEpisode.id) ? "Favoritado" : "Favoritar"}</button>
          <button type="button" onClick={openQuiz} disabled={!episodeProgress?.completed} className="orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border border-neon-green/40 bg-neon-green/[0.1] px-3 py-2 text-xs font-bold text-neon-green hover:bg-neon-green/20 disabled:opacity-50" aria-label="Abrir quiz de revisão do episódio"><Brain className="h-3.5 w-3.5" />Quiz de revisão · {AUDIO_LAB_QUIZ_XP_PER_CORRECT} XP por acerto</button>
          {episodeProgress?.completed ? (
            <button type="button" onClick={() => void completeEpisode(activeEpisode, true)} className="orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border border-neon-purple/40 bg-neon-purple/[0.1] px-3 py-2 text-xs font-bold text-neon-purple hover:bg-neon-purple/20" aria-label="Registrar conclusão do episódio"><CheckCircle2 className="h-3.5 w-3.5" />Marcar concluído</button>
          ) : null}
        </div>
        {showTranscript ? (
          <div className="mt-5 max-h-[30rem] space-y-3 overflow-y-auto pr-2" aria-live="polite">{transcript.map((line: { speaker: string; text: string }, index: number) => {
            const isActiveLine = index === activeCue;
            const cueSeconds = cueTimes[index] ?? 0;
            const hasDuration = Number.isFinite(mediaDuration) && mediaDuration > 0;
            return (
              <div key={`${activeEpisode.id}-${index}`} className={`w-full rounded-xl border p-4 text-left ${isActiveLine ? speakerTone(line.speaker) : "border-white/8 bg-black/10"}`}>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.65rem] font-bold ${speakerTone(line.speaker)}`}>{line.speaker === "Ana" ? <Sparkles className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}{line.speaker}</span>
                  {isActiveLine ? <span className="text-[0.63rem] font-bold tracking-[0.1em] text-muted-foreground">FALA ATUAL</span> : null}
                  <button type="button" onClick={() => seekToCue(cueSeconds)} disabled={!hasDuration} className="ml-auto inline-flex items-center gap-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/[0.07] px-2.5 py-1 text-[0.66rem] font-bold text-neon-cyan transition-colors hover:bg-neon-cyan/20 disabled:cursor-not-allowed disabled:opacity-50" aria-label={`Ir para ${estimateCueTime(cueSeconds)}`} title={`Pular para ${estimateCueTime(cueSeconds)}`}>{estimateCueTime(cueSeconds)}</button>
                </div>
                <p className="mt-3 text-sm leading-7 text-foreground/90">{line.text}</p>
              </div>
            );
          })}</div>
        ) : null}
      </div>
      {showQuiz && <QuizPanel episodeId={activeEpisode.id} quizSubmitted={quizSubmitted} quizReview={quizReview} quizAnswers={quizAnswers} setQuizAnswers={setQuizAnswers} submit={submit} submitQuiz={submitQuiz} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
