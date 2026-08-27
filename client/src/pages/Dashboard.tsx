import { useAuth } from "@/_core/hooks/useAuth";
import GlobalSearch from "@/components/GlobalSearch";
import { getStarterCourse, starterCourses } from "@/data/courseCatalog";
import { securityPlusWeeklyPlan } from "@/data/securityPlusWeeklyPlan";
import { FREE_VIDEO_COURSE_CATEGORIES, FREE_VIDEO_COURSES } from "@shared/freeVideoCourses";
import { curriculumCourses } from "@/data/curriculumCatalog";
import { calculateMissionXp, GAMIFICATION_RULES, getMissionLevel, getStudyRecommendation } from "@/lib/commandCenter";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { FreeCourseCard, type ContinueWatchCard } from "@/components/FreeCourseCard";
import { RecommendedPath } from "@/components/RecommendedPath";
import { WelcomeModal } from "@/components/WelcomeModal";
import { ProfessionalProgress } from "@/components/ProfessionalProgress";
import { AcademyProgressCards } from "@/components/AcademyProgressCards";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import { getReadingPreferenceClasses } from "@/lib/readingPreferences";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Brain,
  CircleCheckBig,
  Code2,
  Compass,
  Bell,
  ChevronDown,
  Menu,
  Search,
  X,
  FlaskConical,
  Gauge,
  Headphones,
  ListChecks,
  Network,
  Radio,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Terminal,
  Trophy,
  Video,
  Zap,
} from "lucide-react";

const accentPalette = [
  { text: "text-neon-cyan", bg: "bg-neon-cyan/12", border: "border-neon-cyan/25", bar: "from-neon-cyan to-[oklch(0.67_0.2_240)]" },
  { text: "text-neon-purple", bg: "bg-neon-purple/12", border: "border-neon-purple/25", bar: "from-neon-purple to-[oklch(0.73_0.17_310)]" },
  { text: "text-neon-green", bg: "bg-neon-green/12", border: "border-neon-green/25", bar: "from-neon-green to-neon-cyan" },
];

const courseIconMap = { cpu: Compass, shield: Shield, network: Network, terminal: Terminal };

