import { useMemo, useState } from "react";
import { functionalCourses, getStarterCourse } from "@/data/courseCatalog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Bookmark, CirclePlay, Filter, Heart, Play, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { buildVideoCatalog, filterVideoCatalog, listVideoAcademies, listVideoLevels, sortVideoCatalog, type VideoSort } from "@/lib/videoLibrary";
import { countAuthorialVideoLessons } from "@/lib/authorialVideoCatalog";

function getVideoContext(courseSlug: string, moduleIndex: number, chapterIndex: number) {
  const course = getStarterCourse(courseSlug);
  const session = course?.videoLearning?.sessions.find((item) => item.moduleIndex === moduleIndex);
  const chapter = session?.chapters[chapterIndex] ?? session?.chapters[0];
  return { course, session, chapter };
}

export default function VideoLibrary() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const summaryQuery = trpc.formations.summary.useQuery(undefined, { enabled: Boolean(user) });
  const utils = trpc.useUtils();
  const setFavorite = trpc.formations.setFavorite.useMutation();
  const videoCourses = useMemo(() => functionalCourses, []);
  const videoCatalog = useMemo(() => buildVideoCatalog(videoCourses), [videoCourses]);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [academy, setAcademy] = useState("all");
  const [sort, setSort] = useState<VideoSort>("title-asc");
  const favoriteSlugs = useMemo(() => new Set((summaryQuery.data?.favorites ?? []).map((item) => item.courseSlug)), [summaryQuery.data?.favorites]);
  const favoriteCourses = videoCourses.filter((course) => favoriteSlugs.has(course.slug));
  const filteredCourses = useMemo(() => sortVideoCatalog(filterVideoCatalog(videoCatalog, { query, level, academy }), sort), [academy, level, query, sort, videoCatalog]);
  const levels = useMemo(() => listVideoLevels(videoCatalog), [videoCatalog]);
  const academies = useMemo(() => listVideoAcademies(videoCatalog), [videoCatalog]);
  const hasFilters = Boolean(query.trim()) || level !== "all" || academy !== "all" || sort !== "title-asc";
  const resumedCourses = (summaryQuery.data?.videoProgress ?? [])
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .filter((item, index, items) => items.findIndex((other) => other.courseSlug === item.courseSlug) === index)
    .map((progress) => ({ progress, ...getVideoContext(progress.courseSlug, progress.moduleIndex, progress.chapterIndex) }))
    .filter((item) => item.course && item.session && item.chapter);

  const removeFavorite = async (courseSlug: string) => {
    try {
      await setFavorite.mutateAsync({ courseSlug: courseSlug as "redes-para-cyber-security" | "linux-para-operacoes-de-seguranca", favorite: false });
      await utils.formations.summary.invalidate();
      toast.success("Formação removida dos favoritos.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar os favoritos.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-55" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl"><div className="container flex min-h-18 items-center justify-between gap-4 py-3"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link><span className="font-orbitron text-xs font-bold tracking-[0.08em]">BIBLIOTECA <span className="text-neon-purple">DE VÍDEOS</span></span></div></header>
      <main className="container relative py-7 md:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-neon-purple/25 bg-[linear-gradient(135deg,oklch(0.13_0.055_295/0.54),oklch(0.08_0.025_260/0.94))] p-6 md:p-8"><div className="absolute -right-14 -top-16 h-52 w-52 rounded-full bg-neon-purple/18 blur-3xl" /><div className="relative"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-purple"><CirclePlay className="h-4 w-4" /> SUA ROTA AUDIOVISUAL</p><h1 className="mt-3 font-orbitron text-3xl font-bold md:text-4xl">Aulas em vídeo <span className="text-neon-cyan">do zero ao profissional</span>.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">Encontre dez aulas autorais por formação, retome sessões já iniciadas e use o Modo Vídeo das trilhas que possuem mídia incorporada.</p></div></section>

        <section className="mt-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">CONTINUAR ASSISTINDO</p><h2 className="mt-2 font-orbitron text-xl font-bold">Pontos de retomada</h2></div><span className="text-sm text-muted-foreground">{resumedCourses.length} {resumedCourses.length === 1 ? "aula marcada" : "aulas marcadas"}</span></div>
          {summaryQuery.isLoading ? <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-5 text-sm text-muted-foreground">Carregando sua biblioteca…</div> : resumedCourses.length ? <div className="mt-4 grid gap-4 lg:grid-cols-2">{resumedCourses.map(({ progress, course, session, chapter }) => <article key={`${progress.courseSlug}-${progress.moduleIndex}`} className="module-card rounded-2xl border border-neon-cyan/20 p-5"><p className="text-xs font-bold tracking-[0.14em] text-neon-cyan">{course?.code} · CAPÍTULO {String(progress.chapterIndex + 1).padStart(2, "0")}</p><h3 className="mt-2 font-orbitron text-lg font-bold">{course?.title}</h3><p className="mt-2 text-sm font-bold text-foreground">{chapter?.time} · {chapter?.title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{chapter?.summary}</p><div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4"><span className="inline-flex items-center gap-2 text-xs text-muted-foreground"><Play className="h-3.5 w-3.5 text-neon-cyan" /> {session?.title}</span><Link href={`/formation/${course?.slug}`} className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-2 text-xs font-bold text-neon-cyan">Retomar <ArrowRight className="h-3.5 w-3.5" /></Link></div></article>)}</div> : <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-5 text-sm leading-6 text-muted-foreground">Você ainda não marcou um capítulo. Entre em uma formação com Modo Vídeo e selecione um capítulo para salvar sua retomada.</div>}</section>

        <section className="mt-10" aria-labelledby="video-filter-title"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-purple"><Filter className="h-4 w-4" /> BIBLIOTECA COMPLETA</p><h2 id="video-filter-title" className="mt-2 font-orbitron text-xl font-bold">Encontre sua próxima aula</h2></div><span className="text-sm text-muted-foreground">{filteredCourses.length} de {videoCatalog.length} formações</span></div>
          <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] md:items-end"><label className="block text-xs font-bold text-muted-foreground">Buscar por título, tema ou academia<div className="relative mt-1.5"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Ex.: SOC, Linux, Cloud…" aria-label="Buscar cursos em vídeo" className="w-full rounded-xl border border-white/12 bg-background/70 px-3 py-2.5 pl-9 text-sm text-foreground outline-none focus:border-neon-cyan/60" /></div></label><label className="block text-xs font-bold text-muted-foreground">Nível<select value={level} onChange={(event) => setLevel(event.target.value)} aria-label="Filtrar vídeos por nível" className="mt-1.5 w-full rounded-xl border border-white/12 bg-background px-3 py-2.5 text-sm text-foreground"><option value="all">Todos os níveis</option>{levels.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="block text-xs font-bold text-muted-foreground">Academia<select value={academy} onChange={(event) => setAcademy(event.target.value)} aria-label="Filtrar vídeos por academia" className="mt-1.5 w-full rounded-xl border border-white/12 bg-background px-3 py-2.5 text-sm text-foreground"><option value="all">Todas as academias</option>{academies.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}</select></label><label className="block text-xs font-bold text-muted-foreground">Ordenar<select value={sort} onChange={(event) => setSort(event.target.value as VideoSort)} aria-label="Ordenar cursos em vídeo" className="mt-1.5 w-full rounded-xl border border-white/12 bg-background px-3 py-2.5 text-sm text-foreground"><option value="title-asc">Título: A–Z</option><option value="title-desc">Título: Z–A</option><option value="lessons-desc">Mais aulas</option><option value="level">Nível: avançado primeiro</option></select></label></div>
          {hasFilters ? <button type="button" onClick={() => { setQuery(""); setLevel("all"); setAcademy("all"); setSort("title-asc"); }} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-neon-cyan hover:underline"><X className="h-3.5 w-3.5" /> Limpar filtros</button> : null}
          {filteredCourses.length ? <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredCourses.map(({ course, academy: academyName }) => <article key={course.slug} className="module-card flex min-h-56 flex-col rounded-2xl border border-neon-green/20 p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[0.14em] text-neon-green">MODO VÍDEO · {course.level}</p><p className="mt-1 text-[0.62rem] font-bold tracking-[0.12em] text-neon-cyan">{academyName}</p></div><CirclePlay className="h-5 w-5 shrink-0 text-neon-green" /></div><h3 className="mt-3 font-orbitron text-lg font-bold">{course.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{course.videoLearning?.label ?? "Aulas autorais em vídeo — produzidas pela CyberDimension Academy"}</p><p className="mt-2 text-xs text-muted-foreground">{course.lessons} aulas · {course.videoLearning?.sessions.length ?? countAuthorialVideoLessons(course)} sessões em vídeo</p><div className="mt-auto flex items-center justify-between gap-3 pt-5"><Link href={`/formation/${course.slug}`} className="orbit-button inline-flex items-center gap-2 text-sm font-bold text-neon-cyan">Abrir formação <ArrowRight className="h-4 w-4" /></Link>{favoriteSlugs.has(course.slug) ? <button type="button" onClick={() => removeFavorite(course.slug)} disabled={setFavorite.isPending} aria-label={`Remover ${course.title} dos favoritos`} className="orbit-button inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neon-purple/30 bg-neon-purple/10 text-neon-purple disabled:opacity-60"><Heart className="h-4 w-4 fill-current" /></button> : null}</div></article>)}</div> : <div className="mt-5 rounded-2xl border border-neon-amber/25 bg-neon-amber/[0.05] p-6"><p className="font-orbitron text-sm font-bold">Nenhuma formação encontrada.</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Tente remover um filtro ou buscar por outro tema, nível ou academia.</p></div>}
        </section>

        <section className="mt-10 rounded-2xl border border-neon-purple/20 bg-neon-purple/[0.05] p-5" aria-labelledby="favorite-title"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.16em] text-neon-purple">FAVORITOS</p><h2 id="favorite-title" className="mt-2 font-orbitron text-xl font-bold">Sua lista de estudo</h2></div><Bookmark className="h-6 w-6 text-neon-purple" /></div>{favoriteCourses.length ? <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{favoriteCourses.map((course) => <article key={course.slug} className="module-card flex min-h-48 flex-col rounded-2xl border border-neon-purple/20 p-5"><p className="text-xs font-bold tracking-[0.14em] text-neon-purple">MODO VÍDEO · {course.level}</p><h3 className="mt-3 font-orbitron text-lg font-bold">{course.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{course.videoLearning?.label}</p><div className="mt-auto flex items-center justify-between gap-3 pt-5"><Link href={`/formation/${course.slug}`} className="orbit-button inline-flex items-center gap-2 text-sm font-bold text-neon-cyan">Abrir formação <ArrowRight className="h-4 w-4" /></Link><button type="button" onClick={() => removeFavorite(course.slug)} disabled={setFavorite.isPending} aria-label={`Remover ${course.title} dos favoritos`} className="orbit-button inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neon-purple/30 bg-neon-purple/10 text-neon-purple disabled:opacity-60"><Heart className="h-4 w-4 fill-current" /></button></div></article>)}</div> : <p className="mt-4 text-sm leading-6 text-muted-foreground">Use o botão Favoritar dentro das formações com Modo Vídeo para manter sua rota organizada.</p>}</section>

        <section className="mt-10 rounded-2xl border border-neon-green/25 bg-neon-green/[0.06] p-5"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-green"><Sparkles className="h-4 w-4" /> MODO VÍDEO DISPONÍVEL — MARATONA DE ESTUDO</p><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Todas as formações com vídeo em um só lugar, do iniciante ao avançado. Escolha a trilha e assista em sequência — favoritos e pontos de retomada ficam salvos no seu perfil.</p></section>
      </main>
    </div>
  );
}
