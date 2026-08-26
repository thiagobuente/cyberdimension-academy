// Lista de episódios do CyberCast exibida no painel lateral da página /podcast.
// Componente extraído para manter a página principal legível e compatível com o
// parser JSX (o JSX inline de linhas com milhares de caracteres falhava na
// compilação). Reproduce fielmente o bloco original.
import { Fragment } from "react";
import {
  ArrowDownToLine,
  CheckCircle2,
  ChevronDown,
  Crosshair,
  Globe,
  Languages,
  Star,
  Zap,
} from "lucide-react";
import type { PodcastEpisode } from "@shared/podcastEpisodes";
import { CyberCastAllSection } from "@/pages/PodcastAllView";

function formatDurationText(
  duration: string,
  completed: boolean,
  positionSeconds: number | undefined | null,
  formatTime: (seconds: number) => string,
): string {
  if (completed) return `${duration} · Concluído`;
  if (positionSeconds) return `${duration} · Retomar em ${formatTime(positionSeconds)}`;
  return `${duration} · Ouvir agora`;
}

function CybercastEpisodeCard({
  episode,
  episodeProgress,
  episodeFavorite,
  selected,
  accentCyan,
  onOpen,
  onDownload,
  onFavorite,
  formatTime,
}: {
  episode: PodcastEpisode;
  episodeProgress: { completed: boolean; positionSeconds: number | null } | undefined;
  episodeFavorite: boolean;
  selected: boolean;
  accentCyan: boolean;
  onOpen: (episode: PodcastEpisode) => void;
  onDownload: (episode: PodcastEpisode) => void;
  onFavorite: (episodeId: string) => void;
  formatTime: (seconds: number) => string;
}) {
  return (
    <button
      type="button"
      key={episode.id}
      onClick={() => onOpen(episode)}
      className={`w-full rounded-xl border p-3 text-left transition-colors ${
        selected
          ? "border-neon-cyan/45 bg-neon-cyan/[0.09]"
          : "border-white/8 bg-black/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[0.68rem] font-bold ${
            accentCyan
              ? "border-neon-cyan/45 bg-neon-cyan/10 text-neon-cyan"
              : episodeProgress?.completed
                ? "border-neon-green/45 bg-neon-green/10 text-neon-green"
                : "border-neon-purple/35 bg-neon-purple/10 text-neon-purple"
          }`}
        >
          {accentCyan ? (
            <Languages className="h-4 w-4" />
          ) : episodeProgress?.completed ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            String(episode.episodeNumber).padStart(2, "0")
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.63rem] font-bold tracking-[0.12em] text-neon-cyan">
            {episode.domainCode} · {episode.examWeight}
          </p>
          <h3 className="mt-1 font-orbitron text-xs font-bold leading-5 text-foreground">
            {episode.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDurationText(
              episode.duration,
              Boolean(episodeProgress?.completed),
              episodeProgress?.positionSeconds,
              formatTime,
            )}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Baixar o episódio ${episode.episodeNumber}`}
          onClick={(event) => {
            event.stopPropagation();
            if (episode.audioUrl) void onDownload(episode);
          }}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/[0.08] text-neon-cyan transition-colors hover:bg-neon-cyan/20"
        >
          <ArrowDownToLine className="h-3.5 w-3.5" />
        </button>
        <span
          role="button"
          tabIndex={0}
          aria-label={
            episodeFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          onClick={(event) => {
            event.stopPropagation();
            onFavorite(episode.id);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onFavorite(episode.id);
            }
          }}
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors ${
            episodeFavorite
              ? "border-neon-amber/50 bg-neon-amber/15 text-neon-amber"
              : "border-white/10 text-muted-foreground hover:border-neon-amber/40 hover:text-neon-amber"
          }`}
        >
          {episodeFavorite ? (
            <Star className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Star className="h-3.5 w-3.5" />
          )}
        </span>
      </div>
    </button>
  );
}

