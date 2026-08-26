// Seção do hub unificado do CyberCast: as 9 séries que combinam o CyberCast
// (Security+ em Áudio e Technical English) e o CyberDimension Podcast (7 séries
// técnicas) em um único catálogo, com cards de episódio compartilhando o
// mesmo visual e o player comum do CyberCast.
import {
  CheckCircle2,
  ChevronDown,
  Languages,
  Star,
  ArrowDownToLine,
  ArrowUp,
} from "lucide-react";
import type { AudioLabEpisode } from "@shared/audioLabEpisodes";
import type { PodcastEpisode } from "@shared/podcastEpisodes";
import {
  CYBERCAST_HUB_SERIES,
  cybercastEpisodeSeriesKey,
  cdpEpisodeSeriesKey,
  hubSeriesByKey,
} from "@/lib/cybercastSeries";
import {
  seriesMeta,
  getAccent,
  ACCENT_BORDER,
  ACCENT_BG,
  ACCENT_TEXT,
} from "@/components/AudioLabEpisodePlayer";
import type { AccentKey } from "@/components/AudioLabEpisodePlayer";

type AccentMap = Record<AccentKey, string>;
const accentBorder = ACCENT_BORDER as AccentMap;
const accentBg = ACCENT_BG as AccentMap;
const accentText = ACCENT_TEXT as AccentMap;

export type HubEpisode =
  | { source: "cybercast"; episode: PodcastEpisode }
  | { source: "cdp"; episode: AudioLabEpisode };

export const hubEpisodeSeriesKey = (item: HubEpisode): string =>
  item.source === "cybercast"
    ? cybercastEpisodeSeriesKey(item.episode)
    : cdpEpisodeSeriesKey(item.episode);

export const hubEpisodeId = (item: HubEpisode): string => item.episode?.id ?? "";

export const hubEpisodeTitle = (item: HubEpisode): string => item.episode?.title ?? "";

export const hubEpisodeDuration = (item: HubEpisode): string => item.episode?.duration ?? "";

