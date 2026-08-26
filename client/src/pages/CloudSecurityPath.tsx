import { useAuth } from "@/_core/hooks/useAuth";
import { ReadingControls } from "@/components/ReadingControls";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import { getReadingPreferenceClasses } from "@/lib/readingPreferences";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, CheckCircle2, Cloud, LockKeyhole, ShieldCheck, Sparkles, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

const cloudStages = [
  { number: "01", title: "Fundamentos compartilhados", detail: "Responsabilidade compartilhada, identidade, rede e logging como base das duas nuvens.", course: "aws-security-fundamentals", label: "AWS Security" },
  { number: "02", title: "Proteção na AWS", detail: "Aprofunde IAM, trilhas de auditoria, criptografia e resposta orientada a evidências.", course: "aws-security-fundamentals", label: "Abrir AWS Security" },
  { number: "03", title: "Proteção no Azure", detail: "Aplique identidade, postura, políticas e monitoramento na plataforma Azure.", course: "azure-security-fundamentals", label: "Abrir Azure Security" },
  { number: "04", title: "Consolidar a especialidade", detail: "Compare decisões, fortaleça a governança e conclua as duas formações para obter a base Cloud Security.", course: "azure-security-fundamentals", label: "Continuar Azure Security" },
];

export default function CloudSecurityPath() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const { preferences } = useReadingPreferences();
  const challengeQuery = trpc.weeklyChallenges.current.useQuery(undefined, { enabled: isAuthenticated });
  const summaryQuery = trpc.formations.summary.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();
  const claimChallenge = trpc.weeklyChallenges.claim.useMutation({
    onSuccess: (result) => {
      void utils.weeklyChallenges.current.invalidate();
      toast.success(result.alreadyClaimed ? "Bônus semanal já resgatado." : `+${result.awardedXp} XP adicionados à sua missão.`);
    },
    onError: (error) => toast.error(error.message),
  });
  const challenge = challengeQuery.data;
  const completedModules = summaryQuery.data?.modules.filter((item) => item.completed) ?? [];
  const cloudCompleted = new Set(completedModules.filter((item) => item.courseSlug === "aws-security-fundamentals" || item.courseSlug === "azure-security-fundamentals").map((item) => `${item.courseSlug}:${item.moduleIndex}`)).size;
  const cloudProgress = Math.min(Math.round((cloudCompleted / 6) * 100), 100);

  if (!isAuthenticated || !user) return null;

  return <div className={`weekly-path-study reading-theme-transition min-h-screen space-canvas text-foreground ${getReadingPreferenceClasses(preferences)} ${preferences.focusMode ? "study-focus" : ""}`}>
    <div className="pointer-events-none fixed inset-0 space-grid opacity-55" />
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl"><div className="container flex items-center justify-between gap-3 py-3"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link><Link href="/" className="flex items-center gap-2" aria-label="CyberDimension Academy"><span className="grid h-8 w-8 place-items-center rounded-lg border border-neon-cyan/35 bg-neon-cyan/10"><ShieldCheck className="h-4 w-4 text-neon-cyan" /></span><span className="font-orbitron text-xs font-bold sm:text-sm">CYBER<span className="text-neon-purple">DIMENSION</span></span></Link><ReadingControls compact /></div></header>
    <main className="container relative py-7 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-neon-cyan/25 bg-[linear-gradient(135deg,oklch(0.13_0.045_260/0.96),oklch(0.09_0.025_270/0.9))] p-6 md:p-9"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-neon-cyan/13 blur-3xl" /><div className="relative grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"><div><p className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/25 bg-neon-cyan/10 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-neon-cyan"><Cloud className="h-3.5 w-3.5" /> ESPECIALIZAÇÃO CLOUD SECURITY</p><h1 className="mt-4 font-orbitron text-3xl font-black tracking-[-0.04em] md:text-5xl">Defenda a nuvem com <span className="text-neon-cyan">contexto.</span></h1><p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">Uma rota prática que conecta AWS Security e Azure Security. Estude identidade, postura, redes, auditoria e resposta sem perder de vista a responsabilidade compartilhada.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/formacoes/aws-security-fundamentals/estudar" className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"><Cloud className="h-4 w-4" /> Iniciar AWS Security</Link><Link href="/formacoes/azure-security-fundamentals/estudar" className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-purple/35 bg-neon-purple/10 px-4 py-3 text-sm font-bold text-neon-purple"><ShieldCheck className="h-4 w-4" /> Explorar Azure Security</Link></div></div><aside className="module-card rounded-2xl border border-white/12 p-5"><p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">PROGRESSO CLOUD</p><p className="mt-3 font-orbitron text-4xl font-bold">{cloudProgress}%</p><p className="mt-2 text-sm text-muted-foreground">{cloudCompleted}/6 módulos concluídos nas duas formações.</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green" style={{ width: `${cloudProgress}%` }} /></div></aside></div></section>

      {challenge && <section className="mt-5 grid gap-5 rounded-2xl border border-neon-green/30 bg-neon-green/[0.06] p-5 md:grid-cols-[1fr_auto] md:items-center"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-green"><Sparkles className="h-4 w-4" /> DESAFIO DA SEMANA · +{challenge.xp} XP</p><h2 className="mt-2 font-orbitron text-xl font-bold">{challenge.title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{challenge.description}</p></div><div className="flex flex-wrap gap-3"><Link href={`/formacoes/${challenge.courseSlug}/estudar`} className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-green/35 bg-neon-green/10 px-4 py-3 text-sm font-bold text-neon-green">{challenge.completed ? "Revisar atividade" : "Abrir desafio"} <ArrowRight className="h-4 w-4" /></Link><button type="button" disabled={!challenge.completed || challenge.claimed || claimChallenge.isPending} onClick={() => claimChallenge.mutate()} className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-green px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:cursor-not-allowed disabled:opacity-55">{challenge.claimed ? <><CheckCircle2 className="h-4 w-4" /> XP resgatado</> : challenge.completed ? <><Zap className="h-4 w-4" /> Resgatar XP</> : <><LockKeyhole className="h-4 w-4" /> Conclua para resgatar</>}</button></div></section>}

      <section className="mt-9"><p className="text-xs font-bold tracking-[0.17em] text-neon-cyan">ROTA RECOMENDADA</p><h2 className="mt-2 font-orbitron text-2xl font-bold">Quatro marcos, duas plataformas.</h2><div className="mt-5 grid gap-4 lg:grid-cols-2">{cloudStages.map((stage) => <article key={stage.number} className="module-card rounded-2xl border border-white/12 p-5"><div className="flex items-start justify-between gap-4"><span className="font-orbitron text-2xl font-black text-neon-cyan">{stage.number}</span><Cloud className="h-5 w-5 text-neon-purple" /></div><h3 className="mt-5 font-orbitron text-lg font-bold">{stage.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.detail}</p><Link href={`/formacoes/${stage.course}/estudar`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-neon-cyan hover:underline">{stage.label} <ArrowRight className="h-4 w-4" /></Link></article>)}</div></section>
      <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">A trilha organiza experiências educativas em nuvem e não substitui requisitos, treinamentos ou certificações oficiais dos provedores.</p>
    </main>
  </div>;
}
