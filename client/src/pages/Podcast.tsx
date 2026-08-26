import confetti from "canvas-confetti";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowDownToLine, Search, ArrowLeft, Award, BadgeCheck, Book, BookOpen, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CirclePause, CirclePlay, Clock3, ClipboardList, Crosshair, Globe, Headphones, Infinity, LockKeyhole, Languages, Microscope, Play, Radio, Rocket, RotateCcw, Satellite, Sparkles, Star, Trophy, Volume2, X, Zap } from "lucide-react";
import { PODCAST_LISTENER_BADGES } from "@shared/podcastListenerBadges";
import { englishVocabulary, getTermsByEpisode } from "@shared/englishVocabulary";
import { getQuestionsByRole, interviewRoles, type InterviewRole } from "@shared/englishInterviewSimulator";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import type { PodcastEpisode, PodcastLine, PodcastSpeaker } from "@shared/podcastEpisodes";
import { filterCybercastEpisodes, filterAudioLabEpisodes } from "@/lib/podcastSearch";
import { seriesMeta, getAccent, ACCENT_BORDER, ACCENT_BG, ACCENT_TEXT, ACCENT_DOT_BORDER, ACCENT_DOT_BG } from "@/components/AudioLabEpisodePlayer";
import { CybercastHubSection, hubEpisodeSeriesKey, type HubEpisode } from "./CybercastHubSection";
import { CybercastEpisodeList } from "@/components/CybercastEpisodeList";
import { audioLabSeriesMeta, CYBERCAST_HUB_SERIES } from "@/lib/cybercastSeries";
import {
  CyberCastAllSection,
  CdpAllSeriesSection,
} from "./PodcastAllView";


const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;
const EPISODE_XP = 50;
const QUIZ_XP_PER_CORRECT = 10;
const QUIZ_PERFECT_BADGE = "Quiz perfeito: +50 XP bônus de maestria!";

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

function transcriptCueIndex(transcript: readonly PodcastLine[], currentTime: number, duration: number) {
  if (!transcript.length || !duration) return 0;
  const totalWords = transcript.reduce((sum, line) => sum + line.text.trim().split(/\s+/).length, 0);
  const target = (Math.max(0, Math.min(currentTime, duration)) / duration) * totalWords;
  let cumulative = 0;
  for (let index = 0; index < transcript.length; index += 1) {
    cumulative += transcript[index].text.trim().split(/\s+/).length;
    if (target <= cumulative) return index;
  }
  return transcript.length - 1;
}

function speakerTone(speaker: PodcastLine["speaker"]) {
  return speaker === "Ana"
    ? "border-neon-cyan/35 bg-neon-cyan/[0.08] text-neon-cyan"
    : "border-neon-purple/35 bg-neon-purple/[0.08] text-neon-purple";
}

interface DrillResultEntry {
  termId: string;
  correct: boolean;
  stage: number;
  mastered: boolean;
}
export interface DrillResult {
  entries: DrillResultEntry[];
  bonusXpPerCorrect: number;
  totalCorrect: number;
  totalXp: number;
}

export function gradeDrillResult(
  result: { results: { termId: string; correct: boolean; stage: number; mastered: boolean }[]; bonusXpPerCorrect: number },
  picks: Record<string, number>,
): DrillResult {
  const entries = result.results.map((entry) => ({ ...entry, picked: picks[entry.termId] ?? -1 }));
  const totalCorrect = entries.filter((entry) => entry.correct).length;
  return {
    entries,
    bonusXpPerCorrect: result.bonusXpPerCorrect,
    totalCorrect,
    totalXp: totalCorrect * result.bonusXpPerCorrect,
  };
}

