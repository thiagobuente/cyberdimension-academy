import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Shield, Trophy, CheckCircle, Star, Award, Compass, Flame, Target, TrendingUp } from "lucide-react";
import { domainMasteryBadgeCode, domainMasteryBadgeMeta, DOMAIN_MASTERY_THRESHOLD } from "@shared/domainMastery";

export default function Progress() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const [domains, setDomains] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  const domainsQuery = trpc.domains.list.useQuery();
  const progressQuery = trpc.progress.list.useQuery();
  const certsQuery = trpc.certificates.list.useQuery();
    const quizHistory = trpc.quiz.history.useQuery();
  const streakQuery = trpc.studyStreak.status.useQuery(undefined, { refetchOnWindowFocus: false });
  const streakMutation = trpc.studyStreak.markStudyDay.useMutation({
    onSuccess: () => streakQuery.refetch(),
  });
  const [domainStats, setDomainStats] = useState<Record<number, { attempts: number; totalAnswered: number; totalCorrect: number; bestPct: number }>>({});
  useEffect(() => {
    if (domainsQuery.data) setDomains(domainsQuery.data);
    if (progressQuery.data) setProgress(progressQuery.data);
    if (certsQuery.data) setCertificates(certsQuery.data);
  }, [domainsQuery.data, progressQuery.data, certsQuery.data]);
  useEffect(() => {
    if (quizHistory.data && domains.length > 0) {
      const stats: Record<number, { attempts: number; totalAnswered: number; totalCorrect: number; bestPct: number }> = {};
      for (const quiz of quizHistory.data) {
        const answers: Array<{ correct?: boolean }> = Array.isArray(quiz.answers) ? quiz.answers : [];
        if (!stats[quiz.domainId]) stats[quiz.domainId] = { attempts: 0, totalAnswered: 0, totalCorrect: 0, bestPct: 0 };
        const bucket = stats[quiz.domainId];
        bucket.attempts += 1;
        bucket.totalAnswered += quiz.totalQuestions;
        bucket.totalCorrect += quiz.score;
        const pct = Math.round((quiz.score / quiz.totalQuestions) * 100);
        if (pct > bucket.bestPct) bucket.bestPct = pct;
      }
      setDomainStats(stats);
    }
  }, [quizHistory.data, domains]);

  const utils = trpc.useUtils();
  const [lessonCounts, setLessonCounts] = useState<Record<number, number>>({});
  const [countsLoaded, setCountsLoaded] = useState(false);

  useEffect(() => {
    if (domains.length > 0) {
      Promise.all(domains.map(async (d) => {
        try {
          const count = await utils.progress.lessonCount.fetch({ domainId: d.id });
          setLessonCounts(prev => ({ ...prev, [d.id]: count }));
        } catch {
          setLessonCounts(prev => ({ ...prev, [d.id]: 0 }));
        }
      })).then(() => setCountsLoaded(true));
    }
  }, [domains]);

  const getDomainProgress = (domainId: number) => {
    const domainProgress = progress.filter(p => p.domainId === domainId && p.completed);
    return domainProgress.length;
  };

  const getDomainQuizHistory = (domainId: number) => {
    if (!quizHistory.data) return [];
    return quizHistory.data.filter(q => q.domainId === domainId);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white" style={{ width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.2 }} />
      ))}

      <header className="relative z-10 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center gap-4 py-4">
          <Link href="/dashboard">
            <span className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </span>
          </Link>
          <Shield className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
          <span className="font-bold font-[Orbitron] text-sm">Meu Progresso</span>
        </div>
      </header>

      <main className="relative z-10 container py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold font-[Orbitron] mb-6">Seu Progresso</h1>

        {/* Streak diário */}
        <div className="mb-8 rounded-xl border border-[oklch(0.78_0.2_150/0.3)] bg-card/30 p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-[oklch(0.75_0.18_45)]" />
              <div>
                <p className="font-bold text-lg font-[Orbitron]">{streakQuery.data?.currentStreak ?? 0} dias</p>
                <p className="text-xs text-muted-foreground">de sequência de estudo</p>
              </div>
            </div>
            <div className="text-right">
              {streakQuery.data?.todayAwardedXp ? (
                <p className="text-sm font-semibold text-[oklch(0.78_0.2_150)]">+{streakQuery.data.todayAwardedXp} XP hoje</p>
              ) : streakQuery.data?.grantedToday ? (
                <p className="text-sm text-[oklch(0.78_0.2_150)]">XP do dia já registrado</p>
              ) : (
                <p className="text-xs text-muted-foreground mb-1">Registre seu estudo de hoje</p>
              )}
              <button
                onClick={() => streakMutation.mutate()}
                disabled={streakQuery.data?.grantedToday || streakMutation.isPending}
                className="mt-1 text-xs font-semibold px-4 py-2 rounded-lg border border-[oklch(0.78_0.2_150/0.4)] bg-[oklch(0.78_0.2_150/0.12)] text-[oklch(0.78_0.2_150)] hover:bg-[oklch(0.78_0.2_150/0.2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {streakMutation.isPending ? "Registrando..." : "Registrar dia de estudo"}
              </button>
            </div>
          </div>
          {streakQuery.data && streakQuery.data.nextMilestone && (
            <p className="mt-3 text-xs text-muted-foreground">
              Próximo marco: <span className="text-[oklch(0.85_0.2_195)] font-medium">{streakQuery.data.nextMilestone.length} dias</span> (+{streakQuery.data.nextMilestone.xp} XP)
            </p>
          )}
          {streakQuery.data && streakQuery.data.earnedMilestones.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">Marcos conquistados: {streakQuery.data.earnedMilestones.join(" · ")}</p>
          )}
        </div>

        <Link href="/securityplus/trilha" className="mb-8 flex items-center justify-between gap-4 rounded-xl border border-[oklch(0.65_0.25_280/0.35)] bg-[oklch(0.65_0.25_280/0.08)] p-4 transition-colors hover:border-[oklch(0.85_0.2_195/0.5)]">
          <div><p className="text-xs font-bold tracking-[0.14em] text-[oklch(0.65_0.25_280)]">TRILHA SEMANAL SECURITY+</p><p className="mt-1 text-sm text-muted-foreground">Organize seus próximos estudos em seis missões com metas por domínio.</p></div><Compass className="h-5 w-5 shrink-0 text-[oklch(0.85_0.2_195)]" />
        </Link>

        {/* Certificates */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[oklch(0.78_0.2_150)]" />
            Certificados ({certificates.length})
          </h2>
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certificates.map((cert) => {
                const domain = domains.find(d => d.id === cert.domainId);
                return (
                  <div key={cert.id} className="p-4 rounded-lg border border-[oklch(0.78_0.2_150/0.3)] bg-card/30">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-[oklch(0.78_0.2_150)]" />
                      <div>
                        <p className="text-sm font-medium">{domain?.title || "Domínio"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(cert.issuedAt).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>
                    <Link href={`/certificate/${cert.id}`}>
                      <span className="mt-2 inline-block text-xs text-[oklch(0.85_0.2_195)] hover:underline">
                        Ver certificado
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum certificado emitido ainda. Conclua um domínio para receber seu certificado.</p>
          )}
        </div>

        {/* Domain Progress */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
          Progresso por Domínio
        </h2>
        <div className="space-y-4">
          {domains.map((domain) => {
            const completed = getDomainProgress(domain.id);
            const quizzes = getDomainQuizHistory(domain.id);
            const bestScore = quizzes.length > 0 ? Math.max(...quizzes.map(q => Math.round((q.score / q.totalQuestions) * 100))) : 0;
            const totalLessons = lessonCounts[domain.id] || 0;
            const progressPct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
            const showProgress = countsLoaded || totalLessons > 0;

            return (
              <div key={domain.id} className="p-4 rounded-lg border border-border bg-card/30">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{domain.title}</h3>
                  <span className="text-xs text-[oklch(0.85_0.2_195)]">
                    {!countsLoaded && totalLessons === 0 ? "Carregando..." : `${progressPct}%`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[oklch(0.85_0.2_195/0.1)] overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[oklch(0.85_0.2_195)] to-[oklch(0.65_0.25_280)]"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{completed} lições concluídas</span>
                  {quizzes.length > 0 && <span>Último simulado: {bestScore}%</span>}
                </div>
                {domainStats[domain.id] && domainStats[domain.id].attempts > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                    {(() => {
                      const stats = domainStats[domain.id];
                      const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0;
                      const needsAttention = accuracy > 0 && accuracy < 70;
                      const mastered = stats.bestPct >= DOMAIN_MASTERY_THRESHOLD;
                      const badgeMeta = domainMasteryBadgeMeta[domainMasteryBadgeCode(domain.id)];
                      return (
                        <>
                          <div key={`d-${domain.id}`}>
                            <p className="text-sm font-bold font-[Orbitron]">{stats.attempts}</p>
                            <p className="text-[0.65rem] text-muted-foreground">tentativas</p>
                          </div>
                          <div>
                            <p className={`text-sm font-bold font-[Orbitron] ${needsAttention ? "text-[oklch(0.75_0.18_30)]" : "text-foreground"}`}>{accuracy}%</p>
                            <p className="text-[0.65rem] text-muted-foreground">acerto total</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold font-[Orbitron] text-[oklch(0.85_0.2_195)]">{stats.bestPct}%</p>
                            <p className="text-[0.65rem] text-muted-foreground">melhor simulado</p>
                          </div>
                          <div>
                            {mastered ? (
                              <p className="text-[0.65rem] font-semibold text-[oklch(0.78_0.2_150)] flex items-center justify-center gap-1">
                                <Trophy className="w-3 h-3" /> {badgeMeta?.name ?? "Domínio dominado"}
                              </p>
                            ) : (
                              <p className="text-[0.65rem] text-muted-foreground flex items-center justify-center gap-1">
                                <Target className="w-3 h-3" /> Meta: {DOMAIN_MASTERY_THRESHOLD}% para badge
                              </p>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
