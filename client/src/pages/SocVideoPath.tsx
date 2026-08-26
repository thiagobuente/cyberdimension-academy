import { useAuth } from "@/_core/hooks/useAuth";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import { getReadingPreferenceClasses } from "@/lib/readingPreferences";
import { trpc } from "@/lib/trpc";
import { ReadingControls } from "@/components/ReadingControls";
import { ArrowLeft, ArrowRight, CheckCircle2, Clapperboard, Radar, ShieldCheck, Video, Waves } from "lucide-react";
import { Link } from "wouter";

const socStages = [
  { number: "01", title: "Triagem orientada a contexto", detail: "Aprenda a operar filas, priorizar alertas, preservar evidências e escalar casos com clareza.", course: "soc-analyst", label: "Assistir SOC Analyst" },
  { number: "02", title: "Telemetria e correlação", detail: "Transforme logs em contexto investigável, usando normalização, correlação e linhas do tempo defensivas.", course: "siem-na-pratica", label: "Assistir SIEM na Prática" },
  { number: "03", title: "Resposta coordenada", detail: "Conecte preparação, contenção, recuperação e melhoria em cenários de resposta a incidentes.", course: "incident-response", label: "Assistir Incident Response" },
  { number: "04", title: "Caça proativa", detail: "Desenvolva hipóteses, investigue telemetria e comunique achados com evidências e limites explícitos.", course: "threat-hunting-avancado", label: "Abrir Threat Hunting" },
  { number: "05", title: "Detecções que evoluem", detail: "Projete, valide e melhore regras defensivas em dados sintéticos, com métricas e playbooks de triagem.", course: "detection-engineering", label: "Assistir Engenharia de Detecção" },
] as const;

const socCourseSlugs = socStages.map((stage) => stage.course);

export default function SocVideoPath() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const { preferences } = useReadingPreferences();
  const summaryQuery = trpc.formations.summary.useQuery(undefined, { enabled: isAuthenticated });
  const completedModules = summaryQuery.data?.modules.filter((item) => item.completed && socCourseSlugs.includes(item.courseSlug as (typeof socCourseSlugs)[number])) ?? [];
  const completedCount = new Set(completedModules.map((item) => `${item.courseSlug}:${item.moduleIndex}`)).size;
  const progress = Math.min(Math.round((completedCount / 15) * 100), 100);

  if (!isAuthenticated || !user) return null;

  return <div className={`weekly-path-study reading-theme-transition min-h-screen space-canvas text-foreground ${getReadingPreferenceClasses(preferences)} ${preferences.focusMode ? "study-focus" : ""}`}>
    <div className="pointer-events-none fixed inset-0 space-grid opacity-55" />
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl"><div className="container flex items-center justify-between gap-3 py-3"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link><Link href="/" className="flex items-center gap-2" aria-label="CyberDimension Academy"><span className="grid h-8 w-8 place-items-center rounded-lg border border-neon-cyan/35 bg-neon-cyan/10"><ShieldCheck className="h-4 w-4 text-neon-cyan" /></span><span className="font-orbitron text-xs font-bold sm:text-sm">CYBER<span className="text-neon-purple">DIMENSION</span></span></Link><ReadingControls compact /></div></header>
    <main className="container relative py-7 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-neon-cyan/25 bg-[linear-gradient(135deg,oklch(0.13_0.045_260/0.96),oklch(0.09_0.025_270/0.9))] p-6 md:p-9"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-neon-purple/15 blur-3xl" /><div className="relative grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"><div><p className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/25 bg-neon-cyan/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-neon-cyan"><Clapperboard className="h-3.5 w-3.5" /> TRILHA SOC EM VÍDEO</p><h1 className="mt-4 font-orbitron text-3xl font-black tracking-[-0.04em] md:text-5xl">Observe. Contextualize. <span className="text-neon-cyan">Proteja.</span></h1><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">Uma progressão audiovisual para quem quer atuar em Security Operations. Estude com vídeos externos complementares, capítulos em português, laboratórios seguros, quizzes e avaliações autorais.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/formacoes/soc-analyst/estudar" className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"><Video className="h-4 w-4" /> Iniciar SOC Analyst</Link><Link href="/formacoes/detection-engineering/estudar" className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-purple/35 bg-neon-purple/10 px-4 py-3 text-sm font-bold text-neon-purple"><Radar className="h-4 w-4" /> Ver Engenharia de Detecção</Link></div></div><aside className="module-card rounded-2xl border border-white/12 p-5"><p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">PROGRESSO SOC</p><p className="mt-3 font-orbitron text-4xl font-bold">{progress}%</p><p className="mt-2 text-sm text-muted-foreground">{completedCount}/15 módulos concluídos em cinco formações.</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green" style={{ width: `${progress}%` }} /></div></aside></div></section>

      <section className="mt-9"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.17em] text-neon-cyan"><Waves className="h-4 w-4" /> ROTA RECOMENDADA</p><h2 className="mt-2 font-orbitron text-2xl font-bold">Da triagem à engenharia de detecção.</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Cada etapa aprofunda a anterior. Conclua os módulos no seu ritmo; as formações em vídeo liberam capítulos, notas, quizzes e as recompensas já integradas à sua conta.</p><div className="mt-5 grid gap-4 lg:grid-cols-2">{socStages.map((stage, index) => <article key={stage.number} className="module-card rounded-2xl border border-white/12 p-5"><div className="flex items-start justify-between gap-4"><span className="font-orbitron text-2xl font-black text-neon-cyan">{stage.number}</span>{index < 3 || index === 4 ? <Clapperboard className="h-5 w-5 text-neon-purple" aria-label="Modo vídeo" /> : <ShieldCheck className="h-5 w-5 text-neon-green" aria-label="Formação prática" />}</div><h3 className="mt-5 font-orbitron text-lg font-bold">{stage.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.detail}</p><Link href={`/formacoes/${stage.course}/estudar`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-neon-cyan hover:underline">{stage.label} <ArrowRight className="h-4 w-4" /></Link></article>)}</div></section>
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-neon-green" /><p>Os vídeos são materiais externos e complementares. A CyberDimension Academy mantém em português a curadoria, os roteiros, as transcrições de apoio, os laboratórios seguros, os quizzes e os critérios de certificação.</p></div>
    </main>
  </div>;
}