export default function Podcast() {
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const episodesQuery = trpc.podcast.list.useQuery();
  const progressQuery = trpc.podcast.getProgress.useQuery(undefined, { enabled: isAuthenticated });
  const saveProgress = trpc.podcast.saveProgress.useMutation();
  const submitQuiz = trpc.podcast.submitQuiz.useMutation();
  const [ownXp, setOwnXp] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mainPlayerRef = useRef<HTMLDivElement | null>(null);
  // Sticky nativo: o player acompanha a rolagem no topo (desktop lg+) e
  // para automaticamente quando o <main> termina — o rodapé fica sempre
  // acessível, pois não está dentro do bloco de contenção (relato:
  // "continua travado, não consigo acessar os áudios e o final da caixa").
  const playerStickyRef = useRef<HTMLElement | null>(null);
  // Rastreia quando o player principal sai do viewport para exibir o mini-player
  // e o botão "Voltar ao player" — a barra compacta do rodapé permite pausar e
  // trocar de episódio sem precisar rolar de volta ao topo.
  useEffect(() => {
    const playerElement = mainPlayerRef.current;
    if (!playerElement) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setPlayerOutOfView(!entry.isIntersecting);
        }
      },
      { threshold: 0, rootMargin: "-8px 0px 0px 0px" },
    );
    observer.observe(playerElement);
    return () => observer.disconnect();
  }, []);
  // O comportamento sticky é gerenciado inteiramente por CSS (lg:sticky
  // lg:top-[72px] na section referenciada por playerStickyRef).
  const lastPersistedAt = useRef(0);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string>("");
  const [playerOutOfView, setPlayerOutOfView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const [interviewRole, setInterviewRole] = useState<"soc" | "pentester" | "network">("soc");
  const [interviewAnswers, setInterviewAnswers] = useState<Record<string, string>>({});
  const [interviewFeedback, setInterviewFeedback] = useState<Record<string, { question: (ReturnType<typeof getQuestionsByRole>)[number]; keywordsFound: string[]; score: number; xp: number }>>({});
  const [submittedInterview, setSubmittedInterview] = useState<Set<string>>(new Set());
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [cdpSearchQuery, setCdpSearchQuery] = useState<string>("");
    const [cdpFilter, setCdpFilter] = useState<string | null>(null);
  const [hubFilterActive, setHubFilterActive] = useState<string | null>(null);
  const [hubShowAll, setHubShowAll] = useState(false);
    const [cdpFavoriteFilter, setCdpFavoriteFilter] = useState(false);
    const cdpFavoritesQuery = trpc.audiolab.favorites.useQuery(undefined, { enabled: isAuthenticated });
    const toggleCdpFavorite = trpc.audiolab.toggleFavorite.useMutation({
      onSuccess: (result, variables) => {
        void utils.audiolab.favorites.invalidate();
        const episode = cdpAllEpisodes.find((current) => current.id === variables.episodeId);
        if (result.favorite) {
          toast.success(episode ? `"${episode.title}" adicionado aos seus episódios favoritos.` : "Episódio adicionado aos favoritos.");
        } else {
          toast.info("Episódio removido dos seus favoritos.");
        }
      },
      onError: (error) => toast.error(error.message),
    });
    const cdpFavoriteIds = new Set(cdpFavoritesQuery.data?.episodeIds ?? []);
    const cdpSaveProgress = trpc.audiolab.saveProgress.useMutation();
    const cdpSubmitQuiz = trpc.audiolab.submitQuiz.useMutation();
    const cdpClaimSeriesBadges = trpc.audiolab.claimSeriesBadges.useMutation();
    const checkCdpSeriesBadges = async () => {
      if (!isAuthenticated) return;
      try {
        const result = await cdpClaimSeriesBadges.mutateAsync();
        void utils.audiolab.getProgress.invalidate();
        if (result.newlyAwarded.length > 0) {
          const names = result.newlyAwarded.map((badge) => badge.badgeCode.replace("audiolab-", "").replace("-completion", "").replace("-listener", "")).join(" · ");
          toast.success(`${result.newlyAwarded.length === 1 ? "Nova conquista desbloqueada: " : "Novas conquistas desbloqueadas: "}${names}`);
        }
      } catch {
        // Conquistas são consultivas; falhas nunca bloqueiam a escuta.
      }
    };
    const persistCdpEpisode = async (episodeId: string, positionSeconds: number, completed = false, notify = false) => {
      if (!isAuthenticated || !episodeId) return null;
      try {
        const result = await cdpSaveProgress.mutateAsync({ episodeId, positionSeconds: Math.max(0, Math.round(positionSeconds)), completed });
        await utils.audiolab.getProgress.invalidate();
        if (notify && result.justCompleted) {
          toast.success(`Episódio concluído! +50 XP registrados no seu progresso.`);
          void checkCdpSeriesBadges();
        } else if (notify && result.completed) {
          toast.success("Episódio já concluído; sua escuta foi atualizada.");
        }
        return result;
      } catch (error) {
        if (notify) toast.error(error instanceof Error ? error.message : "Não foi possível salvar o progresso do episódio.");
        return null;
      }
    };
    const [activeCdpEpisodeId, setActiveCdpEpisodeId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [seriesFilter, setSeriesFilter] = useState<string | null>(null);
  const [showAllCybercast, setShowAllCybercast] = useState(false);
  const [cybercastView, setCybercastView] = useState<"destaque" | "todos">("destaque");
  const [bufferedSeconds, setBufferedSeconds] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState<boolean>(() => {
    try {
      const stored = window.localStorage.getItem("podcast-autoplay-enabled");
      if (stored === "true") return true;
      if (stored === "false") return false;
    } catch {
      // Persistência indisponível; segue com o padrão ativado.
    }
    return true;
  });

  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardFlipped, setFlashcardFlipped] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showCaptions, setShowCaptions] = useState(false);
  const [captionsText, setCaptionsText] = useState<{ speaker: PodcastSpeaker; text: string } | null>(null);
  const [drillMode, setDrillMode] = useState(false);
  const [drillStep, setDrillStep] = useState(0);
  const [drillPicks, setDrillPicks] = useState<Record<string, number>>({});
  const [drillResult, setDrillResult] = useState<DrillResult | null>(null);
  const srsStateQuery = trpc.podcast.flashcardSrsState.useQuery(undefined, { enabled: isAuthenticated });
  const srsStateMap = useMemo(() => new Map((srsStateQuery.data?.states ?? []).map((state) => [state.termId, state])), [srsStateQuery.data?.states]);
  const srsStateEntries = useMemo(() => (srsStateQuery.data?.states ?? []), [srsStateQuery.data?.states]);
  const recordSrsReview = trpc.podcast.recordFlashcardReview.useMutation();
  const srsReload = useCallback(async () => { await utils.podcast.flashcardSrsState.invalidate(); await utils.podcast.weeklyRanking.invalidate(); }, [utils]);
  const srsXpToast = useCallback((xp: number, mastered: boolean) => {
    toast.success(mastered ? `Dominado! +${xp} XP registrados no seu ranking semanal.` : `+${xp} XP registrados no seu ranking semanal.`);
    setOwnXp((current) => (typeof current === "number" ? current + xp : null));
  }, []);
  const drillQuestionsQuery = trpc.podcast.flashcardDrillQuestions.useQuery(undefined, { enabled: isAuthenticated && drillMode && !drillResult });
  const submitDrill = trpc.podcast.submitFlashcardDrill.useMutation();
  const startDrill = useCallback(() => {
    setDrillPicks({});
    setDrillStep(0);
    setDrillResult(null);
    setDrillMode(true);
  }, []);
  const finishDrill = useCallback(async () => {
    const answers = (drillQuestionsQuery.data?.questions ?? []).map((question) => ({ termId: question.termId, answerIndex: drillPicks[question.termId] ?? 0 }));
    try {
      const result = await submitDrill.mutateAsync({ answers });
      setDrillResult(gradeDrillResult(result, drillPicks));
      const earnedXp = result.results.filter((entry) => entry.correct).length * result.bonusXpPerCorrect;
      if (earnedXp > 0) {
        toast.success(`+${earnedXp} XP de bônus registrados no seu ranking semanal pelo simulado de reforço!`);
        setOwnXp((current) => (typeof current === "number" ? current + earnedXp : null));
      } else {
        toast.info("Nenhum termo acertado desta vez. Revise o baralho e tente novamente!");
      }
      await srsReload();
    } catch {
      toast.error("Não foi possível enviar o simulado. Tente novamente.");
    }
  }, [drillPicks, drillQuestionsQuery.data, submitDrill, srsReload]);
  const dueTermCount = useMemo(() => (drillQuestionsQuery.data?.questions.length ?? 0), [drillQuestionsQuery.data?.questions.length]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizReview, setQuizReview] = useState<ReturnType<typeof import("@shared/podcastQuizzes").gradePodcastQuiz>>(null);

  const episodes = episodesQuery.data ?? [];
  // Ao ativar um filtro de trilha, rola a página até a seção da série
  // correspondente na lista de episódios (relato: "quando clico no filtro ele
  // deve me direcionar para os podcasts daquele filtro").
  const scrollToSeries = useCallback((seriesKey: string) => {
    // As séries do hub ganham âncoras cybercast-series-<key> no
    // CybercastHubSection; a seção CDP usa #cdp-section.
    const anchor = document.getElementById(seriesKey) ?? document.getElementById(
      seriesKey === "english" || seriesKey === "securityplus" ? "cdp-section" : `cybercast-series-${seriesKey}`,
    );
    if (!anchor) return;
    anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  // Destaque visual temporário (pulso suave) na seção da série selecionada
  // após a rolagem, para o aluno saber exatamente onde a página parou.
  const highlightSeries = useCallback((seriesKey: string) => {
    const anchor = document.getElementById(seriesKey) ?? document.getElementById(
      seriesKey === "english" || seriesKey === "securityplus" ? "cdp-section" : `cybercast-series-${seriesKey}`,
    );
    if (!anchor) return;
    const previous = anchor.dataset.seriesPulse || "";
    anchor.dataset.seriesPulse = seriesKey;
    anchor.classList.add("series-highlight-pulse");
    window.setTimeout(() => {
      if (anchor.dataset.seriesPulse === seriesKey) {
        anchor.dataset.seriesPulse = previous;
        anchor.classList.remove("series-highlight-pulse");
      }
    }, 2200);
  }, []);
  const scrollToAndHighlight = useCallback((seriesKey: string) => {
    scrollToSeries(seriesKey);
    highlightSeries(seriesKey);
  }, [scrollToSeries, highlightSeries]);
// Especiais "Ao vivo" de revisão relâmpago (episódios bônus) ganham marcação própria no catálogo.
const bonusEpisodeIds = ["ep61-ao-vivo-revisao-dom1-e-dom2", "ep62-ao-vivo-revisao-dom3-a-dom5"] as const;
const isBonusEpisode = (episode: PodcastEpisode | undefined | null) => Boolean(episode) && bonusEpisodeIds.includes(episode?.id as (typeof bonusEpisodeIds)[number]);
// Minissérie "Raio-X da Questão": dissecção de questões estilo simulado.
const raioXEpisodeIds = [
  "ep63-raio-x-dom1-conceitos",
  "ep64-raio-x-dom2-ameacas",
  "ep65-raio-x-dom3-arquitetura",
  "ep66-raio-x-dom4-operacoes",
  "ep67-raio-x-dom5-governanca",
] as const;
const isRaioXEpisode = (episode: PodcastEpisode | undefined | null) => Boolean(episode) && raioXEpisodeIds.includes(episode?.id as (typeof raioXEpisodeIds)[number]);
// Edição especial "English for Cyber Pros": pronúncia técnica e entrevista simulada.
const isEnglishEpisode = (episode: PodcastEpisode | undefined | null) => Boolean(episode) && episode!.series === "english";
  const activeEpisode = episodes.find((episode) => episode.id === activeEpisodeId) ?? episodes[0];
  const cdpSeriesQuery = trpc.audiolab.listSeries.useQuery();
    const cdpEpisodesQuery = trpc.audiolab.episodes.useQuery(cdpFilter ? { series: cdpFilter } : undefined);
    const cdpProgressQuery = trpc.audiolab.getProgress.useQuery(undefined, { enabled: isAuthenticated });
    const cdpSeries = cdpSeriesQuery.data ?? [];
  const cdpAllEpisodes = useMemo(() => filterAudioLabEpisodes(cdpEpisodesQuery.data?.episodes ?? [], cdpSearchQuery), [cdpEpisodesQuery.data, cdpSearchQuery]);
  const cdpProgressByEpisode = useMemo(() => new Map((cdpProgressQuery.data ?? []).map((entry) => [entry.episodeId, entry])), [cdpProgressQuery.data]);
  const cdpActiveEpisode = useMemo(() => cdpAllEpisodes.find((episode) => episode.id === activeCdpEpisodeId), [cdpAllEpisodes, activeCdpEpisodeId]);
  const activeHubItem: HubEpisode = cdpActiveEpisode ? ({ source: "cdp" as const, episode: cdpActiveEpisode }) : ({ source: "cybercast" as const, episode: activeEpisode });
  const isCdpActive = Boolean(cdpActiveEpisode);
  // Servimento de áudio direto pelo servidor (/podcast-audio/:key), sem redirect 307,
  // para redes/extensões que falham ao seguir redirects em requisições de mídia (Range).
  const getAudioSrc = (audioUrl: string | undefined) => (audioUrl ? audioUrl.replace(/^\/manus-storage\//, "/podcast-audio/") : undefined);
  const activeAudioSrc = getAudioSrc(activeHubItem.episode?.audioUrl);
  // Mini-player: exibir quando houver episódio ativo e o player principal tiver saído do viewport.
  const showMiniPlayer = Boolean(activeAudioSrc) && playerOutOfView;
  const progressByEpisode = useMemo(
    () => new Map((progressQuery.data ?? []).map((progress) => [progress.episodeId, progress])),
    [progressQuery.data],
  );
  const activeProgress = isCdpActive ? cdpProgressByEpisode.get(cdpActiveEpisode!.id) : (activeEpisode ? progressByEpisode.get(activeEpisode.id) : undefined);
  const completedCount = Array.from(progressByEpisode.values()).filter((progress) => progress.completed).length;
  const activeTranscript = activeHubItem.episode?.transcript ?? [];
  const activeCue = activeTranscript.length > 0 ? transcriptCueIndex(activeTranscript as unknown as readonly PodcastLine[], position, mediaDuration) : 0;
  const quizQuery = trpc.podcast.quiz.useQuery({ episodeId: activeEpisode?.id ?? "" }, { enabled: !isCdpActive && isAuthenticated && Boolean(activeEpisode?.id) && showQuiz });
  const quizStatusQuery = trpc.podcast.quizStatus.useQuery({ episodeId: activeEpisode?.id ?? "" }, { enabled: !isCdpActive && isAuthenticated && Boolean(activeEpisode?.id) });
  const cdpQuizQuery = trpc.audiolab.quiz.useQuery({ episodeId: isCdpActive ? (cdpActiveEpisode?.id ?? "") : "" }, { enabled: isCdpActive && isAuthenticated && Boolean(cdpActiveEpisode?.id) && showQuiz });
  const cdpQuizStatusQuery = trpc.audiolab.quizStatus.useQuery({ episodeId: isCdpActive ? (cdpActiveEpisode?.id ?? "") : "" }, { enabled: isCdpActive && isAuthenticated && Boolean(cdpActiveEpisode?.id) });
  const activeQuizQuestions = isCdpActive ? (cdpQuizQuery.data?.questions ?? null) : (quizQuery.data?.questions ?? null);
  const activeQuizStatus = isCdpActive ? (cdpQuizStatusQuery.data ?? null) : (quizStatusQuery.data ?? null);
  const activeQuizCompetency = cdpQuizQuery.data?.competency ?? null;
  const weeklyRankingQuery = trpc.podcast.weeklyRanking.useQuery(undefined, { enabled: isAuthenticated });
  const allHubItems = useMemo((): HubEpisode[] => [
    ...episodes.map((episode) => ({ source: "cybercast" as const, episode })),
    ...cdpAllEpisodes.map((episode) => ({ source: "cdp" as const, episode })),
  ], [episodes, cdpAllEpisodes]);
  const cdpVisibleEpisodes = useMemo(() => {
    const scoped = cdpFilter === null ? cdpAllEpisodes : cdpAllEpisodes.filter((episode) => episode.series === cdpFilter);
    const favoriteScoped = cdpFavoriteFilter ? scoped.filter((episode) => cdpFavoriteIds.has(episode.id)) : scoped;
    return filterAudioLabEpisodes(favoriteScoped, cdpSearchQuery);
  }, [cdpAllEpisodes, cdpFilter, cdpFavoriteFilter, cdpSearchQuery, cdpFavoriteIds]);
  const listenerBadgesQuery = trpc.podcast.listenerBadges.useQuery(undefined, { enabled: isAuthenticated });
  const claimBadges = trpc.podcast.claimListenerBadges.useMutation();
  const vocabularyQuery = trpc.podcast.englishVocabulary.useQuery(undefined, { enabled: isAuthenticated && isEnglishEpisode(activeEpisode) });
  const toggleFavorite = trpc.podcast.toggleEnglishFavorite.useMutation({
    onSuccess: (result, variables) => {
      void utils.podcast.englishVocabulary.invalidate();
      if (result.favorited) {
        const term = englishVocabulary.find((current) => current.id === variables.termId);
        toast.success(term ? `"${term.term}" salvo nos seus favoritos para revisão posterior.` : "Termo salvo nos seus favoritos.");
      } else {
        toast.info("Termo removido dos seus favoritos.");
      }
    },
    onError: (error) => toast.error(error.message),
  });
  const submitInterviewAnswer = trpc.podcast.submitEnglishInterviewAnswer.useMutation();
  const episodeFavoritesQuery = trpc.podcast.episodeFavorites.useQuery(undefined, { enabled: isAuthenticated });
  const toggleEpisodeFavorite = trpc.podcast.toggleEpisodeFavorite.useMutation({
    onSuccess: (result, variables) => {
      void utils.podcast.episodeFavorites.invalidate();
      const episode = episodes.find((current) => current.id === variables.episodeId);
      toast.success(result.favorite ? `"${episode?.title}" adicionado aos seus episódios favoritos.` : "Episódio removido dos seus favoritos.");
    },
    onError: (error) => toast.error(error.message),
  });
  const favoriteEpisodeIds = new Set(episodeFavoritesQuery.data ?? []);
  const favoriteTermIds = new Set(vocabularyQuery.data?.favorites ?? []);
  const episodeTerms = isEnglishEpisode(activeEpisode) ? getTermsByEpisode(activeEpisode.id) : [];

  const highlightTranscriptTerms = (text: string) => {
    if (!isEnglishEpisode(activeEpisode) || episodeTerms.length === 0) return text;
    const sorted = [...episodeTerms].sort((first, second) => second.term.length - first.term.length);
    let segments: (string | { kind: "term"; term: (typeof englishVocabulary)[number] })[] = [text];
    for (const term of sorted) {
      const next: (string | { kind: "term"; term: (typeof englishVocabulary)[number] })[] = [];
      const lowerText = text.toLowerCase();
      const needle = term.term.toLowerCase();
      for (const segment of segments) {
        if (typeof segment !== "string") { next.push(segment); continue; }
        let position = lowerText.indexOf(needle);
        let cursor = 0;
        while (position !== -1) {
          next.push(segment.slice(cursor, position));
          next.push({ kind: "term", term });
          cursor = position + needle.length;
          position = lowerText.indexOf(needle, cursor);
        }
        next.push(segment.slice(cursor));
      }
      segments = next;
    }
    return segments.map((segment, index) => (typeof segment === "string" ? (
      <span key={index}>{segment}</span>
    ) : (
      <button
        key={index}
        type="button"
        onClick={() => handleToggleFavorite(segment.term.id)}
        className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.82rem] font-bold transition-colors ${favoriteTermIds.has(segment.term.id) ? "border-neon-amber/50 bg-neon-amber/15 text-neon-amber hover:bg-neon-amber/25" : "border-neon-cyan/35 bg-neon-cyan/[0.06] text-neon-cyan hover:bg-neon-cyan/15"}`}
        aria-label={`${segment.term.term} — ${favoriteTermIds.has(segment.term.id) ? "remover dos favoritos" : "salvar nos favoritos"}`}
      >
        <Star className={`h-3 w-3 ${favoriteTermIds.has(segment.term.id) ? "fill-current" : ""}`} />
        {segment.term.term}
      </button>
    )));
  };

  const handleToggleFavorite = (termId: string) => {
    if (!isAuthenticated) {
      toast.error("Entre com seu e-mail para salvar termos de vocabulário.");
      return;
    }
    void toggleFavorite.mutateAsync({ termId });
  };

  const exportFavorites = () => {
    const favoriteTerms = englishVocabulary.filter((term) => favoriteTermIds.has(term.id));
    if (favoriteTerms.length === 0) {
      toast.info("Sua lista de termos favoritos está vazia. Salve termos na transcrição dos episódios de inglês primeiro.");
      return;
    }
    const header = [
      "CyberDimension Academy — English for Cyber Pros",
      "Meus termos favoritos de vocabulário técnico",
      "",
    ];
    const lines = favoriteTerms.map((term, index) => [
      `#${String(index + 1).padStart(2, "0")} ${term.term}`,
      `Fonética: ${term.phonetic}`,
      `Significado: ${term.meaning}`,
      `Exemplo: “${term.exampleEn}” — ${term.examplePt}`,
      `Fonte: episódio ${term.sourceEpisodes.map((id) => id.replace(/^ep(\d{2})-.*/, "#$1")).join(", ")}`,
      "",
    ].join("\n"));
    const blob = new Blob([...header, ...lines, ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "cyberdimension-termos-favoritos.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast.success(`${favoriteTerms.length} ${favoriteTerms.length === 1 ? "termo exportado" : "termos exportados"} para revisão offline.`);
  };

  const openInterview = () => {
    if (!isAuthenticated) {
      toast.error("Entre com seu e-mail para treinar o simulado de entrevista.");
      return;
    }
    if (!activeProgress?.completed) {
      toast.error("Ouça o episódio até o fim para liberar o simulado de entrevista.");
      return;
    }
    setShowInterview(true);
    setSubmittedInterview(new Set());
    setInterviewAnswers({});
    setInterviewFeedback({});
  };

  const submitInterviewResponse = async (questionId: string) => {
    const answerText = (interviewAnswers[questionId] ?? "").trim();
    if (answerText.length < 10) {
      toast.error("Escreva uma resposta com pelo menos 10 caracteres para receber o feedback.");
      return;
    }
    try {
      const result = await submitInterviewAnswer.mutateAsync({ questionId, answerText });
      const question = getQuestionsByRole(interviewRole).find((current) => current.id === questionId);
      if (!question) return;
      setInterviewFeedback((current) => ({ ...current, [questionId]: { question, keywordsFound: result.keywordsFound, score: result.score, xp: result.xp } }));
      setSubmittedInterview((current) => new Set(current).add(questionId));
      toast.success(`Resposta avaliada: ${result.keywordsFound.length} conceitos-chave identificados · +${result.xp} XP`);
      await utils.podcast.weeklyRanking.invalidate();
      void checkListenerBadges();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível avaliar a resposta.");
    }
  };
  const rankingEntries = weeklyRankingQuery.data?.ranking ?? [];
  const earnedBadgeCodes = new Set((listenerBadgesQuery.data?.badges ?? []).map((entry) => entry.code));
  const earnedBadgeMap = useMemo(
    () => new Map((listenerBadgesQuery.data?.badges ?? []).map((entry) => [entry.code, entry.awardedAt])),
    [listenerBadgesQuery.data?.badges],
  );
  const DOMAIN_META: Record<string, { name: string; weight: string }> = {
    DOM1: { name: "Conceitos gerais de segurança", weight: "12%" },
    DOM2: { name: "Ameaças e vulnerabilidades", weight: "22%" },
    DOM3: { name: "Arquitetura de segurança", weight: "18%" },
    DOM4: { name: "Operações de segurança", weight: "28%" },
    DOM5: { name: "Gestão e governança", weight: "20%" },
  };
  const filterDomains = Object.keys(DOMAIN_META);
  const domainCounts = useMemo(
    () => new Map(filterDomains.map((domain) => [domain, episodes.filter((episode) => episode.domainCode === domain).length])),
    [episodes],
  );
  const englishEpisodeCount = useMemo(() => episodes.filter((episode) => isEnglishEpisode(episode)).length, [episodes]);
  const completedEnglish = useMemo(() => episodes.filter((episode) => isEnglishEpisode(episode)).filter((episode) => progressByEpisode.get(episode.id)?.completed).length, [episodes, progressByEpisode]);
  const securityPlusEpisodes = useMemo(() => episodes.filter((episode) => !isEnglishEpisode(episode)), [episodes]);
  const applySeriesFilter = (list: ReadonlyArray<PodcastEpisode>) => {
    if (seriesFilter === "english") return list.filter((episode) => isEnglishEpisode(episode));
    if (seriesFilter === "securityplus") return list.filter((episode) => !isEnglishEpisode(episode));
    return list;
  };
  const searchCybercastEpisodes = useMemo(
      () =>
        filterCybercastEpisodes(
          episodes.filter((episode) =>
            seriesFilter === null
              ? true
              : episode.series === (seriesFilter === "english" ? "english" : "securityplus"),
          ),
          searchQuery,
        ),
      [episodes, seriesFilter, searchQuery],
    );
    const visibleEpisodes = applySeriesFilter(
    domainFilter === "FAVORITOS"
      ? episodes.filter((episode) => favoriteEpisodeIds.has(episode.id))
      : domainFilter
        ? applySeriesFilter(episodes.filter((episode) => episode.domainCode === domainFilter))
        : episodes,
  );
  // Fila de reprodução automática: próximo episódio na ordem de reprodução,
  // avançando dentro da mesma trilha do episódio ativo (English ou Security+)
  // e retornando ao início da trilha ao chegar no fim da série.
  const nextCybercastEpisode = useMemo(() => {
    if (!activeEpisode) return null;
    const ordered = searchQuery.trim() ? searchCybercastEpisodes : visibleEpisodes;
    if (ordered.length === 0) return null;
    const seriesOrdered = isEnglishEpisode(activeEpisode)
      ? ordered.filter(isEnglishEpisode)
      : ordered.filter((episode) => !isEnglishEpisode(episode));
    if (seriesOrdered.length <= 1) return null;
    const currentIndex = seriesOrdered.findIndex((episode) => episode.id === activeEpisode.id);
    if (currentIndex === -1) return null;
    const next = seriesOrdered[currentIndex + 1] ?? seriesOrdered[0];
    return next.id !== activeEpisode.id ? next : null;
  }, [activeEpisode, visibleEpisodes, searchCybercastEpisodes, searchQuery]);
  // Autoplay unificado: o próximo episódio da mesma série do episódio ativo
  // (CyberCast com wrap-around; CyberDimension Podcast sem wrap-around).
  const nextHubEpisode = useMemo(() => {
    if (isCdpActive && cdpActiveEpisode) {
      const sameSeries = cdpVisibleEpisodes.filter((episode) => episode.series === cdpActiveEpisode.series);
      if (sameSeries.length <= 1) return null;
      const currentIndex = sameSeries.findIndex((episode) => episode.id === cdpActiveEpisode.id);
      if (currentIndex === -1) return null;
      const next = sameSeries[currentIndex + 1] ?? null;
      return next && next.id !== cdpActiveEpisode.id ? ({ source: "cdp" as const, episode: next }) : null;
    }
    return nextCybercastEpisode ? ({ source: "cybercast" as const, episode: nextCybercastEpisode }) : null;
  }, [isCdpActive, cdpActiveEpisode, cdpVisibleEpisodes, nextCybercastEpisode]);
  const playNextHubEpisode = async (nextItem: HubEpisode) => {
    try {
      if (!audioRef.current) return;
      await waitForReady(audioRef.current);
      await selectHubEpisode(nextItem);
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
      toast.success(`Próximo episódio: ${nextItem.episode.title}`);
    } catch {
      toast.error("Não foi possível iniciar o próximo episódio. Tente novamente.");
    }
  };

  // Troca unificada para o episódio anterior: mesma trilha no CyberCast
  // (com wrap-around para o fim da trilha) ou mesmo anterior da série CDP.
  const prevHubEpisode = useMemo(() => {
    if (isCdpActive && cdpActiveEpisode) {
      const sameSeries = cdpVisibleEpisodes.filter((episode) => episode.series === cdpActiveEpisode.series);
      if (sameSeries.length <= 1) return null;
      const currentIndex = sameSeries.findIndex((episode) => episode.id === cdpActiveEpisode.id);
      if (currentIndex === -1) return null;
      if (currentIndex === 0) return null;
      return { source: "cdp" as const, episode: sameSeries[currentIndex - 1] };
    }
    if (!activeEpisode) return null;
    const ordered = searchQuery.trim() ? searchCybercastEpisodes : visibleEpisodes;
    if (ordered.length === 0) return null;
    const seriesOrdered = isEnglishEpisode(activeEpisode)
      ? ordered.filter(isEnglishEpisode)
      : ordered.filter((episode) => !isEnglishEpisode(episode));
    if (seriesOrdered.length <= 1) return null;
    const currentIndex = seriesOrdered.findIndex((episode) => episode.id === activeEpisode.id);
    if (currentIndex === -1) return null;
    const previous = currentIndex === 0 ? seriesOrdered[seriesOrdered.length - 1] : seriesOrdered[currentIndex - 1];
    return previous.id !== activeEpisode.id ? ({ source: "cybercast" as const, episode: previous }) : null;
  }, [isCdpActive, cdpActiveEpisode, cdpVisibleEpisodes, activeEpisode, visibleEpisodes, searchCybercastEpisodes, searchQuery]);
  const playPreviousHubEpisode = async (previousItem: HubEpisode | null) => {
    if (!previousItem) return;
    try {
      if (!audioRef.current) return;
      await waitForReady(audioRef.current);
      await selectHubEpisode(previousItem);
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
      toast.success(`Episódio anterior: ${previousItem.episode.title}`);
    } catch {
      toast.error("Não foi possível iniciar o episódio anterior. Tente novamente.");
    }
  };

  const setAutoplay = (enabled: boolean) => {
    setAutoplayEnabled(enabled);
    try {
      window.localStorage.setItem("podcast-autoplay-enabled", String(enabled));
    } catch {
      // Persistência indisponível; a preferência vale para a sessão.
    }
  };

  const playNextCybercastEpisode = async (nextEpisode: PodcastEpisode) => {
    try {
      if (!audioRef.current) return;
      await waitForReady(audioRef.current);
      selectEpisode(nextEpisode);
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
      toast.success(`Próximo episódio: ${nextEpisode.title}`);
    } catch {
      toast.error("Não foi possível iniciar o próximo episódio. Tente novamente.");
    }
  };

  const ownRanking = user && rankingEntries.find((entry) => entry.userId === user.id);
  const rankingPosition = ownRanking ? rankingEntries.findIndex((entry) => entry.userId === ownRanking.userId) + 1 : 0;
  const quizExplanation = (questionIndex: number) =>
    (isCdpActive ? (cdpQuizQuery.data?.questions[questionIndex] as { explanation?: string } | undefined) : quizQuery.data?.questions[questionIndex] as { explanation?: string } | undefined);

  const downloadAudio = async () => {
    if (!activeAudioSrc) return;
    try {
      const response = await fetch(activeAudioSrc);
      if (!response.ok) throw new Error(`Falha ao baixar (HTTP ${response.status}).`);
      const blob = await response.blob();
      const fileName = `${activeEpisode.id}.wav`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast.success(`Áudio de "${activeHubItem.episode?.title ?? "episódio"}" baixado para ouvir offline.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível baixar o áudio. Tente novamente.");
    }
  };

  // Download de qualquer episódio do CyberCast a partir do card (sem precisar ativá-lo).
  const downloadCybercastEpisode = async (episode: PodcastEpisode) => {
    if (!episode.audioUrl) return;
    try {
      const response = await fetch(episode.audioUrl);
      if (!response.ok) throw new Error(`Falha ao baixar (HTTP ${response.status}).`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${episode.id}.wav`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast.success(`Áudio do episódio ${episode.episodeNumber} baixado para ouvir offline.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível baixar o áudio. Tente novamente.");
    }
  };

  const downloadTranscript = () => {
    if (!activeEpisode && !isCdpActive) return;
    const lines = ((activeHubItem.episode?.transcript ?? []) as readonly PodcastLine[]).map((line) => {
      const timestamp = typeof line.timestampSeconds === "number" ? `[${formatTime(line.timestampSeconds)}] ` : "";
      return `${timestamp}${line.speaker}: ${line.text}`;
    });
    const header = isCdpActive
      ? [`CyberDimension Academy — Podcast`, `${seriesMeta(cdpActiveEpisode!.series)?.label ?? cdpActiveEpisode!.series} · ${activeHubItem.episode?.title ?? ""}`, "", ""]
      : [
          `CyberDimension Academy — CyberCast`,
          `Episódio ${String(activeEpisode.episodeNumber).padStart(2, "0")}: ${activeEpisode.title}`,
          `Domínio: ${activeEpisode.domainCode} · ${activeEpisode.examWeight}`,
          "",
        ];
    const blob = new Blob([...header, ...lines, ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activeHubItem.episode?.id ?? "episodio"}-transcricao.txt`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast.success("Transcrição baixada para estudo complementar.");
  };

  const openQuiz = () => {
    if (!isAuthenticated) {
      toast.error("Entre com seu e-mail para fazer o quiz de revisão.");
      return;
    }
    if (!activeProgress?.completed) {
      toast.error("Ouça o episódio até o fim para liberar o quiz de revisão.");
      return;
    }
    setShowQuiz(true);
    setQuizSubmitted(false);
    setQuizReview(null);
    setQuizAnswers([]);
  };

  const submitQuizAnswers = async () => {
    if (!activeEpisode) return;
    if (isCdpActive) {
      if (quizAnswers.length !== (cdpQuizQuery.data?.questions.length ?? 5)) return;
      try {
        const result = await cdpSubmitQuiz.mutateAsync({ episodeId: cdpActiveEpisode!.id, answers: quizAnswers });
        setQuizSubmitted(true);
        setQuizReview({ score: result.score, totalQuestions: result.totalQuestions, percentage: Math.round((result.score / result.totalQuestions) * 100), quizXp: result.quizXp, review: result.review ?? null, competency: result.competency ?? null } as never);
        setOwnXp(result.quizXp);
        if (result.score === result.totalQuestions) {
          toast.success(`Total: +${result.quizXp} XP. Competência: ${result.competency?.label ?? "Audio Lab"}`);
        } else {
          toast.success(`Quiz de revisão enviado. +${result.quizXp} XP (${result.score}/${result.totalQuestions} acertos)`);
        }
        await utils.audiolab.quizStatus.invalidate();
        void checkCdpSeriesBadges();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Não foi possível enviar o quiz.");
      }
      return;
    }
    if (quizAnswers.length !== (quizQuery.data?.questions.length ?? 5)) return;
    try {
      const result = await submitQuiz.mutateAsync({ episodeId: activeEpisode.id, answers: quizAnswers });
      setQuizSubmitted(true);
      setQuizReview(result);
      setOwnXp(result.quizXp);
      if (result.score === result.totalQuestions) {
        toast.success(`${QUIZ_PERFECT_BADGE} Total: +${result.quizXp} XP.`);
      } else {
        toast.success(`Quiz de revisão enviado. +${result.quizXp} XP (${result.score}/${result.totalQuestions} acertos)`);
      }
      await utils.podcast.quizStatus.invalidate();
      await utils.podcast.weeklyRanking.invalidate();
      void checkListenerBadges();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar o quiz.");
    }
  };

  useEffect(() => {
    setShowQuiz(false);
    setQuizSubmitted(false);
    setQuizReview(null);
    setQuizAnswers([]);
  }, [activeEpisodeId]);

  useEffect(() => {
    const requestedId = new URLSearchParams(window.location.search).get("ep");
    if (!activeEpisodeId && episodes.length) setActiveEpisodeId(episodes.find((episode) => episode.id === requestedId)?.id ?? episodes[0].id);
  }, [activeEpisodeId, episodes]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = speed;
  }, [speed]);

  const persistEpisode = async (episodeId: string, positionSeconds: number, completed = false, notify = false) => {
    if (!isAuthenticated) return null;
    try {
      const result = await saveProgress.mutateAsync({
        episodeId,
        positionSeconds: Math.max(0, Math.round(positionSeconds)),
        completed,
      });
      await utils.podcast.getProgress.invalidate();
      if (notify && result.justCompleted) {
        toast.success(`Episódio concluído. +${EPISODE_XP} XP para sua jornada!`);
        void checkListenerBadges();
      } else if (notify && result.completed) {
        toast.success("Episódio já concluído; sua escuta foi atualizada.");
      }
      return result;
    } catch (error) {
      if (notify) toast.error(error instanceof Error ? error.message : "Não foi possível salvar o progresso do Podcast.");
      return null;
    }
  };

  // Seleciona um episódio do hub (CyberCast ou CyberDimension Podcast) no player principal,
  // persistindo o ponto de escuta da fonte anterior na tabela correta antes da troca.
  const selectHubEpisode = async (item: HubEpisode, scroll = true) => {
    const audio = audioRef.current;
    if (isCdpActive && audio && isAuthenticated) {
      void persistCdpEpisode(cdpActiveEpisode!.id, audio.currentTime, false);
    } else if (activeEpisode && audio && isAuthenticated) {
      void persistEpisode(activeEpisode.id, audio.currentTime, false);
    }
    setIsPlaying(false);
    setPosition(0);
    setMediaDuration(0);
    setShowQuiz(false);
    setQuizSubmitted(false);
    setQuizReview(null);
    setQuizAnswers([]);
    setShowTranscript(true);
    setShowCaptions(false);
    setShowFavorites(false);
    if (item.source === "cdp") {
      setActiveCdpEpisodeId(item.episode.id);
      setActiveEpisodeId("");
    } else {
      setActiveCdpEpisodeId("");
      setActiveEpisodeId(item.episode.id);
    }
    if (scroll) {
      try {
        const element = mainPlayerRef.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top >= 0 && rect.top <= window.innerHeight * 0.6 && rect.bottom <= window.innerHeight;
          if (!isVisible) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          element.focus({ preventScroll: true });
        }
      } catch {
        // Scroll indisponível; a troca de episódio continua funcional.
      }
    }
  };
  const selectEpisode = (episode: PodcastEpisode) => {
    const audio = audioRef.current;
    if (activeEpisode && audio && isAuthenticated) {
      void persistEpisode(activeEpisode.id, audio.currentTime, false);
    }
    setIsPlaying(false);
    setPosition(0);
    setMediaDuration(0);
    setActiveEpisodeId(episode.id);
    // Rola o player principal para o topo do viewport ao trocar de episódio
    // (o player fica no topo da página na aba Todos).
    try {
      const element = mainPlayerRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight * 0.6) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        element.focus({ preventScroll: true });
      }
    } catch {
      // Scroll indisponível; a troca de episódio continua funcional.
    }
  };

  const waitForReady = (audio: HTMLAudioElement, timeoutMs = 30000): Promise<void> =>
    new Promise((resolve, reject) => {
      if (audio.readyState >= 2 && Number.isFinite(audio.duration) && audio.duration > 0) {
        resolve();
        return;
      }
      const timer = window.setTimeout(() => {
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("error", onError);
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
    const resumeAt = Math.max(0, activeProgress?.positionSeconds ?? 0);
    if (Number.isFinite(audio.duration) && audio.duration > 0 && resumeAt < audio.duration) {
      try {
        audio.currentTime = resumeAt;
      } catch {
        audio.currentTime = 0;
      }
    }
    audio.playbackRate = speed;
    setPosition(audio.currentTime);
    setMediaDuration(audio.duration);
  };

  const onAudioError = () => {
    toast.error("O áudio não pôde ser carregado. Recarregue a página e tente novamente.");
  };

  const onAudioStalled = () => {
    const audio = audioRef.current;
    if (audio && audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE && audio.paused) {
      audio.load();
    }
  };

  // Atalhos de teclado: espaço = play/pause · seta esquerda = −10s · seta direita = +15s.
  // Ignora quando o foco está em campo de texto ou botão para não quebrar a navegação.
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
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        audio.currentTime = Math.min(audio.duration || audio.currentTime, audio.currentTime + 15);
        setPosition(audio.currentTime);
      } else if (event.key.toLowerCase() === "a" && (event.shiftKey || event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setAutoplay(!autoplayEnabled);
        toast.info(autoplayEnabled ? "Reprodução automática desativada." : "Reprodução automática ativada. O próximo episódio será reproduzido ao final.");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAudioSrc, activeEpisode]);

  const onTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !activeEpisode) return;
    const time = audio.currentTime;
    setPosition(time);
    if (showCaptions && isEnglishEpisode(activeEpisode)) {
      const lines = activeEpisode.transcript;
      let currentIndex = 0;
      for (let index = 0; index < lines.length; index += 1) {
        const timestamp = lines[index].timestampSeconds;
        const nextTimestamp = lines[index + 1]?.timestampSeconds;
        if (typeof timestamp === "number" && time >= timestamp && (nextTimestamp === undefined || time < nextTimestamp)) {
          currentIndex = index;
          break;
        }
      }
      setCaptionsText({ speaker: lines[currentIndex].speaker as PodcastSpeaker, text: lines[currentIndex].text });
    }
    if (audio.buffered.length > 0 && Number.isFinite(audio.duration)) {
      setBufferedSeconds(audio.buffered.end(audio.buffered.length - 1));
    }
    if (isAuthenticated && Date.now() - lastPersistedAt.current > 15000) {
      lastPersistedAt.current = Date.now();
      if (isCdpActive && cdpActiveEpisode) {
        void persistCdpEpisode(cdpActiveEpisode.id, audio.currentTime);
      } else {
        void persistEpisode(activeEpisode.id, audio.currentTime);
      }
    }
  };

  const jumpToTimestamp = (line: PodcastLine) => {
    const audio = audioRef.current;
    if (!audio || !line.timestampSeconds || !mediaDuration) return;
    const target = Math.max(0, Math.min(line.timestampSeconds, mediaDuration));
    seek(target);
    if (audio.paused) void togglePlayback();
  };

  const seek = (nextPosition: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextPosition;
    setPosition(nextPosition);
  };

  const checkListenerBadges = async () => {
    if (!isAuthenticated) return;
    try {
      const result = await claimBadges.mutateAsync();
      await utils.podcast.listenerBadges.invalidate();
      if (result.newlyAwarded.length > 0) {
        const names = result.newlyAwarded.map((badge) => badge.name).join(" · ");
        toast.success(`${result.newlyAwarded.length === 1 ? "Nova conquista desbloqueada: " : "Novas conquistas desbloqueadas: "}${names}`);
      }
    } catch {
      // Badge claims are advisory; failures never block the listening flow.
    }
  };

  if (episodesQuery.isLoading) {
    return <div className="min-h-screen space-canvas text-foreground"><div className="pointer-events-none fixed inset-0 space-grid opacity-40" /><main className="container relative grid min-h-screen place-items-center"><p className="font-orbitron text-sm tracking-[0.14em] text-neon-cyan">SINTONIZANDO O CYBERCAST…</p></main></div>;
  }

  if (!activeEpisode) {
    return <div className="min-h-screen space-canvas text-foreground"><main className="container grid min-h-screen place-items-center"><p className="text-muted-foreground">A série de áudio ainda não está disponível.</p></main></div>;
  }

  const resumeLabel = activeProgress?.completed ? "Concluído" : activeProgress?.positionSeconds ? `Retomar em ${formatTime(activeProgress.positionSeconds)}` : "Novo episódio";

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-45" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.86)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> {isAuthenticated ? "Painel" : "Início"}</Link>
          <span className="font-orbitron text-[0.68rem] font-bold tracking-[0.11em] sm:text-xs">CYBER<span className="text-neon-purple">CAST</span> · SECURITY+</span>
          {isAuthenticated ? <span className="hidden text-xs font-bold text-neon-green sm:inline">{completedCount}/{episodes.length} concluídos</span> : <Link href="/login" className="text-xs font-bold text-neon-cyan hover:underline">Entrar para salvar</Link>}
        </div>
      </header>

      <main className="container relative py-7 md:py-10 lg:pb-[calc(1280px+72px)]">
        <section className="mt-5 flex flex-wrap items-center gap-3" aria-label="Buscar episódios">
          <div className="relative flex-1 min-w-64">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar episódios em todo o Podcast… (ex.: phishing, soc, inglês, episódio 12)"
              aria-label="Buscar episódios do Podcast por título ou série"
              className="w-full rounded-full border border-white/12 bg-black/20 px-4 py-2.5 pl-10 text-xs text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/60 focus:outline-none focus:ring-2 focus:ring-neon-cyan/15"
            />
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            {searchQuery.trim() ? <button type="button" onClick={() => setSearchQuery("")} aria-label="Limpar busca" className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.68rem] font-bold tracking-[0.1em] text-neon-cyan hover:underline">LIMPAR</button> : null}
          </div>
          <p className="text-[0.68rem] font-bold tracking-[0.12em] text-muted-foreground">BUSCA GLOBAL · CYBERDIMENSION PODCAST + CYBERCAST</p>
        </section>
        <section className="mt-6" aria-label="Filtrar episódios por trilha">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-neon-purple"><Satellite className="h-3.5 w-3.5" /> FILTRAR POR TRILHA</span>
            <button type="button" onClick={() => { setSeriesFilter(null); setDomainFilter(null); }} className={`rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-[0.08em] transition-colors ${!seriesFilter ? "border-neon-cyan/50 bg-neon-cyan/15 text-neon-cyan" : "border-white/12 bg-white/[0.04] text-muted-foreground hover:border-white/25 hover:text-foreground"}`}>TODAS · {episodes.length}</button>
            <button type="button" onClick={() => { if (seriesFilter === "english") { setSeriesFilter(null); } else { setSeriesFilter("english"); setDomainFilter(null); setHubFilterActive(null); setTimeout(() => scrollToSeries("english"), 60); } }} className={`rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-[0.08em] transition-colors ${seriesFilter === "english" ? "border-neon-cyan/50 bg-neon-cyan/15 text-neon-cyan" : "border-white/12 bg-white/[0.04] text-muted-foreground hover:border-white/25 hover:text-foreground"}`}><Languages className="h-3.5 w-3.5" />Inglês · {englishEpisodeCount}</button>
            <button type="button" onClick={() => { if (seriesFilter === "securityplus") { setSeriesFilter(null); } else { setSeriesFilter("securityplus"); setDomainFilter(null); setHubFilterActive(null); setTimeout(() => scrollToSeries("securityplus"), 60); } }} className={`rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-[0.08em] transition-colors ${seriesFilter === "securityplus" ? "border-neon-purple/50 bg-neon-purple/15 text-neon-purple" : "border-white/12 bg-white/[0.04] text-muted-foreground hover:border-white/25 hover:text-foreground"}`}><BookOpen className="h-3.5 w-3.5" />Comptia Security+ · {securityPlusEpisodes.length}</button>
            <span className="mx-1 hidden h-5 w-px bg-white/10 sm:inline-block" aria-hidden="true" />
            <button type="button" onClick={() => { setSeriesFilter(null); setDomainFilter(favoriteEpisodeIds.size > 0 ? "FAVORITOS" : null); }} className={`rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-[0.08em] transition-colors ${domainFilter === "FAVORITOS" ? "border-neon-amber/50 bg-neon-amber/15 text-neon-amber" : "border-white/12 bg-white/[0.04] text-muted-foreground hover:border-white/25 hover:text-foreground"}`}>{domainFilter === "FAVORITOS" ? <Star className="h-3.5 w-3.5 fill-current" /> : <Star className="h-3.5 w-3.5" />}Favoritos{favoriteEpisodeIds.size > 0 ? ` · ${favoriteEpisodeIds.size}` : ""}</button>
            {CYBERCAST_HUB_SERIES.map((series) => {
                const count = allHubItems.filter((item) => hubEpisodeSeriesKey(item) === series.key).length;
                const isSpecial = series.cybercastSeries === null;
                const active = isSpecial ? hubFilterActive === series.key : false;
                const Icon = series.icon;
                const accentTone = series.accent === "neon-purple" ? "border-neon-purple/50 bg-neon-purple/15 text-neon-purple" : series.accent === "neon-cyan" ? "border-neon-cyan/50 bg-neon-cyan/15 text-neon-cyan" : series.accent === "neon-green" ? "border-neon-green/50 bg-neon-green/15 text-neon-green" : series.accent === "neon-amber" ? "border-neon-amber/50 bg-neon-amber/15 text-neon-amber" : "border-neon-blue/50 bg-neon-blue/15 text-neon-blue";
                return (
                  <button key={series.key} type="button" onClick={() => { if (hubFilterActive === series.key) { setHubFilterActive(null); } else { setSeriesFilter(null); setDomainFilter(null); setHubFilterActive(series.key); setTimeout(() => scrollToSeries(series.key), 60); } }} className={`rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-[0.08em] transition-colors ${isSpecial && hubFilterActive === series.key ? accentTone : "border-white/12 bg-white/[0.04] text-muted-foreground hover:border-white/25 hover:text-foreground"}`}>
                    <Icon className="h-3.5 w-3.5" />{series.shortLabel} · {count}
                  </button>
                );
              })}
            {seriesFilter === "securityplus" && filterDomains.map((domain) => (
              <button type="button" key={domain} onClick={() => setDomainFilter(domainFilter === domain ? null : domain)} aria-pressed={domainFilter === domain} className={`rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-[0.08em] transition-colors ${domainFilter === domain ? "border-neon-cyan/50 bg-neon-cyan/15 text-neon-cyan" : "border-white/12 bg-white/[0.04] text-muted-foreground hover:border-white/25 hover:text-foreground"}`}>
                {domain} · {DOMAIN_META[domain].weight} do exame · {domainCounts.get(domain) ?? 0}
              </button>
            ))}
            {seriesFilter !== null || domainFilter !== null ? <button type="button" onClick={() => { setSeriesFilter(null); setDomainFilter(null); }} className="ml-1 inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs font-bold tracking-[0.08em] text-muted-foreground hover:border-white/25 hover:text-foreground"><RotateCcw className="h-3.5 w-3.5" />LIMPAR</button> : null}
          </div>
        </section>
        {!activeEpisode && !isCdpActive ? <section className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14"><p className="text-sm font-bold text-muted-foreground">Carregando o player do podcast...</p></section> : null}
        <section ref={playerStickyRef} data-player-sticky="section" className={`mt-6 lg:z-20 ${showTranscript ? "" : "lg:sticky lg:top-[72px]"}`}>
            <article ref={mainPlayerRef} tabIndex={-1} className={`overflow-hidden rounded-3xl border ${isBonusEpisode(activeEpisode) ? "border-neon-amber/30" : isRaioXEpisode(activeEpisode) ? "border-neon-green/30" : isEnglishEpisode(activeEpisode) ? "border-neon-cyan/40" : "border-neon-cyan/20"} bg-[linear-gradient(145deg,oklch(0.11_0.028_260/0.96),oklch(0.075_0.018_260/0.98))] outline-none focus-visible:border-neon-cyan/70`}>
              <div className="border-b border-white/8 px-5 py-6 md:px-7"><div className="flex flex-wrap items-center gap-2">{isBonusEpisode(activeEpisode) ? <span className="inline-flex items-center gap-1 rounded-full border border-neon-amber/40 bg-neon-amber/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.13em] text-neon-amber"><Radio className="h-3 w-3" /> ESPECIAL AO VIVO · REVISÃO RELÂMPAGO</span> : isRaioXEpisode(activeEpisode) ? <span className="inline-flex items-center gap-1 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.13em] text-neon-green"><Crosshair className="h-3 w-3" /> RAIO-X DA QUESTÃO · QUESTÃO POR QUESTÃO</span> : isEnglishEpisode(activeEpisode) ? <span className="inline-flex items-center gap-1 rounded-full border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.13em] text-neon-cyan"><Languages className="h-3 w-3" /> ESPECIAL · ENGLISH FOR CYBER PROS</span> : isCdpActive ? <span className={`inline-flex items-center gap-1 rounded-full ${ACCENT_BORDER[getAccent(seriesMeta(cdpActiveEpisode!.series)?.accent ?? "cyan")] ?? "border-neon-cyan/30"} ${ACCENT_BG[getAccent(seriesMeta(cdpActiveEpisode!.series)?.accent ?? "cyan")] ?? "bg-neon-cyan/[0.07]"} px-3 py-1 text-[0.65rem] font-bold tracking-[0.13em] ${ACCENT_TEXT[getAccent(seriesMeta(cdpActiveEpisode!.series)?.accent ?? "cyan")] ?? "text-neon-cyan"}`}><Radio className="h-3 w-3" />{seriesMeta(cdpActiveEpisode!.series)?.label ?? cdpActiveEpisode!.series}</span> : <span className="rounded-full border border-neon-purple/35 bg-neon-purple/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.13em] text-neon-purple">EPISÓDIO {String(activeEpisode.episodeNumber).padStart(2, "0")}</span>}<span className="rounded-full border border-neon-cyan/30 bg-neon-cyan/[0.07] px-3 py-1 text-[0.65rem] font-bold tracking-[0.13em] text-neon-cyan">{isCdpActive ? (seriesMeta(cdpActiveEpisode!.series)?.short ?? "CDP") : `${activeEpisode.domainCode} · ${activeEpisode.examWeight}`}</span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" /> {activeHubItem.episode?.duration}</span></div><h2 className="mt-5 font-orbitron text-2xl font-bold leading-tight md:text-3xl">{activeHubItem.episode?.title}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{activeHubItem.episode?.description}</p></div>

              <div className="px-5 py-6 md:px-7"><audio ref={audioRef} src={activeAudioSrc} preload="auto" onLoadedMetadata={onLoadedMetadata} onError={onAudioError} onStalled={onAudioStalled} onTimeUpdate={onTimeUpdate} onPlay={() => setIsPlaying(true)} onPause={() => { setIsPlaying(false); if (isCdpActive) void persistCdpEpisode(cdpActiveEpisode!.id, audioRef.current?.currentTime ?? 0); else if (activeEpisode) void persistEpisode(activeEpisode.id, audioRef.current?.currentTime ?? 0); }} onEnded={() => { setIsPlaying(false); if (isCdpActive) void persistCdpEpisode(cdpActiveEpisode!.id, audioRef.current?.duration ?? position, true, true); else if (activeEpisode) void persistEpisode(activeEpisode.id, audioRef.current?.duration ?? position, true, true); if (autoplayEnabled && nextHubEpisode) void playNextHubEpisode(nextHubEpisode); }} />
                <div className="cursor-pointer select-none rounded-xl border border-white/8 p-4 transition-colors hover:border-neon-cyan/30 hover:bg-neon-cyan/[0.03]" onDoubleClick={togglePlayback} role="button" aria-label="Clique duas vezes para reproduzir ou pausar o episódio" onClick={(event) => { const target = event.target as HTMLElement; if (target.closest("input,button") || target.tagName === "INPUT") return; }}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><button type="button" onClick={togglePlayback} disabled={!activeAudioSrc} className="orbit-button grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan disabled:opacity-50" aria-label={isPlaying ? "Pausar episódio" : "Reproduzir episódio"}>{isPlaying ? <CirclePause className="h-7 w-7" /> : <CirclePlay className="h-7 w-7" />}</button><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground"><span>{formatTime(position)}</span><span>{mediaDuration ? formatTime(mediaDuration) : activeEpisode.duration}</span></div><input type="range" min={0} max={mediaDuration || 1} step={1} value={Math.min(position, mediaDuration || 1)} onChange={(event) => seek(Number(event.target.value))} aria-label="Posição do episódio" className="mt-2 h-2 w-full cursor-pointer accent-[oklch(0.85_0.2_195)]" /></div>
                  {mediaDuration > 0 && bufferedSeconds > 0 ? <span className="hidden shrink-0 items-center gap-1.5 text-xs font-bold text-muted-foreground sm:inline-flex"><span className="inline-block h-1.5 w-10 overflow-hidden rounded-full bg-white/10"><span className="block h-full bg-neon-cyan/60" style={{ width: `${Math.min(100, (bufferedSeconds / mediaDuration) * 100)}%` }} /></span>{Math.round(Math.min(100, (bufferedSeconds / mediaDuration) * 100))}% carregado</span> : null}<span className="hidden text-[0.62rem] font-bold tracking-[0.1em] text-muted-foreground sm:block">Duplo clique para reproduzir ou pausar</span></div></div>
                {showCaptions && captionsText ? <div className="mt-4 rounded-xl border border-neon-cyan/30 bg-black/25 px-4 py-3"><div className="flex items-center gap-2"><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.62rem] font-bold ${speakerTone(captionsText.speaker)}`}>{captionsText.speaker === "Ana" ? <Sparkles className="h-3 w-3" /> : <Headphones className="h-3 w-3" />}{captionsText.speaker}</span><span className="text-[0.6rem] font-bold tracking-[0.12em] text-neon-cyan">LEGENDA AO VIVO · CC</span></div><p className="mt-2 text-sm font-bold leading-6 text-foreground/90">{captionsText.text}</p></div> : null}
                <div className="mt-5 flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap items-center gap-2"><Volume2 className="h-4 w-4 text-neon-cyan" /><span className="mr-1 text-xs font-bold text-muted-foreground">VELOCIDADE</span>{SPEEDS.map((option) => <button type="button" key={option} onClick={() => setSpeed(option)} className={`rounded-md border px-2.5 py-1.5 text-xs font-bold ${speed === option ? "border-neon-cyan/45 bg-neon-cyan/10 text-neon-cyan" : "border-white/10 text-muted-foreground hover:border-white/20"}`}>{option}x</button>)}</div><div className="flex items-center gap-2"><button type="button" onClick={() => setAutoplay(!autoplayEnabled)} className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-bold transition-colors ${autoplayEnabled ? "border-neon-green/45 bg-neon-green/10 text-neon-green" : "border-white/10 text-muted-foreground hover:border-white/20"}`} aria-label={autoplayEnabled ? "Desativar reprodução automática" : "Ativar reprodução automática"} title={autoplayEnabled ? "Autoplay ativado · Shift+A para alternar" : "Autoplay desativado · Shift+A para alternar"}><Infinity className="h-3.5 w-3.5" />AUTOP{autoplayEnabled ? "·LIG" : "·DESL"}</button>{autoplayEnabled && nextHubEpisode ? <span className="inline-flex items-center gap-1.5 max-w-[220px] truncate rounded-md border border-neon-green/25 bg-neon-green/[0.06] px-2.5 py-1.5 text-xs font-bold text-neon-green" title={`Próximo: ${nextHubEpisode.episode?.title ?? ""}`}><Radio className="h-3 w-3 shrink-0" />A seguir: {nextHubEpisode.episode?.title ?? ""}</span> : null}</div><div className="flex items-center gap-3"><span className="text-xs font-bold text-muted-foreground">{resumeLabel}</span>{activeProgress?.positionSeconds ? <button type="button" onClick={() => seek(activeProgress.positionSeconds)} className="inline-flex items-center gap-1 text-xs font-bold text-neon-purple hover:underline"><RotateCcw className="h-3.5 w-3.5" /> Retomar</button> : null}</div>
                    <div className="flex flex-wrap items-center gap-2 border-t border-white/8 pt-3 sm:border-t-0 sm:pt-0"><button type="button" onClick={downloadAudio} disabled={!activeAudioSrc} className="orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border border-neon-cyan/30 bg-neon-cyan/[0.08] px-3 py-2 text-xs font-bold text-neon-cyan hover:bg-neon-cyan/20 disabled:opacity-50" aria-label="Baixar áudio do episódio"><ArrowDownToLine className="h-3.5 w-3.5" />Baixar episódio</button><button type="button" onClick={downloadTranscript} className="orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/12 bg-black/15 px-3 py-2 text-xs font-bold text-foreground hover:border-neon-purple/40 hover:text-neon-purple" aria-label="Baixar transcrição do episódio"><Book className="h-3.5 w-3.5" />Baixar transcrição</button>{isCdpActive && cdpActiveEpisode ? <button type="button" onClick={() => toggleCdpFavorite.mutate({ episodeId: cdpActiveEpisode.id })} className={`orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${cdpFavoriteIds.has(cdpActiveEpisode.id) ? "border-neon-amber/45 bg-neon-amber/10 text-neon-amber" : "border-white/12 bg-black/15 text-foreground hover:border-neon-amber/45 hover:text-neon-amber"}`} aria-label={cdpFavoriteIds.has(cdpActiveEpisode.id) ? "Remover episódio dos favoritos" : "Adicionar episódio aos favoritos"}><Star className={`h-3.5 w-3.5 ${cdpFavoriteIds.has(cdpActiveEpisode.id) ? "fill-current" : ""}`} />{cdpFavoriteIds.has(cdpActiveEpisode.id) ? "Favoritado" : "Favoritar"}</button> : null}{isEnglishEpisode(activeEpisode) ? <button type="button" onClick={() => setShowCaptions((current) => !current)} className={`orbit-button inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold ${showCaptions ? "border-neon-cyan/45 bg-neon-cyan/10 text-neon-cyan" : "border-white/12 bg-black/15 text-foreground hover:border-neon-cyan/40 hover:text-neon-cyan"}`} aria-label={showCaptions ? "Ocultar legendas sincronizadas" : "Mostrar legendas sincronizadas"}><Languages className="h-3.5 w-3.5" />Legendas</button> : null}</div></div>
              </div>

              <div className="border-t border-white/8 bg-black/10 px-5 py-5 md:px-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold tracking-[0.14em] text-neon-green">REVISÃO GUIADA</p><p className="mt-1 text-sm text-muted-foreground">Tópicos: {(isCdpActive ? (cdpActiveEpisode?.topics ?? []) : activeEpisode.topics).join(" · ")}</p></div><div className="flex flex-wrap items-center gap-2">{isEnglishEpisode(activeEpisode) ? <button type="button" onClick={openInterview} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/[0.08] px-4 py-2.5 text-sm font-bold text-neon-cyan hover:bg-neon-cyan/20"><Languages className="h-4 w-4" />Simulado de entrevista</button> : null}<button type="button" onClick={openQuiz} className={`orbit-button inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold ${activeQuizStatus?.submitted ? "border-neon-green/40 bg-neon-green/10 text-neon-green hover:bg-neon-green/20" : "border-neon-purple/35 bg-neon-purple/10 text-neon-purple hover:bg-neon-purple/20"}`}><ClipboardList className="h-4 w-4" />{activeQuizStatus?.submitted ? `Quiz enviado · ${activeQuizStatus.percentage}%` : "Quiz de revisão"}</button><button type="button" onClick={() => setShowTranscript((current) => !current)} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-black/15 px-4 py-2.5 text-sm font-bold text-foreground">{showTranscript ? <ChevronUp className="h-4 w-4 text-neon-cyan" /> : <ChevronDown className="h-4 w-4 text-neon-cyan" />}{showTranscript ? "Ocultar transcrição" : "Abrir transcrição"}</button>{isEnglishEpisode(activeEpisode) ? <button type="button" onClick={() => setShowFavorites((current) => !current)} className={`orbit-button inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-bold ${showFavorites ? "border-neon-amber/40 bg-neon-amber/10 text-neon-amber" : "border-white/12 bg-black/15 text-foreground hover:border-neon-amber/40 hover:text-neon-amber"}`}><Star className={`h-4 w-4 ${showFavorites ? "fill-current" : ""}`} />Meus termos{favoriteTermIds.size > 0 ? ` · ${favoriteTermIds.size}` : ""}</button> : null}</div></div>
                {showQuiz ? <section className="mt-5 rounded-2xl border border-neon-purple/25 bg-neon-purple/[0.06] p-5 md:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.14em] text-neon-purple">MINI-QUIZ DE REVISÃO · 5 QUESTÕES</p><h3 className="mt-2 font-orbitron text-lg font-bold">{activeHubItem.episode?.title}</h3><p className="mt-1 text-sm text-muted-foreground">Cada acerto rende <strong className="text-neon-green">+{QUIZ_XP_PER_CORRECT} XP</strong> e a revisão comentada fica disponível após o envio.</p></div>{activeQuizStatus?.submitted && !quizSubmitted ? <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-neon-green/35 bg-neon-green/10 px-3 py-1 text-xs font-bold text-neon-green"><CheckCircle2 className="h-3.5 w-3.5" />Enviado · {activeQuizStatus.percentage}%</span> : null}</div>
                  {(quizQuery.isLoading || cdpQuizQuery.isLoading || submitQuiz.isPending) ? <div className="mt-6 space-y-3">{[1, 2, 3, 4, 5].map((index) => <div key={index} className="h-20 animate-pulse rounded-xl border border-white/8 bg-white/5" />)}</div> : activeQuizQuestions && activeQuizQuestions.length > 0 ? <ol className="mt-6 space-y-6">{activeQuizQuestions.map((question, questionIndex) => <li key={question.id} className="rounded-xl border border-white/8 bg-black/15 p-4"><p className="text-sm font-bold leading-6"><span className="font-orbitron text-xs text-neon-cyan">{String(questionIndex + 1).padStart(2, "0")} · </span>{question.prompt}</p><div className="mt-3 space-y-2">{question.options.map((option, optionIndex) => { const selected = quizAnswers[questionIndex] === optionIndex; const isReviewVisible = quizSubmitted && quizReview?.review[questionIndex]; const isCorrectOption = isReviewVisible && quizReview!.review[questionIndex].correctAnswer === optionIndex; const isWrongSelection = isReviewVisible && selected && !quizReview!.review[questionIndex].correct; return <button key={optionIndex} type="button" disabled={quizSubmitted} onClick={() => setQuizAnswers((current) => current.map((answer, index) => (index === questionIndex ? optionIndex : answer)))} className={`w-full rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${selected && !quizSubmitted ? "border-neon-cyan/45 bg-neon-cyan/10 text-foreground" : isCorrectOption ? "border-neon-green/45 bg-neon-green/10 text-neon-green" : isWrongSelection ? "border-neon-red/50 bg-neon-red/10 text-foreground" : "border-white/10 text-muted-foreground hover:border-white/25 disabled:hover:border-white/10"}`}><span className="font-orbitron text-[0.65rem] font-bold text-neon-purple">{String.fromCharCode(65 + optionIndex)} </span>{option}</button>; })}</div>{quizSubmitted && quizReview?.review?.[questionIndex] ? <p className={`mt-3 rounded-lg border p-3 text-xs leading-6 ${quizReview.review[questionIndex].correct ? "border-neon-green/25 bg-neon-green/[0.06] text-neon-green" : "border-neon-cyan/20 bg-neon-cyan/[0.05] text-foreground/85"}`}>{quizReview.review[questionIndex].correct ? "Correto. " : "Incorreto. "}{(quizReview.review[questionIndex] as { explanation?: string }).explanation ?? quizExplanation(questionIndex)?.explanation}</p> : null}</li>)}</ol> : <p className="mt-6 text-sm text-muted-foreground">O quiz deste episódio ainda não está disponível.</p>}
                  {activeQuizQuestions && activeQuizQuestions.length > 0 && !quizSubmitted ? <div className="mt-6 flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs font-bold text-muted-foreground">{quizAnswers.length}/{activeQuizQuestions.length} respondidas{quizAnswers.some((answer) => answer === undefined) ? " · selecione uma opção por questão" : ""}</p><button type="button" onClick={submitQuizAnswers} disabled={quizAnswers.length !== activeQuizQuestions.length || submitQuiz.isPending} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-neon-green/40 bg-neon-green/10 px-5 py-2.5 text-sm font-bold text-neon-green disabled:opacity-50">{submitQuiz.isPending ? <RotateCcw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Enviar respostas</button></div> : quizSubmitted && quizReview ? <div className="mt-6 flex flex-col gap-3 border-t border-white/8 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-bold">Sua nota: <span className="font-orbitron text-neon-green">{quizReview.score}/{quizReview.totalQuestions}</span> <span className="text-muted-foreground">({quizReview.percentage}%) · +{quizReview.score * QUIZ_XP_PER_CORRECT} XP</span></p><button type="button" onClick={() => setShowQuiz(false)} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-black/15 px-4 py-2.5 text-sm font-bold text-foreground">Fechar quiz</button></div> : null}
                </section> : null}
                {showTranscript ? <div className="mt-5 max-h-[calc(100vh-420px)] min-h-[16rem] space-y-3 overflow-y-auto pr-2" aria-live="polite">{(activeTranscript as readonly PodcastLine[]).map((line, index) => { const hasTimestamp = typeof line.timestampSeconds === "number"; const nextTimestamp = activeTranscript[index + 1]?.timestampSeconds; const cueDuration = hasTimestamp && nextTimestamp !== undefined ? nextTimestamp - (line.timestampSeconds as number) : undefined; return <article key={`${activeHubItem.episode?.id ?? "ep"}-${index}`} className={`rounded-xl border p-4 transition-colors ${index === activeCue ? speakerTone(line.speaker) : "border-white/8 bg-black/10"}`}><div className="flex items-center gap-2"><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.65rem] font-bold ${speakerTone(line.speaker)}`}>{line.speaker === "Ana" ? <Sparkles className="h-3 w-3" /> : <Headphones className="h-3 w-3" />}{line.speaker}</span>{index === activeCue ? <span className="text-[0.63rem] font-bold tracking-[0.1em] text-muted-foreground">FALA ATUAL</span> : null}{hasTimestamp && activeAudioSrc ? <button type="button" onClick={() => jumpToTimestamp(line)} aria-label={`Pular para ${formatTime(line.timestampSeconds!)}`} className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[0.65rem] font-bold tabular-nums transition-colors ${index === activeCue ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20" : "border-white/12 text-muted-foreground hover:border-neon-cyan/40 hover:text-neon-cyan"}`}>{index === activeCue && cueDuration !== undefined && cueDuration > 2 ? <span className="text-[0.55rem]">{formatTime(Math.round(cueDuration))} ·</span> : null}<CirclePlay className="h-3 w-3" />{formatTime(line.timestampSeconds!)}</button> : null}</div><p className="mt-3 text-sm leading-7 text-foreground/90">{highlightTranscriptTerms(line.text)}</p></article>; })}</div> : null}
                {showInterview ? <section className="mt-5 rounded-2xl border border-neon-cyan/25 bg-neon-cyan/[0.05] p-5 md:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.14em] text-neon-cyan">SIMULADO DE ENTREVISTA · VAGAS INTERNACIONAIS</p><h3 className="mt-2 font-orbitron text-lg font-bold">Responda como o candidato</h3><p className="mt-1 text-sm text-muted-foreground">Escolha a vaga, escreva sua resposta em inglês e receba o feedback da resposta ideal, com os conceitos-chave esperados pelo recrutador. Cada conceito identificado rende <strong className="text-neon-green">até +10 XP por resposta</strong>.</p></div></div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">{(["soc", "pentester", "network"] as InterviewRole[]).map((role) => { const roleMeta = interviewRoles.find((current) => current.id === role)!; const isActive = interviewRole === role; return <button type="button" key={role} onClick={() => { setInterviewRole(role); setSubmittedInterview(new Set()); setInterviewAnswers({}); setInterviewFeedback({}); }} className={`rounded-xl border p-3 text-left transition-colors ${isActive ? "border-neon-cyan/45 bg-neon-cyan/10" : "border-white/10 bg-black/10 hover:border-white/25"}`}><p className={`text-[0.63rem] font-bold tracking-[0.12em] ${isActive ? "text-neon-cyan" : "text-neon-purple"}`}>{roleMeta.title.toUpperCase()}</p><p className="mt-1 text-sm font-bold leading-5 text-foreground">{roleMeta.title}</p><p className="mt-1 text-xs text-muted-foreground">{roleMeta.subtitle}</p></button>; })}</div>
                  <ol className="mt-6 space-y-6">{getQuestionsByRole(interviewRole).map((question, questionIndex) => { const feedback = interviewFeedback[question.id]; const isSubmitted = submittedInterview.has(question.id); return <li key={question.id} className="rounded-xl border border-white/8 bg-black/15 p-4"><p className="text-sm font-bold leading-6"><span className="font-orbitron text-xs text-neon-cyan">{String(questionIndex + 1).padStart(2, "0")} · </span>“{question.recruiter}”</p><p className="mt-1 text-xs text-muted-foreground">{question.recruiterTranslation}</p>
                    <div className="mt-3"><label className="text-xs font-bold text-neon-cyan">SUA RESPOSTA EM INGLÊS</label>
                      <textarea value={interviewAnswers[question.id] ?? ""} disabled={isSubmitted} onChange={(event) => setInterviewAnswers((current) => ({ ...current, [question.id]: event.target.value }))} rows={4} aria-label={`Resposta para a pergunta ${questionIndex + 1}`}
                        className={`mt-2 w-full resize-y rounded-xl border bg-black/20 px-4 py-3 text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-neon-cyan/60 focus:ring-2 focus:ring-neon-cyan/15 ${isSubmitted ? "border-white/10 text-muted-foreground" : "border-white/12 text-foreground"}`}
                        placeholder="Write your answer here… (escreva em inglês, como se estivesse na entrevista)" />{isSubmitted ? <button type="button" onClick={() => { setInterviewAnswers((current) => ({ ...current, [question.id]: "" })); setInterviewFeedback((current) => { const { [question.id]: removed, ...rest } = current; return rest; }); setSubmittedInterview((current) => { const next = new Set(current); next.delete(question.id); return next; }); }} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-neon-purple hover:underline"><RotateCcw className="h-3 w-3" /> Reescrever resposta</button> : <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs font-bold text-muted-foreground">Mínimo de 10 caracteres para receber o feedback.</p><button type="button" disabled={(interviewAnswers[question.id] ?? "").trim().length < 10 || submitInterviewAnswer.isPending} onClick={() => void submitInterviewResponse(question.id)} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-neon-green/40 bg-neon-green/10 px-5 py-2.5 text-sm font-bold text-neon-green disabled:opacity-50">{submitInterviewAnswer.isPending ? <RotateCcw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Enviar e receber feedback</button></div>}
                    </div>
                    {feedback ? <div className="mt-4 space-y-3"><div className="rounded-xl border border-neon-amber/35 bg-neon-amber/[0.07] p-4"><p className="text-xs font-bold tracking-[0.12em] text-neon-amber">O QUE O RECRUTADOR ESPETA</p><ul className="mt-2 space-y-1.5">{feedback.question.ideaScore.map((point, pointIndex) => <li key={pointIndex} className="flex gap-2 text-xs leading-6 text-foreground/85"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon-amber" />{point}</li>)}</ul></div>
                      <div className="rounded-xl border border-neon-green/30 bg-neon-green/[0.07] p-4"><p className="text-xs font-bold tracking-[0.12em] text-neon-green">RESPOSTA IDEAL · EN</p><p className="mt-2 text-sm italic leading-7 text-foreground/90">“{feedback.question.idealAnswerEn}”</p><p className="mt-3 text-xs font-bold tracking-[0.12em] text-neon-green">RESPOSTA IDEAL · PT</p><p className="mt-2 text-sm leading-7 text-foreground/85">{feedback.question.idealAnswerPt}</p></div>
                      <div className="rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.06] p-4"><p className="text-xs font-bold tracking-[0.12em] text-neon-cyan">CONCEITOS-CHAVE E SUA AVALIAÇÃO</p><div className="mt-3 flex flex-wrap gap-1.5">{feedback.question.keywords.map((keyword) => { const found = feedback.keywordsFound.includes(keyword); return <span key={keyword} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[0.68rem] font-bold ${found ? "border-neon-green/45 bg-neon-green/10 text-neon-green" : "border-white/12 bg-black/15 text-muted-foreground"}`}>{found ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-white/25" />}{keyword}</span>; })}</div><p className="mt-3 text-xs leading-6 text-muted-foreground"><strong className="text-foreground">{feedback.score}/{feedback.question.keywords.length} conceitos identificados</strong> · +{feedback.xp} XP registrados no seu ranking semanal.</p></div>
                      <div className="rounded-xl border border-neon-purple/25 bg-neon-purple/[0.05] p-4"><p className="text-xs font-bold tracking-[0.12em] text-neon-purple">DICA DE PRÁTICA</p><p className="mt-2 text-sm leading-7 text-foreground/85">{feedback.question.tips}</p></div>
                    </div> : null}
                  </li>; })}</ol>
                  <div className="mt-6 border-t border-white/8 pt-4"><p className="text-xs leading-6 text-muted-foreground">Use as respostas ideais como referência de estrutura e vocabulário. Repita em voz alta, grave sua voz e compare com o diálogo dos episódios especiais do CyberCast.</p></div>
                </section> : null}
                {showFavorites ? <section className="mt-5 rounded-2xl border border-neon-amber/25 bg-neon-amber/[0.05] p-5 md:p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.14em] text-neon-amber">MEUS TERMOS FAVORITOS</p><h3 className="mt-1 font-orbitron text-lg font-bold">Vocabulário para revisão</h3><p className="mt-1 text-sm text-muted-foreground">Termos salvos na transcrição dos episódios de inglês — clique em um termo para removê-lo da lista.</p></div><div className="flex items-center gap-2"><button type="button" onClick={exportFavorites} className="orbit-button inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/15 px-3 py-2 text-xs font-bold text-foreground hover:border-neon-green/40 hover:text-neon-green" aria-label="Exportar termos favoritos"><ArrowDownToLine className="h-3.5 w-3.5" />Exportar</button><button type="button" onClick={() => setFlashcardMode((current) => !current)} className={`orbit-button inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold ${flashcardMode ? "border-neon-amber/45 bg-neon-amber/15 text-neon-amber" : "border-neon-cyan/30 bg-neon-cyan/[0.08] text-neon-cyan hover:bg-neon-cyan/20"}`}>{flashcardMode ? <Star className="h-3.5 w-3.5 fill-current" /> : <BookOpen className="h-3.5 w-3.5" />}{flashcardMode ? "Modo lista" : "Modo flashcards"}</button><Star className="h-5 w-5 text-neon-amber" /></div></div>
                  {vocabularyQuery.isLoading ? <div className="mt-6 space-y-3">{[1, 2, 3].map((index) => <div key={index} className="h-16 animate-pulse rounded-xl border border-white/8 bg-white/5" />)}</div> : !vocabularyQuery.data || vocabularyQuery.data.favorites.length === 0 ? <div className="mt-6 rounded-xl border border-white/8 bg-black/10 p-6 text-center"><Languages className="mx-auto h-6 w-6 text-neon-amber" /><p className="mt-3 text-sm font-bold text-foreground">Sua lista está vazia</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Na transcrição, os termos de vocabulário aparecem destacados em ciano. Clique na estrela ao lado de qualquer termo para adicioná-lo aqui e revisá-lo depois.</p></div>  : flashcardMode ? <FlashcardDeck favoriteTermIds={favoriteTermIds} flipped={flashcardFlipped} setFlipped={setFlashcardFlipped} index={flashcardIndex} setIndex={setFlashcardIndex} onRemove={handleToggleFavorite} srsStateMap={srsStateMap} recordSrsReview={recordSrsReview} onXpToast={srsXpToast} onReload={srsReload} onStartDrill={startDrill} dueTermCount={dueTermCount} onExitDrill={() => setDrillMode(false)} drillMode={drillMode} drillStep={drillStep} setDrillStep={setDrillStep} drillPicks={drillPicks} setDrillPicks={setDrillPicks} drillQuestions={drillQuestionsQuery.data?.questions ?? []} drillQuestionsLoading={drillQuestionsQuery.isLoading} drillSubmitting={submitDrill.isPending} onFinishDrill={finishDrill} drillResult={drillResult} setDrillResult={setDrillResult} /> : <ol className="mt-5 space-y-2">{englishVocabulary.filter((term) => favoriteTermIds.has(term.id)).map((term) => <li key={term.id} className="flex flex-col justify-between gap-3 rounded-xl border border-neon-amber/25 bg-black/15 p-4 sm:flex-row sm:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-bold capitalize text-foreground">{term.term}</p><span className="rounded-full border border-white/12 bg-black/20 px-2 py-0.5 font-mono text-[0.68rem] text-neon-cyan">{term.phonetic}</span></div><p className="mt-1.5 text-sm leading-6 text-foreground/85">{term.meaning}</p><p className="mt-1.5 text-xs italic leading-6 text-muted-foreground">“{term.exampleEn}” — {term.examplePt}</p></div><button type="button" onClick={() => handleToggleFavorite(term.id)} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-neon-amber/40 bg-neon-amber/10 px-3 py-2 text-xs font-bold text-neon-amber hover:bg-neon-amber/20"><Star className="h-3.5 w-3.5 fill-current" />Remover da lista</button></li>)}</ol>}
                </section> : null}
              </div>
            </article>

            <section className="mt-5 rounded-2xl border border-neon-green/20 bg-neon-green/[0.05] p-5"><div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-neon-green/30 bg-neon-green/10"><CheckCircle2 className="h-5 w-5 text-neon-green" /></div><div><h3 className="font-orbitron text-sm font-bold">Progresso que acompanha sua escuta</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Ao fim de cada episódio, a posição e a conclusão são salvas automaticamente. Cada domínio concluído rende <strong className="text-neon-green">{EPISODE_XP} XP</strong> e cada acerto no quiz de revisão rende <strong className="text-neon-green">+{QUIZ_XP_PER_CORRECT} XP</strong>.</p>{!isAuthenticated ? <Link href="/login" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-neon-cyan hover:underline"><LockKeyhole className="h-4 w-4" /> Entrar para salvar meu progresso</Link> : null}</div></div></section>
          </section>
<CybercastHubSection
          allItems={allHubItems}
          searchQuery={searchQuery}
          hubFilterActive={hubFilterActive}
          onHubFilter={setHubFilterActive}
          progressByEpisode={progressByEpisode}
          favoriteEpisodeIds={favoriteEpisodeIds}
          toggleFavorite={(episodeId) => toggleEpisodeFavorite.mutate({ episodeId })}
          onOpen={(item) => void selectHubEpisode(item)}
          showAll={hubShowAll}
          onShowAll={() => setHubShowAll((current) => !current)}
          cdpProgressByEpisode={cdpProgressByEpisode}
          cdpFavoriteIds={cdpFavoriteIds}
          toggleCdpFavorite={(episodeId) => toggleCdpFavorite.mutate({ episodeId })}
          onSelectCdp={(episode) => void selectHubEpisode({ source: "cdp", episode })}
        />
        
        <section id="cdp-section" className="mt-6 border-t border-white/8 pt-7 scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-neon-purple"><Radio className="h-3.5 w-3.5" /> CYBERDIMENSION PODCAST · MICRO-APRENDIZAGEM EM ÁUDIO</span>
            <div className="relative">
              <input
                type="search"
                value={cdpSearchQuery}
                onChange={(event) => setCdpSearchQuery(event.target.value)}
                placeholder="Buscar no CyberDimension Podcast…"
                aria-label="Buscar episódios do CyberDimension Podcast"
                className="w-64 rounded-full border border-white/12 bg-black/20 px-4 py-2 pl-9 text-xs text-foreground placeholder:text-muted-foreground focus:border-neon-purple/60 focus:outline-none focus:ring-2 focus:ring-neon-purple/15"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
            <button type="button" onClick={() => { setCdpFilter(null); setCdpFavoriteFilter(false); }} className={`rounded-xl border p-3 text-left transition-colors ${cdpFilter === null && !cdpFavoriteFilter ? "border-neon-cyan/50 bg-neon-cyan/15" : "border-white/10 bg-white/[0.04] hover:border-white/25"}`}>
              <span className={`text-[0.62rem] font-bold tracking-[0.1em] ${cdpFilter === null && !cdpFavoriteFilter ? "text-neon-cyan" : "text-muted-foreground"}`}>TODAS</span>
              <p className="mt-1 font-orbitron text-xs font-bold leading-4 text-foreground">Todas as séries</p>
              <p className="mt-1 text-[0.62rem] text-muted-foreground">{cdpAllEpisodes.length} episódios</p>
            </button>
            <button type="button" onClick={() => { setCdpFilter(null); setCdpFavoriteFilter((current) => !current); }} className={`rounded-xl border p-3 text-left transition-colors ${cdpFavoriteFilter ? "border-neon-amber/50 bg-neon-amber/15" : "border-white/10 bg-white/[0.04] hover:border-white/25"}`}>
              <span className={`text-[0.62rem] font-bold tracking-[0.1em] ${cdpFavoriteFilter ? "text-neon-amber" : "text-muted-foreground"}`}>FAVORITOS</span>
              <p className="mt-1 font-orbitron text-xs font-bold leading-4 text-foreground">Meus favoritos</p>
              <p className="mt-1 text-[0.62rem] text-muted-foreground">{isAuthenticated ? cdpFavoriteIds.size : 0} episódios</p>
            </button>
            {cdpSeries.map((seriesItem) => {
              const meta = seriesMeta(seriesItem.code) ?? { label: seriesItem.title, short: seriesItem.shortTitle ?? seriesItem.code.slice(0, 3).toUpperCase(), accent: "cyan" };
              const isActive = cdpFilter === seriesItem.code;
              const seriesEpisodes = cdpAllEpisodes.filter((episode) => episode.series === seriesItem.code);
              const seriesCount = seriesEpisodes.length;
              const completedSeries = seriesEpisodes.filter((episode) => cdpProgressByEpisode.get(episode.id)?.completed).length;
              return (
                <button type="button" key={seriesItem.code} onClick={() => { setCdpFilter(isActive ? null : seriesItem.code); if (!isActive) setTimeout(() => scrollToAndHighlight(`cdp-series-${seriesItem.code}`), 80); }} className={`rounded-xl border p-3 text-left transition-colors ${isActive ? `${ACCENT_BORDER[getAccent(meta.accent)]} ${ACCENT_BG[getAccent(meta.accent)]}` : "border-white/10 bg-white/[0.04] hover:border-white/25"}`}>
                  <span className={`text-[0.62rem] font-bold tracking-[0.1em] ${isActive ? ACCENT_TEXT[getAccent(meta.accent)] : "text-muted-foreground"}`}>{`${meta.short} · ${completedSeries}/${seriesCount}`}</span>
                  <p className="mt-1 font-orbitron text-xs font-bold leading-4 text-foreground">{meta.label}</p>
                  <p className="mt-1 text-[0.62rem] text-muted-foreground">{seriesCount} episódios</p>
                </button>
              );
            })}
          </div>
          <div className="mt-5">
            <p className="text-xs font-bold tracking-[0.12em] text-neon-cyan">RESULTADOS {cdpSearchQuery.trim() ? `· BUSCA "${cdpSearchQuery.trim().toUpperCase()}"` : `· ${cdpFavoriteFilter ? "FAVORITOS" : (cdpFilter ?? "TODAS")}`}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{cybercastView === "todos" && cdpFilter === null && !cdpSearchQuery.trim() ? null : <Fragment>
              {cdpVisibleEpisodes.map((episode) => {
                const meta = seriesMeta(episode.series) ?? { label: "", short: "", accent: "cyan" };
                const ak = getAccent(meta.accent);
                const completed = cdpProgressByEpisode.get(episode.id)?.completed;
                return (
                  <button type="button" key={episode.id} onClick={() => void selectHubEpisode({ source: "cdp", episode })} className={`rounded-xl border p-3 text-left transition-colors ${completed ? "border-neon-green/45 bg-neon-green/10" : `${ACCENT_DOT_BORDER[ak]} ${ACCENT_DOT_BG[ak]} hover:border-white/25`}`}>
                    <p className={`text-[0.63rem] font-bold tracking-[0.12em] ${ACCENT_TEXT[ak]}`}>{meta.short}</p>
                    <h3 className="mt-1 font-orbitron text-xs font-bold leading-5 text-foreground">{episode.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{episode.duration}{completed ? " · Concluído" : ""}</p>
                  </button>
                );
              })}
              {cdpVisibleEpisodes.length === 0 ? <p className="col-span-full rounded-xl border border-white/10 bg-black/10 px-4 py-6 text-center text-sm text-muted-foreground">Nenhum episódio encontrado para esta busca.</p> : null}
            {cybercastView === "todos" && cdpFilter === null && !cdpSearchQuery.trim() ? <CdpAllSeriesSection episodes={cdpAllEpisodes} progress={cdpProgressByEpisode} onSelect={(episodeId) => { const found = cdpAllEpisodes.find((episode) => episode.id === episodeId); if (found) void selectHubEpisode({ source: "cdp", episode: found }); }} favoriteEpisodeIds={cdpFavoriteIds} onFavorite={(episodeId) => toggleCdpFavorite.mutate({ episodeId })} /> : null}</Fragment>}
            </div>
          </div>
        </section>

        {isAuthenticated && rankingEntries.length > 0 ? <section className="mt-8 rounded-2xl border border-neon-purple/20 bg-neon-purple/[0.05] p-5"><div className="flex items-center justify-between gap-4"><div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-neon-purple" /><h3 className="font-orbitron text-sm font-bold">RANKING SEMANAL DE OUVINTES</h3></div><span className="text-[0.65rem] font-bold tracking-[0.13em] text-muted-foreground">{weeklyRankingQuery.data?.weekKey} · XP DO PODCAST</span></div>
          {ownRanking ? <p className="mt-3 rounded-xl border border-neon-cyan/30 bg-neon-cyan/[0.08] px-4 py-3 text-sm font-bold text-foreground"><span className="font-orbitron text-neon-cyan">Sua posição: {rankingPosition}º</span> <span className="text-muted-foreground">· {ownRanking.xp} XP nesta semana</span></p> : <p className="mt-3 text-sm text-muted-foreground">Conclua episódios e faça os quizzes de revisão para aparecer no ranking desta semana.</p>}
          <ol className="mt-4 space-y-1.5">{rankingEntries.slice(0, 10).map((entry, index) => { const isOwn = entry.userId === user?.id; return <li key={entry.userId} className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm ${isOwn ? "border-neon-cyan/40 bg-neon-cyan/[0.08]" : "border-white/8 bg-black/10"}`}><span className="flex items-center gap-3 truncate"><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.65rem] font-bold ${index < 3 ? "border-neon-green/40 bg-neon-green/10 text-neon-green" : "border-white/15 text-muted-foreground"}`}>{index + 1}</span><span className="truncate font-bold text-foreground">{isOwn ? "Você" : entry.name}</span></span><span className={`font-orbitron text-xs font-bold ${index < 3 ? "text-neon-green" : "text-muted-foreground"}`}>{entry.xp} XP</span></li>; })}</ol>
        </section> : null}
        {isAuthenticated ? <PodcastBadgesCard earnedBadgeCodes={earnedBadgeCodes} earnedBadgeMap={earnedBadgeMap} isLoading={listenerBadgesQuery.isLoading} onClaim={checkListenerBadges} isClaiming={claimBadges.isPending} /> : null}

        <section className="mt-8 border-t border-white/8 py-8"><div className="grid gap-4 md:grid-cols-3"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">AUTORIA E USO</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Conteúdo próprio da CyberDimension Academy, criado para estudo e revisão dentro da plataforma.</p></div><div><p className="text-xs font-bold tracking-[0.15em] text-neon-purple">ACESSIBILIDADE</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Transcrição estruturada por interlocutor, acompanhamento da fala estimado pela cadência textual e controles de velocidade.</p></div><div><p className="text-xs font-bold tracking-[0.15em] text-neon-green">ESTUDE COM MÉTODO</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Ouça, releia a transcrição, retome o domínio na trilha Security+ e pratique com simulados autorais.</p><Link href="/securityplus/trilha" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-neon-cyan hover:underline">Abrir trilha Security+ <Play className="h-3.5 w-3.5" /></Link></div></div>
        </section>
        {showMiniPlayer ? <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neon-cyan/25 bg-[oklch(0.08_0.025_260/0.97)] shadow-[0_-8px_30px_oklch(0_0_0/0.5)] backdrop-blur-xl"><div className="container flex items-center gap-3 py-2.5 md:gap-4"><button type="button" onClick={() => { const element = mainPlayerRef.current; if (element) element.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="hidden shrink-0 items-center gap-1.5 rounded-md border border-neon-cyan/30 bg-neon-cyan/[0.08] px-2.5 py-1.5 text-[0.65rem] font-bold text-neon-cyan hover:bg-neon-cyan/20 md:inline-flex" aria-label="Voltar ao player completo no topo"><ChevronUp className="h-4 w-4" />Player</button><span className="min-w-0 shrink-0 truncate text-xs font-bold text-foreground/90" title={activeHubItem.episode?.title ?? ""}>{activeHubItem.episode?.title ?? ""}</span><div className="flex shrink-0 items-center gap-1.5"><button type="button" onClick={() => void playPreviousHubEpisode(prevHubEpisode)} disabled={!prevHubEpisode} className="grid h-8 w-8 place-items-center rounded-lg border border-white/12 text-muted-foreground hover:border-neon-cyan/30 hover:text-neon-cyan disabled:opacity-30" aria-label="Episódio anterior"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={togglePlayback} disabled={!activeAudioSrc} className="grid h-9 w-9 place-items-center rounded-full border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan disabled:opacity-50" aria-label={isPlaying ? "Pausar episódio" : "Reproduzir episódio"}>{isPlaying ? <CirclePause className="h-5 w-5" /> : <CirclePlay className="h-5 w-5" />}</button><button type="button" onClick={() => nextHubEpisode && void playNextHubEpisode(nextHubEpisode)} disabled={!nextHubEpisode} className="grid h-8 w-8 place-items-center rounded-lg border border-white/12 text-muted-foreground hover:border-neon-cyan/30 hover:text-neon-cyan disabled:opacity-30" aria-label="Próximo episódio"><ChevronRight className="h-4 w-4" /></button></div><div className="min-w-0 flex-1"><input type="range" min={0} max={mediaDuration || 1} step={1} value={Math.min(position, mediaDuration || 1)} onChange={(event) => seek(Number(event.target.value))} aria-label="Posição do episódio" className="h-1.5 w-full cursor-pointer accent-[oklch(0.85_0.2_195)]" /><div className="mt-1 flex items-center justify-between text-[0.6rem] font-bold text-muted-foreground"><span>{formatTime(position)}</span><span>{mediaDuration ? formatTime(mediaDuration) : activeEpisode.duration}</span></div></div></div></div> : <button type="button" onClick={() => { const element = mainPlayerRef.current; if (element) element.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={`fixed bottom-20 right-4 z-50 grid h-11 w-11 place-items-center rounded-full border border-neon-cyan/40 bg-[oklch(0.08_0.025_260/0.97)] text-neon-cyan shadow-lg backdrop-blur-xl transition-opacity hover:bg-neon-cyan/15 ${showMiniPlayer ? "pointer-events-none opacity-0" : "opacity-100"}`} aria-label="Voltar ao player do episódio"><ChevronUp className="h-5 w-5" /></button>}
      </main>
    </div>
  );
}

function badgeIconNode(icon: string, className: string) {
  const props = { className } as const;
  switch (icon) {
    case "rocket": return <Rocket {...props} />;
    case "headphones": return <Headphones {...props} />;
    case "satellite": return <Satellite {...props} />;
    case "star": return <Star {...props} />;
    case "globe": return <Globe {...props} />;
    case "book": return <Book {...props} />;
    case "trophy": return <Trophy {...props} />;
    case "crosshair": return <Crosshair {...props} />;
    case "badge-check": return <BadgeCheck {...props} />;
    case "microscope": return <Microscope {...props} />;
    case "languages": return <Languages {...props} />;
    default: return <Award {...props} />;
  }
}

interface PodcastBadgesCardProps {
  earnedBadgeCodes: ReadonlySet<string>;
  earnedBadgeMap: Map<string, Date>;
  isLoading: boolean;
  onClaim: () => void;
  isClaiming: boolean;
}

function PodcastBadgesCard({ earnedBadgeCodes, earnedBadgeMap, isLoading, onClaim, isClaiming }: PodcastBadgesCardProps) {
  const earnedCount = PODCAST_LISTENER_BADGES.filter((badge) => earnedBadgeCodes.has(badge.code)).length;
  return (
    <section className="mt-5 rounded-2xl border border-neon-cyan/20 bg-neon-cyan/[0.05] p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2"><Award className="h-4 w-4 text-neon-cyan" /><h3 className="font-orbitron text-sm font-bold">CONQUISTAS DE OUVINTE</h3></div>
        <span className="text-[0.65rem] font-bold tracking-[0.13em] text-muted-foreground">{earnedCount}/{PODCAST_LISTENER_BADGES.length} DESBLOQUEADAS</span>
      </div>
      {isLoading ? <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((index) => <div key={index} className="h-24 animate-pulse rounded-xl border border-white/8 bg-white/5" />)}</div> : (
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {PODCAST_LISTENER_BADGES.map((badge) => {
            const earned = earnedBadgeCodes.has(badge.code);
            return (
              <article key={badge.code} title={badge.description} className={`group relative flex flex-col items-start gap-2 rounded-xl border p-3 transition-colors ${earned ? "border-neon-cyan/40 bg-neon-cyan/[0.08]" : "border-white/8 bg-black/10 opacity-60"}`}>
                <span className={`grid h-8 w-8 place-items-center rounded-lg border ${earned ? "border-neon-cyan/45 bg-neon-cyan/10 text-neon-cyan" : "border-white/15 bg-black/20 text-muted-foreground"}`}>{badgeIconNode(badge.icon, "h-4 w-4")}</span>
                <p className={`text-[0.72rem] font-bold leading-4 ${earned ? "text-foreground" : "text-muted-foreground"}`}>{badge.name}</p>
                <p className="text-[0.65rem] leading-4 text-muted-foreground">{badge.description}</p>
                <p className={`ml-auto mt-auto text-[0.62rem] font-bold ${earned ? "text-neon-green" : "text-muted-foreground/60"}`}>+{badge.xp} XP</p>
                {earned ? <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full border border-neon-green/40 bg-neon-green/15 text-neon-green" aria-label={`Conquistado em ${earnedBadgeMap.get(badge.code)?.toLocaleDateString("pt-BR")}`}><CheckCircle2 className="h-2.5 w-2.5" /></span> : null}
              </article>
            );
          })}
        </div>
      )}
      {earnedCount < PODCAST_LISTENER_BADGES.length ? <button type="button" onClick={onClaim} disabled={isClaiming} className="orbit-button mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-4 py-2.5 text-xs font-bold text-neon-cyan transition-colors hover:bg-neon-cyan/20 disabled:opacity-60"><Sparkles className="h-3.5 w-3.5" />{isClaiming ? "Verificando marcos…" : "Verificar novas conquistas"}</button> : earnedCount > 0 ? <p className="mt-4 text-center text-[0.7rem] font-bold tracking-[0.14em] text-neon-green">SÉRIE COMPLETA — VOCÊ CONQUISTOU TODOS OS BADGES DO CYBERCAST</p> : null}
    </section>
  );
}

const SRS_STAGE_LABELS = ["Novo", "Revisão em 1 dia", "Revisão em 3 dias", "Revisão em 7 dias", "Revisão em 14 dias", "Dominado"];

function srsNextReviewLabel(nextReviewAt: Date | undefined, mastered: boolean): string {
  if (mastered) return "Dominado · revise quando quiser";
  if (!nextReviewAt) return "Novo · comece a revisão";
  const days = Math.ceil((nextReviewAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  if (days <= 0) return "Revisão devida hoje";
  return `Próxima revisão em ${days} ${days === 1 ? "dia" : "dias"}`;
}

/** Baralho de flashcards interativo com repetição espaçada (SRS). */
function FlashcardDeck(props: {
  favoriteTermIds: Set<string>;
  flipped: boolean;
  setFlipped: (next: boolean | ((prev: boolean) => boolean)) => void;
  index: number;
  setIndex: (next: number) => void;
  onRemove: (termId: string) => void;
  srsStateMap: Map<string, { stage: number; nextReviewAt: Date; reviewCount: number; mastered: boolean }>;
  recordSrsReview: { mutateAsync: (input: { termId: string; remembered: boolean }) => Promise<{ stage: number; mastered: boolean; xp: number; intervalDays: number }>; isPending: boolean };
  onXpToast: (xp: number, mastered: boolean) => void;
  onReload: () => void;
  onStartDrill: () => void;
  dueTermCount: number;
  onExitDrill: () => void;
  drillMode: boolean;
  drillStep: number;
  setDrillStep: (next: number) => void;
  drillPicks: Record<string, number>;
  setDrillPicks: (next: Record<string, number> | ((current: Record<string, number>) => Record<string, number>)) => void;
  drillQuestions: { termId: string; term: string; phonetic: string; options: string[]; correctAnswer: number }[];
  drillQuestionsLoading: boolean;
  drillSubmitting: boolean;
  onFinishDrill: () => void;
  drillResult: DrillResult | null;
  setDrillResult: (next: DrillResult | null) => void;
}) {
  const {
    favoriteTermIds, flipped, setFlipped, index, setIndex, onRemove, srsStateMap, recordSrsReview, onXpToast, onReload,
    onStartDrill, dueTermCount, onExitDrill, drillMode, drillStep, setDrillStep, drillPicks, setDrillPicks,
    drillQuestions, drillQuestionsLoading, drillSubmitting, onFinishDrill, drillResult, setDrillResult,
  } = props;
  const orderTerms = (terms: readonly (typeof englishVocabulary)[number][]) => {
    const due = terms.filter((term) => {
      const state = srsStateMap.get(term.id);
      if (!state) return false;
      return new Date(state.nextReviewAt).getTime() <= Date.now();
    });
    const newCards = terms.filter((term) => !srsStateMap.has(term.id));
    const future = terms.filter((term) => {
      const state = srsStateMap.get(term.id);
      if (!state) return false;
      return new Date(state.nextReviewAt).getTime() > Date.now();
    });
    return [...due, ...newCards, ...future];
  };
  const cards = useMemo(() => orderTerms(englishVocabulary.filter((term) => favoriteTermIds.has(term.id))), [favoriteTermIds, srsStateMap]);
  const currentCard = cards[index];
  if (drillMode) return <DrillQuiz drillResult={drillResult} setDrillResult={setDrillResult} onExit={onExitDrill} onStart={onStartDrill} questions={drillQuestions} loading={drillQuestionsLoading} submitting={drillSubmitting} step={drillStep} setStep={setDrillStep} picks={drillPicks} setPicks={setDrillPicks} onFinish={onFinishDrill} dueTermCount={dueTermCount} />;
  if (!currentCard) return null;
  const srsState = srsStateMap.get(currentCard.id);
  const stage = srsState?.stage ?? 0;
  const isLastCard = index >= cards.length - 1;
  const mastered = Boolean(srsState?.mastered);
  const handleSrsReview = async (remembered: boolean) => {
    try {
      const result = await recordSrsReview.mutateAsync({ termId: currentCard.id, remembered });
      onXpToast(result.xp, result.mastered);
      await onReload();
      if (!remembered) {
        if (isLastCard && index > 0) setIndex(index - 1);
      } else if (!isLastCard) {
        setIndex(index + 1);
      }
    } catch {
      toast.error("Não foi possível registrar a revisão. Tente novamente.");
    }
  };
  return <div className="mt-5 flex flex-col items-center">
    <div className="flex flex-wrap items-center justify-center gap-2">
      <p className="text-xs font-bold tracking-[0.12em] text-neon-amber">CARTA {index + 1} DE {cards.length}</p>
      <button type="button" onClick={onStartDrill} disabled={dueTermCount === 0} className="inline-flex items-center gap-1.5 rounded-full border border-neon-amber/45 bg-neon-amber/10 px-3 py-1 text-[0.68rem] font-bold text-neon-amber hover:bg-neon-amber/20 disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-black/15 disabled:text-muted-foreground" aria-label="Iniciar o simulado de reforço"><Crosshair className="h-3.5 w-3.5" />Simulado de reforço{dueTermCount > 0 ? ` · ${dueTermCount}` : " · nada devido agora"}</button>
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold ${stage >= 5 ? "border-neon-green/45 bg-neon-green/10 text-neon-green" : "border-neon-purple/35 bg-neon-purple/10 text-neon-purple"}`}>Fase {stage}/5 · {SRS_STAGE_LABELS[stage]}</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground"><RotateCcw className="h-3 w-3" />{srsNextReviewLabel(srsState ? new Date(srsState.nextReviewAt) : undefined, mastered)}</span>
    </div>
    <button type="button" onClick={() => setFlipped((current) => !current)} className="mt-3 h-52 w-full max-w-md rounded-2xl border border-neon-amber/30 bg-gradient-to-br from-black/30 to-neon-amber/[0.06] p-6 text-left shadow-[0_0_40px_-15px,oklch(0.72_0.13_75/0.3)] transition-all hover:border-neon-amber/45" aria-label={flipped ? "Virar para ver o termo" : "Virar para ver o significado"}>
      {flipped ? <div className="flex h-full flex-col justify-between"><div><p className="text-xs font-bold tracking-[0.12em] text-neon-cyan">SIGNIFICADO · FONÉTICA · EXEMPLO</p><p className="mt-2 text-lg font-bold leading-7 text-foreground/90">{currentCard.meaning}</p><p className="mt-2 text-sm font-mono text-neon-cyan">{currentCard.phonetic}</p><p className="mt-3 text-xs italic leading-6 text-muted-foreground">“{currentCard.exampleEn}” — {currentCard.examplePt}</p></div><p className="text-[0.62rem] font-bold tracking-[0.1em] text-muted-foreground">Toque para voltar ao termo</p></div> : <div className="flex h-full flex-col items-start justify-center"><p className="text-xs font-bold tracking-[0.12em] text-neon-amber">TERMO EM INGLÊS</p><p className="mt-2 font-orbitron text-2xl font-bold capitalize text-foreground">{currentCard.term}</p><p className="mt-1 text-xs font-mono text-neon-cyan">{currentCard.phonetic}</p><p className="mt-4 text-[0.62rem] font-bold tracking-[0.1em] text-muted-foreground">Toque para ver o significado</p></div>}
    </button>
    {flipped ? <div className="mt-4 flex w-full max-w-md gap-3">
      <button type="button" onClick={() => void handleSrsReview(false)} disabled={recordSrsReview.isPending} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-neon-red/45 bg-neon-red/[0.08] px-3 py-3 text-xs font-bold text-red-200 hover:bg-neon-red/20 disabled:opacity-50" aria-label="Não lembrei: adiar a fase"><X className="h-3.5 w-3.5" />Não lembrei</button>
      <button type="button" onClick={() => void handleSrsReview(true)} disabled={recordSrsReview.isPending} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-neon-green/45 bg-neon-green/10 px-3 py-3 text-xs font-bold text-neon-green hover:bg-neon-green/20 disabled:opacity-50" aria-label="Lembrei: avançar na fase">Lembrei! ✓</button>
    </div> : null}
    <div className={`mt-4 flex w-full max-w-md items-center justify-between gap-3 ${flipped ? "border-t border-white/8 pt-3" : ""}`}>
      <button type="button" onClick={() => { setFlipped(false); onRemove(currentCard.id); if (isLastCard && index > 0) setIndex(index - 1); }} className="inline-flex items-center gap-1.5 rounded-lg border border-neon-amber/40 bg-neon-amber/10 px-4 py-2.5 text-xs font-bold text-neon-amber hover:bg-neon-amber/20"><Star className="h-3.5 w-3.5 fill-current" />Remover</button>
      <div className="flex items-center gap-2">{index > 0 ? <button type="button" onClick={() => { setFlipped(false); setIndex(index - 1); }} className="orbit-button inline-flex items-center gap-1 rounded-lg border border-white/12 bg-black/15 px-3 py-2.5 text-xs font-bold text-foreground hover:border-white/20" aria-label="Carta anterior"><ChevronLeft className="h-4 w-4" />Anterior</button> : <span />}<span className="text-[0.68rem] font-bold text-muted-foreground">{index + 1}/{cards.length}</span>{isLastCard ? <button type="button" onClick={() => { setFlipped(false); setIndex(0); }} className="orbit-button inline-flex items-center gap-1 rounded-lg border border-neon-green/40 bg-neon-green/10 px-3 py-2.5 text-xs font-bold text-neon-green hover:bg-neon-green/20" aria-label="Reiniciar baralho"><RotateCcw className="h-3.5 w-3.5" />Recomeçar</button> : <button type="button" onClick={() => { setFlipped(false); setIndex(index + 1); }} className="orbit-button inline-flex items-center gap-1 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-2.5 text-xs font-bold text-neon-cyan hover:bg-neon-cyan/20" aria-label="Próxima carta">Próxima<ChevronRight className="h-4 w-4" /></button>}</div>
    </div>
  </div>;
}


/** Mini-simulado de reforço: questões de múltipla escolha para os termos esquecidos do SRS. */
function DrillQuiz(props: {
  drillResult: DrillResult | null;
  setDrillResult: (next: DrillResult | null) => void;
  onExit: () => void;
  onStart: () => void;
  questions: { termId: string; term: string; phonetic: string; options: string[]; correctAnswer: number }[];
  loading: boolean;
  submitting: boolean;
  step: number;
  setStep: (next: number) => void;
  picks: Record<string, number>;
  setPicks: (next: Record<string, number> | ((current: Record<string, number>) => Record<string, number>)) => void;
  onFinish: () => void;
  dueTermCount: number;
}) {
  const { drillResult, setDrillResult, onExit, onStart, questions, loading, submitting, step, setStep, picks, setPicks, onFinish, dueTermCount } = props;

  if (questions.length === 0 && !loading) {
    return <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-6 text-center"><Crosshair className="mx-auto h-6 w-6 text-neon-amber" /><p className="mt-3 text-sm font-bold text-foreground">Nada devido agora</p><p className="mt-2 max-w-sm mx-auto text-sm leading-6 text-muted-foreground">Você revisou todos os termos atrasados! Faça o baralho completo ou volte mais tarde para um novo simulado.</p><button type="button" onClick={onExit} className="mt-4 orbit-button inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/15 px-4 py-2.5 text-xs font-bold text-foreground hover:border-white/20"><ChevronLeft className="h-3.5 w-3.5" />Voltar ao baralho</button></div>;
  }

  const currentQuestion = questions[step];

  if (loading) {
    return <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-6"><div className="h-10 w-48 mx-auto animate-pulse rounded-lg bg-white/8" /><p className="mt-3 text-center text-xs font-bold tracking-[0.12em] text-neon-amber">CARREGANDO O SIMULADO…</p></div>;
  }

  if (!currentQuestion) return null;
  const pickedIndex = picks[currentQuestion.termId];
  const isLastQuestion = step >= questions.length - 1;

  if (drillResult) {
    const { entries, totalCorrect, totalXp, bonusXpPerCorrect } = drillResult;
    const isPerfect = entries.length > 0 && totalCorrect === entries.length;
    useEffect(() => {
      if (!isPerfect) return;
      let cancelled = false;
      const burst = () => {
        void confetti({ particleCount: 110, spread: 80, origin: { y: 0.55 }, colors: ["#22d3ee", "#34d399", "#fbbf24", "#a78bfa", "#f87171"] });
      };
      burst();
      const second = setTimeout(() => {
        if (!cancelled) burst();
      }, 450);
      return () => {
        cancelled = true;
        clearTimeout(second);
      };
    }, [isPerfect]);
    return <div className={`mt-5 rounded-2xl border p-6 text-center ${isPerfect ? "border-neon-amber/40 bg-neon-amber/[0.06]" : "border-neon-green/30 bg-neon-green/[0.05]"}`}>{isPerfect ? <Sparkles className="mx-auto h-9 w-9 text-neon-amber" /> : <Trophy className="mx-auto h-8 w-8 text-neon-green" />}{isPerfect ? <p className="mt-3 text-xs font-bold tracking-[0.14em] text-neon-amber">PERFEITO · SIMULADO DE REFORÇO CONCLUÍDO</p> : <p className="mt-3 text-xs font-bold tracking-[0.14em] text-neon-green">SIMULADO DE REFORÇO CONCLUÍDO</p>}{isPerfect ? <p className="mt-2 font-orbitron text-4xl font-bold text-neon-amber">{totalCorrect}/{entries.length}</p> : <p className="mt-2 font-orbitron text-3xl font-bold text-foreground">{totalCorrect}/{entries.length}</p>}<p className="mt-1 text-sm text-muted-foreground">{isPerfect ? "todos os termos esquecidos dominados neste agrupamento" : "termos acertados no agrupamento de esquecidos"}</p>{totalXp > 0 ? <p className={`mt-2 text-sm font-bold ${isPerfect ? "text-neon-amber" : "text-neon-green"}`}>{isPerfect ? `+${totalXp} XP de bônus · pontuação perfeita registrada no ranking semanal · +${bonusXpPerCorrect} XP por acerto` : `+${totalXp} XP de bônus registrados no ranking semanal · +${bonusXpPerCorrect} XP por acerto`}</p> : null}<ol className="mt-4 space-y-1.5 text-left">{entries.map((entry) => {
      const term = englishVocabulary.find((current) => current.id === entry.termId);
      return <li key={entry.termId} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${entry.correct ? "border-neon-green/40 bg-neon-green/[0.08] text-neon-green" : "border-neon-red/40 bg-neon-red/[0.07] text-red-200"}`}>{entry.correct ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}{term ? <><span className="capitalize">{term.term}</span><span className="font-normal text-muted-foreground">· {term.meaning}</span></> : <span>{entry.termId}</span>}</li>;
    })}</ol><div className="mt-4 flex flex-wrap items-center justify-center gap-2"><button type="button" onClick={onStart} className="orbit-button inline-flex items-center gap-1.5 rounded-lg border border-neon-amber/40 bg-neon-amber/10 px-4 py-2.5 text-xs font-bold text-neon-amber hover:bg-neon-amber/20"><RotateCcw className="h-3.5 w-3.5" />Novo simulado</button><button type="button" onClick={onExit} className="orbit-button inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/15 px-4 py-2.5 text-xs font-bold text-foreground hover:border-white/20"><ChevronLeft className="h-3.5 w-3.5" />Voltar ao baralho</button></div></div>;
  }

  const answeredCount = Object.keys(picks).length;
  const totalQuestions = questions.length;
  const remainingCount = Math.max(0, totalQuestions - answeredCount);
  const liveCorrect = questions.filter((question) => typeof picks[question.termId] === "number" && picks[question.termId] === question.correctAnswer).length;
  const liveXp = liveCorrect * 15;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const allPicked = questions.every((question) => typeof picks[question.termId] === "number");
  return <div className="mt-5 rounded-2xl border border-neon-amber/25 bg-black/15 p-6">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs font-bold tracking-[0.14em] text-neon-amber">SIMULADO DE REFORÇO · TERMOS ESQUECIDOS</p>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-green/40 bg-neon-green/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-neon-green">+15 XP bônus por acerto</span>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
      <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-2.5"><p className="text-xs font-bold text-muted-foreground">RESTANTES</p><p className="mt-0.5 font-orbitron text-lg font-bold text-foreground">{remainingCount}/{totalQuestions}</p></div>
      <div className="rounded-xl border border-neon-green/30 bg-neon-green/[0.06] px-2 py-2.5"><p className="text-xs font-bold text-neon-green">ACERTOS</p><p className="mt-0.5 font-orbitron text-lg font-bold text-neon-green">{liveCorrect}</p></div>
      <div className="rounded-xl border border-neon-amber/30 bg-neon-amber/[0.06] px-2 py-2.5"><p className="text-xs font-bold text-neon-amber">XP ATUAL</p><p className="mt-0.5 font-orbitron text-lg font-bold text-neon-amber">{liveXp}</p></div>
    </div>
    <div className="mt-3 flex items-center gap-3"><div className="h-2.5 flex-1 rounded-full bg-white/8 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-neon-amber to-neon-green transition-all duration-500" style={{ width: `${progressPercent}%` }} /></div><span className="text-[0.68rem] font-bold text-muted-foreground">{answeredCount}/{totalQuestions} · {progressPercent}%</span></div>
    <p className="mt-5 text-center text-[0.62rem] font-bold tracking-[0.1em] text-muted-foreground">O QUE SIGNIFICA</p>
    <p className="mt-1 font-orbitron text-center text-2xl font-bold capitalize text-foreground">{currentQuestion.term}</p>
    <p className="mt-1 text-center text-sm font-mono text-neon-cyan">{currentQuestion.phonetic}</p>
    <div className="mt-4 space-y-2">{currentQuestion.options.map((option, optionIndex) => {
      const picked = pickedIndex === optionIndex;
      return <button key={optionIndex} type="button" onClick={() => setPicks((current) => ({ ...current, [currentQuestion.termId]: optionIndex }))} className={`w-full rounded-xl border px-4 py-3 text-left text-sm leading-6 transition-all active:scale-[0.98] ${picked ? "border-neon-amber/55 bg-neon-amber/15 font-bold text-neon-amber" : "border-white/12 bg-black/20 text-foreground/85 hover:border-neon-cyan/40 hover:bg-neon-cyan/[0.07]"}`} aria-pressed={picked}>{option}</button>;
    })}</div>
    <div className="mt-4 flex items-center justify-between gap-2">
      <button type="button" onClick={() => setDrillResult(null)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/15 px-3 py-2.5 text-xs font-bold text-muted-foreground hover:border-white/20 hover:text-foreground"><X className="h-3.5 w-3.5" />Cancelar</button>
      <div className="flex items-center gap-2">{step > 0 ? <button type="button" onClick={() => setStep(step - 1)} className="orbit-button inline-flex items-center gap-1 rounded-lg border border-white/12 bg-black/15 px-3 py-2.5 text-xs font-bold text-foreground hover:border-white/20" aria-label="Questão anterior"><ChevronLeft className="h-4 w-4" />Anterior</button> : <span />}{!isLastQuestion ? <button type="button" onClick={() => setStep(step + 1)} disabled={typeof pickedIndex !== "number"} className="orbit-button inline-flex items-center gap-1 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-2.5 text-xs font-bold text-neon-cyan hover:bg-neon-cyan/20 disabled:opacity-50">Próxima<ChevronRight className="h-4 w-4" /></button> : <button type="button" onClick={onFinish} disabled={submitting || !allPicked} className="orbit-button inline-flex items-center gap-1 rounded-lg border border-neon-green/45 bg-neon-green/10 px-4 py-2.5 text-xs font-bold text-neon-green hover:bg-neon-green/20 disabled:opacity-50"><Crosshair className="h-3.5 w-3.5" />{submitting ? "Enviando…" : "Enviar respostas"}</button>}</div>
    </div>
  </div>;
}    