export function CybercastEpisodeList({
  visibleEpisodes,
  searchedEpisodes,
  progressByEpisode,
  favoriteEpisodeIds,
  onOpen,
  onDownload,
  onFavorite,
  searchQuery,
  showAll,
  onToggleShowAll,
  hideSecuritySection,
  selectedEpisodeId,
  formatTime,
  episodeXp,
  isAuthenticated,
  isEnglish,
  isBonus,
  isRaiox,
  completedEnglish,
  englishEpisodeCount,
  securityPlusEpisodeCount,
  allSectionProps,
}: {
  visibleEpisodes: readonly PodcastEpisode[];
  searchedEpisodes: readonly PodcastEpisode[];
  progressByEpisode: Map<string, { completed: boolean; positionSeconds: number | null }>;
  favoriteEpisodeIds: Set<string>;
  onOpen: (episode: PodcastEpisode) => void;
  onDownload: (episode: PodcastEpisode) => void;
  onFavorite: (episodeId: string) => void;
  searchQuery: string;
  showAll: boolean;
  onToggleShowAll: () => void;
  hideSecuritySection: boolean;
  selectedEpisodeId: string;
  formatTime: (seconds: number) => string;
  episodeXp: number;
  isAuthenticated: boolean;
  isEnglish: (episode: PodcastEpisode | undefined | null) => boolean;
  isBonus: (episode: PodcastEpisode | undefined | null) => boolean;
  isRaiox: (episode: PodcastEpisode | undefined | null) => boolean;
  completedEnglish: number;
  englishEpisodeCount: number;
  securityPlusEpisodeCount: number;
  allSectionProps: {
    englishEpisodes: readonly PodcastEpisode[];
    securityEpisodes: readonly PodcastEpisode[];
    completedEnglish: number;
    englishEpisodeCount: number;
    securityPlusEpisodeCount: number;
  };
}) {
  const englishEpisodes = visibleEpisodes.filter((episode) => isEnglish(episode));
  const completedCount = englishEpisodes.filter(
    (episode) => progressByEpisode.get(episode.id)?.completed,
  ).length;
  const englishPercent = Math.round((completedCount / Math.max(englishEpisodes.length, 1)) * 100);
  const listEpisodes = (accentCyan: boolean) => {
    const base = searchQuery.trim()
      ? searchedEpisodes.filter((episode) => isEnglish(episode) === accentCyan)
      : showAll
        ? visibleEpisodes.filter((episode) => isEnglish(episode) === accentCyan)
        : visibleEpisodes
            .filter((episode) => isEnglish(episode) === accentCyan)
            .slice(0, 24);
    return base.map((episode) => {
      const episodeProgress = progressByEpisode.get(episode.id);
      const episodeFavorite = favoriteEpisodeIds.has(episode.id);
      const selected = episode.id === selectedEpisodeId;
      return (
        <CybercastEpisodeCard
          key={episode.id}
          episode={episode}
          episodeProgress={episodeProgress}
          episodeFavorite={episodeFavorite}
          selected={selected}
          accentCyan={accentCyan}
          onOpen={onOpen}
          onDownload={onDownload}
          onFavorite={onFavorite}
          formatTime={formatTime}
        />
      );
    });
  };
  return (
    <div>
      <div className="mt-2 rounded-xl border border-neon-cyan/20 bg-black/15 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[0.68rem] font-bold tracking-[0.1em] text-muted-foreground">
            Progresso da trilha
          </span>
          <span className="font-orbitron text-sm font-bold text-neon-cyan">
            {englishPercent}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-300"
            style={{ width: `${englishPercent}%` }}
          />
        </div>
        <p className="mt-2 text-[0.68rem] leading-5 text-muted-foreground">
          {isAuthenticated
            ? `${completedCount} de ${englishEpisodes.length} episódios concluídos · ${completedCount * episodeXp} XP`
            : "Entre com seu e-mail para salvar o progresso."}
        </p>
      </div>
      <div className="mt-3 space-y-2">{listEpisodes(true)}</div>
      {!searchQuery.trim() && visibleEpisodes.length > 24 ? (
        <div className="mt-3 flex justify-center border-t border-white/8 pt-4">
          <button
            type="button"
            onClick={onToggleShowAll}
            className="inline-flex items-center gap-1.5 rounded-full border border-neon-purple/40 bg-neon-purple/10 px-4 py-2 text-[0.68rem] font-bold tracking-[0.12em] text-neon-purple transition-colors hover:bg-neon-purple/20"
          >
            <ChevronDown
              className="h-3.5 w-3.5 transition-transform duration-200"
              style={{ transform: showAll ? "rotate(180deg)" : "none" }}
            />
            {showAll ? "VER MENOS" : "VER TODOS OS EPISÓDIOS"}
          </button>
        </div>
      ) : null}

    </div>
  );
}
