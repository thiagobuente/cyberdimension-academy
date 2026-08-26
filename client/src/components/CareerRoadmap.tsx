import { Link } from "wouter";
import { Award, CheckCircle2, ChevronRight, Lock, PlayCircle, Target } from "lucide-react";

export type RoadmapStatus = "done" | "in-progress" | "next" | "locked";

export interface RoadmapStep {
  title: string;
  slug: string | null;
  status: RoadmapStatus;
}

export interface CareerRoadmapProps {
  steps: RoadmapStep[];
  goalLabel: string;
  compact?: boolean;
}

const statusMeta: Record<RoadmapStatus, { icon: typeof CheckCircle2; label: string; classes: string; ring: string }> = {
  done: { icon: CheckCircle2, label: "Concluído", classes: "border-neon-green/35 bg-neon-green/10 text-neon-green", ring: "ring-neon-green/20" },
  "in-progress": { icon: PlayCircle, label: "Em andamento", classes: "border-amber-300/40 bg-amber-300/10 text-amber-300", ring: "ring-amber-300/20" },
  next: { icon: Target, label: "Próximo", classes: "border-neon-cyan/45 bg-neon-cyan/12 text-neon-cyan", ring: "ring-neon-cyan/25" },
  locked: { icon: Lock, label: "Bloqueado", classes: "border-white/12 bg-black/20 text-muted-foreground/70", ring: "ring-white/5" },
};

export default function CareerRoadmap({ steps, goalLabel, compact = false }: CareerRoadmapProps) {
  const maxVisible = compact ? 6 : 8;
  const visible = steps.slice(0, maxVisible);
  const overflow = steps.length - maxVisible;
  return (
    <div className="relative">
      <div className={`flex flex-wrap items-stretch gap-2 ${compact ? "" : ""}`}>
        {visible.map((step, index) => {
          const meta = statusMeta[step.status];
          const Icon = meta.icon;
          const isNext = step.status === "next";
          return (
            <div key={`${step.title}-${index}`} className="flex items-stretch gap-2">
              {step.slug ? (
                <Link href={`/catalog/${step.slug}`} className={`group flex min-w-[92px] flex-1 flex-col rounded-xl border p-2.5 text-left transition-colors hover:border-neon-cyan/40 hover:ring-2 ${meta.classes} ${meta.ring} ${isNext ? "orbit-button" : ""}`}>
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1 text-[0.62rem] font-bold uppercase tracking-[0.08em]">{meta.label}</span>
                  </div>
                  <span className={`mt-1.5 line-clamp-2 text-[0.72rem] font-bold ${compact ? "leading-4" : "leading-4.5"}`}>{step.title}</span>
                </Link>
              ) : (
                <div className={`flex min-w-[92px] flex-1 flex-col rounded-xl border p-2.5 ${meta.classes}`}>
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-[0.62rem] font-bold uppercase tracking-[0.08em]">{meta.label}</span>
                  </div>
                  <span className="mt-1.5 line-clamp-2 text-[0.72rem] font-bold leading-4">{step.title}</span>
                </div>
              )}
              {index < visible.length - 1 && <ChevronRight className="hidden h-4 w-4 shrink-0 self-center text-muted-foreground/40 sm:block" />}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {overflow > 0 ? <span className="rounded-full border border-white/12 bg-black/15 px-2.5 py-1 text-[0.62rem] font-bold text-muted-foreground">+{overflow} etapas da trilha</span> : null}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1.5 text-[0.68rem] font-bold text-neon-purple">
          <Award className="h-3.5 w-3.5" /> Objetivo: {goalLabel}
        </span>
      </div>
    </div>
  );
}
