import { careerGoals } from "@/data/curriculumCatalog";
import { getAcademyReadiness, getRecommendedAcademy, type RealProgress } from "@/data/careerReadiness";
import { getCurriculumCourseByTitle } from "@/data/curriculumCatalog";
import { Link } from "wouter";
import {
  Award,
  BookOpen,
  FlaskConical,
  Layers,
  Lightbulb,
  ShieldCheck,
  Target,
} from "lucide-react";

/**
 * Progresso Profissional — os cinco pilares da jornada do aluno.
 *
 * Responde a "onde estou na jornada profissional?": Fundamentos → Conhecimento →
 * Prática → Projetos → Certificação, cada pilar medido a partir do progresso real
 * do aluno, com a mensagem de distância até a função-alvo.
 */
export interface ProfessionalProgressData {
  progress: RealProgress;
  quizArea: string | null;
  projectsCompleted: number;
  projectsTotal: number;
  /** Total de módulos + labs da rota da carreira-alvo. */
  careerTotal: number;
  /** Módulos + labs da rota da carreira-alvo já concluídos. */
  careerCompleted: number;
}

export interface PillarState {
  key: "fundamentos" | "conhecimento" | "pratica" | "projetos" | "certificacao";
  label: string;
  icon: typeof BookOpen;
  /** Percentual de conclusão do pilar. */
  percent: number;
  /** Texto curto do estado (ex.: "1 de 4 módulos"). */
  detail: string;
  status: "done" | "in-progress" | "not-started";
}

const PILLAR_META = 0.6;
const PILLAR_FULL = 1.0;

/**
 * Calcula o estado dos cinco pilares a partir do progresso real.
 *
 * - Fundamentos: cursos com nível Iniciante concluídos (módulos 100%).
 * - Conhecimento: cursos com nível Intermediário concluídos.
 * - Prática: laboratórios da rota da carreira-alvo concluídos.
 * - Projetos: projetos CyberProjects concluídos.
 * - Certificação: certificados emitidos na rota da carreira-alvo.
 */
