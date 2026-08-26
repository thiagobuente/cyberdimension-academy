import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, ListMusic, Radio, RotateCcw, Volume2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  ACCENT_BORDER,
  ACCENT_BG,
  ACCENT_TEXT,
  ACCENT_SELECTED_BORDER,
  ACCENT_SELECTED_BG,
  ACCENT_DOT_BORDER,
  ACCENT_DOT_BG,
  AudioLabEpisodePlayer,
  getAccent,
  seriesMeta,
} from "@/components/AudioLabEpisodePlayer";

export default function AudioLab() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<string | null>(null);
  const [activeEpisodeId, setActiveEpisodeId] = useState<string>("");

  const seriesQuery = trpc.audiolab.listSeries.useQuery();
  const episodesQuery = trpc.audiolab.episodes.useQuery(filter ? { series: filter } : undefined);
  const progressQuery = trpc.audiolab.getProgress.useQuery(undefined, { enabled: isAuthenticated });

  const series = seriesQuery.data ?? [];
  const progress = progressQuery.data ?? [];
  const completedCount = useMemo(() => progress.filter((entry) => entry.completed).length, [progress]);

  if (episodesQuery.isLoading) {
    return (
      <div className="min-h-screen space-canvas text-foreground">
        <div className="pointer-events-none fixed inset-0 space-grid opacity-40" />
        <main className="container relative grid min-h-screen place-items-center">
          <p className="font-orbitron text-sm tracking-[0.14em] text-neon-cyan">SINTONIZANDO O CYBER PODCAST…</p>
        </main>
      </div>
    );
  }

  const episodes = episodesQuery.data?.episodes ?? [];
  if (episodes.length === 0) {
    return (
      <div className="min-h-screen space-canvas text-foreground">
        <main className="container grid min-h-screen place-items-center">
          <p className="text-muted-foreground">O catálogo do podcast ainda não está disponível.</p>
        </main>
      </div>
    );
  }

  const totalEpisodes = Math.max(episodesQuery.data?.episodes.length ?? 1, 1);
  const completionPercent = Math.round((completedCount / totalEpisodes) * 100);
  const activeEpisode = episodesQuery.data?.episodes.find((episode) => episode.id === activeEpisodeId);

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-45" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.86)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> {isAuthenticated ? "Painel" : "Início"}</Link>
          <span className="font-orbitron text-[0.68rem] font-bold tracking-[0.11em] sm:text-xs">CYBER<span className="text-neon-purple">PODCAST</span> · ACADEMY</span>
          {isAuthenticated ? <span className="hidden text-xs font-bold text-neon-green sm:inline">{completedCount} episódios concluídos</span> : <Link href="/login" className="text-xs font-bold text-neon-cyan hover:underline">Entrar para salvar</Link>}
        </div>
      </header>
      <main className="container relative py-7 md:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-neon-purple/25 bg-[linear-gradient(135deg,oklch(0.13_0.055_295/0.56),oklch(0.08_0.025_260/0.96))] px-6 py-8 md:px-9 md:py-10">
          <div className="absolute -right-14 -top-14 h-60 w-60 rounded-full bg-neon-purple/16 blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.17em] text-neon-cyan"><Radio className="h-4 w-4" /> MICRO-APRENDIZAGEM EM ÁUDIO</p>
              <h1 className="mt-4 max-w-3xl font-orbitron text-3xl font-black leading-[1.08] tracking-[-0.04em] sm:text-4xl md:text-5xl">CyberDimension <span className="text-neon-cyan">Podcast.</span></h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">Ouvir → Responder → Ganhar XP → Aprofundar. Oito séries curtas ligadas às trilhas da academia: cada episódio vira microexperiência de aprendizagem com quiz de revisão, XP e competência registrada no seu Career Readiness.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.13em] text-neon-green">SUA TRILHA DE ESCUTA</span>
                <span className="font-orbitron text-xl font-bold">{completionPercent}%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-green" style={{ width: `${completionPercent}%` }} /></div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{isAuthenticated ? `${completedCount} episódios concluídos · XP registrado no seu progresso` : "Entre com seu e-mail para salvar a retomada e conquistar XP."}</p>
            </div>
          </div>
        </section>
        <section className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
          <button type="button" onClick={() => { setFilter(null); setActiveEpisodeId(""); }} className={`rounded-xl border p-3 text-left transition-colors ${filter === null ? "border-neon-cyan/50 bg-neon-cyan/15" : "border-white/10 bg-white/[0.04] hover:border-white/25"}`}>
            <span className={`text-[0.62rem] font-bold tracking-[0.1em] ${filter === null ? "text-neon-cyan" : "text-muted-foreground"}`}>TODAS</span>
            <p className="mt-1 font-orbitron text-xs font-bold leading-4 text-foreground">Todas as séries</p>
            <p className="mt-1 text-[0.62rem] text-muted-foreground">{episodes.length} episódios</p>
          </button>
          {series.map((seriesItem) => {
            const meta = seriesMeta(seriesItem.code) ?? { label: seriesItem.title, short: seriesItem.shortTitle ?? seriesItem.code.slice(0, 3).toUpperCase(), accent: "cyan" };
            const isActive = filter === seriesItem.code;
            const seriesEpisodes = episodes.filter((episode) => episode.series === seriesItem.code);
            const seriesCount = seriesEpisodes.length;
            const completedSeries = seriesEpisodes.filter((episode) => progressQuery.data?.find((entry) => entry.episodeId === episode.id)?.completed).length;
            return (
              <button type="button" key={seriesItem.code} onClick={() => { setFilter(isActive ? null : seriesItem.code); setActiveEpisodeId(""); }} className={`rounded-xl border p-3 text-left transition-colors ${isActive ? `${ACCENT_BORDER[getAccent(meta.accent)]} ${ACCENT_BG[getAccent(meta.accent)]}` : "border-white/10 bg-white/[0.04] hover:border-white/25"}`}>
                <span className={`text-[0.62rem] font-bold tracking-[0.1em] ${isActive ? ACCENT_TEXT[getAccent(meta.accent)] : "text-muted-foreground"}`}>{`${meta.short} · ${completedSeries}/${seriesCount}`}</span>
                <p className="mt-1 font-orbitron text-xs font-bold leading-4 text-foreground">{meta.label}</p>
                <p className="mt-1 text-[0.62rem] text-muted-foreground">{seriesCount} episódios</p>
              </button>
            );
          })}
        </section>
        <div className="mt-7 grid gap-6 xl:grid-cols-[0.82fr_1.45fr]">
          <aside className="order-2 xl:order-1">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="flex items-center justify-between gap-2 border-b border-white/8 pb-4">
                <span className="flex items-center gap-2"><ListMusic className="h-4 w-4 text-neon-purple" /><h2 className="font-orbitron text-sm font-bold">EPISÓDIOS · {episodes.length}{filter ? ` · ${seriesMeta(filter)?.label ?? filter}` : " · TODAS"}</h2></span>
                {filter !== null ? <button type="button" onClick={() => setFilter(null)} className="inline-flex items-center gap-1 text-[0.68rem] font-bold tracking-[0.1em] text-neon-cyan hover:underline"><RotateCcw className="h-3 w-3" /> LIMPAR</button> : null}
              </div>
              <div className="mt-3 max-h-[44rem] space-y-2 overflow-y-auto pr-1">
                {episodes.map((episode) => {
                  const progressEntry = progressQuery.data?.find((entry) => entry.episodeId === episode.id);
                  const selected = episode.id === activeEpisodeId;
                  const meta = seriesMeta(episode.series) ?? { label: "", short: "", accent: "cyan" };
                  const ak = getAccent(meta.accent);
                  return (
                    <button type="button" key={episode.id} onClick={() => setActiveEpisodeId(episode.id)} className={`w-full rounded-xl border p-3 text-left transition-colors ${selected ? `${ACCENT_SELECTED_BORDER[ak]} ${ACCENT_SELECTED_BG[ak]}` : "border-white/8 bg-black/10 hover:border-white/20"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[0.68rem] font-bold ${progressEntry?.completed ? "border-neon-green/45 bg-neon-green/10 text-neon-green" : `${ACCENT_DOT_BORDER[ak]} ${ACCENT_DOT_BG[ak]} ${ACCENT_TEXT[ak]}`}`}>{progressEntry?.completed ? <CheckCircle2 className="h-4 w-4" /> : <Volume2 className="h-3.5 w-3.5" />}</span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-[0.63rem] font-bold tracking-[0.12em] ${ACCENT_TEXT[ak]}`}>{seriesMeta(episode.series)?.short ?? episode.series}</p>
                          <h3 className="mt-1 font-orbitron text-xs font-bold leading-5 text-foreground">{episode.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{episode.duration}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
          <section className="order-1 xl:order-2">
            <AudioLabEpisodePlayer initialEpisodeId={activeEpisodeId} />
          </section>
        </div>
        <footer className="mt-10 border-t border-white/8 pt-6 text-center text-xs leading-6 text-muted-foreground">CyberDimension Podcast — micro-learning em áudio · ouvir → responder → ganhar XP → aprofundar · conteúdo autoral da CyberDimension Academy.</footer>
      </main>
    </div>
  );
}
