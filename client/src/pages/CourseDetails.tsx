import { Link, useParams } from "wouter";
import { useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  ClipboardCheck,
  Cpu,
  FlaskConical,
  GraduationCap,
  ListChecks,
  Network,
  Shield,
  Terminal,
  Timer,
  Trophy,
} from "lucide-react";
import { getStarterCourse } from "@/data/courseCatalog";
import NotFound from "@/pages/NotFound";
import { ContentTransparency } from "@/components/ContentTransparency";
import { LearningJourney } from "@/components/LearningJourney";
import { academies, getCurriculumCourseByTitle } from "@/data/curriculumCatalog";

const iconMap = { cpu: Cpu, shield: Shield, network: Network, terminal: Terminal };
const accentMap = {
  cyan: { text: "text-neon-cyan", border: "border-neon-cyan/30", surface: "bg-neon-cyan/10", button: "bg-neon-cyan" },
  purple: { text: "text-neon-purple", border: "border-neon-purple/30", surface: "bg-neon-purple/10", button: "bg-neon-purple" },
  green: { text: "text-neon-green", border: "border-neon-green/30", surface: "bg-neon-green/10", button: "bg-neon-green" },
  blue: { text: "text-blue-300", border: "border-blue-300/30", surface: "bg-blue-300/10", button: "bg-blue-300" },
};

/**
 * Página do curso como "vitrine acadêmica": o aluno entende antes de estudar
 * o que é o curso, o que vai aprender, como vai estudar e o que recebe ao concluir.
 */
