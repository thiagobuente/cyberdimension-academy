import { careerGoals, getCurriculumCourseByTitle } from "@/data/curriculumCatalog";
import { getAcademyReadiness, getRecommendedAcademy, type RealProgress } from "@/data/careerReadiness";
import CareerRoadmap from "@/components/CareerRoadmap";
import { Link } from "wouter";
import {
  Award,
  Compass,
  ListChecks,
  Rocket,
  Target,
} from "lucide-react";

interface RecommendedPathProps {
  /** Progresso real do aluno (formations.readiness ou formations.summary). */
  progress: RealProgress;
  /** Área recomendada pelo teste vocacional (formations.readiness.quizArea). */
  quizArea: string | null;
  /** Variante de renderização: hero do dashboard ou card do catálogo. */
  variant?: "hero" | "card";
}

/**
 * "Seu caminho recomendado" — o centro do sistema de carreira.
 *
 * Responde em uma tela: onde estou, o que devo estudar, por que e qual o próximo passo.
 * Exibe carreira alvo, progresso da carreira (%), competências dominadas
 * (X de Y), a próxima competência em destaque (vermelha) e o botão Continuar formação.
 */
export function RecommendedPath({ progress, quizArea, variant = "card" }: RecommendedPathProps) {
  const recommendedAcademy = getRecommendedAcademy(quizArea);
  const goalReadiness = recommendedAcademy ? getAcademyReadiness(recommendedAcademy, progress) : null;
  const goalCareer = careerGoals.find((item) => item.academy === recommendedAcademy);

  const dominantCount = goalReadiness?.competencies.filter((item) => item.status === "done").length ?? 0;
  const totalCompetencies = goalReadiness?.competencies.length ?? 0;
  const nextCompetency = goalReadiness?.competencies.find((item) => item.status === "in-progress" || item.status === "not-started");
  const nextCourse = nextCompetency ? getCurriculumCourseByTitle(nextCompetency.title) : null;

  const goalReached = goalReadiness ? goalReadiness.score === 100 : false;
  const hasQuizResult = Boolean(recommendedAcademy);

  if (!hasQuizResult || !goalReadiness) {
    return (
      <section className={`rounded-2xl border border-neon-purple/28 bg-neon-purple/8 p-5`}>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon-purple/30 bg-neon-purple/10">
              <Compass className="h-5 w-5 text-neon-purple" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-neon-purple">SEU CAMINHO RECOMENDADO</p>
              <h2 className="mt-2 font-orbitron text-lg font-bold">Descubra sua carreira para ativar seu caminho.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                O teste vocacional define sua carreira-alvo e monta a sequência de estudos. Sem ele, o caminho recomendado fica
                desativado.
              </p>
            </div>
          </div>
          <Link
            href="/carreira"
            className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neon-purple/35 bg-neon-purple/12 px-4 py-3 text-sm font-bold text-neon-purple"
          >
            <Target className="h-4 w-4" /> Fazer o teste vocacional <Rocket className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  const isHero = variant === "hero";

  return (
    <section
      className={`rounded-2xl border border-neon-cyan/28 bg-gradient-to-br from-neon-cyan/8 via-transparent to-neon-purple/8 p-5 ${
        isHero ? "md:p-6" : ""
      }`}
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan">
            <Compass className="h-3.5 w-3.5" /> SEU CAMINHO RECOMENDADO
          </p>
          <h2 className="mt-2 font-orbitron text-lg font-bold md:text-xl">{goalCareer?.recommendedTrilha ?? goalReadiness.academyName}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4 shrink-0 text-neon-cyan" />
              Progresso da carreira:{" "}
              <span className="font-bold text-neon-cyan">{goalReadiness.score}%</span>
            </p>
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ListChecks className="h-4 w-4 shrink-0 text-neon-purple" />
              Você domina{" "}
              <span className="font-bold text-neon-purple">
                {dominantCount} de {totalCompetencies}
              </span>{" "}
              competências.
            </p>
          </div>
          {nextCompetency && !goalReached && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-neon-purple/25 bg-neon-purple/8 px-3 py-1.5 text-xs font-bold text-neon-purple">
              <Rocket className="h-3.5 w-3.5" /> Próxima competência: {nextCompetency.title}
              {nextCourse ? ` (${nextCourse.level})` : ""}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-center">
            <p className="font-orbitron text-2xl font-bold text-neon-cyan">{goalReadiness.score}%</p>
            <p className="text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground">PRONTIDÃO</p>
          </div>
          <div className="relative h-16 w-16">
            <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="3.2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="oklch(0.85 0.2 200)"
                strokeWidth="3.2"
                strokeDasharray={`${goalReadiness.score}, 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <CareerRoadmap
          steps={goalReadiness.competencies.map((item, index) => {
            const earlierDone = index === 0 ? true : goalReadiness.competencies.slice(0, index).every((prev) => prev.status === "done");
            const status =
              item.status === "done"
                ? ("done" as const)
                : item.status === "in-progress"
                  ? ("in-progress" as const)
                  : earlierDone
                    ? ("next" as const)
                    : ("locked" as const);
            return { title: item.title, slug: item.slug, status };
          })}
          goalLabel={goalCareer?.recommendedTrilha ?? goalReadiness.academyName}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {goalReached ? (
          <Link
            href="/certificados"
            className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-green to-[oklch(0.75_0.18_155)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"
          >
            <Award className="h-4 w-4" /> Objetivo alcançado — confira seus certificados
          </Link>
        ) : nextCompetency?.slug ? (
          <Link
            href={`/catalog/${nextCompetency.slug}`}
            className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"
          >
            <Rocket className="h-4 w-4" /> Continuar formação: {nextCompetency.title}
          </Link>
        ) : (
          <Link
            href={`/academias/${recommendedAcademy}`}
            className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"
          >
            <Rocket className="h-4 w-4" /> Abrir academia {goalReadiness.academyName}
          </Link>
        )}
        <Link
          href={`/academias/${recommendedAcademy}`}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-xs font-bold text-muted-foreground hover:border-neon-cyan/40 hover:text-neon-cyan"
        >
          <Target className="h-3.5 w-3.5" /> Ver carreira completa
        </Link>
      </div>
    </section>
  );
}
