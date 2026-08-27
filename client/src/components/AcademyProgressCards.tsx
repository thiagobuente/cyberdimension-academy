import { academies, type AcademySlug } from "@/data/curriculumCatalog";
import { getAcademyReadiness } from "@/data/careerReadiness";
import { Link } from "wouter";
import { ArrowRight, GraduationCap, Lock } from "lucide-react";

const academyColor: Record<AcademySlug, { text: string; bg: string; border: string; bar: string; icon: string }> = {
  "blue-team": { text: "text-neon-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/25", bar: "from-neon-cyan to-[oklch(0.67_0.2_240)]", icon: "bg-neon-cyan/15 text-neon-cyan" },
  "red-team": { text: "text-rose-300", bg: "bg-rose-400/10", border: "border-rose-400/25", bar: "from-rose-400 to-neon-purple", icon: "bg-rose-400/15 text-rose-300" },
  grc: { text: "text-amber-300", bg: "bg-amber-400/10", border: "border-amber-400/25", bar: "from-amber-400 to-[oklch(0.75_0.15_80)]", icon: "bg-amber-400/15 text-amber-300" },
  "cloud-security": { text: "text-neon-purple", bg: "bg-neon-purple/10", border: "border-neon-purple/25", bar: "from-neon-purple to-neon-cyan", icon: "bg-neon-purple/15 text-neon-purple" },
  "threat-intelligence": { text: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/25", bar: "from-neon-green to-neon-cyan", icon: "bg-neon-green/15 text-neon-green" },
  "security-engineering": { text: "text-sky-300", bg: "bg-sky-400/10", border: "border-sky-400/25", bar: "from-sky-400 to-neon-purple", icon: "bg-sky-400/15 text-sky-300" },
  "ai-security": { text: "text-lime-300", bg: "bg-lime-400/10", border: "border-lime-400/25", bar: "from-lime-400 to-neon-green", icon: "bg-lime-400/15 text-lime-300" },
  "artificial-intelligence": { text: "text-cyan-200", bg: "bg-cyan-400/10", border: "border-cyan-400/25", bar: "from-cyan-300 to-blue-400", icon: "bg-cyan-400/15 text-cyan-200" },
};

interface AcademyProgressCardsProps {
  /** Progresso real retornado por formations.readiness. */
  progress: {
    modules: Array<{ courseSlug: string; moduleIndex: number; completed: boolean }>;
    labs?: Array<{ courseSlug: string; labIndex: number; completed: boolean }>;
    certificates?: Array<{ courseSlug: string }>;
  };
  /** Área recomendada pelo teste vocacional, quando disponível. */
  quizArea: string | null;
}

/**
 * Mini-cards clicáveis por academia: % de prontidão (Career Readiness) e
 * próximo passo, levando direto à rota da academia no Mapa da Cyberdimension.
 */
export function AcademyProgressCards({ progress, quizArea }: AcademyProgressCardsProps) {
  const items = academies.map((academy) => {
    const readiness = getAcademyReadiness(academy.slug, progress);
    const score = readiness?.score ?? 0;
    const doneCount = readiness ? readiness.competencies.filter((c) => c.status === "done").length : 0;
    const total = readiness?.competencies.length ?? 0;
    const isRecommended = quizArea && getRecommendedMatch(quizArea) === academy.slug;
    return { academy, readiness, score, doneCount, total, isRecommended };
  });
  const recommended = items.find((item) => item.isRecommended);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">TRILHAS POR ACADEMIA</p>
          <h2 className="mt-1 font-orbitron text-lg font-bold md:text-xl">Sua prontidão em cada rota.</h2>
          <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
            Cada card mede o quanto você já avançou na sequência da academia. Selecione uma rota para continuar.
          </p>
        </div>
        <Link
          href="/catalog"
          className="orbit-button inline-flex items-center gap-2 text-xs font-bold text-neon-cyan hover:underline"
        >
          Mapa completo <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items
          .sort((a, b) => Number(b.isRecommended) - Number(a.isRecommended))
          .map(({ academy, score, doneCount, total, isRecommended }) => {
            const palette = academyColor[academy.slug];
            return (
              <Link
                key={academy.slug}
                href={`/academias/${academy.slug}`}
                className={`group relative flex min-h-[118px] flex-col justify-between overflow-hidden rounded-2xl border ${palette.border} ${palette.bg} p-4 transition-transform duration-200 hover:-translate-y-0.5`}
              >
                {isRecommended && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-neon-green/30 bg-neon-green/15 px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.12em] text-neon-green">
                    Recomendada
                  </span>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-orbitron text-[0.72rem] font-bold leading-tight">{academy.name}</p>
                    <p className="mt-1 line-clamp-2 text-[0.68rem] leading-4 text-muted-foreground">{academy.tagline}</p>
                  </div>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${palette.icon}`} aria-hidden="true">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-end justify-between gap-2">
                    <span className={`font-orbitron text-xl font-bold ${palette.text}`}>{score}%</span>
                    <span className="text-[0.65rem] leading-4 text-muted-foreground">
                      {total > 0 ? `${doneCount}/${total} cursos` : "Sequência em rota"}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${palette.bar}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  {score === 0 && total > 0 && (
                    <p className="mt-2 flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                      <Lock className="h-3 w-3" /> Comece pelo primeiro curso da rota
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
      </div>
      {recommended && recommended.readiness?.nextStep && (
        <Link
          href={recommended.readiness.nextStep.slug ? `/academias/${recommended.academy.slug}` : "/catalog"}
          className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-green/30 bg-neon-green/10 px-4 py-3 text-sm font-bold text-neon-green hover:bg-neon-green/15"
        >
          <GraduationCap className="h-4 w-4" />
          Continuar em {recommended.academy.name}: {recommended.readiness.nextStep.title}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function getRecommendedMatch(quizArea: string): AcademySlug | null {
  const area = quizArea.toLowerCase();
  if (area.includes("blue") || area.includes("defesa") || area.includes("soc")) return "blue-team";
  if (area.includes("red") || area.includes("ofensiva") || area.includes("pentest")) return "red-team";
  if (area.includes("grc") || area.includes("governan") || area.includes("risco")) return "grc";
  if (area.includes("cloud") || area.includes("nuvem")) return "cloud-security";
  if (area.includes("intelig") || area.includes("threat")) return "threat-intelligence";
  if (area.includes("engen") || area.includes("devsec")) return "security-engineering";
  if (area.includes("ai") || area.includes("ia")) return "ai-security";
  return null;
}