export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>();
  const course = getStarterCourse(slug || "");
  const [activeModule, setActiveModule] = useState(0);
  if (!course) return <NotFound />;
  const accent = accentMap[course.accent];
  const Icon = iconMap[course.icon];

  // O currículo vincula o curso à academia e à rota profissional — vitrine mostra a posição do curso na rota.
  const curriculumCourse = getCurriculumCourseByTitle(course.title);
  const academy = curriculumCourse ? academies.find((item) => item.slug === curriculumCourse.academy) : null;

  // Pré-requisitos: formações que aparecem antes deste curso na rota da academia.
  const prerequisites =
    academy && curriculumCourse
      ? academy.route.slice(0, academy.route.indexOf(curriculumCourse.title)).filter((previousTitle) => {
          const previousCourse = getCurriculumCourseByTitle(previousTitle);
          return Boolean(previousCourse?.existingSlug);
        })
      : [];

  // Próximo passo da rota — a formação que o aluno desbloqueia após concluir esta.
  const nextRouteStep =
    academy && curriculumCourse
      ? academy.route.slice(academy.route.indexOf(curriculumCourse.title) + 1).find((nextTitle) => {
          const nextCourse = getCurriculumCourseByTitle(nextTitle);
          return Boolean(nextCourse?.existingSlug);
        })
      : null;
  const nextRouteCourse = nextRouteStep ? getCurriculumCourseByTitle(nextRouteStep) : null;

  const academyHref = academy ? `/academias/${academy.slug}` : "/catalog";

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan">
            <ArrowLeft className="h-4 w-4" /> Catálogo
          </Link>
          <Link href="/" className="font-orbitron text-xs font-bold tracking-[0.08em]">
            CYBERDIMENSION <span className="text-neon-cyan">ACADEMY</span>
          </Link>
        </div>
      </header>

      <main className="container relative py-8 md:py-12">
        {/* Vitrine: herói com dados completos do curso */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[oklch(0.1_0.03_260/0.8)] p-6 md:p-10">
          <div className={`absolute -right-12 -top-12 h-56 w-56 rounded-full ${accent.surface} blur-3xl`} />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-2 rounded-full border ${accent.border} ${accent.surface} px-3 py-1.5 text-xs font-bold tracking-[0.14em] ${accent.text}`}>
                  <Icon className="h-4 w-4" /> {course.code} · {course.level.toUpperCase()}
                </span>
                {academy && (
                  <Link href={academyHref} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:border-neon-cyan/40 hover:text-neon-cyan">
                    {academy.name}
                  </Link>
                )}
              </div>
              <h1 className="mt-5 max-w-3xl font-orbitron text-3xl font-black leading-tight md:text-5xl">{course.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-7 text-muted-foreground">{course.description}</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm">
                <span className="rounded-lg border border-white/10 bg-black/15 px-3 py-2">
                  <Timer className={`mr-2 inline h-4 w-4 ${accent.text}`} />{course.duration}
                </span>
                <span className="rounded-lg border border-white/10 bg-black/15 px-3 py-2">
                  <BookOpen className={`mr-2 inline h-4 w-4 ${accent.text}`} />{course.lessons} lições
                </span>
                <span className="rounded-lg border border-white/10 bg-black/15 px-3 py-2">
                  <FlaskConical className={`mr-2 inline h-4 w-4 ${accent.text}`} />{course.labs} laboratórios
                </span>
                <span className="rounded-lg border border-white/10 bg-black/15 px-3 py-2">
                  <ClipboardCheck className={`mr-2 inline h-4 w-4 ${accent.text}`} />{course.quizCount} quizzes
                </span>
              </div>

              {prerequisites.length > 0 && (
                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-bold tracking-[0.15em] text-muted-foreground">
                    <ListChecks className="mr-1.5 inline h-3.5 w-3.5" /> PREPARAÇÃO RECOMENDADA
                  </p>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Antes deste curso, recomendamos:</span>
                    {prerequisites.map((title) => {
                      const prerequisite = getCurriculumCourseByTitle(title);
                      return (
                        <Link
                          key={title}
                          href={prerequisite?.existingSlug ? `/catalog/${prerequisite.existingSlug}` : academyHref}
                          className="rounded-lg border border-white/15 px-2.5 py-1 text-xs font-bold text-foreground hover:border-neon-cyan/40 hover:text-neon-cyan"
                        >
                          {title}
                        </Link>
                      );
                    })}
                  </p>
                </div>
              )}
            </div>
            <div className="module-card rounded-2xl p-5">
              <p className={`text-xs font-bold tracking-[0.15em] ${accent.text}`}>RESULTADO DA MISSÃO</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.focus}</p>
              <ul className="mt-5 space-y-3">
                {course.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-2 text-sm">
                    <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${accent.text}`} />{outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA de entrada na formação */}
        <section className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/formation/${course.slug}`}
            className={`orbit-button inline-flex items-center gap-2 rounded-xl ${accent.button} px-6 py-3.5 text-sm font-bold text-[oklch(0.1_0.02_260)] hover:opacity-90`}
          >
            Iniciar esta formação <ChevronRight className="h-4 w-4" />
          </Link>
          {nextRouteCourse && (
            <Link
              href={nextRouteCourse.existingSlug ? `/catalog/${nextRouteCourse.existingSlug}` : "/catalog"}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3.5 text-xs font-bold text-muted-foreground hover:border-neon-purple/40 hover:text-neon-purple"
            >
              Na sequência da rota: {nextRouteStep} <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </section>

        {course.videoLearning && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-neon-purple/30 bg-[linear-gradient(135deg,oklch(0.12_0.055_295/0.24),oklch(0.08_0.025_260/0.88))] p-5 md:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon-purple/30 bg-neon-purple/10">
                  <CirclePlay className="h-5 w-5 text-neon-purple" />
                </span>
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-neon-purple">MODO VÍDEO · COMPLEMENTAR</p>
                  <h2 className="mt-1 font-orbitron text-lg font-bold">Estude com uma sessão audiovisual e roteiro de foco</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                    {course.videoLearning.label}. Cada módulo combina vídeo externo, objetivo de atenção, quiz de fixação e prática
                    guiada para manter a aprendizagem ativa.
                  </p>
                </div>
              </div>
              <Link
                href={`/formation/${course.slug}`}
                className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-neon-purple/35 bg-neon-purple/12 px-4 py-3 text-sm font-bold text-neon-purple"
              >
                Abrir sessão em vídeo <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
          <LearningJourney hasVideo={Boolean(course.videoLearning)} compact />
          <ContentTransparency course={course} compact />
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
          <aside className="module-card h-fit rounded-2xl p-5 xl:sticky xl:top-24">
            <p className={`text-xs font-bold tracking-[0.15em] ${accent.text}`}>ROTA DE MÓDULOS</p>
            <div className="mt-4 space-y-2">
              {course.modules.map((module, index) => (
                <button
                  key={module.title}
                  onClick={() => setActiveModule(index)}
                  className={`orbit-button flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                    activeModule === index ? `${accent.border} ${accent.surface}` : "border-transparent hover:bg-white/6"
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold ${
                      activeModule === index ? `${accent.surface} ${accent.text}` : "bg-white/6 text-muted-foreground"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">{module.title}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{module.lessons} lições</span>
                  </span>
                  <ChevronRight className={`h-4 w-4 ${activeModule === index ? accent.text : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </aside>
          <div className="space-y-6">
            <article className="module-card rounded-2xl p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-xs font-bold tracking-[0.15em] ${accent.text}`}>MÓDULO {String(activeModule + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 font-orbitron text-2xl font-bold">{course.modules[activeModule].title}</h2>
                </div>
                <span className={`rounded-lg border ${accent.border} ${accent.surface} px-3 py-2 text-sm font-bold ${accent.text}`}>
                  {course.modules[activeModule].lessons} lições
                </span>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{course.modules[activeModule].description}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                  <BookOpen className={`h-5 w-5 ${accent.text}`} />
                  <p className="mt-4 text-sm font-bold">Lições guiadas</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Conceitos em sequência, com revisões ativas.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                  <CirclePlay className={`h-5 w-5 ${accent.text}`} />
                  <p className="mt-4 text-sm font-bold">Prática progressiva</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Cenários e desafios relacionados ao objetivo.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                  <ClipboardCheck className={`h-5 w-5 ${accent.text}`} />
                  <p className="mt-4 text-sm font-bold">Revisão do módulo</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Questões autorais com explicações detalhadas.</p>
                </div>
              </div>
            </article>

            <article className="module-card rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-xl border ${accent.border} ${accent.surface}`}>
                  <FlaskConical className={`h-5 w-5 ${accent.text}`} />
                </span>
                <div>
                  <p className={`text-xs font-bold tracking-[0.15em] ${accent.text}`}>LABORATÓRIOS SEGUROS</p>
                  <h2 className="mt-1 font-orbitron text-xl font-bold">Aprender fazendo, em contexto controlado.</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {course.labsList.map((lab, index) => (
                  <div key={lab.title} className="rounded-xl border border-white/10 bg-black/15 p-4">
                    <span className={`font-orbitron text-xs font-bold ${accent.text}`}>LAB {String(index + 1).padStart(2, "0")}</span>
                    <h3 className="mt-3 font-bold">{lab.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{lab.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-neon-green/25 bg-gradient-to-r from-neon-green/10 via-[oklch(0.1_0.03_260/0.88)] to-neon-cyan/10 p-6 md:p-8">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-neon-green">PRÁTICA E CERTIFICAÇÃO</p>
                  <h2 className="mt-2 font-orbitron text-xl font-bold">Conclua, demonstre e registre sua evolução.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                    {course.assessment} Ao concluir todos os módulos e laboratórios guiados, o aluno recebe certificado nominal
                    com data e identificador verificável.
                  </p>
                  {nextRouteStep && (
                    <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-1.5 text-xs font-bold text-neon-cyan">
                      <GraduationCap className="h-3.5 w-3.5" /> Ao concluir, o próximo passo da sua rota é: {nextRouteStep}
                    </p>
                  )}
                </div>
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-neon-green/35 bg-neon-green/10">
                  <Award className="h-7 w-7 text-neon-green" />
                </span>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/formation/${course.slug}`}
                  className={`orbit-button inline-flex items-center justify-center gap-2 rounded-xl ${accent.button} px-5 py-3 font-bold text-[oklch(0.1_0.02_260)] hover:opacity-90`}
                >
                  Iniciar esta missão <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/catalog"
                  className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 font-bold hover:bg-white/8"
                >
                  <Trophy className="h-4 w-4 text-neon-green" /> Ver outras formações
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
