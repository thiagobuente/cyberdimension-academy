import { useMemo } from "react";
import { BookOpen, ChevronRight, Heart, Rocket, Star, Trash2 } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { activatedCatalogCourses } from "@shared/activatedCatalogCourses";

type FavoriteSummary = {
  modules: Array<{ courseSlug: string; completed: boolean }>;
  labs: Array<{ courseSlug: string; completed: boolean }>;
};

function progressFor(slug: string, summary: FavoriteSummary) {
  const course = activatedCatalogCourses.find((item) => item.slug === slug);
  if (!course) return { percent: 0, completed: 0, total: 0 };
  const modules = summary.modules.filter((item) => item.courseSlug === slug && item.completed).length;
  const labs = summary.labs.filter((item) => item.courseSlug === slug && item.completed).length;
  const total = course.modules.length + course.labsList.length;
  return { percent: total ? Math.round(((modules + labs) / total) * 100) : 0, completed: modules + labs, total };
}

export default function Favorites() {
  const { user, isAuthenticated } = useAuth();
  const summaryQuery = trpc.formations.summary.useQuery(undefined, { enabled: Boolean(isAuthenticated && user) });
  const utils = trpc.useUtils();
  const setFavorite = trpc.formations.setFavorite.useMutation({
    onSuccess: () => void Promise.all([summaryQuery.refetch(), utils.formations.summary.invalidate()]),
  });

  const favoriteCourses = useMemo(() => {
    const favoriteSlugs = new Set((summaryQuery.data?.favorites ?? []).map((item) => item.courseSlug));
    return activatedCatalogCourses.filter((course) => favoriteSlugs.has(course.slug));
  }, [summaryQuery.data?.favorites]);

  if (!isAuthenticated || !user) return null;
  const summary = summaryQuery.data;

  return (
    <DashboardLayout>
      <main className="min-h-screen space-canvas px-4 py-6 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1400px]">
          <section className="relative overflow-hidden rounded-3xl border border-neon-amber/25 bg-gradient-to-br from-neon-amber/[0.10] via-background to-neon-purple/[0.08] p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-neon-amber/10 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-amber"><Star className="h-4 w-4 fill-current" /> MINHA BIBLIOTECA</p>
                <h1 className="mt-3 font-sans text-3xl font-bold tracking-tight sm:text-4xl">Cursos favoritos</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Salve as formações que deseja acompanhar e retome seus estudos rapidamente, com o progresso preservado na sua conta.</p>
              </div>
              <div className="rounded-2xl border border-neon-amber/25 bg-black/20 px-5 py-4 text-right"><p className="text-3xl font-black text-neon-amber">{favoriteCourses.length}</p><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">salvos</p></div>
            </div>
          </section>

          {summaryQuery.isLoading ? <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Carregando favoritos">{[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-2xl border border-white/8 bg-white/[0.04]" />)}</section> : favoriteCourses.length === 0 ? (
            <section className="mt-6 rounded-3xl border border-dashed border-white/15 bg-black/15 px-6 py-16 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-neon-amber/30 bg-neon-amber/10 text-neon-amber"><Heart className="h-7 w-7" /></div><h2 className="mt-5 font-sans text-2xl font-bold">Sua biblioteca ainda está vazia</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Abra uma formação, clique em Favoritar e ela aparecerá aqui para acesso rápido.</p><Link href="/catalog" className="orbit-button mt-6 inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-5 py-3 text-sm font-bold text-slate-950">Explorar cursos <ChevronRight className="h-4 w-4" /></Link></section>
          ) : <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{favoriteCourses.map((course) => { const progress = progressFor(course.slug, summary!); return <article key={course.slug} className="module-card group flex min-h-64 flex-col rounded-2xl p-5"><div className="flex items-start justify-between gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl border border-neon-amber/35 bg-neon-amber/10 text-neon-amber"><BookOpen className="h-5 w-5" /></div><button type="button" onClick={() => setFavorite.mutate({ courseSlug: course.slug as never, favorite: false })} disabled={setFavorite.isPending} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:border-rose-300/40 hover:bg-rose-300/10 hover:text-rose-300 disabled:opacity-50" aria-label={`Remover ${course.shortTitle} dos favoritos`} title="Remover dos favoritos"><Trash2 className="h-4 w-4" /></button></div><p className="mt-5 text-xs font-bold tracking-[0.14em] text-neon-amber">FORMAÇÃO SALVA</p><h2 className="mt-2 font-sans text-xl font-bold leading-snug">{course.shortTitle}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{course.description}</p><div className="mt-4"><div className="mb-1.5 flex items-center justify-between text-xs font-bold"><span className="text-muted-foreground">{progress.completed}/{progress.total} etapas</span><span className="text-neon-cyan">{progress.percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all" style={{ width: `${progress.percent}%` }} /></div></div><Link href={`/formation/${course.slug}`} className="orbit-button mt-auto inline-flex items-center justify-between pt-5 text-sm font-bold text-neon-cyan">{progress.percent > 0 ? "Continuar estudos" : "Abrir formação"}<ChevronRight className="h-4 w-4" /></Link></article>; })}</section>}

          <section className="mt-8 grid gap-4 md:grid-cols-2"><Link href="/catalog" className="module-card rounded-2xl p-5"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-cyan"><Rocket className="h-4 w-4" /> DESCOBRIR MAIS</p><h2 className="mt-2 font-sans text-lg font-bold">Explorar o catálogo</h2><p className="mt-1 text-sm text-muted-foreground">Encontre novas formações para sua próxima etapa.</p></Link><Link href="/progress" className="module-card rounded-2xl p-5"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-green"><BookOpen className="h-4 w-4" /> ACOMPANHAR EVOLUÇÃO</p><h2 className="mt-2 font-sans text-lg font-bold">Ver meu progresso</h2><p className="mt-1 text-sm text-muted-foreground">Retome sua jornada com métricas e próximos objetivos.</p></Link></section>
        </div>
      </main>
    </DashboardLayout>
  );
}

function _unused() { return null; }
void _unused;
