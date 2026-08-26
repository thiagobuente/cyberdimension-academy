/**
 * Cyber Projects — programa de projetos práticos que consolidam a formação.
 * O aluno explora os cinco projetos profissionais, visualiza as etapas de
 * entrega e marca os projetos como concluídos a partir do próprio perfil.
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { type CyberProject } from "@/data/cyberProjects";
import { PROJECT_XP_REWARD } from "@shared/cyberProjects";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock,
  FolderOpen,
  ListChecks,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

const levelColor: Record<CyberProject["level"], string> = {
  Iniciante: "text-neon-green",
  Intermediário: "text-neon-cyan",
  Avançado: "text-neon-purple",
};

const levelBorder: Record<CyberProject["level"], string> = {
  Iniciante: "border-neon-green/30",
  Intermediário: "border-neon-cyan/30",
  Avançado: "border-neon-purple/30",
};

export default function CyberProjects() {
  const { user, isAuthenticated } = useAuth();
  const projectsQuery = trpc.cyberProjects.list.useQuery();
  const completionsQuery = trpc.cyberProjects.completions.useQuery(undefined, { enabled: Boolean(user) });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const detailsQuery = trpc.cyberProjects.details.useQuery<CyberProject>({ projectId: selectedId ?? "" }, { enabled: Boolean(selectedId) });

  const completionMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const completion of completionsQuery.data ?? []) map.set(completion.projectId, true);
    return map;
  }, [completionsQuery.data]);

  const projectWithSteps: CyberProject | null = detailsQuery.data ?? null;

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Início</Link>
          <Link href="/" className="font-orbitron text-xs font-bold tracking-[0.08em]">CYBERDIMENSION <span className="text-neon-cyan">ACADEMY</span></Link>
        </div>
      </header>

      <main className="container relative py-10 md:py-14">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(0.13_0.05_260/0.96),oklch(0.08_0.025_270/0.93))] p-6 md:p-10">
          <div className="absolute -right-10 -top-16 h-60 w-60 rounded-full bg-neon-cyan/15 blur-3xl" />
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan"><Rocket className="h-4 w-4" /> CYBER PROJECTS</p>
          <h1 className="mt-3 font-orbitron text-2xl font-bold md:text-4xl">Consolide sua formação com projetos profissionais</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">Cada curso ensina; cada projeto prova. O programa Cyber Projects reúne cinco entregas profissionais que simulam o trabalho real de cibersegurança — de relatórios de SOC a auditorias e programas de governança. Cada projeto concluído rende <span className="font-bold text-neon-cyan">{PROJECT_XP_REWARD} XP</span> e passa a compor o seu portfólio público.</p>
        </section>

        {!user ? (
          <section className="mt-8 rounded-2xl border border-neon-cyan/25 bg-black/15 p-6 text-center">
            <UserRound className="mx-auto h-8 w-8 text-neon-cyan" />
            <p className="mt-3 text-sm text-muted-foreground">Entre com sua conta para registrar a entrega dos projetos e somar XP.</p>
            <Link href="/login" className="orbit-button mt-4 inline-flex items-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-4 py-2.5 text-sm font-bold text-neon-cyan">Entrar na Academia</Link>
          </section>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm">
            <BadgeCheck className="h-4 w-4 text-neon-green" />
            <p className="font-bold">Seus projetos entregues:</p>
            <p className="text-muted-foreground">{(completionsQuery.data ?? []).length} de {projectsQuery.data?.length ?? 0} · <span className="font-bold text-neon-green">{(completionsQuery.data ?? []).length * PROJECT_XP_REWARD} XP acumulados</span></p>
          </div>
        )}

        <section className="mt-8">
          <h2 className="font-orbitron text-lg font-bold">Os cinco projetos do programa</h2>
          <p className="mt-1 text-sm text-muted-foreground">Toque em um projeto para ver as etapas de entrega. Ao concluir, registre a entrega no seu perfil.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(projectsQuery.data ?? []).map((project) => {
              const completed = completionMap.get(project.id) ?? false;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedId(project.id)}
                  className={`group flex flex-col gap-3 rounded-2xl border bg-black/15 p-5 text-left transition-colors hover:border-neon-cyan/50 hover:bg-neon-cyan/5 ${completed ? "border-neon-green/30" : levelBorder[project.level as CyberProject["level"]]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-neon-cyan/10 text-2xl`}>{project.emoji}</div>
                    {completed ? <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neon-green/15 px-2 py-1 text-[0.65rem] font-bold text-neon-green"><ShieldCheck className="h-3 w-3" /> Entregue</span> : <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neon-cyan/15 px-2 py-1 text-[0.65rem] font-bold text-neon-cyan">+{PROJECT_XP_REWARD} XP</span>}
                  </div>
                  <div>
                    <p className={`text-[0.65rem] font-bold tracking-[0.12em] ${levelColor[project.level as CyberProject["level"]]}`}>{project.area.toUpperCase()} · {project.level.toUpperCase()}</p>
                    <h3 className="mt-1 font-orbitron text-base font-bold leading-6">{project.title}</h3>
                  </div>
                  <p className="line-clamp-3 flex-1 text-xs leading-5 text-muted-foreground">{project.objective}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.slice(0, 3).map((skill) => <span key={skill} className="rounded-lg border border-white/12 bg-white/5 px-2 py-0.5 text-[0.65rem] font-bold tracking-[0.06em] text-muted-foreground">{skill.toUpperCase()}</span>)}
                  </div>
                    <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.1em] text-neon-cyan"><Clock className="h-3 w-3" /> {project.duration} · ETAPAS DE ENTREGA NO DETALHE</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-black/15 p-6 md:p-8">
          <h2 className="font-orbitron text-lg font-bold">Como funciona</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-neon-cyan/25 bg-black/20 p-4">
              <ListChecks className="h-6 w-6 text-neon-cyan" />
              <h3 className="mt-2 text-sm font-bold">1. Escolha o projeto</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Cada projeto cobre uma área profissional: SOC, Red Team, GRC, Cloud Security e Threat Intelligence.</p>
            </div>
            <div className="rounded-xl border border-neon-cyan/25 bg-black/20 p-4">
              <Wrench className="h-6 w-6 text-neon-cyan" />
              <h3 className="mt-2 text-sm font-bold">2. Entregue as etapas</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Siga o roteiro de entrega e produza o artefato profissional descrito no projeto, no seu ritmo.</p>
            </div>
            <div className="rounded-xl border border-neon-cyan/25 bg-black/20 p-4">
              <Sparkles className="h-6 w-6 text-neon-cyan" />
              <h3 className="mt-2 text-sm font-bold">3. Registre no portfólio</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Marque como entregue no perfil, some {PROJECT_XP_REWARD} XP e exiba o projeto no seu portfólio público.</p>
            </div>
          </div>
        </section>
      </main>

              {projectWithSteps && !detailsQuery.isLoading && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setSelectedId(null)}>
          <div className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border border-neon-cyan/30 bg-[oklch(0.09_0.03_260)] p-5 md:max-w-2xl md:rounded-3xl sm:p-7" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-neon-cyan/10 text-2xl">{projectWithSteps.emoji}</span>
                <div>
                  <p className={`text-[0.65rem] font-bold tracking-[0.12em] ${levelColor[projectWithSteps.level as CyberProject["level"]]}`}>{projectWithSteps.area.toUpperCase()} · {projectWithSteps.level.toUpperCase()}</p>
                  <h3 className="font-orbitron text-lg font-bold leading-7">{projectWithSteps.title}</h3>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} className="rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-muted-foreground hover:text-foreground">Fechar</button>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{projectWithSteps.objective}</p>

            <div className="mt-4 rounded-xl border border-neon-green/25 bg-neon-green/5 p-4">
              <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.12em] text-neon-green"><Target className="h-3 w-3" /> ARTEFATO DE ENTREGA</p>
              <p className="mt-1.5 text-xs leading-5">{projectWithSteps.deliverable}</p>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.12em] text-muted-foreground"><FolderOpen className="h-3 w-3" /> PRÉ-REQUISITOS RECOMENDADOS</p>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{projectWithSteps.prerequisites.join(" · ") || "Nenhum pré-requisito obrigatório"}</p>
            </div>

            <div className="mt-4">
              <p className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.12em] text-neon-cyan"><ListChecks className="h-3 w-3" /> ROTEIRO DE ENTREGA</p>
              <ol className="mt-2 space-y-2">
                {projectWithSteps.steps.map((step) => (
                  <li key={step.step} className="flex gap-3 rounded-xl border border-white/10 bg-black/15 p-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-neon-cyan/40 bg-neon-cyan/10 text-[0.65rem] font-bold text-neon-cyan">{step.step}</span>
                    <div>
                      <p className="text-xs font-bold">{step.title}</p>
                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">Tempo estimado: {projectWithSteps.duration} · Recompensa: {PROJECT_XP_REWARD} XP</p>
              {completionMap.get(projectWithSteps.id) ? (
                <span className="inline-flex items-center justify-center gap-2 rounded-lg border border-neon-green/35 bg-neon-green/10 px-4 py-2 text-xs font-bold text-neon-green"><CheckCircle2 className="h-4 w-4" /> Projeto entregue</span>
              ) : isAuthenticated ? (
                <Link href="/profile" onClick={() => setSelectedId(null)} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-xs font-bold text-neon-cyan">Registrar entrega no perfil</Link>
              ) : (
                <Link href="/login" className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-xs font-bold text-neon-cyan">Entrar para registrar</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
