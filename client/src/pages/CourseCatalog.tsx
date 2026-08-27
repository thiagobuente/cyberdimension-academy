import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  CirclePlay,
  Cloud,
  Compass,
  Crosshair,
  FileText,
  FlaskConical,
  GraduationCap,
  Headphones,
  Heart,
  Lock,
  Map,
  Network,
  Radar,
  Rocket,
  Scale,
  Search,
  Shield,
  Sparkles,
  SlidersHorizontal,
  Target,
  Terminal,
  Timer,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getAreaInfo, type CareerArea } from "@shared/careerQuiz";
import {
  academies,
  careerGoals,
  cyberMap,
  curriculumCourses,
  getAcademy,
  getAcademySlugForCareerArea,
  getCurriculumCourseByTitle,
  getCurriculumCourseById,
  getCoursePrerequisitesWithLinks,
  practiceCards,
  type AcademySlug,
  type CurriculumCourse,
  type CurriculumLevel,
} from "@/data/curriculumCatalog";
import { publicCatalogGroups } from "@/data/publicCatalog";
import { activatedCatalogCourses } from "@shared/activatedCatalogCourses";
import { getContentProvenanceSummary } from "@shared/contentProvenance";
import { getStarterCourse } from "@/data/courseCatalog";
import { RecommendedPath } from "@/components/RecommendedPath";
import { fgvProjectManagementCourses } from "@/data/fgvProjectManagement";

const iconMap: Record<AcademySlug, typeof Shield> = {
  "blue-team": Shield,
  "red-team": Crosshair,
  grc: Scale,
  "cloud-security": Cloud,
  "threat-intelligence": Radar,
  "security-engineering": Network,
  "ai-security": Sparkles,
  "artificial-intelligence": Sparkles,
};

const colorMap = {
  cyan: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
  purple: "text-neon-purple border-neon-purple/30 bg-neon-purple/10",
  green: "text-neon-green border-neon-green/30 bg-neon-green/10",
  blue: "text-blue-300 border-blue-300/30 bg-blue-300/10",
  amber: "text-amber-300 border-amber-300/30 bg-amber-300/10",
  rose: "text-rose-300 border-rose-300/30 bg-rose-300/10",
  lime: "text-lime-300 border-lime-300/30 bg-lime-300/10",
};

const accentTextMap = {
  cyan: "text-neon-cyan",
  purple: "text-neon-purple",
  green: "text-neon-green",
  blue: "text-blue-300",
  amber: "text-amber-300",
  rose: "text-rose-300",
  lime: "text-lime-300",
};

const accentSurfaceMap = {
  cyan: "border-neon-cyan/25 bg-neon-cyan/[0.06]",
  purple: "border-neon-purple/25 bg-neon-purple/[0.06]",
  green: "border-neon-green/25 bg-neon-green/[0.06]",
  blue: "border-blue-300/25 bg-blue-300/[0.06]",
  amber: "border-amber-300/25 bg-amber-300/[0.06]",
  rose: "border-rose-300/25 bg-rose-300/[0.06]",
  lime: "border-lime-300/25 bg-lime-300/[0.06]",
};

const orbitIconMap = { cpu: Compass, shield: Shield, network: Network, terminal: Terminal };
const orbitAccentMap = {
  cyan: "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10",
  purple: "text-neon-purple border-neon-purple/30 bg-neon-purple/10",
  green: "text-neon-green border-neon-green/30 bg-neon-green/10",
  blue: "text-blue-300 border-blue-300/30 bg-blue-300/10",
};

type MaterialFilter = "Todos" | "Conteúdo próprio" | "Vídeo" | "Áudio" | "Referências externas";
const materialFilters: MaterialFilter[] = ["Todos", "Conteúdo próprio", "Vídeo", "Áudio", "Referências externas"];

const levelColors: Record<CurriculumLevel, string> = {
  Iniciante: "text-neon-green",
  Intermediário: "text-amber-300",
  Avançado: "text-rose-300",
};

function matchesMaterialFilter(course: CurriculumCourse, material: MaterialFilter) {
  if (material === "Todos") return true;
  const matchingCourse = activatedCatalogCourses.find((item) => item.slug === course.existingSlug);
  if (!matchingCourse) return material === "Conteúdo próprio";
  if (material === "Vídeo") return "videoLearning" in matchingCourse && Boolean(matchingCourse.videoLearning);
  if (material === "Áudio") return "audioGuide" in matchingCourse && Boolean(matchingCourse.audioGuide);
  if (material === "Referências externas") return getContentProvenanceSummary(matchingCourse).externalCount > 0;
  return getContentProvenanceSummary(matchingCourse).ownCount > 0;
}

function matchesSearch(course: CurriculumCourse, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  const academy = academies.find((item) => item.slug === course.academy);
  const haystack = [course.title, course.description, academy?.name ?? "", academy?.tagline ?? "", course.topics.join(" "), course.level].join(" ").toLowerCase();
  return haystack.includes(q);
}

function courseHref(course: CurriculumCourse): string {
  const academy = academies.find((item) => item.slug === course.academy)!;
  return course.existingSlug ? `/catalog/${course.existingSlug}` : `/academias/${academy.slug}`;
}

function MiniProgressBar({ completedModules, completedLabs, totalModules, totalLabs, color }: { completedModules: number; completedLabs: number; totalModules: number; totalLabs: number; color: string }) {
  const completed = completedModules + completedLabs;
  const total = totalModules + totalLabs;
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  const accentColor = color.split(" ")[0];
  return <div aria-label={`Progresso: ${percentage}%`}>
    <div className="mb-1.5 flex items-center justify-between text-[0.68rem] font-bold">
      <span className="text-muted-foreground">
        {completedModules}/{totalModules} módulos · {completedLabs}/{totalLabs} labs
      </span>
      <span className={accentColor}>{percentage}%</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
      <div className={`h-full rounded-full transition-all duration-500 ${percentage === 100 ? "bg-neon-green" : "bg-gradient-to-r from-neon-cyan to-neon-purple"}`} style={{ width: `${percentage}%` }} />
    </div>
  </div>;
}