export function computePillars(data: ProfessionalProgressData): { pillars: PillarState[]; overallPercent: number; careerLabel: string } {
  const { progress, quizArea, projectsCompleted, projectsTotal, careerTotal, careerCompleted } = data;
  const academySlug = getRecommendedAcademy(quizArea);
  const goalReadiness = academySlug ? getAcademyReadiness(academySlug, progress) : null;
  const goalCareer = careerGoals.find((item) => item.academy === academySlug);
  const careerLabel = goalCareer?.recommendedTrilha ?? goalReadiness?.academyName ?? "sua carreira em cibersegurança";

  // Fundamentos: cursos iniciantes da sequência da carreira concluídos.
  const sequence = goalReadiness?.competencies ?? [];
  const beginner = sequence.filter((item) => getCurriculumCourseByTitle(item.title)?.level === "Iniciante");
  const beginnerDone = beginner.filter((item) => item.status === "done").length;
  // Conhecimento: intermediários concluídos.
  const intermediate = sequence.filter((item) => getCurriculumCourseByTitle(item.title)?.level === "Intermediário" || getCurriculumCourseByTitle(item.title)?.level === "Avançado");
  const intermediateDone = intermediate.filter((item) => item.status === "done").length;

  const labsCompleted = progress.labs?.filter((lab) => lab.completed).length ?? 0;
  const labsTotal = progress.labs?.length ?? 0;
  const certificates = progress.certificates?.length ?? 0;

  const pillars: PillarState[] = [
    {
      key: "fundamentos",
      label: "Fundamentos",
      icon: BookOpen,
      percent: beginner.length === 0 ? 0 : Math.round((beginnerDone / beginner.length) * 100),
      detail: beginner.length === 0 ? "Defina sua carreira para ativar" : `${beginnerDone} de ${beginner.length} cursos iniciantes`,
      status: beginner.length === 0 ? "not-started" : beginnerDone === beginner.length ? "done" : beginnerDone > 0 ? "in-progress" : "not-started",
    },
    {
      key: "conhecimento",
      label: "Conhecimento",
      icon: Layers,
      percent: intermediate.length === 0 ? 0 : Math.round((intermediateDone / intermediate.length) * 100),
      detail: intermediate.length === 0 ? "Defina sua carreira para ativar" : `${intermediateDone} de ${intermediate.length} cursos técnicos`,
      status: intermediate.length === 0 ? "not-started" : intermediateDone === intermediate.length ? "done" : intermediateDone > 0 ? "in-progress" : "not-started",
    },
    {
      key: "pratica",
      label: "Prática",
      icon: FlaskConical,
      percent: labsTotal === 0 ? 0 : Math.round((labsCompleted / labsTotal) * 100),
      detail: labsTotal === 0 ? "Sem laboratórios registrados" : `${labsCompleted} de ${labsTotal} laboratórios`,
      status: labsTotal === 0 ? "not-started" : labsCompleted === labsTotal ? "done" : labsCompleted > 0 ? "in-progress" : "not-started",
    },
    {
      key: "projetos",
      label: "Projetos",
      icon: Lightbulb,
      percent: projectsTotal === 0 ? 0 : Math.round((projectsCompleted / projectsTotal) * 100),
      detail: projectsTotal === 0 ? "Sem projetos registrados" : `${projectsCompleted} de ${projectsTotal} projetos`,
      status: projectsTotal === 0 ? "not-started" : projectsCompleted === projectsTotal ? "done" : projectsCompleted > 0 ? "in-progress" : "not-started",
    },
    {
      key: "certificacao",
      label: "Certificação",
      icon: Award,
      percent: careerTotal === 0 ? 0 : Math.round((certificates / careerTotal) * 100),
      detail: careerTotal === 0 ? "Conclua módulos da rota" : `${certificates} de ${careerTotal} certificados da rota`,
      status: careerTotal === 0 ? "not-started" : certificates === careerTotal ? "done" : certificates > 0 ? "in-progress" : "not-started",
    },
  ];

  const activePillars = [
    beginnerDone / Math.max(beginner.length, 1),
    intermediateDone / Math.max(intermediate.length, 1),
    labsTotal === 0 ? 0 : labsCompleted / labsTotal,
    projectsTotal === 0 ? 0 : projectsCompleted / projectsTotal,
    careerTotal === 0 ? 0 : certificates / careerTotal,
  ];
  const overallPercent = Math.round((activePillars.reduce((sum, value) => sum + value, 0) / activePillars.length) * 100);

  return { pillars, overallPercent, careerLabel };
}

/** Mensagem de distância até a função-alvo. */
export function distanceMessage(
  overallPercent: number,
  careerLabel: string,
  hasCareer: boolean,
): { label: string; description: string; tone: "neutral" | "near" | "ready" | "unknown" } {
  if (!hasCareer) {
    return {
      label: `Sua jornada profissional começa quando a rota é definida.`,
      description: `Faça o teste vocacional para vincular esta visão à sua carreira-alvo.`,
      tone: "unknown",
    };
  }
  if (overallPercent >= 85) {
    return {
      label: "Você está pronto para se candidatar.",
      description: `A jornada até ${careerLabel} está praticamente completa. Conclua os últimos marcos e apresente seu portfólio.`,
      tone: "ready",
    };
  }
  if (overallPercent >= 50) {
    return {
      label: `A ${overallPercent >= PILLAR_META ? "metade" : `${overallPercent}%` } do caminho até ${careerLabel} foi percorrida.`,
      description: "Você já combina fundamentos, prática e projetos. Falta aprofundar os cursos técnicos e a certificação da rota.",
      tone: "near",
    };
  }
  return {
    label: `Você está a ${100 - overallPercent}% de ${careerLabel}.`,
    description: "Cada pilar avançado aproxima você da função. Siga a ordem: Fundamentos, Conhecimento, Prática, Projetos e Certificação.",
    tone: "neutral",
  };
}

interface ProfessionalProgressProps {
  data: ProfessionalProgressData;
}

