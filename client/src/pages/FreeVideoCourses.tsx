import { useMemo, useState, useEffect } from "react";
import { useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Github,
  Globe,
  Play,
  Scale,
  Search,
  Sparkles,
  Trophy,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { FREE_VIDEO_BADGE_MILESTONES, FREE_VIDEO_COURSE_CATEGORIES, type FreeVideoCourse } from "@shared/freeVideoCourses";

const YOUTUBE_EMBED_BASE = "https://www.youtube-nocookie.com/embed/";

export default function FreeVideoCourses() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const catalogQuery = trpc.freeCourses.catalog.useQuery();
  const progressQuery = trpc.freeCourses.progress.useQuery(undefined, { enabled: Boolean(user) });
  const utils = trpc.useUtils();
  const markWatched = trpc.freeCourses.markWatched.useMutation();

  const [categoryFilter, setCategoryFilter] = useState<(typeof FREE_VIDEO_COURSE_CATEGORIES)[number]>("Todos");
  const [searchText, setSearchText] = useState("");
  const [activeCourse, setActiveCourse] = useState<FreeVideoCourse | null>(null);
  const [showWatchedOnly, setShowWatchedOnly] = useState(false);
  const searchParams = useSearch();
  useEffect(() => {
    const initial = new URLSearchParams(searchParams).get("buscar")?.trim() ?? "";
    if (initial.length > 0) setSearchText(initial);
  }, [searchParams]);

  const watchedSlugs = new Set(progressQuery.data?.watchedSlugs ?? []);
  const watchedSlugsUpdatedAt = progressQuery.data?.watchedSlugsUpdatedAt ?? {};
  const earnedMilestoneCodes = new Set(progressQuery.data?.earnedMilestones ?? []);

  const categories = catalogQuery.data?.categories ?? FREE_VIDEO_COURSE_CATEGORIES;
  const filteredCourses = useMemo(() => {
    let courses = catalogQuery.data?.courses ?? [];
    if (showWatchedOnly) {
      courses = courses.filter((course) => watchedSlugs.has(course.slug));
      courses = [...courses].sort((left, right) => (watchedSlugsUpdatedAt[right.slug] ?? 0) - (watchedSlugsUpdatedAt[left.slug] ?? 0));
    }
    if (categoryFilter !== "Todos") {
      courses = courses.filter((course) => course.category === categoryFilter);
    }
    const query = searchText.trim().toLowerCase();
    if (query.length > 0) {
      const queryWords = query.split(/\s+/);
      courses = courses.filter((course) => {
        const haystack = `${course.title} ${course.category} ${course.description} ${course.tags.join(" ")}`.toLowerCase();
        return queryWords.every((word) => haystack.includes(word));
      });
    }
    return courses;
  }, [catalogQuery.data?.courses, categoryFilter, searchText]);

  const watchedCount = progressQuery.data?.watchedCount ?? 0;
  const availableCount = (catalogQuery.data?.courses ?? []).filter((course) => course.status === "disponivel").length;

  const handleMarkWatched = async (course: FreeVideoCourse) => {
    if (!course.videoId || course.status !== "disponivel") return;
    try {
      const result = await markWatched.mutateAsync({ courseSlug: course.slug });
      await utils.freeCourses.progress.invalidate();
      const awarded = [...(result.newlyAwardedMilestones ?? []), ...(result.newlyAwardedCategoryBadges ?? [])];
      if (awarded.length > 0) {
        toast.success(`+${result.milestoneXp + result.categoryXp} XP de marcos! Novos badges desbloqueados.`);
      } else if (result.xp > 0) {
        toast.success(`+${result.xp} XP registrado no seu progresso.`);
      } else {
        toast("Curso já registrado no seu progresso.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível registrar o curso.");
    }
  };

  if (!user) return null;

  const isCatalogLoading = catalogQuery.isLoading || progressQuery.isLoading;
  const isSearching = searchText.trim().length > 0;

  return (
    <div className="min-h-screen bg-[oklch(0.13_0.045_275)]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[oklch(0.13_0.045_275)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" aria-label="Início" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 font-orbitron text-sm font-bold text-neon-cyan">C</Link>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold tracking-[0.2em] text-neon-cyan">CURSOS GRATUITOS · CONTEÚDO EXTERNO</p>
              <h1 className="truncate font-orbitron text-lg font-bold md:text-xl">Biblioteca de vídeos</h1>
            </div>
          </div>
          <Link href="/videos" className="orbit-button inline-flex shrink-0 items-center gap-2 rounded-xl border border-neon-purple/30 bg-neon-purple/10 px-4 py-2 text-xs font-bold text-neon-purple">Modo Vídeo</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="module-card rounded-2xl border border-neon-cyan/20 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10">
              <Video className="h-7 w-7 text-neon-cyan" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-orbitron text-xl font-bold md:text-2xl">Cursos gratuitos em vídeo <span className="text-neon-cyan">— do zero ao profissional</span></h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Catálogo curado de aulas em vídeo do YouTube como <strong className="text-foreground">referência complementar</strong> de estudo. Ao concluir um curso, marque como assistido e acumule XP e badges de marcos (10, 20 e 30 cursos).
              </p>
            </div>
            <div className="grid shrink-0 grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center"><p className="font-orbitron text-lg font-bold text-neon-cyan">{availableCount}</p><p className="mt-1 text-[0.65rem] font-bold tracking-[0.12em] text-muted-foreground">CURSOS DISPONÍVEIS</p></div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center"><p className="font-orbitron text-lg font-bold text-neon-green">{watchedCount}</p><p className="mt-1 text-[0.65rem] font-bold tracking-[0.12em] text-muted-foreground">ASSISTIDOS</p></div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center"><p className="font-orbitron text-lg font-bold text-amber-300">{earnedMilestoneCodes.size}/{FREE_VIDEO_BADGE_MILESTONES.length}</p><p className="mt-1 text-[0.65rem] font-bold tracking-[0.12em] text-muted-foreground">MARÇOS</p></div>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] p-3">
            <Scale className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            <p className="text-xs leading-5 text-amber-200/90">
              Fonte: YouTube — canal do autor. Licença: conforme disponibilizada pelo autor e pela plataforma. Uso: vídeos incorporados via YouTube como material de apoio; a curadoria, o progresso e as trilhas da CyberDimension Academy são autorais. Apostilas de apoio no repositório do GitHub.
            </p>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1 sm:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Buscar por título ou tag (ex.: python, linux, sql)" aria-label="Buscar cursos"
                className="w-full rounded-xl border border-white/15 bg-black/20 py-3 pl-11 pr-11 text-sm outline-none placeholder:text-muted-foreground focus:border-neon-cyan/60 focus:ring-2 focus:ring-neon-cyan/15" />
              {searchText.length > 0 && (
                <button onClick={() => setSearchText("")} aria-label="Limpar busca" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            {user && watchedSlugs.size > 0 ? (
              <button onClick={() => { setShowWatchedOnly((current) => !current); setCategoryFilter("Todos"); }} className={`orbit-button rounded-full border px-4 py-2 text-xs font-bold transition-colors ${showWatchedOnly ? "border-neon-amber/45 bg-neon-amber/15 text-neon-amber" : "border-neon-amber/30 bg-black/20 text-neon-amber/80 hover:text-neon-amber"}`}>
                <CheckCircle2 className={`h-3.5 w-3.5 ${showWatchedOnly ? "fill-current" : ""}`} />Meus cursos{showWatchedOnly ? " · ativado" : ` · ${watchedSlugs.size}`}
              </button>
            ) : null}
            {categories.map((category) => {
              const count = category === "Todos"
                ? filteredCourses.length
                : filteredCourses.filter((course) => course.category === category).length;
              const isActive = categoryFilter === category;
              return (
                <button key={category} onClick={() => setCategoryFilter(category)} className={`orbit-button rounded-full border px-4 py-2 text-xs font-bold transition-colors ${isActive ? "border-neon-cyan/40 bg-neon-cyan/15 text-neon-cyan" : "border-white/15 bg-black/20 text-muted-foreground hover:text-foreground"}`}>
                  {category}{category !== "Todos" ? ` · ${count}` : isSearching ? ` · ${count} resultados` : ` · ${count}`}
                </button>
              );
            })}
          </div>
        </section>

        {isCatalogLoading ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/15 p-6 text-sm text-muted-foreground">Carregando a biblioteca…</div>
        ) : filteredCourses.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-black/15 p-8 text-center text-sm text-muted-foreground">
            {showWatchedOnly ? "Você ainda não marcou nenhum curso como assistido." : isSearching ? "Nenhum curso encontrado para a busca." : "Nenhum curso nesta categoria."}
            {isSearching ? <p className="mt-3 text-xs"><button onClick={() => { setSearchText(""); setCategoryFilter("Todos"); }} className="font-bold text-neon-cyan hover:underline">Limpar filtros</button></p> : null}
          </div>
        ) : (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const watched = watchedSlugs.has(course.slug);
              const unavailable = course.status === "indisponivel";
              return (
                <article key={course.slug} className={`module-card flex min-h-60 flex-col rounded-2xl border p-5 ${unavailable ? "border-white/10 bg-black/15" : watched ? "border-neon-green/30 bg-neon-green/[0.07]" : "border-neon-purple/20 bg-black/15"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className={`text-xs font-bold tracking-[0.14em] ${unavailable ? "text-muted-foreground" : watched ? "text-neon-green" : "text-neon-purple"}`}>{course.category.toUpperCase()}{unavailable ? " · VÍDEO INDISPONÍVEL" : ""}</p>
                    {watched ? <CheckCircle2 className="h-5 w-5 shrink-0 text-neon-green" /> : unavailable ? <X className="h-5 w-5 shrink-0 text-muted-foreground" /> : null}
                  </div>
                  <h3 className="mt-3 font-orbitron text-base font-bold leading-snug">{course.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{course.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {course.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[0.65rem] font-bold text-muted-foreground">#{tag}</span>)}
                    {!unavailable && <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[0.65rem] font-bold text-amber-300">+{course.watchXp} XP</span>}
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    {unavailable ? (
                      <a href="https://github.com/jorgegil1905/Apostilas-das-Aulas" target="_blank" rel="noreferrer" className="orbit-button inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground">
                        <Github className="h-3.5 w-3.5" /> Apostilas
                      </a>
                    ) : (
                      <button type="button" onClick={() => setActiveCourse(course)} className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-purple/30 bg-neon-purple/10 px-3 py-2 text-xs font-bold text-neon-purple">
                        <Play className="h-3.5 w-3.5" /> Assistir
                      </button>
                    )}
                    {!unavailable && (
                      watched
                        ? <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.12em] text-neon-green"><CheckCircle2 className="h-3.5 w-3.5" /> ASSISTIDO</span>
                        : <button type="button" onClick={() => handleMarkWatched(course)} disabled={markWatched.isPending} className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-green/30 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green disabled:opacity-60">
                          <BadgeCheck className="h-3.5 w-3.5" /> Concluí · +{course.watchXp} XP
                        </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <section className="mt-10 rounded-2xl border border-neon-green/25 bg-neon-green/[0.06] p-5">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-green"><Trophy className="h-4 w-4" /> MARCOS DA COLEÇÃO</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {FREE_VIDEO_BADGE_MILESTONES.map((milestone) => {
              const earned = earnedMilestoneCodes.has(milestone.code);
              return (
                <div key={milestone.code} className={`rounded-xl border p-4 ${earned ? "border-neon-green/40 bg-neon-green/10" : "border-white/10 bg-black/15"}`}>
                  <p className="font-orbitron text-sm font-bold">{milestone.title}</p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{milestone.description}</p>
                  <p className="mt-3 text-[0.65rem] font-bold tracking-[0.12em] text-amber-300">+{milestone.xp} XP · {milestone.count} cursos</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-cyan"><BookOpen className="h-4 w-4" /> MATERIAL DE APOIO</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            As apostilas das aulas estão reunidas no repositório{" "}
            <a href="https://github.com/jorgegil1905/Apostilas-das-Aulas" target="_blank" rel="noreferrer" className="font-bold text-neon-cyan underline underline-offset-4">
              Apostilas das Aulas <ExternalLink className="inline h-3 w-3" />
            </a>
            . O conteúdo dos vídeos pertence aos respectivos autores no YouTube; a CyberDimension Academy organiza a trilha, o progresso e as recompensas.
          </p>
        </section>
      </main>

      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-4xl rounded-2xl border border-neon-cyan/30 bg-[oklch(0.16_0.05_275)] p-5">
            <button type="button" onClick={() => setActiveCourse(null)} aria-label="Fechar" className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/20 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">{activeCourse.category.toUpperCase()}</p>
            <h3 className="mt-2 pr-12 font-orbitron text-lg font-bold md:text-xl">{activeCourse.title}</h3>
            <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border border-white/10">
              {activeCourse.videoId ? (
                <iframe
                  src={`${YOUTUBE_EMBED_BASE}${activeCourse.videoId}?rel=0`}
                  title={`Aula ${activeCourse.title}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
                  <Globe className="mr-2 h-5 w-5" /> Vídeo indisponível para incorporação. Consulte as apostilas no GitHub.
                </div>
              )}
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{activeCourse.description}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-neon-cyan" /> Conteúdo externo · YouTube — canal do autor</span>
              <div className="flex flex-wrap gap-2">
                <a href="https://github.com/jorgegil1905/Apostilas-das-Aulas" target="_blank" rel="noreferrer" className="orbit-button inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground">
                  <Github className="h-3.5 w-3.5" /> Apostilas
                </a>
                {activeCourse.status === "disponivel" && (
                  watchedSlugs.has(activeCourse.slug)
                    ? <span className="inline-flex items-center gap-1.5 rounded-xl border border-neon-green/30 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green"><CheckCircle2 className="h-3.5 w-3.5" /> ASSISTIDO</span>
                    : <button type="button" onClick={() => { void handleMarkWatched(activeCourse); }} disabled={markWatched.isPending} className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-green/30 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green disabled:opacity-60">
                      <BadgeCheck className="h-3.5 w-3.5" /> Concluí · +{activeCourse.watchXp} XP
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
