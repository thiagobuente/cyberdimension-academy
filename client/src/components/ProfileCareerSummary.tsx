import { Link } from "wouter";
import { Award, Briefcase, GraduationCap, Shield, Target } from "lucide-react";
import { academies, type AcademySlug } from "@/data/curriculumCatalog";
import { getAcademyReadiness, getOverallReadiness, type RealProgress } from "@/data/careerReadiness";

const ACADEMY_HIGHLIGHTS: AcademySlug[] = ["blue-team", "grc", "cloud-security"];

const accentColors: Record<string, { bar: string; text: string; bg: string; border: string }> = {
  "blue-team": { bar: "bg-neon-cyan", text: "text-neon-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/25" },
  "red-team": { bar: "bg-rose-400", text: "text-rose-300", bg: "bg-rose-400/10", border: "border-rose-400/25" },
  grc: { bar: "bg-amber-300", text: "text-amber-300", bg: "bg-amber-300/10", border: "border-amber-300/25" },
  "cloud-security": { bar: "bg-neon-purple", text: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/25" },
  "threat-intelligence": { bar: "bg-neon-green", text: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/25" },
  "security-engineering": { bar: "bg-blue-300", text: "text-blue-300", bg: "bg-blue-300/10", border: "border-blue-300/25" },
  "ai-security": { bar: "bg-lime-300", text: "text-lime-300", bg: "bg-lime-300/10", border: "border-lime-300/25" },
};

export interface ProfileCareerSummaryProps {
  /** Progresso real vindo de trpc.formations.readiness. */
  progress: RealProgress;
  /** Área recomendada pelo teste vocacional (formations.readiness.quizArea). */
  quizArea: string | null;
  /** Projetos Cyber entregues pelo aluno (ids). */
  completedProjectIds: string[];
  /** Certificados emitidos no histórico. */
  certificateCount: number;
  /** Total de evidências de portfólio. */
  evidenceCount: number;
}

/** Resumo profissional do perfil: título de carreira, prontidão geral, academias com %, projetos e certificações. */
export default function ProfileCareerSummary({
  progress,
  quizArea,
  completedProjectIds,
  certificateCount,
  evidenceCount,
}: ProfileCareerSummaryProps) {
  const overall = getOverallReadiness(progress, quizArea);
  const recommendedReadiness = overall.academy ? getAcademyReadiness(overall.academy, progress) : null;

  const highlighted = academies
    .filter((academy) => ACADEMY_HIGHLIGHTS.includes(academy.slug))
    .map((academy) => {
      const readiness = getAcademyReadiness(academy.slug, progress);
      const score = readiness?.score ?? 0;
      return {
        ...academy,
        score,
        hasProgress: Boolean(readiness?.competencies.some((item) => item.status !== "not-started")),
      };
    });

  const careerTitle = recommendedReadiness
    ? `${recommendedReadiness.academyName} Junior`
    : "Cybersecurity Learner";

  const careerSubtitle = recommendedReadiness
    ? `Trilha recomendada: ${recommendedReadiness.academyName}`
    : "Faça o teste vocacional em /carreira para receber sua trilha recomendada";

  return (
    <section className="module-card mt-6 rounded-2xl border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/8 via-transparent to-neon-purple/8 p-5 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan">
            <Shield className="h-4 w-4" /> PORTFÓLIO PROFISSIONAL
          </p>
          <h2 className="mt-2 font-orbitron text-xl font-bold md:text-2xl">{careerTitle}</h2>
          <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
            {careerSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="font-orbitron text-3xl font-bold text-neon-cyan">{overall.score}%</p>
            <p className="mt-1 text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground">CAREER READINESS</p>
          </div>
          <div className="relative h-20 w-20">
            <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="oklch(0.85 0.2 200)" strokeWidth="3" strokeDasharray={`${overall.score}, 100`} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {highlighted.map((academy) => {
          const colors = accentColors[academy.slug] ?? accentColors["blue-team"];
          return (
            <div key={academy.slug} className={`rounded-xl border ${colors.border} ${colors.bg} p-3`}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold tracking-[0.12em] text-foreground/85">
                  <Link href={`/academias/${academy.slug}`} className={`hover:${colors.text}`}>
                    {academy.name}
                  </Link>
                </p>
                <p className={`font-orbitron text-sm font-bold ${colors.text}`}>{academy.score}%</p>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full transition-all duration-500 ${colors.bar}`} style={{ width: `${academy.score}%` }} />
              </div>
              {academy.hasProgress && academy.score < 100 && (
                <p className="mt-1.5 text-[0.65rem] leading-4 text-muted-foreground">
                  Em andamento — continue a sequência de formação na academia.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-neon-green/25 bg-neon-green/10 p-3">
          <Briefcase className="h-5 w-5 shrink-0 text-neon-green" />
          <div className="min-w-0">
            <p className="font-orbitron text-lg font-bold text-neon-green">{completedProjectIds.length}</p>
            <p className="truncate text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground">PROJETOS ENTREGUES</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-neon-cyan/25 bg-neon-cyan/10 p-3">
          <GraduationCap className="h-5 w-5 shrink-0 text-neon-cyan" />
          <div className="min-w-0">
            <p className="font-orbitron text-lg font-bold text-neon-cyan">{certificateCount}</p>
            <p className="truncate text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground">CERTIFICAÇÕES</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 rounded-xl border border-neon-purple/25 bg-neon-purple/10 p-3 sm:flex">
          <Award className="h-5 w-5 shrink-0 text-neon-purple" />
          <div className="min-w-0">
            <p className="font-orbitron text-lg font-bold text-neon-purple">{evidenceCount}</p>
            <p className="truncate text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground">EVIDÊNCIAS</p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link href="/catalog" className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-4 py-2.5 text-xs font-bold text-[oklch(0.1_0.02_260)]">
          <Target className="h-4 w-4" /> Continuar formação
        </Link>
        <Link href="/cyber-projects" className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-green/40 bg-neon-green/10 px-4 py-2.5 text-xs font-bold text-neon-green">
          <Briefcase className="h-4 w-4" /> Ver projetos
        </Link>
      </div>
    </section>
  );
}
