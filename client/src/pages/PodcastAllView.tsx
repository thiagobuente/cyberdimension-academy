import { useState } from "react";
import {
  Zap,
  Crosshair,
  CheckCircle2,
  Languages,
  Globe,
  Star,
  ArrowDownToLine,
  ArrowUp,
} from "lucide-react";
import { toast } from "sonner";
import type { PodcastEpisode } from "@shared/podcastEpisodes";
import { AUDIO_LAB_SERIES } from "@shared/audioLabSeries";
import {
  seriesMeta,
  getAccent,
  ACCENT_BORDER,
  ACCENT_TEXT,
  ACCENT_DOT_BORDER,
  ACCENT_DOT_BG,
} from "@/components/AudioLabEpisodePlayer";
import type { AccentKey } from "@/components/AudioLabEpisodePlayer";

type PodcastProgressRow = { completed: boolean; positionSeconds: number | null };

type AccentMap = Record<AccentKey, string>;
const accentBorder = ACCENT_BORDER as AccentMap;
const accentText = ACCENT_TEXT as AccentMap;
const accentDotBorder = ACCENT_DOT_BORDER as AccentMap;
const accentDotBg = ACCENT_DOT_BG as AccentMap;

export const downloadEpisode = async (episode: PodcastEpisode) => {
  if (!episode.audioUrl) return;
  try {
    const response = await fetch(episode.audioUrl.replace(/^\/manus-storage\//, "/podcast-audio/"));
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
    toast.error(
      error instanceof Error ? error.message : "Não foi possível baixar o áudio. Tente novamente.",
    );
  }
};

function CyberCastEpisodeCard({
  episode,
  progress,
  favorite,
  onOpen,
  onFavorite,
}: {
  episode: PodcastEpisode;
  progress: { completed: boolean; positionSeconds: number | null } | undefined;
  favorite: boolean;
  onOpen: (episode: PodcastEpisode) => void;
  onFavorite: (episodeId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(episode)}
      className={`w-full rounded-xl border p-3 text-left transition-colors ${
        favorite
          ? "border-neon-amber/35 bg-neon-amber/[0.07]"
          : "border-white/8 bg-black/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[0.68rem] font-bold ${
            progress?.completed
              ? "border-neon-green/45 bg-neon-green/10 text-neon-green"
              : "border-neon-purple/35 bg-neon-purple/10 text-neon-purple"
          }`}
        >
          {progress?.completed ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            String(episode.episodeNumber).padStart(2, "0")
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.63rem] font-bold tracking-[0.12em] text-neon-cyan">
            {episode.domainCode} · {episode.examWeight}
            {episode.episodeNumber > 5 ? " · REVISÃO" : ""}
          </p>
          <h3 className="mt-1 font-orbitron text-xs font-bold leading-5 text-foreground">
            {episode.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {episode.duration} ·{" "}
            {progress?.completed
              ? "Concluído"
              : progress?.positionSeconds
                ? `Retomar em ${progress.positionSeconds}s`
                : "Ouvir agora"}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Baixar o episódio ${episode.episodeNumber}`}
          onClick={(event) => {
            event.stopPropagation();
            void downloadEpisode(episode);
          }}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/[0.08] text-neon-cyan transition-colors hover:bg-neon-cyan/20"
        >
          <ArrowDownToLine className="h-3.5 w-3.5" />
        </button>
        <span
          role="button"
          tabIndex={0}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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
            favorite
              ? "border-neon-amber/50 bg-neon-amber/15 text-neon-amber"
              : "border-white/10 text-muted-foreground hover:border-neon-amber/40 hover:text-neon-amber"
          }`}
        >
          {favorite ? (
            <Star className="h-3.5 w-3.5 fill-current" />
          ) : (
            <Star className="h-3.5 w-3.5" />
          )}
        </span>
      </div>
    </button>
  );
}

export function CyberCastAllSection({
  englishEpisodes,
  securityEpisodes,
  progressByEpisode,
  favoriteEpisodeIds,
  onOpen,
  onFavorite,
  completedEnglish,
  englishEpisodeCount,
  securityPlusEpisodeCount,
}: {
  englishEpisodes: readonly PodcastEpisode[];
  securityEpisodes: readonly PodcastEpisode[];
  progressByEpisode: Map<string, PodcastProgressRow>;
  favoriteEpisodeIds: Set<string>;
  onOpen: (episode: PodcastEpisode) => void;
  onFavorite: (episodeId: string) => void;
  completedEnglish: number;
  englishEpisodeCount: number;
  securityPlusEpisodeCount: number;
}) {
  const englishPercent = Math.round(
    (completedEnglish / Math.max(englishEpisodeCount, 1)) * 100,
  );
  return (
    <div className="mt-3 space-y-4">
      <div className="flex items-center gap-2 border-b border-white/8 pb-3">
        <Languages className="h-3.5 w-3.5 text-neon-cyan" />
        <p className="text-[0.68rem] font-bold tracking-[0.14em] text-neon-cyan">
          TRILHA ENGLISH FOR CYBER PROS
        </p>
        <span className="ml-auto text-[0.62rem] font-bold text-muted-foreground">
          {englishEpisodes.length} episódios
        </span>
      </div>
      {englishEpisodeCount > 0 && englishPercent > 0 ? (
        <div className="rounded-xl border border-neon-cyan/20 bg-black/15 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold tracking-[0.1em] text-muted-foreground">
              Progresso da trilha de inglês
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
            {completedEnglish} de {englishEpisodeCount} episódios concluídos ·{" "}
            {completedEnglish * 20} XP
          </p>
        </div>
      ) : null}
      <div className="grid gap-2 md:grid-cols-2">
        {englishEpisodes.map((episode) => (
          <CyberCastEpisodeCard
            key={episode.id}
            episode={episode}
            progress={progressByEpisode.get(episode.id)}
            favorite={favoriteEpisodeIds.has(episode.id)}
            onOpen={onOpen}
            onFavorite={onFavorite}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 border-b border-white/8 pb-3 pt-2">
        <span className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-neon-purple" />
          <p className="text-[0.68rem] font-bold tracking-[0.14em] text-neon-purple">
            SÉRIE PRINCIPAL · SECURITY+ EM 5 DOMÍNIOS
          </p>
        </span>
        <span className="ml-auto text-[0.62rem] font-bold text-muted-foreground">
          {securityEpisodes.length} episódios
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {securityEpisodes.map((episode) => (
          <CyberCastEpisodeCard
            key={episode.id}
            episode={episode}
            progress={progressByEpisode.get(episode.id)}
            favorite={favoriteEpisodeIds.has(episode.id)}
            onOpen={onOpen}
            onFavorite={onFavorite}
          />
        ))}
      </div>
    </div>
  );
}

function CdpEpisodeCard({
  episode,
  completed,
  meta,
  ak,
  onSelect,
  favorite,
  onFavorite,
}: {
  episode: { id: string; title: string; duration: string };
  completed: boolean;
  meta: { short: string; accent: string };
  ak: AccentKey;
  onSelect: (episodeId: string) => void;
  favorite: boolean;
  onFavorite: (episodeId: string) => void;
}) {
  return (
    <button
      key={episode.id}
      type="button"
      onClick={() => onSelect(episode.id)}
      className={`rounded-xl border p-3 text-left transition-colors ${
        completed
          ? "border-neon-green/45 bg-neon-green/10"
          : favorite
            ? `${accentBorder[ak]} bg-neon-amber/[0.05] hover:border-white/25`
            : `${accentDotBorder[ak]} ${accentDotBg[ak]} hover:border-white/25`
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={`text-[0.63rem] font-bold tracking-[0.12em] ${accentText[ak]}`}>
            {meta.short}
          </p>
          <h3 className="mt-1 font-orbitron text-xs font-bold leading-5 text-foreground">
            {episode.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {episode.duration}
            {completed ? " · Concluído" : ""}
          </p>
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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
            favorite
              ? "border-neon-amber/50 bg-neon-amber/15 text-neon-amber"
              : "border-white/10 text-muted-foreground hover:border-neon-amber/40 hover:text-neon-amber"
          }`}
        >
          {favorite ? <Star className="h-3.5 w-3.5 fill-current" /> : <Star className="h-3.5 w-3.5" />}
        </span>
      </div>
    </button>
  );
}

export function CdpAllSeriesSection({
  episodes,
  progress,
  onSelect,
  favoriteEpisodeIds,
  onFavorite,
}: {
  episodes: readonly { id: string; series: string; title: string; duration: string }[];
  progress: Map<string, { completed: boolean; positionSeconds: number | null }>;
  onSelect: (episodeId: string) => void;
  favoriteEpisodeIds?: Set<string>;
  onFavorite?: (episodeId: string) => void;
}) {
  const grouped = new Map<
    string,
    { id: string; series: string; title: string; duration: string }[]
  >();
  for (const episode of episodes) {
    const list = grouped.get(episode.series) ?? [];
    list.push(episode);
    grouped.set(episode.series, list);
  }
  const favoriteEpisodes = favoriteEpisodeIds
    ? episodes.filter((episode) => favoriteEpisodeIds.has(episode.id))
    : [];
  const handleFavorite = (episodeId: string) => {
    if (onFavorite) onFavorite(episodeId);
  };
  return (
    <div className="mt-5 space-y-4">
      {favoriteEpisodes.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 border-b border-neon-amber/40 pb-3">
            <Star className="h-3.5 w-3.5 text-neon-amber" />
            <p className="text-[0.68rem] font-bold tracking-[0.14em] text-neon-amber">
              MEUS FAVORITOS · CYBERDIMENSION PODCAST
            </p>
            <span className="ml-auto text-[0.62rem] font-bold text-muted-foreground">
              {favoriteEpisodes.length} episódios
            </span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteEpisodes.map((episode) => {
              const meta =
                seriesMeta(episode.series) ?? {
                  label: episode.series,
                  short: episode.series.toUpperCase(),
                  accent: "cyan",
                };
              const ak = getAccent(meta.accent);
              const completed = progress.get(episode.id)?.completed;
              return (
                <CdpEpisodeCard
                  key={episode.id}
                  episode={episode}
                  completed={Boolean(completed)}
                  meta={meta}
                  ak={ak}
                  onSelect={onSelect}
                  favorite
                  onFavorite={handleFavorite}
                />
              );
            })}
          </div>
        </div>
      ) : null}
      {Array.from(grouped.entries()).map(([seriesCode, list]) => {
        const meta =
          seriesMeta(seriesCode) ?? {
            label: seriesCode,
            short: seriesCode.toUpperCase(),
            accent: "cyan",
          };
        const ak = getAccent(meta.accent);
        const completedCount = list.filter(
          (episode) => progress.get(episode.id)?.completed,
        ).length;
        return (
          <div key={seriesCode} id={`cdp-series-${seriesCode}`} className="scroll-mt-24">
            <div className={`flex items-center gap-2 border-b ${accentBorder[ak]} pb-3`}>
              <p className={`text-[0.68rem] font-bold tracking-[0.14em] ${accentText[ak]}`}>
                {meta.label.toUpperCase()}
              </p>
              <span className="text-[0.62rem] font-bold text-muted-foreground">
                {list.length} episódios · {completedCount} concluídos
              </span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Voltar aos filtros"
                className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[0.6rem] font-bold tracking-[0.1em] text-muted-foreground transition-colors hover:border-white/25 hover:text-foreground"
              >
                <ArrowUp className="h-3 w-3" /> VOLTAR AOS FILTROS
              </button>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((episode) => {
                const completed = progress.get(episode.id)?.completed;
                const favorite = favoriteEpisodeIds?.has(episode.id) ?? false;
                return (
                  <CdpEpisodeCard
                    key={episode.id}
                    episode={episode}
                    completed={Boolean(completed)}
                    meta={meta}
                    ak={ak}
                    onSelect={onSelect}
                    favorite={favorite}
                    onFavorite={handleFavorite}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      {episodes.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-black/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Nenhum episódio listado.
        </p>
      ) : null}
    </div>
  );
}