function PracticeBadge({ format }: { format: "Laboratório" | "CTF" | "Simulado" }) {
  if (format === "Simulado") {
    return <span className="inline-flex items-center gap-1 rounded-full border border-rose-300/30 bg-rose-300/10 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-rose-300"><Timer className="h-3 w-3" />SIMULADO</span>;
  }
  if (format === "CTF") {
    return <span className="inline-flex items-center gap-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-neon-purple"><FlaskConical className="h-3 w-3" />CTF</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-neon-cyan"><Terminal className="h-3 w-3" />LABORATÓRIO</span>;
}

function CourseCard({ course, progress, favorite, onToggleFavorite, favoritePending }: { course: CurriculumCourse; progress?: { completedModules: number; completedLabs: number; totalModules: number; totalLabs: number } | null; favorite: boolean; onToggleFavorite: () => void; favoritePending: boolean }) {
  const academy = academies.find((item) => item.slug === course.academy)!;
  const Icon = iconMap[academy.slug];
  const color = colorMap[academy.color];
  const href = courseHref(course);
  const matchingCourse = activatedCatalogCourses.find((item) => item.slug === course.existingSlug);
  const videoLearning = matchingCourse && "videoLearning" in matchingCourse ? matchingCourse.videoLearning : undefined;
  const audioGuide = matchingCourse && "audioGuide" in matchingCourse ? matchingCourse.audioGuide : undefined;
  const transparency = matchingCourse ? getContentProvenanceSummary(matchingCourse) : null;
  const prerequisites = useMemo(() => (matchingCourse ? getCoursePrerequisitesWithLinks(course.id) : []), [course.id, matchingCourse]);
  const requiredCount = prerequisites.filter((prerequisite) => prerequisite.type === "required").length;
  const recommendedCount = prerequisites.filter((prerequisite) => prerequisite.type === "recommended").length;

  return <article className="module-card group flex min-h-[24rem] flex-col rounded-2xl p-5">
    <div className="flex items-start justify-between gap-3">
      <div className={`grid h-10 w-10 place-items-center rounded-xl border ${color}`}><Icon className="h-5 w-5" /></div>
      <div className="flex flex-col items-end gap-2">
        <span className="rounded-full border border-neon-green/30 bg-neon-green/10 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-neon-green">DISPONÍVEL</span>
        {videoLearning && <span className="inline-flex items-center gap-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-neon-purple"><CirclePlay className="h-3 w-3" /> VÍDEO</span>}
        {audioGuide && <span className="inline-flex items-center gap-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-neon-cyan"><Headphones className="h-3 w-3" /> ÁUDIO</span>}
      </div>
    </div>
    <p className={`mt-5 flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] ${levelColors[course.level]}`}><span aria-hidden="true" className="opacity-75">●</span>{course.level.toUpperCase()}<span aria-hidden="true" className="opacity-40">·</span><span className="text-muted-foreground">{academy.name.replace(" Academy", "")}</span></p>
    <h2 className="mt-2 font-sans text-lg font-semibold leading-snug text-foreground">{course.title}</h2>
    <p className="mt-2 text-sm leading-[1.7] text-muted-foreground">{course.description}</p>
    <div className="mt-3.5 flex flex-wrap gap-2">{course.topics.map((topic) => <span key={topic} className="rounded-full border border-white/10 bg-black/15 px-2.5 py-1 text-xs text-muted-foreground">{topic}</span>)}</div>
    {requiredCount > 0 && <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1 font-bold text-neon-amber" style={{ color: "oklch(0.85 0.14 80)" }}><Lock className="h-3 w-3" />{requiredCount} obrigatório{requiredCount > 1 ? "s" : ""}</span>
      {recommendedCount > 0 && <span className="inline-flex items-center gap-1 text-muted-foreground"><CircleHelp className="h-3 w-3" />{recommendedCount} recomendado{recommendedCount > 1 ? "s" : ""}</span>}
    </div>}
    {progress && <div className="mt-4">{<MiniProgressBar completedModules={progress.completedModules} completedLabs={progress.completedLabs} totalModules={progress.totalModules} totalLabs={progress.totalLabs} color={color} />}</div>}
    {transparency && <p className="mt-3 text-xs leading-5 text-muted-foreground"><span className="font-bold text-neon-cyan">{transparency.ownCount} materiais próprios</span>{transparency.externalCount > 0 ? <><span aria-hidden="true"> · </span><span className="font-bold text-neon-purple">{transparency.externalCount} fonte externa registrada</span></> : " · sem fontes externas cadastradas"}</p>}
    <div className="mt-auto flex items-center gap-3 pt-4"><Link href={href} className={`orbit-button inline-flex min-w-0 flex-1 items-center justify-between text-sm font-bold ${color.split(" ")[0]}`}>{progress && progress.completedModules + progress.completedLabs > 0 ? "Continuar" : "Ver curso"} <ChevronRight className="h-4 w-4" /></Link><button type="button" onClick={onToggleFavorite} disabled={favoritePending} aria-label={favorite ? `Remover ${course.title} dos favoritos` : `Adicionar ${course.title} aos favoritos`} title={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${favorite ? "border-neon-amber/40 bg-neon-amber/10 text-neon-amber" : "border-white/15 text-muted-foreground hover:border-neon-amber/40 hover:text-neon-amber"}`}><Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} /></button></div>
  </article>;
}

function OrbitFormationCard({ course, progress, favorite, onToggleFavorite, favoritePending }: { course: (typeof publicCatalogGroups.orbitFormations)[number]; progress?: { completedModules: number; completedLabs: number; totalModules: number; totalLabs: number } | null; favorite: boolean; onToggleFavorite: () => void; favoritePending: boolean }) {
  const Icon = orbitIconMap[course.icon];
  const color = orbitAccentMap[course.accent];
  const starterCourse = getStarterCourse(course.slug);
  const totalModules = starterCourse?.modules.length ?? course.lessons;
  const totalLabs = starterCourse?.labsList.length ?? course.labs;
  return <article className="module-card flex min-h-[21rem] flex-col rounded-2xl p-5"><div className="flex items-start justify-between gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl border ${color}`}><Icon className="h-5 w-5" /></div><div className="flex items-center gap-2"><span className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] ${color}`}>{course.code}</span><button type="button" onClick={onToggleFavorite} disabled={favoritePending} aria-label={favorite ? `Remover ${course.shortTitle} dos favoritos` : `Adicionar ${course.shortTitle} aos favoritos`} title={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${favorite ? "border-neon-amber/40 bg-neon-amber/10 text-neon-amber" : "border-white/15 text-muted-foreground hover:border-neon-amber/40 hover:text-neon-amber"}`}><Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} /></button></div></div><p className={`mt-5 text-xs font-bold tracking-[0.14em] ${color.split(" ")[0]}`}>FORMAÇÃO ORBIT · DISPONÍVEL</p><h3 className="mt-2 font-sans text-lg font-semibold leading-snug text-foreground">{course.shortTitle}</h3><p className="mt-2 text-sm leading-[1.7] text-muted-foreground">{course.description}</p>{progress ? <div className="mt-4">{<MiniProgressBar completedModules={progress.completedModules} completedLabs={progress.completedLabs} totalModules={totalModules} totalLabs={totalLabs} color={color} />}</div> : <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground"><span><strong className={color.split(" ")[0]}>{course.lessons}</strong> lições</span><span><strong className={color.split(" ")[0]}>{course.labs}</strong> labs</span><span><strong className={color.split(" ")[0]}>{course.duration}</strong> de duração</span></div>}<Link href={`/formation/${course.slug}`} className={`orbit-button mt-auto inline-flex items-center justify-between pt-4 text-sm font-bold ${color.split(" ")[0]}`}>{progress && progress.completedModules + progress.completedLabs > 0 ? "Continuar" : "Ver curso"} <ChevronRight className="h-4 w-4" /></Link></article>;
}

