import { SECURITY_PLUS_WEEKLY_TARGET, type SecurityPlusWeeklyMilestone } from "@/data/securityPlusWeeklyPlan";

export type SecurityPlusWeeklyDomainSnapshot = {
  order: number;
  totalLessons: number;
  completedLessons: number;
  bestScore: number | null;
};

export type SecurityPlusWeeklyState = SecurityPlusWeeklyMilestone & {
  lessonProgress: number;
  completedLessons: number;
  totalLessons: number;
  bestScore: number | null;
  complete: boolean;
};

export function getSecurityPlusWeeklyProgress({
  plan,
  domains,
  hasConsolidationAttempt,
}: {
  plan: SecurityPlusWeeklyMilestone[];
  domains: SecurityPlusWeeklyDomainSnapshot[];
  hasConsolidationAttempt: boolean;
}) {
  const domainWeeks = plan.filter((week) => week.domainOrder).map((week) => {
    const domain = domains.find((item) => item.order === week.domainOrder);
    const totalLessons = domain?.totalLessons ?? 0;
    const completedLessons = domain?.completedLessons ?? 0;
    const lessonProgress = totalLessons ? Math.min(Math.round((completedLessons / totalLessons) * 100), 100) : 0;
    const bestScore = domain?.bestScore ?? null;
    const complete = lessonProgress === 100 && (bestScore ?? 0) >= (week.quizTarget ?? SECURITY_PLUS_WEEKLY_TARGET);
    return { ...week, totalLessons, completedLessons, lessonProgress, bestScore, complete };
  });
  const completedDomainWeeks = domainWeeks.filter((week) => week.complete).length;
  const consolidationPlan = plan.find((week) => !week.domainOrder);
  const consolidation = consolidationPlan ? {
    ...consolidationPlan,
    totalLessons: 0,
    completedLessons: 0,
    lessonProgress: domainWeeks.length ? Math.round((completedDomainWeeks / domainWeeks.length) * 100) : 0,
    bestScore: null,
    complete: completedDomainWeeks === domainWeeks.length && hasConsolidationAttempt,
  } : undefined;
  const weekStates: SecurityPlusWeeklyState[] = consolidation ? [...domainWeeks, consolidation] : domainWeeks;
  const completedWeeks = weekStates.filter((week) => week.complete).length;
  const activeWeekIndex = weekStates.findIndex((week) => !week.complete);

  return {
    weekStates,
    completedDomainWeeks,
    completedWeeks,
    totalProgress: weekStates.length ? Math.round((completedWeeks / weekStates.length) * 100) : 0,
    currentWeekNumber: activeWeekIndex === -1 ? weekStates.length : activeWeekIndex + 1,
  };
}
