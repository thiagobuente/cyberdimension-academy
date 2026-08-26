import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import { getReadingPreferenceClasses } from "@/lib/readingPreferences";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleHelp, Clock3, Cloud, Code2, Play, Radar, RotateCcw, ShieldCheck, TimerReset } from "lucide-react";
import { Link } from "wouter";

type ActiveSimulation = {
  attemptId: number;
  startedAt: Date;
  expiresAt: Date;
  resumed: boolean;
  simulation: {
    slug: string;
    title: string;
    subtitle: string;
    durationMinutes: number;
    passingScore: number;
    questions: { id: string; prompt: string; options: readonly string[] }[];
  };
};

function formatRemaining(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

function SimulationIcon({ slug, className }: { slug: string; className?: string }) {
  if (slug === "cloud-security") return <Cloud className={className} />;
  if (slug === "application-security") return <Code2 className={className} />;
  return <Radar className={className} />;
}

export default function SpecialtySimulations() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const { preferences } = useReadingPreferences();
  const catalogQuery = trpc.specialtySimulations.catalog.useQuery(undefined, { enabled: isAuthenticated });
  const historyQuery = trpc.specialtySimulations.history.useQuery(undefined, { enabled: isAuthenticated });
  const [active, setActive] = useState<ActiveSimulation | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState<{
    score: number; totalQuestions: number; percentage: number; passed: boolean; timedOut: boolean;
    review: { id: string; correct: boolean; correctAnswer: number; explanation: string }[];
  } | null>(null);
  const autoSubmitted = useRef(false);
  const utils = trpc.useUtils();

  const startMutation = trpc.specialtySimulations.start.useMutation({
    onSuccess: (data) => {
      const session = data as ActiveSimulation;
      setActive(session);
      setAnswers(Array.from({ length: session.simulation.questions.length }, () => -1));
      setResult(null);
      autoSubmitted.current = false;
      setNow(Date.now());
    },
  });
  const submitMutation = trpc.specialtySimulations.submit.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setActive(null);
      autoSubmitted.current = false;
      void utils.specialtySimulations.history.invalidate();
    },
  });

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [active]);

  const remaining = active ? Math.max(active.expiresAt.getTime() - now, 0) : 0;
  useEffect(() => {
    if (!active || remaining > 0 || autoSubmitted.current || submitMutation.isPending) return;
    autoSubmitted.current = true;
    submitMutation.mutate({ attemptId: active.attemptId, answers: answers.filter((answer) => answer >= 0) });
  }, [active, answers, remaining, submitMutation]);

  const submitCurrent = () => {
    if (!active || submitMutation.isPending) return;
    submitMutation.mutate({ attemptId: active.attemptId, answers: answers.filter((answer) => answer >= 0) });
  };

  if (!isAuthenticated || !user) return null;

  return <div className={`weekly-path-study reading-theme-transition min-h-screen space-canvas text-foreground ${getReadingPreferenceClasses(preferences)}`}>
    <div className="pointer-events-none fixed inset-0 space-grid opacity-55" />
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
      <div className="container flex items-center justify-between gap-3 py-3"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link><Link href="/" className="flex items-center gap-2" aria-label="CyberDimension Academy"><span className="grid h-8 w-8 place-items-center rounded-lg border border-neon-cyan/35 bg-neon-cyan/10"><ShieldCheck className="h-4 w-4 text-neon-cyan" /></span><span className="font-orbitron text-xs font-bold sm:text-sm">CYBER<span className="text-neon-purple">DIMENSION</span></span></Link></div>
    </header>
    <main className="container relative py-7 md:py-10">
      {!active && !result && <>
        <section className="relative overflow-hidden rounded-3xl border border-neon-purple/25 bg-[linear-gradient(135deg,oklch(0.13_0.045_260/0.96),oklch(0.09_0.025_270/0.9))] p-6 md:p-9"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-neon-purple/16 blur-3xl" /><div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end"><div><p className="inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-neon-purple"><TimerReset className="h-3.5 w-3.5" /> SIMULADOS POR ESPECIALIDADE</p><h1 className="mt-4 font-orbitron text-3xl font-black tracking-[-0.04em] md:text-5xl">Pratique sob <span className="text-neon-purple">tempo real.</span></h1><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">Escolha uma especialidade, inicie uma sessão com tempo controlado pelo servidor e receba revisão autoral após o envio. Os simulados são educativos, não substituem certificações oficiais.</p></div><aside className="module-card rounded-2xl border border-white/12 p-5"><Clock3 className="h-5 w-5 text-neon-cyan" /><p className="mt-3 font-orbitron text-2xl font-bold">18 minutos</p><p className="mt-2 text-sm leading-6 text-muted-foreground">8 questões por sessão, aprovação a partir de 70% e histórico particular de tentativas.</p></aside></div></section>
        <section className="mt-8 grid gap-4 lg:grid-cols-3">{catalogQuery.data?.map((simulation) => <article key={simulation.slug} className="module-card flex min-h-[290px] flex-col rounded-2xl border border-white/12 p-5"><SimulationIcon slug={simulation.slug} className="h-6 w-6 text-neon-cyan" /><p className="mt-5 text-xs font-bold tracking-[0.16em] text-neon-purple">SIMULADO CRONOMETRADO</p><h2 className="mt-2 font-orbitron text-lg font-bold">{simulation.title}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{simulation.subtitle}</p><div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-white/7 px-2.5 py-1 text-muted-foreground">{simulation.totalQuestions} questões</span><span className="rounded-full bg-white/7 px-2.5 py-1 text-muted-foreground">{simulation.durationMinutes} min</span><span className="rounded-full bg-neon-green/10 px-2.5 py-1 text-neon-green">meta {simulation.passingScore}%</span></div><button type="button" className="orbit-button mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60" onClick={() => startMutation.mutate({ simulationSlug: simulation.slug })} disabled={startMutation.isPending}><Play className="h-4 w-4" /> {startMutation.isPending ? "Preparando..." : "Iniciar simulado"}</button></article>)}</section>
        {historyQuery.data && historyQuery.data.length > 0 && <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5"><div className="flex items-center gap-2"><CircleHelp className="h-5 w-5 text-neon-cyan" /><h2 className="font-orbitron text-lg font-bold">Histórico de prática</h2></div><div className="mt-4 grid gap-3 md:grid-cols-3">{historyQuery.data.slice(0, 6).map((attempt) => <div key={attempt.id} className="rounded-xl border border-white/8 bg-black/10 p-4"><p className="text-xs font-bold tracking-[0.12em] text-muted-foreground">{attempt.simulationSlug.replaceAll("-", " ")}</p><p className="mt-2 font-orbitron text-2xl font-bold">{attempt.score === null ? "Em andamento" : `${Math.round((attempt.score / attempt.totalQuestions) * 100)}%`}</p><p className="mt-1 text-xs text-muted-foreground">{attempt.timedOut ? "Tempo encerrado" : attempt.passed ? "Meta alcançada" : "Continue praticando"}</p></div>)}</div></section>}
      </>}

      {active && <section className="mx-auto max-w-4xl"><div className="sticky top-[72px] z-20 mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neon-purple/25 bg-[oklch(0.09_0.025_260/0.95)] p-4 backdrop-blur"><div><p className="text-xs font-bold tracking-[0.16em] text-neon-purple">{active.simulation.title.toUpperCase()}</p><p className="mt-1 text-sm text-muted-foreground">{answers.filter((answer) => answer >= 0).length}/{active.simulation.questions.length} respondidas</p></div><div className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-orbitron text-xl font-bold ${remaining <= 120_000 ? "bg-red-500/12 text-red-300" : "bg-neon-cyan/10 text-neon-cyan"}`}><Clock3 className="h-5 w-5" /> {formatRemaining(remaining)}</div></div><div className="rounded-3xl border border-white/12 bg-[oklch(0.11_0.02_260/0.9)] p-5 md:p-8"><h1 className="font-orbitron text-2xl font-black md:text-3xl">{active.simulation.title}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Responda todas as questões antes do prazo. O envio ocorre automaticamente quando o tempo terminar.</p><div className="mt-8 space-y-7">{active.simulation.questions.map((question, index) => <fieldset key={question.id} className="border-t border-white/10 pt-6 first:border-0 first:pt-0"><legend className="font-semibold leading-6"><span className="mr-2 text-neon-cyan">{String(index + 1).padStart(2, "0")}</span>{question.prompt}</legend><div className="mt-4 grid gap-2">{question.options.map((option, optionIndex) => <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors ${answers[index] === optionIndex ? "border-neon-cyan/60 bg-neon-cyan/10" : "border-white/10 bg-white/[0.025] hover:border-white/25"}`}><input className="mt-0.5 accent-cyan-400" type="radio" name={question.id} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? optionIndex : answer))} /><span>{option}</span></label>)}</div></fieldset>)}</div><button type="button" onClick={submitCurrent} disabled={submitMutation.isPending} className="orbit-button mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60">{submitMutation.isPending ? "Corrigindo..." : "Enviar simulado"} <CheckCircle2 className="h-4 w-4" /></button></div></section>}

      {result && <section className="mx-auto max-w-4xl rounded-3xl border border-white/12 bg-[oklch(0.11_0.02_260/0.92)] p-6 md:p-9"><div className="flex flex-wrap items-start justify-between gap-5"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan"><CheckCircle2 className="h-4 w-4" /> SESSÃO CONCLUÍDA</p><h1 className="mt-3 font-orbitron text-3xl font-black">{result.percentage}% de acerto</h1><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{result.timedOut ? "O tempo da sessão terminou; as respostas enviadas foram registradas para revisão, mas a tentativa não pode ser aprovada." : result.passed ? "Meta alcançada. Revise as explicações e prossiga para a formação recomendada." : "Continue praticando: a revisão abaixo mostra como fortalecer seus fundamentos."}</p></div><div className={`rounded-2xl border p-4 text-center ${result.passed && !result.timedOut ? "border-neon-green/30 bg-neon-green/10 text-neon-green" : "border-neon-purple/30 bg-neon-purple/10 text-neon-purple"}`}><p className="font-orbitron text-2xl font-bold">{result.score}/{result.totalQuestions}</p><p className="mt-1 text-xs font-bold">{result.passed && !result.timedOut ? "META ALCANÇADA" : "REVISAR E TENTAR"}</p></div></div><div className="mt-8 space-y-3">{result.review.map((item, index) => <article key={item.id} className={`rounded-xl border p-4 ${item.correct ? "border-neon-green/20 bg-neon-green/[0.06]" : "border-white/10 bg-white/[0.025]"}`}><p className="text-sm font-bold"><span className={item.correct ? "text-neon-green" : "text-neon-purple"}>{item.correct ? "Correta" : "Revisar"}</span> · questão {index + 1}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.explanation}</p></article>)}</div><div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => { setResult(null); setAnswers([]); }} className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"><RotateCcw className="h-4 w-4" /> Escolher outro simulado</button><Link href="/catalog" className="inline-flex items-center gap-2 rounded-xl border border-white/18 px-4 py-3 text-sm font-bold hover:border-neon-cyan/50">Ver formações recomendadas <ArrowLeft className="h-4 w-4 rotate-180" /></Link></div></section>}
    </main>
  </div>;
}