export const hubEpisodeAudioUrl = (item: HubEpisode): string | undefined =>
  item.source === "cybercast"
    ? item.episode?.audioUrl
    : item.episode?.audioUrl?.replace(/^\/manus-storage\//, "/podcast-audio/");

export const hubEpisodeNumber = (item: HubEpisode): number =>
  item.source === "cybercast" ? (item.episode?.episodeNumber ?? 0) : (item.episode?.episodeNumber ?? 0);

export const hubEpisodeDescription = (item: HubEpisode): string =>
  item.source === "cybercast" ? (item.episode?.description ?? "") : (item.episode?.description ?? "");

export const hubEpisodeSeriesCode = (item: HubEpisode): string =>
  item.source === "cybercast"
    ? (item.episode?.series ?? "securityplus")
    : (item.episode?.series ?? "");

export const hubEpisodeDomainCode = (item: HubEpisode): string =>
  item.source === "cybercast" ? (item.episode?.domainCode ?? "") : (item.episode?.series ?? "");

export const hubEpisodeExamWeight = (item: HubEpisode): string =>
  item.source === "cybercast" ? (item.episode?.examWeight ?? "") : "";

export const hubEpisodeTopics = (item: HubEpisode): readonly string[] =>
  item.source === "cybercast" ? (item.episode?.topics ?? []) : (item.episode?.topics ?? []);

export const hubEpisodeTranscript = (item: HubEpisode) =>
  item.source === "cybercast" ? (item.episode?.transcript ?? []) : (item.episode?.transcript ?? []);

export const hubEpisodeQuizId = (item: HubEpisode): string | undefined =>
  item.source === "cdp" ? item.episode.quizId : undefined;

/** Número sequencial do episódio dentro da série (CDP: extraído do id "audio-xxx09-..."). */
const cdpNumberFromId = (id: string): number => {
  const match = id.match(/(\d+)(?=-)/);
  return match ? Number(match[1]) : 0;
};

export function HubSeriesEpisodeCard({
  item,
  completed,
  positionSeconds,
  favorite,
  onOpen,
  onFavorite,
}: {
  item: HubEpisode;
  completed: boolean;
  positionSeconds: number | null;
  favorite: boolean;
  onOpen: (item: HubEpisode) => void;
  onFavorite: (episodeId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`w-full rounded-xl border p-3 text-left transition-colors ${
        completed
          ? "border-neon-green/40 bg-neon-green/[0.06]"
          : favorite
            ? "border-neon-amber/35 bg-neon-amber/[0.06] hover:border-neon-amber/50"
            : "border-white/8 bg-black/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[0.68rem] font-bold ${
            completed
              ? "border-neon-green/45 bg-neon-green/10 text-neon-green"
              : "border-neon-purple/35 bg-neon-purple/10 text-neon-purple"
          }`}
        >
          {completed ? <CheckCircle2 className="h-4 w-4" /> : String(hubEpisodeNumber(item)).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-orbitron text-xs font-bold leading-5 text-foreground">
            {item.episode.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {item.episode.duration} ·{" "}
            {completed
              ? "Concluído"
              : positionSeconds
                ? `Retomar em ${Math.round(positionSeconds / 60)} min`
                : "Ouvir agora"}
          </p>
        </div>
        <span
          role="button"
          tabIndex={0}
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          onClick={(event) => {
            event.stopPropagation();
            onFavorite(item.episode.id);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onFavorite(item.episode.id);
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

export function CybercastHubSection({
  allItems,
  searchQuery,
  hubFilterActive,
  onHubFilter,
  progressByEpisode,
  favoriteEpisodeIds,
  toggleFavorite,
  onOpen,
  showAll,
  onShowAll,
  cdpProgressByEpisode,
  cdpFavoriteIds,
  toggleCdpFavorite,
  onSelectCdp,
}: {
  allItems: HubEpisode[];
  searchQuery: string;
  hubFilterActive: string | null;
  onHubFilter: (key: string | null) => void;
  progressByEpisode: Map<string, { completed: boolean; positionSeconds: number | null }>;
  favoriteEpisodeIds: Set<string>;
  toggleFavorite: (episodeId: string) => void;
  onOpen: (item: HubEpisode) => void;
  showAll: boolean;
  onShowAll: () => void;
  cdpProgressByEpisode: Map<string, { completed: boolean; positionSeconds: number | null }>;
  cdpFavoriteIds: Set<string>;
  toggleCdpFavorite: (episodeId: string) => void;
  onSelectCdp: (episodeId: string) => void;
}) {
  const normalizedQuery = searchQuery.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
  const searchTerms = normalizedQuery ? normalizedQuery.split(/\\s+/).filter(Boolean) : [];
  const searchableItems = allItems.filter((item) => {
    if (searchTerms.length === 0) return true;
    const series = hubSeriesByKey(hubEpisodeSeriesKey(item));
    const text = [item.episode.title, item.episode.description, item.episode.series, hubEpisodeDomainCode(item), hubEpisodeTopics(item).join(" "), series?.label, series?.shortLabel].filter(Boolean).join(" ").normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLocaleLowerCase("pt-BR");
    return searchTerms.every((term) => text.includes(term));
  });
  const itemsBySeries = new Map<string, HubEpisode[]>();
  for (const item of searchableItems) {
    const key = hubEpisodeSeriesKey(item);
    const list = itemsBySeries.get(key) ?? [];
    list.push(item);
    itemsBySeries.set(key, list);
  }
  const filteredKeys = hubFilterActive
    ? CYBERCAST_HUB_SERIES.filter((series) => series.key === hubFilterActive).map((series) => series.key)
    : CYBERCAST_HUB_SERIES.map((series) => series.key);
  const INITIAL_PER_SERIES = 10;
  // Continuar Ouvindo: episódios parcialmente ouvidos (não concluídos), ordenados
  // do mais recentemente atualizado para o mais antigo.
  const continueWatching: HubEpisode[] = [];
  const seenIds = new Set<string>();
  for (const item of searchableItems) {
    const id = item.episode.id;
    if (seenIds.has(id)) continue;
    const progress =
      item.source === "cybercast"
        ? progressByEpisode.get(id)
        : cdpProgressByEpisode.get(id);
    if (progress && !progress.completed && progress.positionSeconds && progress.positionSeconds > 0) {
      seenIds.add(id);
      continueWatching.push(item);
    }
  }
  const resumeProgress = (item: HubEpisode) =>
    item.source === "cybercast"
      ? progressByEpisode.get(item.episode.id)
      : cdpProgressByEpisode.get(item.episode.id);
  const formatResume = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    if (h > 0) return `${h} h ${m} min restantes`;
    return `${m} min restantes`;
  };
  return (
    <section aria-label="CyberCast — hub de séries">
      {continueWatching.length > 0 ? (
        <div className="mb-6">
          <p className="mb-3 inline-flex items-center gap-1.5 text-[0.68rem] font-bold tracking-[0.14em] text-neon-green">
            <span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
            CONTINUAR OUVINDO
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {continueWatching.slice(0, 6).map((item) => {
              const progress = resumeProgress(item);
              const series = hubSeriesByKey(hubEpisodeSeriesKey(item));
              const onToggleFavorite =
                item.source === "cybercast" ? toggleFavorite : toggleCdpFavorite;
              const onOpenItem = () => {
                if (item.source === "cdp" && onSelectCdp) onSelectCdp(item.episode.id);
                onOpen(item);
              };
              return (
                <button
                  key={`resume-${item.episode.id}`}
                  type="button"
                  onClick={onOpenItem}
                  className="w-full rounded-xl border border-neon-green/30 bg-neon-green/[0.06] p-3 text-left transition-colors hover:border-neon-green/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.6rem] font-bold tracking-[0.12em] text-neon-cyan">
                        {series?.shortLabel ?? (item.source === "cybercast" ? "CyberCast" : "CyberDimension Podcast")}
                        {item.source === "cdp" && item.episode.episodeNumber ? ` · EP ${String(item.episode.episodeNumber).padStart(2, "0")}` : item.source === "cybercast" ? ` · EP ${String(item.episode.episodeNumber).padStart(2, "0")}` : ""}
                      </p>
                      <h3 className="mt-1 font-orbitron text-xs font-bold leading-5 text-foreground">
                        {item.episode.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatResume(progress!.positionSeconds ?? 0)}
                      </p>
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Favoritar episódio"
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleFavorite(item.episode.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          onToggleFavorite(item.episode.id);
                        }
                      }}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-neon-amber/40 hover:text-neon-amber"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-neon-purple">
          SÉRIES DO HUB
        </span>
        <button
          type="button"
          onClick={() => onHubFilter(null)}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-[0.1em] transition-colors ${
            hubFilterActive === null
              ? "border-neon-purple/45 bg-neon-purple/15 text-neon-purple"
              : "border-white/10 bg-black/10 text-muted-foreground hover:border-white/25 hover:text-foreground"
          }`}
        >
          Todas · {searchQuery.trim() ? `${searchableItems.length}/${allItems.length}` : allItems.length}
        </button>
        {CYBERCAST_HUB_SERIES.map((series) => {
          const count = itemsBySeries.get(series.key)?.length ?? 0;
          const active = hubFilterActive === series.key;
          const Icon = series.icon;
          const ak = getAccent(series.accent);
          return (
            <button
              key={series.key}
              type="button"
              onClick={() => onHubFilter(active ? null : series.key)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-[0.1em] transition-colors ${
                active
                  ? `${accentBorder[ak]} ${accentBg[ak]} ${accentText[ak]}`
                  : "border-white/10 bg-black/10 text-muted-foreground hover:border-white/25 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {series.shortLabel}
              <span className="text-[0.62rem] opacity-75">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 space-y-6">
        {CYBERCAST_HUB_SERIES.filter((series) => filteredKeys.includes(series.key)).map((series) => {
          const items = itemsBySeries.get(series.key) ?? [];
          if (items.length === 0) return null;
          const ak = getAccent(series.accent);
          const visibleItems = showAll ? items : items.slice(0, INITIAL_PER_SERIES);
          const seriesFavorites = items.filter((item) => {
            if (item.source === "cybercast") return favoriteEpisodeIds.has(item.episode.id);
            return cdpFavoriteIds.has(item.episode.id);
          });
          const progressMap = (item: HubEpisode) =>
            item.source === "cybercast"
              ? progressByEpisode.get(item.episode.id)
              : cdpProgressByEpisode.get(item.episode.id);
          return (
            <div id={`cybercast-series-${series.key}`} key={series.key} className="scroll-mt-24">
              <div className={`flex flex-wrap items-center gap-2 border-b ${accentBorder[ak]} pb-3`}>
                <series.icon className={`h-4 w-4 ${accentText[ak]}`} />
                <p className={`text-[0.68rem] font-bold tracking-[0.14em] ${accentText[ak]}`}>
                  {series.label.toUpperCase()}
                </p>
                <span className="text-[0.62rem] font-bold text-muted-foreground">
                  {items.length} episódios · {items.filter((item) => progressMap(item)?.completed).length} concluídos
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
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{series.description}</p>
              {seriesFavorites.length > 0 ? (
                <div className="mt-3">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-[0.62rem] font-bold tracking-[0.12em] text-neon-amber">
                    <Star className="h-3 w-3 fill-current" /> FAVORITOS DA SÉRIE
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {seriesFavorites.map((item) => (
                      <HubSeriesEpisodeCard
                        key={`fav-${hubEpisodeId(item)}`}
                        item={item}
                        completed={Boolean(progressMap(item)?.completed)}
                        positionSeconds={progressMap(item)?.positionSeconds ?? null}
                        favorite
                        onOpen={onOpen}
                        onFavorite={(episodeId) => {
                          if (item.source === "cybercast") toggleFavorite(episodeId);
                          else toggleCdpFavorite(episodeId);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((item) => (
                  <HubSeriesEpisodeCard
                    key={hubEpisodeId(item)}
                    item={item}
                    completed={Boolean(progressMap(item)?.completed)}
                    positionSeconds={progressMap(item)?.positionSeconds ?? null}
                    favorite={
                      item.source === "cybercast"
                        ? favoriteEpisodeIds.has(item.episode.id)
                        : cdpFavoriteIds.has(item.episode.id)
                    }
                    onOpen={onOpen}
                    onFavorite={(episodeId) => {
                      if (item.source === "cybercast") toggleFavorite(episodeId);
                      else toggleCdpFavorite(episodeId);
                    }}
                  />
                ))}
              </div>
              {items.length > INITIAL_PER_SERIES ? (
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={onShowAll}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neon-purple/40 bg-neon-purple/10 px-4 py-2 text-[0.68rem] font-bold tracking-[0.12em] text-neon-purple transition-colors hover:bg-neon-purple/20"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                    {showAll ? "VER MENOS" : `VER TODOS OS ${items.length} EPISÓDIOS`}
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { CYBERCAST_HUB_SERIES, hubSeriesByKey };
