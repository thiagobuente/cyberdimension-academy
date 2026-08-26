import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { ReadingControls } from "@/components/ReadingControls";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import { SECURITY_PLUS_WEEKLY_TARGET, securityPlusWeeklyPlan } from "@/data/securityPlusWeeklyPlan";
import { getReadingPreferenceClasses } from "@/lib/readingPreferences";
import { getSecurityPlusWeeklyProgress } from "@/lib/securityPlusWeeklyProgress";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Compass, LockKeyhole, Rocket, Shield, Sparkles, Target, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";

type WeekStatus = "complete" | "active" | "upcoming";

export default function SecurityPlusPath() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const { preferences } = useReadingPreferences();
  const domainsQuery = trpc.domains.list.useQuery();
  const progressQuery = trpc.progress.list.useQuery();
  const quizHistoryQuery = trpc.quiz.history.useQuery();
  const utils = trpc.useUtils();
  const [lessonCounts, setLessonCounts] = useState<Record<number, number>>({});
  const domains = domainsQuery.data ?? [];
  const progress = progressQuery.data ?? [];
  const attempts = quizHistoryQuery.data ?? [];

  useEffect(() => {
    if (!domains.length) return;
    void Promise.all(domains.map(async (domain) => {
      try {
        return [domain.id, await utils.progress.lessonCount.fetch({ domainId: domain.id })] as const;
      } catch {
        return [domain.id, 0] as const;
      }
    })).then((entries) => setLessonCounts(Object.fromEntries(entries)));
  }, [domains, utils.progress.lessonCount]);

  const completedByDomain = useMemo(() => progress.reduce<Record<number, Set<number>>>((acc, entry) => {
    if (entry.completed && entry.lessonId) (acc[entry.domainId] ??= new Set()).add(entry.lessonId);
    return acc;
  }, {}), [progress]);
  const orderedDomains = useMemo(() => [...domains].sort((left, right) => left.order - right.order), [domains]);

  const domainSnapshots = useMemo(() => orderedDomains.map((domain) => {
    const totalLessons = lessonCounts[domain.id] ?? 0;
    const completedLessons = completedByDomain[domain.id]?.size ?? 0;
    const domainAttempts = attempts.filter((attempt) => attempt.domainId === domain.id && attempt.totalQuestions > 0);
    const bestScore = domainAttempts.length ? Math.max(...domainAttempts.map((attempt) => Math.round((attempt.score / attempt.totalQuestions) * 100))) : null;
    return { order: domain.order, totalLessons, completedLessons, bestScore };
  }), [attempts, completedByDomain, lessonCounts, orderedDomains]);
  const weeklyProgress = useMemo(() => getSecurityPlusWeeklyProgress({
    plan: securityPlusWeeklyPlan,
    domains: domainSnapshots,
    hasConsolidationAttempt: attempts.some((attempt) => attempt.domainId === null || attempt.domainId === undefined),
  }), [attempts, domainSnapshots]);
  const { weekStates: weeklyGoals, completedDomainWeeks, completedWeeks, totalProgress, currentWeekNumber } = weeklyProgress;
  const domainsByOrder = useMemo(() => new Map(orderedDomains.map((domain) => [domain.order, domain])), [orderedDomains]);
  const activeDomain = weeklyGoals[currentWeekNumber - 1]?.domainOrder ? domainsByOrder.get(weeklyGoals[currentWeekNumber - 1].domainOrder!) : undefined;

  if (!isAuthenticated || !user) return null;

  return (
    <DashboardLayout>
      <div className={`weekly-path-study reading-theme-transition min-h-screen space-canvas text-foreground ${getReadingPreferenceClasses(preferences)} ${preferences.focusMode ? "study-focus" : ""}`}>
        <div className="pointer-events-none fixed inset-0 space-grid opacity-55" />
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link>
          <ReadingControls compact />
        </div>

        <main className="container relative py-3 md:py-6">
        <section className="relative overflow-hidden rounded-3xl border border-neon-cyan/22 bg-[linear-gradient(135deg,oklch(0.13_0.045_260/0.96),oklch(0.09_0.025_270/0.9))] p-6 md:p-9">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-neon-purple/16 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-neon-cyan/10 blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-neon-green/25 bg-neon-green/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-neon-green"><Compass className="h-3.5 w-3.5" /> TRILHA SECURITY+ SY0-701</p>
              <h1 className="mt-4 font-orbitron text-3xl font-black tracking-[-0.04em] md:text-5xl">Sua rota de <span className="text-neon-cyan">seis semanas</span>.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">Uma preparação flexível, organizada em missões semanais. Cada semana combina estudo guiado, prática por domínio e uma meta verificável de simulado.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {activeDomain ? <><Link href={`/course/${activeDomain.id}`} className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"><BookOpen className="h-4 w-4" /> Abrir semana atual</Link><Link href={`/quiz/${activeDomain.id}`} className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-purple/35 bg-neon-purple/10 px-4 py-3 text-sm font-bold text-neon-purple"><Target className="h-4 w-4" /> Praticar o domínio</Link></> : <Link href="/quiz" className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"><Rocket className="h-4 w-4" /> Iniciar revisão geral</Link>}
              </div>
            </div>
            <aside className="module-card rounded-2xl border border-white/12 p-5">
              <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">SUA MISSÃO ATUAL</p>
              <p className="mt-3 font-orbitron text-xl font-bold">Semana {String(currentWeekNumber).padStart(2, "0")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{weeklyGoals[currentWeekNumber - 1]?.title}</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green" style={{ width: `${totalProgress}%` }} /></div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold"><span className="text-muted-foreground">{completedWeeks}/6 metas concluídas</span><span className="text-neon-cyan">{totalProgress}%</span></div>
            </aside>
          </div>
        </section>

        <section className="mt-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold tracking-[0.17em] text-neon-cyan">CRONOGRAMA ADAPTATIVO</p><h2 className="mt-2 font-orbitron text-2xl font-bold">Seis missões. Um objetivo.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">As semanas não têm datas rígidas: avance quando cumprir a meta anterior. A plataforma usa suas aulas concluídas e melhores resultados para acompanhar cada checkpoint.</p></div>
          <span className="inline-flex items-center gap-2 text-xs font-bold text-neon-green"><Sparkles className="h-4 w-4" /> Meta de domínio: {SECURITY_PLUS_WEEKLY_TARGET}%</span>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          {weeklyGoals.map((week, index) => {
            const status: WeekStatus = week.complete ? "complete" : index === currentWeekNumber - 1 ? "active" : "upcoming";
            const domain = week.domainOrder ? domainsByOrder.get(week.domainOrder) : undefined;
            const isDomainWeek = Boolean(domain);
            const accent = status === "complete" ? "border-neon-green/32" : status === "active" ? "border-neon-cyan/42" : "border-white/12";
            const statusLabel = status === "complete" ? "Concluída" : status === "active" ? "Em andamento" : "Próxima missão";
            return <article id={isDomainWeek ? `dominio-${week.domainOrder}` : undefined} key={week.week} className={`module-card relative scroll-mt-24 overflow-hidden rounded-2xl border p-5 md:p-6 ${accent}`}>
              {status === "active" && <div className="absolute inset-y-0 left-0 w-1 bg-neon-cyan" />}
              <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl border ${status === "complete" ? "border-neon-green/35 bg-neon-green/10 text-neon-green" : status === "active" ? "border-neon-cyan/35 bg-neon-cyan/10 text-neon-cyan" : "border-white/12 bg-white/[0.035] text-muted-foreground"}`}>{status === "complete" ? <CheckCircle2 className="h-5 w-5" /> : status === "upcoming" ? <LockKeyhole className="h-5 w-5" /> : <Circle className="h-5 w-5" />}</span><div><p className={`text-xs font-bold tracking-[0.15em] ${status === "complete" ? "text-neon-green" : status === "active" ? "text-neon-cyan" : "text-muted-foreground"}`}>SEMANA {String(week.week).padStart(2, "0")} · {statusLabel}</p><h3 className="mt-1 font-orbitron text-lg font-bold">{week.title}</h3></div></div><span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-bold text-muted-foreground">{isDomainWeek ? `Domínio ${domain?.order}` : "Revisão"}</span></div>
              <p className="mt-5 font-semibold text-foreground">{isDomainWeek ? domain?.title : week.focus}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{week.cadence}</p>
              <div className="weekly-goal-surface mt-5 rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-[0.68rem] font-bold tracking-[0.14em] text-neon-purple">META DA SEMANA</p><p className="mt-2 text-sm leading-6 text-foreground">{week.goal}</p></div>
              {isDomainWeek ? <><div className="mt-5 flex items-center justify-between text-xs font-bold"><span className="text-muted-foreground">{week.completedLessons}/{week.totalLessons || "—"} lições · {week.bestScore !== null ? `melhor quiz ${week.bestScore}%` : "quiz pendente"}</span><span className={week.complete ? "text-neon-green" : "text-neon-cyan"}>{week.lessonProgress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8"><div className={`h-full rounded-full bg-gradient-to-r ${week.complete ? "from-neon-green to-neon-cyan" : "from-neon-cyan to-neon-purple"}`} style={{ width: `${week.lessonProgress}%` }} /></div><div className="mt-5 grid grid-cols-2 gap-2"><Link href={`/course/${domain?.id}`} className="weekly-card-action orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.035] px-3 py-2.5 text-sm font-bold hover:border-neon-cyan/35"><BookOpen className="h-4 w-4 text-neon-cyan" /> Estudar</Link><Link href={`/quiz/${domain?.id}`} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-neon-purple/30 bg-neon-purple/10 px-3 py-2.5 text-sm font-bold text-neon-purple"><Target className="h-4 w-4" /> Praticar</Link></div></> : <><div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Trophy className="h-4 w-4 text-neon-green" /> {completedDomainWeeks}/5 domínios com meta semanal cumprida</div><Link href="/quiz" className="orbit-button mt-5 inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-2.5 text-sm font-bold text-[oklch(0.1_0.02_260)]">Abrir simulado geral <ArrowRight className="h-4 w-4" /></Link></>}
            </article>;
          })}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3"><article className="module-card rounded-2xl border border-neon-cyan/22 p-5"><BookOpen className="h-5 w-5 text-neon-cyan" /><h3 className="mt-3 font-orbitron text-base font-bold">Aprender</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Conclua as lições do domínio antes de transformar conhecimento em ritmo de prova.</p></article><article className="module-card rounded-2xl border border-neon-purple/22 p-5"><Target className="h-5 w-5 text-neon-purple" /><h3 className="mt-3 font-orbitron text-base font-bold">Praticar</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Use o simulado por domínio para testar sua compreensão com explicações pedagógicas.</p></article><article className="module-card rounded-2xl border border-neon-green/22 p-5"><Rocket className="h-5 w-5 text-neon-green" /><h3 className="mt-3 font-orbitron text-base font-bold">Consolidar</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Na sexta semana, reveja as lacunas e faça o simulado geral como diagnóstico final.</p></article></section>
        <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">Esta trilha é um guia educacional flexível. Ela organiza seu estudo, mas não representa a pontuação oficial nem garante aprovação no exame.</p>
        </main>
      </div>
    </DashboardLayout>
  );
}