function FilterChip({ active, accent, onClick, children }: { active: boolean; accent: string; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-full border px-3 py-2 text-xs font-bold transition-colors duration-150 ${active ? accent : "border-white/10 text-muted-foreground hover:border-white/20"}`}>{children}</button>;
}

export default function CourseCatalog() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: false });
  const [level, setLevel] = useState<"Todos" | CurriculumLevel>("Todos");
  const [academyFilter, setAcademyFilter] = useState<"Todas" | AcademySlug>("Todas");
  const [material, setMaterial] = useState<MaterialFilter>("Todos");
  const [search, setSearch] = useState("");

  const formationsQuery = trpc.formations.summary.useQuery(undefined, { enabled: Boolean(isAuthenticated && user) });
  const readinessQuery = trpc.formations.readiness.useQuery(undefined, { enabled: Boolean(isAuthenticated && user) });
  const careerQuizQuery = trpc.career.myResult.useQuery(undefined, { enabled: Boolean(isAuthenticated && user) });
  const setFavorite = trpc.formations.setFavorite.useMutation({ onSuccess: () => formationsQuery.refetch() });
  const favoriteSlugs = useMemo(() => new Set((formationsQuery.data?.favorites ?? []).map((item) => item.courseSlug)), [formationsQuery.data?.favorites]);
  const toggleFavorite = (courseSlug: string) => {
    if (!isAuthenticated) return;
    setFavorite.mutate({ courseSlug: courseSlug as never, favorite: !favoriteSlugs.has(courseSlug) });
  };

  const courseProgressMap = useMemo(() => {
    if (!formationsQuery.data) return {} as Record<string, { completedModules: number; completedLabs: number; totalModules: number; totalLabs: number }>;
    const summary = formationsQuery.data;
    const moduleCounts: Record<string, number> = {};
    const labCounts: Record<string, number> = {};
    for (const module of summary.modules) {
      if (module.completed) moduleCounts[module.courseSlug] = (moduleCounts[module.courseSlug] ?? 0) + 1;
    }
    for (const lab of summary.labs) {
      if (lab.completed) labCounts[lab.courseSlug] = (labCounts[lab.courseSlug] ?? 0) + 1;
    }
    const map: Record<string, { completedModules: number; completedLabs: number; totalModules: number; totalLabs: number }> = {};
    for (const activated of activatedCatalogCourses) {
      map[activated.slug] = {
        completedModules: moduleCounts[activated.slug] ?? 0,
        completedLabs: labCounts[activated.slug] ?? 0,
        totalModules: activated.modules.length,
        totalLabs: activated.labsList.length,
      };
    }
    return map;
  }, [formationsQuery.data]);

  const recommendedAreaKey: CareerArea | null = isAuthenticated && careerQuizQuery.data?.topArea ? (careerQuizQuery.data.topArea as CareerArea) : null;
  const recommendedAreaInfo = recommendedAreaKey ? getAreaInfo(recommendedAreaKey) : undefined;

  const courses = useMemo(() => curriculumCourses.filter((course) => (level === "Todos" || course.level === level) && (academyFilter === "Todas" || course.academy === academyFilter) && matchesMaterialFilter(course, material) && matchesSearch(course, search)), [academyFilter, level, material, search]);

  const inProgressCourses = useMemo(() => {
    if (!isAuthenticated) return [] as { slug: string; progress: { completedModules: number; completedLabs: number; totalModules: number; totalLabs: number }; title: string; code?: string }[];
    return activatedCatalogCourses
      .map((activated) => ({ activated, progress: courseProgressMap[activated.slug] ?? null }))
      .filter((entry) => entry.progress && entry.progress.completedModules + entry.progress.completedLabs > 0 && (entry.progress.completedModules + entry.progress.completedLabs) < entry.progress.totalModules + entry.progress.totalLabs)
      .slice()
      .sort((first, second) => (second.progress!.completedModules + second.progress!.completedLabs) / (second.progress!.totalModules + second.progress!.totalLabs) - (first.progress!.completedModules + first.progress!.completedLabs) / (first.progress!.totalModules + first.progress!.totalLabs))
      .slice(0, 4)
      .map((entry) => ({ slug: entry.activated.slug, progress: entry.progress!, title: entry.activated.shortTitle, code: entry.activated.code }));
  }, [isAuthenticated, courseProgressMap]);

  const professionalStages = [
    { code: "ETAPA 01", conventional: "Fundamentos", title: "Fundamentos — Fundação ORBIT", description: "TI, cibersegurança, redes e Linux para construir repertório operacional.", count: publicCatalogGroups.orbitFormations.length, accent: "text-neon-cyan border-neon-cyan/25 bg-neon-cyan/[0.06]" },
    { code: "ETAPA 02", conventional: "Segurança Essencial", title: "Segurança Essencial — Entrada Segura", description: "Proteção pessoal, ética e cloud para começar com decisões responsáveis.", count: curriculumCourses.filter((course) => course.level === "Iniciante").length, accent: "text-neon-green border-neon-green/25 bg-neon-green/[0.06]" },
    { code: "ETAPA 03", conventional: "Especialização Técnica", title: "Especialização Técnica — Atuação Técnica", description: "Defesa, aplicações, cloud, dados e operações para ganhar prática guiada.", count: curriculumCourses.filter((course) => course.level === "Intermediário").length, accent: "text-neon-purple border-neon-purple/25 bg-neon-purple/[0.06]" },
    { code: "ETAPA 04", conventional: "Profissionalização", title: "Profissionalização — Carreira Profissional", description: "Simulação autorizada, engenharia de segurança e gestão de programas.", count: curriculumCourses.filter((course) => course.level === "Avançado").length, accent: "text-blue-300 border-blue-300/25 bg-blue-300/[0.06]" },
  ];

  const totalFormations = publicCatalogGroups.orbitFormations.length + curriculumCourses.length;
  const careerEntryPoint = isAuthenticated ? (recommendedAreaKey ? "/academias/" + (getAcademySlugForCareerArea(recommendedAreaKey) ?? "blue-team") : "/carreira") : "/carreira";
  const careerEntryPointLabel = isAuthenticated && recommendedAreaKey ? `Trilha recomendada: ${recommendedAreaInfo?.label ?? "Sua carreira"}` : "Descubra sua carreira";

  return <div className="min-h-screen space-canvas text-foreground"><div className="pointer-events-none fixed inset-0 space-grid opacity-50" />
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl"><div className="container flex min-h-18 items-center justify-between gap-4 py-3"><Link href="/" className="flex items-center gap-3" aria-label="Voltar para a CyberDimension Academy"><span className="grid h-10 w-10 place-items-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/10"><Shield className="h-5 w-5 text-neon-cyan" /></span><span className="font-orbitron text-xs font-bold tracking-[0.08em] sm:text-sm">CYBERDIMENSION <span className="text-neon-cyan">ACADEMY</span></span></Link><div className="flex items-center gap-2"><Link href="/politica-de-conteudo" className="hidden items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-muted-foreground sm:inline-flex"><FileText className="h-3.5 w-3.5" /> Política</Link><Link href={isAuthenticated ? "/dashboard" : "/login"} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 text-sm font-bold text-neon-cyan">{isAuthenticated ? "Meu painel" : "Entrar"} <ChevronRight className="h-4 w-4" /></Link></div></div></header>
    <main className="relative">
      <section className="py-14 md:py-18"><div className="container grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-cyan"><Rocket className="h-4 w-4" /> BIBLIOTECA DE FORMAÇÃO</p><h1 className="mt-5 max-w-3xl font-sans text-4xl font-bold leading-[1.15] tracking-[-0.02em] sm:text-5xl">Da base à especialização. <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green bg-clip-text text-transparent">Uma rota para sua carreira.</span></h1><p className="mt-6 max-w-2xl text-lg leading-7 text-muted-foreground">Uma escola de cibersegurança com material autoral, prática guiada, áudio-aulas próprias e referências externas registradas com fonte, licença e uso pedagógico.</p></div><div className="module-card rounded-3xl p-5 sm:p-6"><p className="text-xs font-bold tracking-[0.15em] text-neon-green">PADRÃO CYBERDIMENSION</p><div className="mt-5 grid grid-cols-2 gap-3 text-sm">{[[BookOpen, "Conteúdo próprio", "Roteiros e apostilas"], [Headphones, "Áudio-aulas", "Narração própria"], [Timer, "Fontes externas", "Origem e licença"], [Shield, "Certificação", "Conclua sua missão"]].map(([Icon, title, detail]) => { const ItemIcon = Icon as typeof BookOpen; return <div key={title as string} className="rounded-xl border border-white/8 bg-black/15 p-3"><ItemIcon className="h-4 w-4 text-neon-cyan" /><p className="mt-3 font-sans font-semibold text-foreground">{title as string}</p><p className="mt-1 text-xs text-muted-foreground">{detail as string}</p></div>; })}</div></div></div></section>

      <section className="border-b border-white/8 bg-black/10 py-12"><div className="container"><p className="text-xs font-bold tracking-[0.18em] text-neon-purple">PORTAS DE ENTRADA</p><h2 className="mt-3 font-sans text-2xl font-bold text-foreground">Por onde você começa?</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">Três caminhos oficiais. Todos levam ao mesmo destino: sua certificação e seu portfólio profissional.</p><div className="mt-8 grid gap-4 md:grid-cols-3"><Link href={careerEntryPoint} className="module-card group rounded-2xl border border-neon-purple/20 p-6"><div className="grid h-12 w-12 place-items-center rounded-xl border border-neon-purple/30 bg-neon-purple/10"><Target className="h-6 w-6 text-neon-purple" /></div><p className="mt-5 text-[0.65rem] font-bold tracking-[0.16em] text-neon-purple">PORTA 01 · CARREIRA</p><h3 className="mt-2 font-sans text-xl font-bold text-foreground">{careerEntryPointLabel}</h3><p className="mt-2.5 text-sm leading-[1.7] text-muted-foreground">Responda ao teste vocacional de 10 questões e receba uma trilha personalizada para sua área — SOC, Pentest, GRC, Cloud, Forense ou Engenharia.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-neon-purple">Iniciar descoberta <ChevronRight className="h-4 w-4" /></span></Link><button type="button" onClick={() => { window.location.hash = "formacoes-orbit"; document.getElementById("formacoes-orbit")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="module-card group rounded-2xl border border-neon-cyan/20 p-6 text-left" aria-label="Ver catálogo de formações"><div className="grid h-12 w-12 place-items-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10"><Compass className="h-6 w-6 text-neon-cyan" /></div><p className="mt-5 text-[0.65rem] font-bold tracking-[0.16em] text-neon-cyan">PORTA 02 · FORMAÇÕES</p><h3 className="mt-2 font-sans text-xl font-bold text-foreground">Escolher um curso</h3><p className="mt-2.5 text-sm leading-[1.7] text-muted-foreground">Explore o núcleo ORBIT e a biblioteca completa de especializações, com filtros por nível, área e formato de estudo.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-neon-cyan">Ver catálogo <ChevronRight className="h-4 w-4" /></span></button><button type="button" onClick={() => { window.location.hash = "aprenda-fazendo"; document.getElementById("aprenda-fazendo")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="module-card group rounded-2xl border border-neon-green/20 p-6 text-left" aria-label="Ver práticas"><div className="grid h-12 w-12 place-items-center rounded-xl border border-neon-green/30 bg-neon-green/10"><Wrench className="h-6 w-6 text-neon-green" /></div><p className="mt-5 text-[0.65rem] font-bold tracking-[0.16em] text-neon-green">PORTA 03 · PRÁTICA</p><h3 className="mt-2 font-sans text-xl font-bold text-foreground">Aprender fazendo</h3><p className="mt-2.5 text-sm leading-[1.7] text-muted-foreground">Laboratórios guiados, CTFs e simulados aplicados. Pratique triagem em SOC, análise de risco e segurança web em ambientes controlados.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-neon-green">Ver práticas <ChevronRight className="h-4 w-4" /></span></button></div></div></section>

      {isAuthenticated && <section className="border-y border-neon-cyan/15 bg-neon-cyan/[0.025] py-12"><div className="container"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-cyan"><Compass className="h-4 w-4" /> SEU CAMINHO RECOMENDADO</p><h2 className="mt-3 font-sans text-2xl font-bold text-foreground">Onde você está e o que estudar em seguida</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">Sua carreira-alvo, competências dominadas e o próximo passo — calculados a partir do seu progresso real nas formações.</p></div></div><div className="mt-7"><RecommendedPath progress={readinessQuery.data ? { modules: readinessQuery.data.modules, labs: readinessQuery.data.labs, certificates: readinessQuery.data.certificates } : { modules: [], labs: [], certificates: [] }} quizArea={readinessQuery.data?.quizArea ?? null} variant="card" /></div></div></section>}
      {isAuthenticated && <section className="border-b border-white/8 py-12"><div className="container"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-purple"><Compass className="h-4 w-4" /> COMECE AQUI · RECOMENDAÇÃO PESSOAL</p><h2 className="mt-3 font-sans text-2xl font-bold text-foreground">{recommendedAreaKey ? `${recommendedAreaInfo?.label ?? "Sua carreira"} — seus primeiros passos` : "Comece pela descoberta"}</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">{recommendedAreaKey ? "Com base no resultado do seu teste vocacional, esta é a sequência de formações sugerida para abrir sua trilha. Você pode alternar entre quantas rotas quiser." : "Responda ao teste vocacional de 10 questões e receba a rota personalizada ideal para a sua área — SOC, Pentest, GRC, Cloud, Forense ou Engenharia."}</p></div>{recommendedAreaKey ? <Link href={`/academias/${getAcademySlugForCareerArea(recommendedAreaKey) ?? "blue-team"}`} className="inline-flex items-center gap-2 text-sm font-bold text-neon-purple">Ver rota completa <ChevronRight className="h-4 w-4" /></Link> : <Link href="/carreira" className="inline-flex items-center gap-2 text-sm font-bold text-neon-purple">Fazer o teste vocacional <ChevronRight className="h-4 w-4" /></Link>}</div>{recommendedAreaKey ? <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{academies.filter((item) => item.slug === getAcademySlugForCareerArea(recommendedAreaKey)).map((academy) => { const Icon = iconMap[academy.slug]; const accent = colorMap[academy.color as keyof typeof colorMap] ?? colorMap.cyan; const startSequence = academy.route.slice(0, 4); return <article key={academy.slug} className={`module-card rounded-2xl border ${accent.split(" ").slice(1).join(" ")} p-5`}><div className="flex items-center justify-between gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl border ${accent}`}><Icon className="h-5 w-5" /></div><span className="rounded-full border border-white/15 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-muted-foreground">ACADEMIA {String(startSequence.length).padStart(2, "0")}</span></div><h3 className="mt-4 font-sans text-lg font-semibold leading-snug text-foreground">{academy.name.replace(" Academy", "")}</h3><p className="mt-1.5 text-sm font-semibold">{academy.tagline}</p><p className="mt-3 text-xs font-bold tracking-[0.14em] text-muted-foreground">SEQUÊNCIA RECOMENDADA</p><ol className="mt-3 space-y-1.5">{startSequence.map((courseTitle, index) => { const course = getCurriculumCourseByTitle(courseTitle); const courseLink = course?.existingSlug ? `/catalog/${course.existingSlug}` : null; return <li key={courseTitle} className="flex items-center gap-2.5 text-sm"><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.6rem] font-bold ${course ? "border-neon-green/40 text-neon-green" : "border-white/15 text-muted-foreground"}`}>{index + 1}</span><span className={courseLink ? "font-medium text-foreground" : "text-muted-foreground"}>{courseLink ? <Link href={courseLink} className="hover:text-neon-cyan">{courseTitle}</Link> : courseTitle}</span>{!course && <span className="text-[0.62rem] font-bold tracking-[0.1em] text-muted-foreground">· EM BREVE</span>}</li>; })}</ol><span className={`mt-4 inline-flex items-center gap-2 text-sm font-bold ${accent.split(" ")[0]}`}>Abrir rota <ChevronRight className="h-4 w-4" /></span></article>; })}</div> : <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{academies.filter((item) => item.slug !== "ai-security").map((academy) => { const Icon = iconMap[academy.slug]; const accent = colorMap[academy.color as keyof typeof colorMap] ?? colorMap.cyan; return <Link key={academy.slug} href={`/academias/${academy.slug}`} className="module-card group rounded-2xl p-5"><div className={`grid h-10 w-10 place-items-center rounded-xl border ${accent}`}><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-sans text-lg font-semibold text-foreground">{academy.name.replace(" Academy", "")}</h3><p className={`mt-1.5 text-sm font-semibold ${accent.split(" ")[0]}`}>{academy.tagline}</p><p className="mt-2.5 text-sm leading-[1.7] text-muted-foreground">{academy.description}</p><span className={`mt-4 inline-flex items-center gap-2 text-sm font-bold ${accent.split(" ")[0]}`}>Explorar trilha <ChevronRight className="h-4 w-4" /></span></Link>; })}</div>}</div></section>}
      {isAuthenticated && inProgressCourses.length > 0 && <section className="border-b border-white/8 py-12"><div className="container"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-cyan"><TrendingUp className="h-4 w-4" /> VOCÊ ESTÁ AQUI</p><h2 className="mt-3 font-sans text-2xl font-bold text-foreground">Sua jornada em andamento</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">Formações com progresso real registrado. Continue exatamente de onde parou.</p></div><Link href="/progress" className="inline-flex items-center gap-2 text-sm font-bold text-neon-cyan">Ver progresso completo <ChevronRight className="h-4 w-4" /></Link></div><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{inProgressCourses.map((current) => { const activated = activatedCatalogCourses.find((item) => item.slug === current.slug); if (!activated) return null; const Icon = orbitIconMap[activated.icon]; const color = orbitAccentMap[activated.accent]; return <Link key={current.slug} href={`/formation/${current.slug}`} className="module-card rounded-2xl border border-neon-cyan/15 p-5"><div className="flex items-start justify-between gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl border ${color}`}><Icon className="h-5 w-5" /></div><span className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] ${color}`}>{current.code}</span></div><h3 className="mt-4 font-sans text-lg font-semibold leading-snug text-foreground">{current.title}</h3><div className="mt-4">{<MiniProgressBar completedModules={current.progress.completedModules} completedLabs={current.progress.completedLabs} totalModules={current.progress.totalModules} totalLabs={current.progress.totalLabs} color={color} />}</div><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-neon-cyan">Continuar <ChevronRight className="h-4 w-4" /></span></Link>; })}</div></div></section>}

      <section className="border-b border-white/8 py-12"><div className="container"><p className="text-xs font-bold tracking-[0.18em] text-neon-green">ONDE VOCÊ QUER CHEGAR?</p><h2 className="mt-3 font-sans text-2xl font-bold text-foreground">Seu objetivo define sua rota</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">Seis destinos de carreira, cada um com uma sequência recomendada de formações. Escolha o seu — ou combine mais de um.</p><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{careerGoals.map((goal) => { const academy = academies.find((item) => item.slug === goal.academy); if (!academy) return null; const Icon = iconMap[academy.slug]; const color = colorMap[academy.color]; const accent = accentTextMap[academy.color]; return <Link key={goal.slug} href={`/academias/${academy.slug}`} className="module-card group rounded-2xl p-5"><div className="flex items-center justify-between gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl border ${color}`}><Icon className="h-5 w-5" /></div><span className="rounded-full border border-white/15 px-2.5 py-1 text-[0.62rem] font-bold tracking-[0.1em] text-muted-foreground">{goal.emoji} {academy.name.replace(" Academy", "")}</span></div><h3 className="mt-4 font-sans text-lg font-semibold text-foreground">{goal.title}</h3><p className="mt-1.5 text-xs font-bold tracking-[0.14em] text-muted-foreground">SEQUÊNCIA RECOMENDADA</p><ol className="mt-3 space-y-1.5">{goal.startSequence.slice(0, 4).map((courseTitle, index) => { const course = getCurriculumCourseByTitle(courseTitle); const IconCheck = course ? Check : undefined; const courseHref = course?.existingSlug ? `/catalog/${course.existingSlug}` : null; return <li key={courseTitle} className="flex items-center gap-2.5 text-sm"><span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.6rem] font-bold ${course ? "border-neon-green/40 text-neon-green" : "border-white/15 text-muted-foreground"}`}>{index + 1}</span><span className={courseHref ? "font-medium text-foreground" : "text-muted-foreground"}>{courseTitle}</span>{!course && <span className="text-[0.62rem] font-bold tracking-[0.1em] text-muted-foreground">· EM BREVE</span>}</li>; })}{goal.startSequence.length > 4 && <li className="pt-1 text-xs font-bold text-muted-foreground">+ {goal.startSequence.length - 4} formações na rota completa</li>}</ol><span className={`mt-4 inline-flex items-center gap-2 text-sm font-bold ${accent}`}>Abrir rota <ChevronRight className="h-4 w-4" /></span></Link>; })}</div><p className="mt-6 text-sm text-muted-foreground">Não sabe por onde começar? <Link href="/carreira" className="font-bold text-neon-purple underline-offset-2 hover:underline">Faça o teste vocacional</Link> e descubra sua área recomendada em 3 minutos.</p></div></section>

      <section id="formacoes-orbit" className="border-b border-white/8 bg-black/10 py-12"><div className="container"><p className="text-xs font-bold tracking-[0.18em] text-neon-cyan">FORMAÇÕES DISPONÍVEIS AGORA</p><div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="font-sans text-2xl font-bold text-foreground">Núcleo ORBIT</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">Quatro formações completas para construir repertório de TI, segurança, redes e Linux antes de avançar para uma especialidade.</p></div><span className="text-sm text-muted-foreground">4 missões com conteúdo, labs e certificação</span></div><div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{publicCatalogGroups.orbitFormations.map((course) => { const starterCourse = getStarterCourse(course.slug); const progress = isAuthenticated && starterCourse ? { completedModules: (formationsQuery.data?.modules ?? []).filter((module) => module.courseSlug === starterCourse.slug && module.completed).length, completedLabs: (formationsQuery.data?.labs ?? []).filter((lab) => lab.courseSlug === starterCourse.slug && lab.completed).length, totalModules: starterCourse.modules.length, totalLabs: starterCourse.labsList.length } : null; return <OrbitFormationCard key={course.slug} course={course} progress={progress} favorite={favoriteSlugs.has(course.slug)} favoritePending={setFavorite.isPending} onToggleFavorite={() => toggleFavorite(course.slug)} />; })}</div></div></section>

      <section id="aprenda-fazendo" className="border-y border-neon-cyan/15 bg-neon-cyan/[0.025] py-12"><div className="container"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-cyan"><FlaskConical className="h-4 w-4" /> APRENDA FAZENDO</p><h2 className="mt-4 font-sans text-2xl font-bold text-foreground">Laboratórios e simulados aplicados</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">Prática guiada conectada diretamente às formações do catálogo. Cada exercício registra evidência para o seu portfólio profissional.</p><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{practiceCards.map((practice) => { const course = getCurriculumCourseByTitle(practice.route); const academy = academies.find((item) => item.slug === practice.academy); if (!academy) return null; const Icon = practice.format === "Simulado" ? Timer : practice.format === "CTF" ? FlaskConical : Terminal; const color = colorMap[academy.color]; const href = course?.existingSlug ? `/catalog/${course.existingSlug}` : `/academias/${academy.slug}`; return <Link key={practice.id} href={href} className="module-card group rounded-2xl p-5"><div className="flex items-start justify-between gap-3"><div className={`grid h-10 w-10 place-items-center rounded-xl border ${color}`}><Icon className="h-5 w-5" /></div><PracticeBadge format={practice.format} /></div><p className={`mt-5 flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] ${levelColors[practice.level]}`}>●{practice.level.toUpperCase()}</p><h3 className="mt-2 font-sans text-lg font-semibold leading-snug text-foreground">{practice.title}</h3><p className="mt-2 text-sm leading-[1.7] text-muted-foreground">{practice.description}</p><div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-neon-cyan" />{practice.minutes}</span><span>Dentro de <span className="font-bold text-foreground">{practice.route}</span></span></div><span className={`mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold ${color.split(" ")[0]}`}>Iniciar prática <ChevronRight className="h-4 w-4" /></span></Link>; })}</div><div className="mt-8 rounded-2xl border border-white/10 bg-black/15 p-5 text-sm leading-[1.7] text-muted-foreground">Conclua módulos, laboratórios e avaliações de qualquer formação e registre <Link href="/portfolio" className="font-bold text-neon-green underline-offset-2 hover:underline">evidências no seu portfólio</Link> — cada laboratório concluído pode ganhar um selo visível para recrutadores.</div></div></section>

      <section className="border-b border-white/8 py-12"><div className="container"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-purple"><Map className="h-4 w-4" /> MAPA DA CYBERDIMENSION</p><h2 className="mt-4 font-sans text-2xl font-bold text-foreground">Navegue por território</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">O mapa de carreiras organiza todas as formações em quatro territórios técnicos. Cada território agrupa habilidades complementares.</p><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cyberMap.map((branch) => { const mapColor = { cyan: "border-neon-cyan/30 bg-neon-cyan/[0.05] text-neon-cyan", rose: "border-rose-300/30 bg-rose-300/[0.05] text-rose-300", amber: "border-amber-300/30 bg-amber-300/[0.05] text-amber-300", purple: "border-neon-purple/30 bg-neon-purple/[0.05] text-neon-purple", lime: "border-lime-300/30 bg-lime-300/[0.05] text-lime-300" }[branch.color]; const headingColor = accentTextMap[{ cyan: "cyan", rose: "rose", amber: "amber", purple: "purple", lime: "lime" }[branch.color] as keyof typeof accentTextMap]; return <article key={branch.name} className={`rounded-2xl border p-5 ${mapColor}`}><p className="font-sans text-lg font-bold text-foreground">{branch.emoji} {branch.name}</p><ul className="mt-5 space-y-3">{branch.branches.map((node) => { const nodeCourses = node.courseIds.map((courseId) => getCurriculumCourseById(courseId)).filter((resolved): resolved is CurriculumCourse => Boolean(resolved)); if (nodeCourses.length === 0) return <li key={node.label} className="text-sm text-muted-foreground">{node.label}</li>; const href = courseHref(nodeCourses[0]); return <li key={node.label}><Link href={href} className="text-sm font-bold text-foreground hover:text-neon-cyan">{node.label}</Link><p className="mt-1 flex flex-wrap gap-1.5">{nodeCourses.map((course) => <Link key={course.id} href={courseHref(course)} className="rounded-full border border-white/15 bg-black/15 px-2 py-0.5 text-[0.68rem] text-muted-foreground transition-colors hover:border-neon-cyan/40 hover:text-neon-cyan">{course.title}</Link>)}</p></li>; })}</ul></article>; })}</div></div></section>

      <section className="border-b border-white/8 py-12"><div className="container"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-purple"><Wrench className="h-4 w-4" /> ESCOLHA SUA JORNADA</p><h2 className="mt-4 font-sans text-2xl font-bold text-foreground">Trilhas de carreira</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">Cada trilha combina fundamentos comuns com uma sequência recomendada de especialização. Você pode explorar mais de uma trilha ao mesmo tempo.</p><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{academies.map((item) => { const Icon = iconMap[item.slug]; const color = colorMap[item.color]; return <Link key={item.slug} href={`/academias/${item.slug}`} className="module-card group rounded-2xl p-5"><div className={`grid h-10 w-10 place-items-center rounded-xl border ${color}`}><Icon className="h-5 w-5" /></div><h3 className="mt-5 font-sans text-lg font-semibold text-foreground">{item.name.replace(" Academy", "")}</h3><p className={`mt-1.5 text-sm font-semibold ${color.split(" ")[0]}`}>{item.tagline}</p><p className="mt-2.5 text-sm leading-[1.7] text-muted-foreground">{item.description}</p><span className={`mt-4 inline-flex items-center gap-2 text-sm font-bold ${color.split(" ")[0]}`}>Ver trilha <ChevronRight className="h-4 w-4" /></span></Link>; })}</div></div></section>

      <section className="border-b border-white/8 bg-black/10 py-12"><div className="container">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-neon-cyan" /><p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">BIBLIOTECA COMPLETA · FILTRAR POR ÁREA E FORMATO</p></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{([{ slug: "Todas" as const, name: "Todas as áreas" }, ...academies.map((item) => ({ slug: item.slug as AcademySlug, name: item.name.replace(" Academy", "") }))] as const).map((item) => <FilterChip key={item.slug} active={academyFilter === item.slug} accent="border-neon-purple/45 bg-neon-purple/12 text-neon-purple" onClick={() => setAcademyFilter(item.slug)}>{item.name}</FilterChip>)}</div>
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-neon-green"><Headphones className="h-4 w-4" /> FORMATO</p><div className="flex flex-wrap gap-2">{materialFilters.map((item) => <FilterChip key={item} active={material === item} accent="border-neon-green/45 bg-neon-green/12 text-neon-green" onClick={() => setMaterial(item)}>{item}</FilterChip>)}</div></div>
        <div className="mt-6"><label htmlFor="catalog-search" className="sr-only">Buscar cursos, temas ou certificações</label><div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-black/20 px-4 py-3 focus-within:border-neon-cyan/50"><Search className="h-4.5 w-4.5 shrink-0 text-neon-cyan" /><input id="catalog-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cursos, temas ou certificações..." className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none" /></div></div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p className="font-sans text-sm text-muted-foreground"><strong className="font-bold text-foreground">{courses.length}</strong> formações disponíveis{search ? <> na busca por <em>“{search}”</em></> : ""}</p><Link href="/politica-de-conteudo" className="inline-flex items-center gap-2 text-xs font-bold text-neon-cyan">Como registramos fontes e licenças <ChevronRight className="h-3.5 w-3.5" /></Link></div>
        {courses.length === 0 && <div className="mt-10 rounded-2xl border border-white/10 bg-black/15 p-8 text-center"><p className="font-sans text-base font-semibold text-foreground">Nenhum curso encontrado</p><p className="mt-2 text-sm leading-[1.7] text-muted-foreground">Ajuste os filtros ou a busca para encontrar formações disponíveis.</p></div>}
        <div className="mt-6">
          {["Iniciante", "Intermediário", "Avançado" as CurriculumLevel].map((levelName) => {
            const levelCourses = courses.filter((course) => course.level === levelName);
            if (levelCourses.length === 0) return null;
            return <div key={levelName} className="mb-10">
              <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-3">
                <span className={`h-2.5 w-2.5 rounded-full ${levelName === "Iniciante" ? "bg-neon-green" : levelName === "Intermediário" ? "bg-amber-300" : "bg-rose-300"}`} />
                <h3 className={`font-orbitron text-lg font-bold ${levelColors[levelName as CurriculumLevel]}`}>{levelName}</h3>
                <span className="text-xs font-semibold text-muted-foreground">{levelCourses.length} {levelCourses.length === 1 ? "formação" : "formações"}</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{levelCourses.map((course) => { const matchingCourse = activatedCatalogCourses.find((item) => item.slug === course.existingSlug); const progress = isAuthenticated && matchingCourse ? courseProgressMap[matchingCourse.slug] ?? null : null; return <CourseCard key={course.id} course={course} progress={progress} favorite={Boolean(course.existingSlug && favoriteSlugs.has(course.existingSlug))} favoritePending={setFavorite.isPending} onToggleFavorite={() => course.existingSlug && toggleFavorite(course.existingSlug)} />; })}</div>
            </div>;
          })}
        </div>
      </div></section>

      <section className="border-b border-neon-green/20 bg-neon-green/[0.045] py-12"><div className="container"><div className="flex flex-col justify-between gap-5 rounded-3xl border border-neon-green/25 bg-black/20 p-7 md:flex-row md:items-center"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-green"><span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" /> CURSO ESPECIAL DISPONÍVEL</p><h2 className="mt-3 font-sans text-2xl font-bold text-foreground">Inglês técnico para cibersegurança — do Zero ao Profissional</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">CVEs, advisories, logs, incident reports, handovers de SOC e entrevistas internacionais: leia, escreva e fale como um profissional de segurança global. 6 módulos, 4 laboratórios guiados e certificação automática com 80%.</p></div><Link href="/aulas/ingles-tecnico" className="orbit-button inline-flex shrink-0 items-center gap-2 rounded-lg border border-neon-green/35 bg-neon-green/10 px-5 py-3 font-bold text-neon-green">Começar agora <ChevronRight className="h-4 w-4" /></Link></div></div></section>

      <section className="border-y border-neon-purple/20 bg-neon-purple/[0.035] py-10"><div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon-purple/30 bg-neon-purple/10"><CirclePlay className="h-5 w-5 text-neon-purple" /></div><div><p className="text-xs font-bold tracking-[0.16em] text-neon-purple">APRENDIZAGEM MULTIMÍDIA</p><h2 className="mt-1 font-sans text-lg font-bold text-foreground">Vídeo complementar, áudio-aula própria e prática guiada</h2><p className="mt-1 max-w-3xl text-sm leading-[1.7] text-muted-foreground">Os recursos multimídia apoiam as mesmas aulas, laboratórios, quizzes e certificação da Academia.</p></div></div><Link href="/videos" className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-neon-purple/30 bg-neon-purple/10 px-5 py-3 text-sm font-bold text-neon-purple">Explorar vídeos <ChevronRight className="h-4 w-4" /></Link></div></section>

      <section className="border-y border-white/8 bg-black/10 py-10"><div className="container"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-green"><Rocket className="h-4 w-4" /> JORNADA DO ZERO AO PROFISSIONAL</p><h2 className="mt-3 font-sans text-2xl font-bold text-foreground">Uma progressão em quatro etapas.</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">Comece pela base, avance com prática guiada e escolha especializações conforme seus objetivos de carreira.</p></div><span className="text-sm font-bold text-neon-cyan">{totalFormations} formações disponíveis</span></div><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{professionalStages.map((stage) => <article key={stage.code} className={`rounded-2xl border p-5 ${stage.accent}`}><div className="flex items-center justify-between"><span className="text-[0.65rem] font-bold tracking-[0.16em]">{stage.code}</span><span className="font-orbitron text-2xl font-bold">{stage.count}</span></div><h3 className="mt-4 font-sans text-base font-semibold leading-snug text-foreground">{stage.title}</h3><p className="mt-2 text-sm leading-[1.7] text-muted-foreground">{stage.description}</p></article>)}</div></div></section>

      <section className="border-b border-neon-cyan/20 bg-neon-cyan/[0.035] py-12"><div className="container"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-cyan"><GraduationCap className="h-4 w-4" /> TRILHA COMPLEMENTAR · FGV</p><h2 className="mt-3 font-sans text-2xl font-bold text-foreground">Gestão de Projetos para profissionais de tecnologia</h2><p className="mt-2 max-w-2xl text-sm leading-[1.7] text-muted-foreground">{fgvProjectManagementCourses.length} cursos externos gratuitos para complementar sua formação em planejamento, Scrum, Kanban, Lean, OKR e riscos. O acesso, a avaliação e a declaração permanecem sob responsabilidade da FGV.</p></div><Link href="/trilha/gestao-projetos-fgv" className="orbit-button inline-flex shrink-0 items-center gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-5 py-3 text-sm font-bold text-neon-cyan">Explorar trilha <ChevronRight className="h-4 w-4" /></Link></div></div></section>

      <section className="py-16"><div className="container"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-bold tracking-[0.18em] text-neon-purple">ACADEMIAS DE CARREIRA</p><h2 className="mt-3 font-sans text-2xl font-bold text-foreground">Especializações completas</h2></div><p className="max-w-lg text-sm leading-[1.7] text-muted-foreground">Acesse a sequência recomendada de cursos de cada área técnica.</p></div><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{academies.map((item) => { const Icon = iconMap[item.slug]; const color = colorMap[item.color]; return <Link key={item.slug} href={`/academias/${item.slug}`} className="module-card group rounded-2xl p-5"><div className={`grid h-10 w-10 place-items-center rounded-xl border ${color}`}><Icon className="h-5 w-5" /></div><h3 className="mt-5 font-sans text-lg font-semibold text-foreground">{item.name}</h3><p className={`mt-2 text-sm font-semibold ${color.split(" ")[0]}`}>{item.tagline}</p><p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{item.description}</p><span className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${color.split(" ")[0]}`}>Ver rota <ChevronRight className="h-4 w-4" /></span></Link>; })}</div></div></section>
    </main>
  </div>;
}