const WELCOME_STORAGE_KEY = "cyberdimension.welcomeModalSeen";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [comptiaMenuOpen, setComptiaMenuOpen] = useState(true);

  // Modal de boas-vindas: exibido na primeira visita ao painel. Depois que o
  // aluno fecha o modal, ele não reaparece (persistência em localStorage por
  // usuário; usa "user" como sufixo já que há apenas um usuário logado no navegador).
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = window.setTimeout(() => {
      const seen = localStorage.getItem(`${WELCOME_STORAGE_KEY}:user`);
      if (!seen) setWelcomeOpen(true);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated]);
  const [lessonCounts, setLessonCounts] = useState<Record<number, number>>({});
  const { preferences } = useReadingPreferences();
  const domainsQuery = trpc.domains.list.useQuery();
  const progressQuery = trpc.progress.list.useQuery();
  const certificatesQuery = trpc.certificates.list.useQuery();
  const formationsQuery = trpc.formations.summary.useQuery();
  const readinessQuery = trpc.formations.readiness.useQuery(undefined, { enabled: isAuthenticated });
  const projectCompletionsQuery = trpc.cyberProjects.completions.useQuery(undefined, { enabled: isAuthenticated });
  const contentStatsQuery = trpc.content.stats.useQuery();
  const quizHistoryQuery = trpc.quiz.history.useQuery();
  const weeklyChallengeQuery = trpc.weeklyChallenges.current.useQuery();
  const podcastProgressQuery = trpc.podcast.getProgress.useQuery();
  const freeVideoQuery = trpc.freeCourses.progress.useQuery(undefined, { staleTime: 60_000 });
  const dismissWatched = trpc.freeCourses.dismissWatched.useMutation({
    onMutate: async (variables) => {
      await utils.freeCourses.progress.cancel();
      const previous = utils.freeCourses.progress.getData();
      utils.freeCourses.progress.setData(undefined, (data) =>
        data
          ? {
              ...data,
              watchedSlugs: data.watchedSlugs.filter((slug) => slug !== variables.courseSlug),
              watchedCount: Math.max(0, data.watchedCount - 1),
            }
          : data,
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) utils.freeCourses.progress.setData(undefined, context.previous);
    },
    onSettled: () => {
      void utils.freeCourses.progress.invalidate();
    },
  });
  const utils = trpc.useUtils();
  const domains = domainsQuery.data ?? [];
  const progress = progressQuery.data ?? [];
  const certificates = certificatesQuery.data ?? [];
  const formationProgress = formationsQuery.data;
  const attempts = quizHistoryQuery.data ?? [];
  const completedPodcastEpisodes = (podcastProgressQuery.data ?? []).filter((episode) => episode.completed).length;
  const freeCourseProgress = freeVideoQuery.data;
  const pmsecProgress = useMemo(() => {
    const slug = "gestao-projetos-seguranca-cibernetica";
    const modules = formationProgress?.modules.filter((item) => item.courseSlug === slug && item.completed).length ?? 0;
    const labs = formationProgress?.labs.filter((item) => item.courseSlug === slug && item.completed).length ?? 0;
    const certificateIssued = formationProgress?.certificates.some((item) => item.courseSlug === slug) ?? false;
    const projectSubmitted = projectCompletionsQuery.data?.some((item) => item.projectId === "pmsec-security-project") ?? false;
    const totalSteps = 5 + 5 + 1 + 1;
    const completedSteps = modules + labs + Number(certificateIssued) + Number(projectSubmitted);
    return { modules, labs, certificateIssued, projectSubmitted, percentage: Math.round((completedSteps / totalSteps) * 100) };
  }, [formationProgress, projectCompletionsQuery.data]);
  const watchedSlugs = new Set(freeCourseProgress?.watchedSlugs ?? []);
  const recentlyWatched = useMemo(
    () =>
      (freeCourseProgress?.watchedSlugs ?? [])
        .slice(0, 3)
        .map((slug) => FREE_VIDEO_COURSES.find((course) => course.slug === slug))
        .filter((course): course is (typeof FREE_VIDEO_COURSES)[number] => Boolean(course) && course?.status === "disponivel"),
    [freeCourseProgress?.watchedSlugs],
  );
  const suggestedCategory = useMemo(() => {
    const watchedCategories: (typeof FREE_VIDEO_COURSES)[number]["category"][] = [];
    for (const slug of Array.from(watchedSlugs)) {
      const course = FREE_VIDEO_COURSES.find((c) => c.slug === slug);
      if (course) watchedCategories.push(course.category);
    }
    const categoryCount = new Map<string, number>();
    for (const category of watchedCategories) categoryCount.set(category, (categoryCount.get(category) ?? 0) + 1);
    const remainingByCategory = new Map<string, number>();
    for (const course of FREE_VIDEO_COURSES) {
      if (course.status !== "disponivel" || watchedSlugs.has(course.slug)) continue;
      remainingByCategory.set(course.category, (remainingByCategory.get(course.category) ?? 0) + 1);
    }
    type CourseCategory = (typeof FREE_VIDEO_COURSES)[number]["category"];
    let best: CourseCategory | null = null;
    remainingByCategory.forEach((remaining, category) => {
      const watched = categoryCount.get(category) ?? 0;
      const bestWatched = best ? (categoryCount.get(best) ?? 0) : -1;
      const bestRemaining = best ? (remainingByCategory.get(best) ?? 0) : 0;
      if ((watched > bestWatched || (watched === bestWatched && remaining > bestRemaining)) && remaining > 0) {
        best = category as CourseCategory;
      }
    });
    if (!best) {
      remainingByCategory.forEach((remaining, category) => {
        if (remaining > 0 && (!best || remaining > (remainingByCategory.get(best) ?? 0))) best = category as CourseCategory;
      });
    }
    return best;
  }, [watchedSlugs]);
  const freeWatchedCount = freeCourseProgress?.watchedCount ?? 0;
  const watchedUpdatedAt = freeCourseProgress?.watchedSlugsUpdatedAt ?? {};
  const [continueWatchSort, setContinueWatchSort] = useState<"recentes" | "perto">("recentes");
  const [dismissedSlugs, setDismissedSlugs] = useState<string[]>([]);
  type CourseCategory = (typeof FREE_VIDEO_COURSES)[number]["category"];
  const freeCategoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const category of Array.from(FREE_VIDEO_COURSE_CATEGORIES)) {
      if (category === "Todos") continue;
      counts.set(
        category,
        FREE_VIDEO_COURSES.filter(
          (course) => course.category === category && course.status === "disponivel" && watchedSlugs.has(course.slug),
        ).length,
      );
    }
    return counts;
  }, [watchedSlugs]);
  const categoryTotal = useMemo(() => {
    const totals = new Map<string, number>();
    for (const category of Array.from(FREE_VIDEO_COURSE_CATEGORIES)) {
      if (category === "Todos") continue;
      totals.set(category, FREE_VIDEO_COURSES.filter((course) => course.category === category && course.status === "disponivel").length);
    }
    return totals;
  }, [watchedSlugs]);
  const continueWatchingCards = useMemo(() => {
    const cards: {
      slug: string;
      title: string;
      category: CourseCategory;
      progressPct: number;
      watched: number;
      total: number;
      remaining: number;
      watchedAt: number | undefined;
      videoId: string | null;
    }[] = [];
    if (recentlyWatched.length > 0) {
      for (const course of recentlyWatched) {
        if (dismissedSlugs.includes(course.slug)) continue;
        const watched = freeCategoryCounts.get(course.category) ?? 0;
        const total = categoryTotal.get(course.category) ?? 0;
        cards.push({
          slug: course.slug,
          title: course.title,
          category: course.category,
          progressPct: total ? Math.round((watched / total) * 100) : 0,
          watched,
          total,
          remaining: total - watched,
          watchedAt: watchedUpdatedAt[course.slug],
          videoId: course.videoId,
        });
      }
    } else if (suggestedCategory) {
      const watched = freeCategoryCounts.get(suggestedCategory) ?? 0;
      const total = categoryTotal.get(suggestedCategory) ?? 0;
      const starterCourses = FREE_VIDEO_COURSES.filter(
        (course) =>
          course.category === suggestedCategory &&
          course.status === "disponivel" &&
          !watchedSlugs.has(course.slug) &&
          !dismissedSlugs.includes(course.slug),
      ).slice(0, 3);
      for (const course of starterCourses) {
        cards.push({
          slug: course.slug,
          title: course.title,
          category: suggestedCategory,
          progressPct: 0,
          watched: 0,
          total: 1,
          remaining: 1,
          watchedAt: undefined,
          videoId: course.videoId,
        });
      }
    }
    if (continueWatchSort === "perto") {
      cards.sort((left, right) =>
        left.progressPct === right.progressPct ? right.remaining - left.remaining : right.progressPct - left.progressPct,
      );
    } else {
      cards.sort((left, right) => (right.watchedAt ?? 0) - (left.watchedAt ?? 0));
    }
    return cards;
  }, [
    recentlyWatched,
    suggestedCategory,
    freeCategoryCounts,
    categoryTotal,
    watchedSlugs,
    continueWatchSort,
    dismissedSlugs,
    watchedUpdatedAt,
  ]);

  useEffect(() => {
    if (!domains.length) return;
    void Promise.all(
      domains.map(async (domain) => {
        try {
          return [domain.id, await utils.progress.lessonCount.fetch({ domainId: domain.id })] as const;
        } catch {
          return [domain.id, 0] as const;
        }
      }),
    ).then((entries) => setLessonCounts(Object.fromEntries(entries)));
  }, [domains, utils.progress.lessonCount]);

  const completedByDomain = useMemo(
    () =>
      progress.reduce<Record<number, Set<number>>>((acc, entry) => {
        if (entry.completed && entry.lessonId) (acc[entry.domainId] ??= new Set()).add(entry.lessonId);
        return acc;
      }, {}),
    [progress],
  );

  const getDomainProgress = (domainId: number) => {
    const total = lessonCounts[domainId] ?? 0;
    return total ? Math.min(Math.round(((completedByDomain[domainId]?.size ?? 0) / total) * 100), 100) : 0;
  };
  const overallProgress = domains.length
    ? Math.round(domains.reduce((sum, domain) => sum + getDomainProgress(domain.id), 0) / domains.length)
    : 0;
  const nextDomain = domains.find((domain) => getDomainProgress(domain.id) < 100) ?? domains[0];
  const nextLessonsQuery = trpc.lessons.byDomain.useQuery({ domainId: nextDomain?.id ?? 0 }, { enabled: !!nextDomain });
  const nextLesson = (nextLessonsQuery.data ?? []).find((lesson) => !completedByDomain[nextDomain?.id ?? 0]?.has(lesson.id));
  const completedLessons = Object.values(completedByDomain).reduce((sum, entries) => sum + entries.size, 0);
  const totalLessons = Object.values(lessonCounts).reduce((sum, total) => sum + total, 0);
  const achievementCount = formationProgress?.achievements?.length ?? 0;
  const completedLabsForXp = (formationProgress?.labs ?? []).filter((item) => item.completed).length;
  // Auditoria: contar NO MÁXIMO 1 quiz aprovado por domínio — tentativas repetidas não geram XP extra.
  const approvedByDomain = new Set<number>();
  for (const attempt of attempts) {
    if (attempt.domainId > 0 && attempt.totalQuestions > 0 && attempt.score / attempt.totalQuestions >= 0.7) {
      approvedByDomain.add(attempt.domainId);
    }
  }
  const approvedQuizzes = approvedByDomain.size;
  const xp = calculateMissionXp({
    completedLessons,
    approvedQuizzes,
    completedLabs: completedLabsForXp,
    certificates: certificates.length,
    completedPodcastEpisodes,
  });
  const missionLevel = getMissionLevel(xp);
  const domainSummaries = domains.map((domain) => {
    const latest = attempts.find((attempt) => attempt.domainId === domain.id);
    const latestScore = latest && latest.totalQuestions > 0 ? Math.round((latest.score / latest.totalQuestions) * 100) : null;
    return { domain, progress: getDomainProgress(domain.id), latestScore };
  });
  const recommended =
    domainSummaries.find((item) => item.latestScore !== null && item.latestScore < 70) ??
    domainSummaries.find((item) => item.progress > 0 && item.progress < 100) ??
    domainSummaries.find((item) => item.progress < 100) ??
    domainSummaries[0];
  const recommendation = recommended
    ? getStudyRecommendation({ title: recommended.domain.title, progress: recommended.progress, latestScore: recommended.latestScore })
    : null;
  const eligibleCertification = domainSummaries.find(
    ({ domain, progress: domainProgress }) =>
      domainProgress === 100 && !certificates.some((certificate) => certificate.domainId === domain.id),
  );
  const latestAttempt = attempts[0];
  const latestAttemptScore =
    latestAttempt && latestAttempt.totalQuestions > 0 ? Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100) : null;
  const completedFormationModules = useMemo(
    () =>
      (formationProgress?.modules ?? [])
        .filter((item) => item.completed)
        .reduce<Record<string, Set<number>>>((acc, item) => {
          (acc[item.courseSlug] ??= new Set()).add(item.moduleIndex);
          return acc;
        }, {}),
    [formationProgress?.modules],
  );
  const completedFormationLabs = useMemo(
    () =>
      (formationProgress?.labs ?? [])
        .filter((item) => item.completed)
        .reduce<Record<string, Set<number>>>((acc, item) => {
          (acc[item.courseSlug] ??= new Set()).add(item.labIndex);
          return acc;
        }, {}),
    [formationProgress?.labs],
  );
  const professionalPath = [
    { stage: "ETAPA 01 · COMEÇO", slug: "seguranca-pessoal-digital", title: "Proteja sua presença digital" },
    { stage: "ETAPA 02 · FUNDAÇÃO", slug: "fundamentos-ti", title: "Construa sua base técnica" },
    { stage: "ETAPA 03 · ATUAÇÃO", slug: "purple-team-operations", title: "Pratique defesa colaborativa" },
    { stage: "ETAPA 04 · PROFISSIONAL", slug: "security-program-management", title: "Conecte segurança e estratégia" },
  ] as const;
  const nextProfessionalMission =
    professionalPath.find(({ slug }) => {
      const course = getStarterCourse(slug);
      return (
        course &&
        ((completedFormationModules[slug]?.size ?? 0) < course.modules.length ||
          (completedFormationLabs[slug]?.size ?? 0) < course.labsList.length)
      );
    }) ?? professionalPath[professionalPath.length - 1]!;
  const nextProfessionalCourse = getStarterCourse(nextProfessionalMission.slug);
  const professionalModuleProgress = completedFormationModules[nextProfessionalMission.slug]?.size ?? 0;
  const professionalLabProgress = completedFormationLabs[nextProfessionalMission.slug]?.size ?? 0;
  const professionalTotal = (nextProfessionalCourse?.modules.length ?? 0) + (nextProfessionalCourse?.labsList.length ?? 0);
  const professionalProgress = professionalTotal
    ? Math.round(((professionalModuleProgress + professionalLabProgress) / professionalTotal) * 100)
    : 0;

  if (!isAuthenticated || !user) return null;

  return (
    <div className={`academy-shell min-h-screen text-foreground ${getReadingPreferenceClasses(preferences)}`}>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.85_0.2_195/0.04),transparent_24rem)]" />
      <div className="pointer-events-none fixed inset-0 space-grid opacity-55" />
      <aside className={`dashboard-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[oklch(0.075_0.025_250/0.98)] px-4 py-5 shadow-[18px_0_50px_oklch(0.02_0.02_250/0.2)] backdrop-blur-xl transition-transform duration-200 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`} aria-label="Navegação principal">
        <div className="flex items-center justify-between gap-3 px-2">
          <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Ir para a página inicial" onClick={() => setMobileNavOpen(false)}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-neon-cyan/35 bg-neon-cyan/10 shadow-[0_0_22px_oklch(0.85_0.2_195/0.1)]"><Shield className="h-5 w-5 text-neon-cyan" /></span>
            <span className="min-w-0"><strong className="block truncate font-orbitron text-[0.76rem] font-bold tracking-[0.08em]">CYBERDIMENSION</strong><span className="block text-[0.62rem] font-bold tracking-[0.28em] text-neon-cyan">ACADEMY</span></span>
          </Link>
          <button type="button" onClick={() => setMobileNavOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/[0.06] hover:text-foreground lg:hidden" aria-label="Fechar menu"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-8 px-2"><p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p></div>
        <nav className="mt-3 flex-1 space-y-1" aria-label="Navegação do aluno">
          <Link href="/dashboard" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-active"><Gauge className="h-4 w-4" /> Dashboard</Link>
          <Link href="/securityplus/trilha" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-foundation"><Compass className="h-4 w-4" /> Trilhas</Link>
          <div className="space-y-1">
            <button type="button" onClick={() => setComptiaMenuOpen((open) => !open)} className={`dashboard-nav-item dashboard-nav-item-comptia ${comptiaMenuOpen ? "dashboard-nav-item-comptia-open" : ""}`} aria-expanded={comptiaMenuOpen} aria-controls="comptia-sidebar-submenu">
              <ShieldCheck className="h-4 w-4" /> <span className="min-w-0 flex-1 text-left">CompTIA+</span><span className="dashboard-nav-badge">{overallProgress}%</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${comptiaMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {comptiaMenuOpen && <div id="comptia-sidebar-submenu" className="dashboard-nav-submenu" aria-label="Domínios da prova Security+">
              <Link href="/securityplus/trilha" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-submenu-link dashboard-nav-submenu-link-primary">Visão geral <span>→</span></Link>
              {securityPlusWeeklyPlan.filter((week) => week.domainOrder).map((week) => <Link key={week.domainOrder} href={`/securityplus/trilha#dominio-${week.domainOrder}`} onClick={() => setMobileNavOpen(false)} className="dashboard-nav-submenu-link"><span className="dashboard-nav-submenu-index">0{week.domainOrder}</span><span className="min-w-0 flex-1 truncate">{week.focus}</span></Link>)}
            </div>}
          </div>
          <Link href="/catalog" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-academies"><BookOpen className="h-4 w-4" /> Academias</Link>
          <Link href="/cyber-projects" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-projects"><FlaskConical className="h-4 w-4" /> Projetos</Link>
          <Link href="/simulados" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-assessments"><ListChecks className="h-4 w-4" /> Testes</Link>
          <Link href="/podcast" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-audio"><Headphones className="h-4 w-4" /> CyberCast</Link>
          <Link href="/carreira" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-career"><Target className="h-4 w-4" /> Mapa de carreira</Link>
          <Link href="/profile" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-certificates"><Trophy className="h-4 w-4" /> Certificados</Link>
          <Link href="/favorites" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-favorites"><Star className="h-4 w-4" /> Favoritos</Link>
          <Link href="/progress" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-progress"><BarChart3 className="h-4 w-4" /> Progresso</Link>
          <div className="my-4 border-t border-white/8" />
          <Link href="/tutor" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-accent"><Brain className="h-4 w-4" /> IA Tutor <span className="ml-auto rounded-full bg-neon-green/10 px-2 py-0.5 text-[0.6rem] font-bold text-neon-green">IA</span></Link>
          <Link href="/videos" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-videos"><Video className="h-4 w-4" /> Vídeos</Link>
          <Link href="/ctfs" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item dashboard-nav-item-labs"><Terminal className="h-4 w-4" /> Laboratórios</Link>
          {user.role === "admin" && <Link href="/admin" onClick={() => setMobileNavOpen(false)} className="dashboard-nav-item text-neon-green"><Shield className="h-4 w-4" /> Administração</Link>}
        </nav>
        <div className="dashboard-profile-panel mt-5 flex items-center gap-3 rounded-xl p-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-xs font-black text-neon-cyan">{user.name?.slice(0, 2).toUpperCase() ?? "CD"}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{user.name ?? "Aluno"}</p><p className="truncate text-xs text-neon-green">Nível {missionLevel.level}</p></div><button type="button" onClick={logout} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" aria-label="Sair da conta" title="Sair"><ArrowUpRight className="h-4 w-4 rotate-90" /></button></div>
      </aside>
      {mobileNavOpen && <button type="button" className="fixed inset-0 z-40 bg-black/60 lg:hidden" aria-label="Fechar navegação" onClick={() => setMobileNavOpen(false)} />}
      <header className="academy-topbar sticky top-0 z-30 border-b backdrop-blur-xl lg:pl-64">
        <div className="container flex items-center gap-3 py-3 lg:max-w-none lg:px-8">
          <button type="button" onClick={() => setMobileNavOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground hover:border-neon-cyan/35 hover:text-neon-cyan lg:hidden" aria-label="Abrir navegação"><Menu className="h-5 w-5" /></button>
          <div className="min-w-0 flex-1"><p className="hidden text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground sm:block">Formação completa em cibersegurança</p><Link href="/" className="font-orbitron text-sm font-bold tracking-[0.08em] lg:hidden">CYBER<span className="text-neon-cyan">DIMENSION</span></Link></div>
          <div className="hidden min-w-0 flex-1 lg:flex"><GlobalSearch /></div>
          <Link href="/notificacoes" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground hover:bg-white/[0.06] hover:text-foreground" aria-label="Abrir notificações" title="Notificações"><Bell className="h-4 w-4" /></Link>
          <Link href="/profile" className="dashboard-header-profile hidden items-center gap-2 rounded-xl px-2 py-1.5 sm:flex" aria-label="Abrir perfil"><span className="grid h-8 w-8 place-items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-[0.65rem] font-black text-neon-cyan">{user.name?.slice(0, 2).toUpperCase() ?? "CD"}</span><span className="hidden text-left md:block"><strong className="block max-w-28 truncate text-xs">{user.name ?? "Aluno"}</strong><span className="block text-[0.65rem] text-neon-green">Nível {missionLevel.level}</span></span><ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" /></Link>
                </div>
        <div className="container px-4 pb-3 lg:hidden"><GlobalSearch /></div>
      </header>
      <main className="dashboard-main container relative py-7 md:py-10 lg:px-8 xl:px-10">
        <section className="academy-panel-strong relative overflow-hidden rounded-2xl p-6 md:p-8 lg:p-10">
          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-muted-foreground">
                <Target className="h-3 w-3 text-neon-green" /> PREPARAÇÃO SECURITY+ SY0-701
              </p>
              <h1 className="mt-4 font-orbitron text-3xl font-black tracking-[-0.02em] md:text-4xl">
                Sua estação de <span className="text-neon-cyan">estudo</span>.
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {overallProgress}% concluído · {domains.length} domínios · {contentStatsQuery.data?.totalQuestions ?? "—"} questões de
                prática
              </p>
              <div className="mt-5 max-w-xl">
                <div className="mb-2 flex justify-between text-xs font-bold">
                  <span>Meta: concluir a certificação Security+</span>
                  <span className="text-neon-cyan">{overallProgress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-neon-cyan"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/tutor"
                className="orbit-button inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-foreground hover:border-neon-green/40 hover:text-neon-green"
              >
                <Brain className="h-4 w-4" /> Tutor Cyberdimension
              </Link>
              {nextDomain && (
                <Link
                  href={`/course/${nextDomain.id}`}
                  className="orbit-button inline-flex items-center gap-2 rounded-lg bg-neon-cyan px-4 py-2.5 text-sm font-bold text-[oklch(0.1_0.02_260)]"
                >
                  <Rocket className="h-4 w-4" /> Continuar estudando
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="mt-5">
          <RecommendedPath
            progress={
              readinessQuery.data
                ? { modules: readinessQuery.data.modules, labs: readinessQuery.data.labs, certificates: readinessQuery.data.certificates }
                : { modules: [], labs: [], certificates: [] }
            }
            quizArea={readinessQuery.data?.quizArea ?? null}
            variant="hero"
          />
        </section>

        <section className="mt-5">
          <ProfessionalProgress
            data={{
              progress: readinessQuery.data
                ? { modules: readinessQuery.data.modules, labs: readinessQuery.data.labs, certificates: readinessQuery.data.certificates }
                : { modules: [], labs: [], certificates: [] },
              quizArea: readinessQuery.data?.quizArea ?? null,
              projectsCompleted: projectCompletionsQuery.data?.length ?? 0,
              projectsTotal: 5,
              careerTotal: readinessQuery.data?.certificates.length ?? 0,
              careerCompleted: 0,
            }}
          />
        </section>
        <section className="academy-panel mt-5 rounded-2xl border-blue-300/25 p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-blue-200"><BarChart3 className="h-4 w-4" /> PMSEC-01 · GESTÃO DE PROJETOS EM SEGURANÇA</p><h2 className="mt-2 font-orbitron text-lg font-bold">Acompanhe sua entrega de ponta a ponta.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">O indicador combina módulos, laboratórios, certificação e projeto final registrados na sua conta.</p></div><span className="text-2xl font-black text-blue-200">{pmsecProgress.percentage}%</span></div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-blue-300 to-neon-cyan" style={{ width: `${pmsecProgress.percentage}%` }} /></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-xs font-bold text-muted-foreground">MÓDULOS</p><p className="mt-2 text-xl font-black">{pmsecProgress.modules}/5</p><p className="mt-1 text-xs text-muted-foreground">conteúdo estudado</p></div><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-xs font-bold text-muted-foreground">LABORATÓRIOS</p><p className="mt-2 text-xl font-black">{pmsecProgress.labs}/5</p><p className="mt-1 text-xs text-muted-foreground">missões validadas</p></div><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-xs font-bold text-muted-foreground">PROJETO FINAL</p><p className="mt-2 text-xl font-black">{pmsecProgress.projectSubmitted ? "Enviado" : "Pendente"}</p><p className="mt-1 text-xs text-muted-foreground">exportação ao portfólio</p></div><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-xs font-bold text-muted-foreground">CERTIFICADO</p><p className="mt-2 text-xl font-black">{pmsecProgress.certificateIssued ? "Emitido" : "Em rota"}</p><p className="mt-1 text-xs text-muted-foreground">credencial CyberDimension</p></div></div>
          <Link href="/catalog/gestao-projetos-seguranca-cibernetica" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-200">Abrir trilha PMSEC-01 <ArrowRight className="h-4 w-4" /></Link>
        </section>
        <section className="academy-panel mt-5 rounded-2xl p-5 md:p-6">
          <AcademyProgressCards
            progress={
              readinessQuery.data
                ? { modules: readinessQuery.data.modules, labs: readinessQuery.data.labs, certificates: readinessQuery.data.certificates }
                : { modules: [], labs: [], certificates: [] }
            }
            quizArea={readinessQuery.data?.quizArea ?? null}
          />
        </section>

        <section className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-neon-purple/28 bg-neon-purple/8 p-5 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-neon-purple">PLANO SEMANAL SECURITY+</p>
            <h2 className="mt-2 font-orbitron text-lg font-bold">Transforme os cinco domínios em uma preparação de seis semanas.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Metas de estudo, simulados por domínio e checkpoints calculados a partir do seu progresso real.
            </p>
          </div>
          <Link
            href="/securityplus/trilha"
            className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neon-purple/35 bg-neon-purple/12 px-4 py-3 text-sm font-bold text-neon-purple"
          >
            <Rocket className="h-4 w-4" /> Abrir trilha <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {weeklyChallengeQuery.data && (
          <section className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-neon-green/28 bg-neon-green/[0.06] p-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-neon-green">
                {weeklyChallengeQuery.data.activity === "video" ? "META SEMANAL EM VÍDEO" : "DESAFIO SEMANAL"} · +
                {weeklyChallengeQuery.data.xp} XP
              </p>
              <h2 className="mt-2 font-orbitron text-lg font-bold">{weeklyChallengeQuery.data.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {weeklyChallengeQuery.data.claimed
                  ? "Recompensa semanal já resgatada. Continue avançando nas formações."
                  : weeklyChallengeQuery.data.completed
                    ? "Atividade concluída: resgate seu bônus na formação desta semana."
                    : weeklyChallengeQuery.data.description}
              </p>
            </div>
            <Link
              href={`/formacao/${weeklyChallengeQuery.data.courseSlug}/estudar`}
              className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neon-green/35 bg-neon-green/10 px-4 py-3 text-sm font-bold text-neon-green"
            >
              <Sparkles className="h-4 w-4" /> {weeklyChallengeQuery.data.activity === "video" ? "Abrir meta em vídeo" : "Ver desafio"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}

        <section className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-neon-cyan/25 bg-neon-cyan/[0.05] p-5 md:flex-row md:items-center">
          <div className="flex gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10">
              <Headphones className="h-5 w-5 text-neon-cyan" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">CYBERCAST · SECURITY+ EM ÁUDIO</p>
              <h2 className="mt-2 font-orbitron text-lg font-bold">Revise os cinco domínios em conversas guiadas.</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {completedPodcastEpisodes
                  ? `${completedPodcastEpisodes} episódios concluídos · ${completedPodcastEpisodes * GAMIFICATION_RULES.completedPodcastEpisode} XP já integrados ao seu nível.`
                  : "Áudios autorais com Ana e Rafael, transcrição acessível e retomada automática."}
              </p>
            </div>
          </div>
          <Link
            href="/podcast"
            className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neon-cyan/35 bg-neon-cyan/10 px-4 py-3 text-sm font-bold text-neon-cyan"
          >
            <Headphones className="h-4 w-4" /> Ouvir CyberCast <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-neon-purple/25 bg-neon-purple/[0.05] p-5 md:flex-row md:items-center">
          <div className="flex gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon-purple/30 bg-neon-purple/10">
              <Radio className="h-5 w-5 text-neon-purple" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-neon-purple">CYBERDIMENSION PODCAST · MICRO-LEARNING</p>
              <h2 className="mt-2 font-orbitron text-lg font-bold">Oito séries curtas ligadas às trilhas: ouvir → responder → ganhar XP.</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                160 episódios com áudios gravados de Ana e Rafael, quiz de revisão ao final, XP e competência registrada no seu Career Readiness.
              </p>
            </div>
          </div>
          <Link
            href="/podcast"
            className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-neon-purple/35 bg-neon-purple/10 px-4 py-3 text-sm font-bold text-neon-purple"
          >
            <Radio className="h-4 w-4" /> Ouvir Podcast <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mt-5 rounded-2xl border border-neon-cyan/25 bg-neon-cyan/[0.05] p-5">
          <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">BIBLIOTECA GRATUITA · CONTINUAR ASSISTINDO</p>
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h2 className="font-orbitron text-lg font-bold">Retome sua trilha de cursos em vídeo.</h2>
              {recentlyWatched.length > 0 ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Últimos assistidos:{" "}
                  <span className="font-bold text-foreground">{recentlyWatched.map((course) => course.title).join(" · ")}</span> ·{" "}
                  {freeWatchedCount} cursos concluídos ·{" "}
                  {FREE_VIDEO_COURSES.filter((course) => course.status === "disponivel").length - freeWatchedCount} restantes.
                </p>
              ) : (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Assista a aulas em vídeo gratuitas com curadoria e acumule XP.{" "}
                  {suggestedCategory
                    ? `Sugestão de hoje: explorar ${String(suggestedCategory).toLowerCase()}.`
                    : "Comece pela categoria que mais combina com seu objetivo."}
                </p>
              )}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <div className="flex items-center rounded-lg border border-white/10 bg-black/20 p-0.5">
                <button
                  type="button"
                  onClick={() => setContinueWatchSort("recentes")}
                  className={`rounded-md px-2.5 py-1.5 text-[0.68rem] font-bold transition-colors ${continueWatchSort === "recentes" ? "bg-neon-cyan/15 text-neon-cyan" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Mais recente
                </button>
                <button
                  type="button"
                  onClick={() => setContinueWatchSort("perto")}
                  className={`rounded-md px-2.5 py-1.5 text-[0.68rem] font-bold transition-colors ${continueWatchSort === "perto" ? "bg-neon-cyan/15 text-neon-cyan" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Mais perto da conclusão
                </button>
              </div>
              <Link
                href="/cursos-gratuitos"
                className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-neon-cyan/35 bg-neon-cyan/10 px-4 py-3 text-sm font-bold text-neon-cyan"
              >
                <Video className="h-4 w-4" /> Abrir biblioteca <ArrowRight className="h-4 w-4" />
              </Link>
              {suggestedCategory ? (
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-bold text-muted-foreground">
                  Sugestão: {suggestedCategory} · {freeCategoryCounts.get(suggestedCategory) ?? 0}/
                  {FREE_VIDEO_COURSES.filter((course) => course.category === suggestedCategory && course.status === "disponivel").length}{" "}
                  assistidos
                </span>
              ) : null}
            </div>
          </div>
          {continueWatchingCards.length > 0 ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {continueWatchingCards.map((card) => (
                <FreeCourseCard
                  key={card.slug}
                  card={card}
                  onDismiss={(slug) => {
                    setDismissedSlugs((current) => (current.includes(slug) ? current : [...current, slug]));
                    dismissWatched.mutate({ courseSlug: slug });
                  }}
                />
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_1fr_1fr]">
          <article className="module-card rounded-2xl border border-neon-cyan/25 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">SEU PROGRESSO</p>
              <Gauge className="h-5 w-5 text-neon-cyan" />
            </div>
            <div className="mt-4 flex items-end gap-3">
              <span className="font-orbitron text-4xl font-bold">{overallProgress}%</span>
              <span className="pb-1 text-sm text-muted-foreground">progresso geral</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {completedLessons}/{totalLessons || "—"} aulas · {certificates.length} certificados
            </p>
          </article>
          <article className="module-card rounded-2xl border border-neon-purple/25 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.16em] text-neon-purple">NÍVEL ATUAL</p>
              <Zap className="h-5 w-5 text-neon-purple" />
            </div>
            <p className="mt-4 font-orbitron text-xl font-bold">
              {missionLevel.title} <span className="text-neon-purple">· {missionLevel.level}</span>
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan"
                style={{ width: `${(missionLevel.progressToNextLevel / missionLevel.xpPerLevel) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {xp} XP · +{GAMIFICATION_RULES.completedLesson} aula · +{GAMIFICATION_RULES.approvedQuiz} quiz aprovado · +
              {GAMIFICATION_RULES.completedLab} lab
            </p>
          </article>
          <article className="module-card rounded-2xl border border-neon-green/25 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-[0.16em] text-neon-green">CONQUISTAS</p>
              <Trophy className="h-5 w-5 text-neon-green" />
            </div>
            <p className="mt-4 font-orbitron text-3xl font-bold">{achievementCount}</p>
            <p className="mt-1 text-sm text-muted-foreground">badges desbloqueados</p>
            <Link href="/profile" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-neon-green hover:underline">
              Ver conquistas <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <article className="overflow-hidden rounded-2xl border border-neon-cyan/25 bg-[linear-gradient(100deg,oklch(0.12_0.05_260/0.85),oklch(0.08_0.025_260/0.9))] p-6">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan">
              <Rocket className="h-4 w-4" /> CONTINUE DE ONDE PAROU
            </p>
            <h2 className="mt-3 font-orbitron text-xl font-bold">{nextDomain?.title ?? "Preparando sua missão"}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {nextLesson
                ? `Aula ${nextLesson.order} · ${nextLesson.title}`
                : nextDomain
                  ? "Complete esta missão para avançar na certificação."
                  : "Carregando a próxima atividade."}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {nextDomain && (
                <Link
                  href={`/course/${nextDomain.id}`}
                  className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-2.5 text-sm font-bold text-[oklch(0.1_0.02_260)]"
                >
                  {nextLesson ? "Continuar aula" : "Abrir missão"} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <span className="text-xs font-bold text-muted-foreground">APRENDER → PRATICAR → TESTAR → DOMINAR</span>
            </div>
          </article>
          {recommendation && recommended && (
            <article className="module-card rounded-2xl border border-neon-purple/25 p-6">
              <p className="text-xs font-bold tracking-[0.16em] text-neon-purple">{recommendation.eyebrow}</p>
              <h2 className="mt-3 font-orbitron text-lg font-bold">{recommendation.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{recommendation.detail}</p>
              <Link
                href={`/course/${recommended.domain.id}`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-neon-purple hover:underline"
              >
                {recommendation.action} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          )}
        </section>

        <section className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.17em] text-neon-cyan">ROTA DE ESTUDO</p>
            <h2 className="mt-2 font-orbitron text-2xl font-bold">Cinco missões para a Security+</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Todos os domínios estão disponíveis. Siga a ordem para uma progressão mais estruturada.
            </p>
          </div>
          <Link href="/progress" className="inline-flex items-center gap-1 text-sm font-bold text-neon-green hover:underline">
            Ver evolução detalhada <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
        <section className="mt-5 grid gap-4 lg:grid-cols-5">
          {domainSummaries.map(({ domain, progress: domainProgress, latestScore }, index) => {
            const accent = accentPalette[index % accentPalette.length];
            const completed = completedByDomain[domain.id]?.size ?? 0;
            const total = lessonCounts[domain.id] ?? 0;
            return (
              <article key={domain.id} className={`module-card flex min-h-80 flex-col rounded-2xl border p-5 ${accent.border}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-orbitron text-xs font-bold ${accent.text}`}>DOMÍNIO 0{domain.order}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${domainProgress === 100 ? "bg-neon-green" : "bg-neon-cyan"}`} />
                </div>
                <h3 className="mt-5 font-orbitron text-base font-bold leading-6">{domain.title}</h3>
                <div className="mt-4 border-y border-white/10 py-3">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">O que você vai aprender</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{domain.description}</p>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Peso no exame</dt>
                    <dd className={`mt-1 text-sm font-bold ${accent.text}`}>{domain.percentage}%</dd>
                  </div>
                  <div>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Lições</dt>
                    <dd className="mt-1 text-sm font-bold">
                      {completed}/{total || "—"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                  <div className={`h-full rounded-full bg-gradient-to-r ${accent.bar}`} style={{ width: `${domainProgress}%` }} />
                </div>
                <p className={`mt-2 text-xs font-bold ${accent.text}`}>
                  {domainProgress}% {latestScore !== null ? `· Quiz ${latestScore}%` : "· Disponível"}
                </p>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                  <Link
                    href={`/course/${domain.id}`}
                    className="orbit-button inline-flex items-center justify-center gap-1 rounded-lg bg-white/7 px-2 py-2.5 text-xs font-bold"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Estudar
                  </Link>
                  <Link
                    href={`/quiz/${domain.id}`}
                    className={`orbit-button inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-bold ${accent.border} ${accent.text}`}
                  >
                    <ListChecks className="h-3.5 w-3.5" /> Praticar
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="flex flex-col justify-between gap-4 rounded-2xl border border-neon-purple/25 bg-neon-purple/6 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-purple">
                <ListChecks className="h-4 w-4" /> SIMULADO
              </p>
              <h2 className="mt-2 font-orbitron text-lg font-bold">
                {latestAttemptScore === null ? "Teste seu preparo" : `Último simulado: ${latestAttemptScore}%`}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {latestAttemptScore === null
                  ? "Faça um simulado para identificar seus sinais de preparação por domínio."
                  : latestAttemptScore >= 70
                    ? "Você atingiu a meta de 70%. Continue praticando os domínios mais desafiadores."
                    : "Sua meta é 70%. Revise os tópicos indicados e tente novamente."}
              </p>
            </div>
            <Link
              href="/quiz"
              className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neon-purple/35 bg-neon-purple/10 px-4 py-2.5 text-sm font-bold text-neon-purple"
            >
              <ListChecks className="h-4 w-4" /> Abrir simulado
            </Link>
          </article>
          <article className="flex flex-col justify-between gap-4 rounded-2xl border border-neon-green/25 bg-neon-green/6 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-green">
                <CircleCheckBig className="h-4 w-4" /> CERTIFICAÇÃO
              </p>
              <h2 className="mt-2 font-orbitron text-lg font-bold">
                {eligibleCertification
                  ? `Certificação liberada: ${eligibleCertification.domain.title}`
                  : certificates.length
                    ? "Suas credenciais estão disponíveis"
                    : "Prepare sua certificação"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {eligibleCertification
                  ? "Você concluiu todas as aulas deste domínio. Abra a missão para emitir sua credencial nominal."
                  : certificates.length
                    ? "Revise ou baixe as credenciais emitidas em seu perfil."
                    : "A certificação é liberada ao concluir todas as aulas de uma missão."}
              </p>
            </div>
            {eligibleCertification ? (
              <Link
                href={`/course/${eligibleCertification.domain.id}`}
                className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-neon-green px-4 py-2.5 text-sm font-bold text-[oklch(0.1_0.02_260)]"
              >
                <Trophy className="h-4 w-4" /> Emitir certificado
              </Link>
            ) : certificates.length ? (
              <Link
                href="/profile"
                className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neon-green/35 bg-neon-green/10 px-4 py-2.5 text-sm font-bold text-neon-green"
              >
                <Trophy className="h-4 w-4" /> Ver certificados
              </Link>
            ) : (
              <Link
                href="/progress"
                className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neon-green/35 bg-neon-green/10 px-4 py-2.5 text-sm font-bold text-neon-green"
              >
                <Target className="h-4 w-4" /> Ver elegibilidade
              </Link>
            )}
          </article>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="module-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-neon-green">SEU DESEMPENHO</p>
                <h2 className="mt-2 font-orbitron text-xl font-bold">Sinais de preparação</h2>
              </div>
              <BarChart3 className="h-5 w-5 text-neon-green" />
            </div>
            <div className="mt-5 space-y-3">
              {domainSummaries.map(({ domain, progress: domainProgress, latestScore }) => (
                <div
                  key={domain.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/7 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="truncate text-sm font-bold">{domain.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {latestScore === null
                        ? domainProgress
                          ? "Em estudo · sem quiz respondido"
                          : "Não iniciado"
                        : `Último quiz: ${latestScore}%`}
                    </p>
                  </div>
                  <span
                    className={
                      latestScore !== null && latestScore < 70
                        ? "text-xs font-bold text-amber-300"
                        : latestScore !== null
                          ? "text-xs font-bold text-neon-green"
                          : "text-xs font-bold text-muted-foreground"
                    }
                  >
                    {latestScore === null ? `${domainProgress}%` : `${latestScore}%`}
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="overflow-hidden rounded-2xl border border-neon-purple/25 bg-[linear-gradient(110deg,oklch(0.12_0.06_295/0.25),oklch(0.08_0.025_260/0.88))] p-6">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-purple">
              <Sparkles className="h-4 w-4" /> MÉTODO CYBERDIMENSION
            </p>
            <h2 className="mt-3 font-orbitron text-xl font-bold">Aprender. Praticar. Testar. Dominar.</h2>
            <div className="mt-5 grid grid-cols-4 gap-2 text-center">
              {[
                { label: "Aprender", icon: BookOpen },
                { label: "Praticar", icon: FlaskConical },
                { label: "Testar", icon: Star },
                { label: "Certificar", icon: CircleCheckBig },
              ].map(({ label, icon: Icon }) => (
                <div key={label}>
                  <span className="mx-auto grid h-9 w-9 place-items-center rounded-lg border border-neon-purple/25 bg-neon-purple/10 text-neon-purple">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-[0.62rem] font-bold text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/quiz"
              className="orbit-button mt-6 inline-flex items-center gap-2 rounded-xl border border-neon-purple/30 bg-neon-purple/10 px-4 py-2.5 text-sm font-bold text-neon-purple"
            >
              Abrir simulado <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="overflow-hidden rounded-2xl border border-neon-green/25 bg-[linear-gradient(112deg,oklch(0.12_0.05_260/0.9),oklch(0.09_0.03_260/0.96))] p-6">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-green">
              <Rocket className="h-4 w-4" /> JORNADA PROFISSIONAL
            </p>
            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.12em] text-neon-cyan">{nextProfessionalMission.stage}</p>
                <h2 className="mt-2 font-orbitron text-xl font-bold">
                  {nextProfessionalCourse?.shortTitle ?? nextProfessionalMission.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  {nextProfessionalMission.title}. Avance da proteção pessoal à especialização técnica com módulos, laboratórios seguros,
                  avaliação e certificado.
                </p>
              </div>
              <span className="font-orbitron text-3xl font-bold text-neon-green">{professionalProgress}%</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-cyan"
                style={{ width: `${professionalProgress}%` }}
              />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {professionalModuleProgress}/{nextProfessionalCourse?.modules.length ?? 0} módulos · {professionalLabProgress}/
                {nextProfessionalCourse?.labsList.length ?? 0} labs
              </p>
              <Link
                href={`/formacao/${nextProfessionalMission.slug}/estudar`}
                className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-green/35 bg-neon-green/10 px-4 py-2.5 text-sm font-bold text-neon-green"
              >
                Abrir próxima etapa <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
          <article className="module-card rounded-2xl border border-neon-purple/25 p-6">
            <p className="text-xs font-bold tracking-[0.16em] text-neon-purple">BIBLIOTECA AMPLIADA</p>
            <p className="mt-4 font-orbitron text-4xl font-bold">{curriculumCourses.length + starterCourses.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">formações gratuitas disponíveis</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Filtre por nível ou academia e escolha uma rota alinhada à sua meta profissional.
            </p>
            <Link href="/catalog" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-neon-purple hover:underline">
              Explorar catálogo <ArrowUpRight className="h-4 w-4" />
            </Link>
          </article>
        </section>
        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <article className="module-card rounded-2xl border border-neon-purple/25 p-5">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-purple">
              <ListChecks className="h-4 w-4" /> PRÁTICA POR ESPECIALIDADE
            </p>
            <h2 className="mt-3 font-orbitron text-lg font-bold">Simulados cronometrados</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Teste Cloud Security, segurança de aplicações e operações SOC em sessões com tempo controlado e revisão autoral.
            </p>
            <Link href="/simulados" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-neon-purple hover:underline">
              Abrir simulados <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
          <article className="module-card rounded-2xl border border-neon-green/25 p-5">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-green">
              <FlaskConical className="h-4 w-4" /> EVIDÊNCIAS PRÁTICAS
            </p>
            <h2 className="mt-3 font-orbitron text-lg font-bold">Seu portfólio de laboratórios</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Reúna as missões práticas verificadas em um histórico particular, pronto para revisão e compartilhamento consciente.
            </p>
            <Link href="/portfolio" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-neon-green hover:underline">
              Ver portfólio <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </section>
        <section className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.17em] text-neon-green">FORMAÇÕES FUNDAMENTAIS</p>
            <h2 className="mt-2 font-orbitron text-2xl font-bold">Sua base, em progresso.</h2>
          </div>
          <Link href="/catalog" className="inline-flex items-center gap-1 text-sm font-bold text-neon-cyan hover:underline">
            Ver catálogo <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {starterCourses.map((course) => {
            const modules = completedFormationModules[course.slug]?.size ?? 0;
            const labs = completedFormationLabs[course.slug]?.size ?? 0;
            const total = course.modules.length + course.labsList.length;
            const percentage = total ? Math.round(((modules + labs) / total) * 100) : 0;
            const CourseIcon = courseIconMap[course.icon];
            return (
              <article key={course.slug} className="module-card rounded-2xl border border-white/10 p-5">
                <div className="flex items-center justify-between">
                  <CourseIcon className="h-5 w-5 text-neon-cyan" />
                  <span className="font-orbitron text-xs text-neon-cyan">{course.code}</span>
                </div>
                <h3 className="mt-4 font-orbitron text-sm font-bold">{course.shortTitle}</h3>
                <p className="mt-3 text-xs text-muted-foreground">
                  {modules}/{course.modules.length} módulos · {labs}/{course.labsList.length} labs
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" style={{ width: `${percentage}%` }} />
                </div>
                <Link
                  href={`/formation/${course.slug}`}
                  className="orbit-button mt-4 inline-flex items-center gap-1 text-xs font-bold text-neon-cyan hover:underline"
                >
                  {percentage ? "Continuar" : "Iniciar"} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </article>
            );
          })}
        </section>
      </main>
      <WelcomeModal
        open={welcomeOpen}
        onOpenChange={(next) => setWelcomeOpen(next)}
        quizArea={readinessQuery.data?.quizArea ?? null}
        userName={user?.name ?? null}
      />
    </div>
  );
}