const STATUS_STYLES = {
  done: { pill: "border-neon-green/35 bg-neon-green/12 text-neon-green", bar: "bg-gradient-to-r from-neon-green to-[oklch(0.75_0.18_155)]" },
  "in-progress": { pill: "border-neon-cyan/35 bg-neon-cyan/12 text-neon-cyan", bar: "bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)]" },
  "not-started": { pill: "border-white/15 bg-white/[0.04] text-muted-foreground", bar: "bg-white/12" },
} as const;

const STATUS_LABELS = { done: "Concluído", "in-progress": "Em andamento", "not-started": "Não iniciado" };

export function ProfessionalProgress({ data }: ProfessionalProgressProps) {
  const { pillars, overallPercent, careerLabel } = computePillars(data);
  const hasCareer = data.quizArea !== null;
  const message = distanceMessage(overallPercent, careerLabel, hasCareer);
  const nextPillar = pillars.find((pillar) => pillar.status === "in-progress" || pillar.status === "not-started");
  const allDone = !nextPillar;

  return (
    <section className="rounded-2xl border border-neon-green/25 bg-gradient-to-br from-neon-green/[0.06] via-transparent to-neon-cyan/[0.06] p-5 md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-green">
            <ShieldCheck className="h-3.5 w-3.5" /> PROGRESSO PROFISSIONAL
          </p>
          <h2 className="mt-2 font-orbitron text-lg font-bold md:text-xl">{careerLabel}</h2>
          <p className={`mt-2 text-sm font-bold ${message.tone === "ready" ? "text-neon-green" : message.tone === "near" ? "text-neon-cyan" : "text-muted-foreground"}`}>
            <Target className="mr-1.5 inline h-4 w-4" />
            {message.label}
          </p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{message.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-center">
            <p className="font-orbitron text-2xl font-bold text-neon-green">{overallPercent}%</p>
            <p className="text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground">JORNADA</p>
          </div>
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3.2" />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="oklch(0.75 0.18 155)"
                strokeWidth="3.2"
                strokeDasharray={`${overallPercent}, 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Os cinco pilares: Fundamentos → Conhecimento → Prática → Projetos → Certificação */}
      <ol className="mt-6 grid gap-3 sm:grid-cols-5">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          const styles = STATUS_STYLES[pillar.status];
          return (
            <li key={pillar.key} className="rounded-xl border border-white/10 bg-black/25 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/[0.05]">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.08em] ${styles.pill}`}>
                  {STATUS_LABELS[pillar.status]}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-2 font-sans text-sm font-bold text-foreground">
                <span className="font-orbitron text-[0.6rem] font-bold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                {pillar.label}
                {index > 0 && <span className="hidden text-[0.6rem] text-muted-foreground sm:inline">·</span>}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{pillar.detail}</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full ${styles.bar} transition-all`} style={{ width: `${pillar.percent}%` }} />
              </div>
              <p className="mt-1.5 text-right text-[0.62rem] font-bold text-muted-foreground">{pillar.percent}%</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {allDone ? (
          <Link
            href="/profile"
            className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-green to-[oklch(0.75_0.18_155)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"
          >
            <Award className="h-4 w-4" /> Jornada completa — abrir meu perfil profissional
          </Link>
        ) : nextPillar ? (
          <>
            {!hasCareer ? (
              <Link
                href="/carreira"
                className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-purple to-[oklch(0.6_0.2_300)] px-5 py-3 text-sm font-bold text-white"
              >
                <Target className="h-4 w-4" /> Definir minha carreira — teste vocacional
              </Link>
            ) : (
              <Link
                href="/progress"
                className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-green to-[oklch(0.75_0.18_155)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"
              >
                <Target className="h-4 w-4" /> Ver o que falta — {nextPillar.label}
              </Link>
            )}
            <Link
              href="/progress"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-xs font-bold text-muted-foreground hover:border-neon-cyan/40 hover:text-neon-cyan"
            >
              <Layers className="h-3.5 w-3.5" /> Progresso detalhado
            </Link>
          </>
        ) : null}
      </div>
    </section>
  );
}
