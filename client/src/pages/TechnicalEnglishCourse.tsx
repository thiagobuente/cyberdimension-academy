import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileText,
  Globe2,
  Languages,
  Lightbulb,
  Loader2,
  LockKeyhole,
  Target,
  Network,
  Share2,
  Terminal,
} from "lucide-react";
import { technicalEnglishCourse } from "@shared/technicalEnglishCourse";
import { trpc } from "@/lib/trpc";
import { ReadingControls } from "@/components/ReadingControls";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import { getReadingPreferenceClasses } from "@/lib/readingPreferences";
import { buildCertificateVerificationUrl, buildLinkedInShareUrl } from "@/lib/linkedinShare";
import { useAuth } from "@/_core/hooks/useAuth";

export default function TechnicalEnglishCourse() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean; certificate: { id: number; identifier: string } | null } | null>(null);
  const stateQuery = trpc.technicalEnglish.state.useQuery(undefined, { enabled: Boolean(user) });
  const assessmentQuery = trpc.technicalEnglish.assessment.useQuery(undefined, { enabled: Boolean(user) });
  const markSection = trpc.technicalEnglish.markSectionComplete.useMutation({ onSuccess: () => utils.technicalEnglish.state.invalidate() });
  const submitAssessment = trpc.technicalEnglish.submitAssessment.useMutation({
    onSuccess: (data) => {
      setResult(data);
      void utils.technicalEnglish.state.invalidate();
    },
  });

  const sections = technicalEnglishCourse.sections;
  const labs = technicalEnglishCourse.labs;
  const questions = assessmentQuery.data?.questions ?? technicalEnglishCourse.knowledgeCheck.map(({ question, options }) => ({ question, options }));
  const completedSections = useMemo(() => new Set(stateQuery.data?.sections.map((section) => section.sectionId) ?? []), [stateQuery.data?.sections]);
  const answered = Object.keys(answers).length;
  const allSectionsComplete = sections.every((section) => completedSections.has(section.id));
  const issuedCertificate = result?.certificate ?? stateQuery.data?.certificate ?? null;
  const requireAccount = () => setLocation("/login");

  const shareCertificate = (identifier: string) => {
    const verificationUrl = buildCertificateVerificationUrl(window.location.origin, identifier);
    window.open(buildLinkedInShareUrl(verificationUrl), "_blank", "noopener,noreferrer");
  };

  const submit = () => {
    if (!user) return requireAccount();
    if (!allSectionsComplete || answered !== questions.length) return;
    submitAssessment.mutate({ answers: questions.map((_, index) => answers[index]) });
  };

  const allSectionIds = sections.map((section) => section.id) as [string, ...string[]];
  const { preferences } = useReadingPreferences();

  return (
    <div className={`min-h-screen space-canvas text-foreground reading-theme-transition ${getReadingPreferenceClasses(preferences)} ${preferences.focusMode ? "study-focus" : ""}`}>
      <div className="pointer-events-none fixed inset-0 space-grid opacity-45" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.84)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-3 py-3">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan">
            <ArrowLeft className="h-4 w-4" /> Catálogo
          </Link>
          <Link href="/dashboard" className="orbit-button inline-flex items-center gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 text-sm font-bold text-neon-cyan">
            Meu painel <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </header>
      <main className="relative">
        <section className="border-b border-white/8 py-14 md:py-20">
          <div className="container grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-purple">
                <Globe2 className="h-4 w-4" /> CURSO ESPECIAL · COMUNICAÇÃO E CARREIRA
              </p>
              <h1 className="mt-5 max-w-4xl font-orbitron text-4xl font-black leading-[1.1] tracking-[-0.04em] sm:text-5xl">
                {technicalEnglishCourse.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-7 text-muted-foreground">{technicalEnglishCourse.subtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/25 bg-neon-cyan/10 px-3 py-2 text-neon-cyan">
                  <Clock3 className="h-4 w-4" /> {technicalEnglishCourse.duration}
                </span>
                <span className="rounded-full border border-neon-purple/25 bg-neon-purple/10 px-3 py-2 text-neon-purple">
                  {technicalEnglishCourse.level}
                </span>
                <span className="rounded-full border border-white/10 bg-black/15 px-3 py-2 text-muted-foreground">
                  6 módulos · 4 laboratórios · missão integrada · certificação
                </span>
              </div>
              <div className="mt-6">
                <ReadingControls compact />
              </div>
            </div>
            <aside className="module-card rounded-3xl p-6">
              <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">CERTIFICAÇÃO AUTOMÁTICA</p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Conclua os seis módulos e alcance pelo menos 80% na avaliação. O certificado nominal é emitido automaticamente, com identificador
                público de verificação.
              </p>
              <div className="mt-5 flex items-center gap-3 text-sm font-bold text-neon-green">
                <CheckCircle2 className="h-5 w-5" />
                {completedSections.size}/{sections.length} módulos concluídos
              </div>
              {issuedCertificate && (
                <div className="mt-5 border-t border-neon-green/20 pt-5">
                  <p className="text-sm font-bold text-neon-green">Certificado emitido para você</p>
                  <p className="mt-1 text-xs text-muted-foreground">{issuedCertificate.identifier}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/certificate/course/${issuedCertificate.id}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-neon-green/30 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green"
                    >
                      <FileText className="h-3.5 w-3.5" /> Abrir
                    </Link>
                    <button
                      type="button"
                      onClick={() => shareCertificate(issuedCertificate.identifier)}
                      className="inline-flex items-center gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-2 text-xs font-bold text-neon-cyan"
                    >
                      <Share2 className="h-3.5 w-3.5" /> Compartilhar
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)]">
            <aside className="h-fit lg:sticky lg:top-24">
              <p className="text-xs font-bold tracking-[0.16em] text-neon-purple">ROTA DA AULA</p>
              <nav className="mt-4 space-y-2">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-3 rounded-xl border border-white/8 bg-black/10 p-3 text-sm font-semibold text-muted-foreground hover:border-neon-cyan/30 hover:text-neon-cyan"
                  >
                    <span className="font-orbitron text-xs text-neon-cyan">{String(index + 1).padStart(2, "0")}</span>
                    {section.title.split(":")[0]}
                  </a>
                ))}
              </nav>
            </aside>
            <div className="space-y-8">
              {sections.map((section, index) => {
                const completed = completedSections.has(section.id);
                return (
                  <article id={section.id} key={section.id} className="module-card scroll-mt-28 rounded-3xl p-6 sm:p-8">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">{section.label}</p>
                        <h2 className="mt-3 font-orbitron text-2xl font-bold">{section.title}</h2>
                      </div>
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-neon-purple/25 bg-neon-purple/10 font-orbitron text-sm font-bold text-neon-purple">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="study-copy mt-5 max-w-none">
                      <p className="text-base font-semibold leading-7">Objetivo: {section.objective}</p>
                      <ul className="mt-4 space-y-3 list-none pl-0">
                        {section.keyPoints.map((point) => (
                          <li key={point} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-green" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {section.vocabulary.length > 0 && (
                      <div className="mt-7 border-t border-white/8 pt-6">
                        <p className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-neon-purple">
                          <Languages className="h-4 w-4" /> VOCABULÁRIO ESSENCIAL
                        </p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {section.vocabulary.map((item) => (
                            <div key={item.term} className="rounded-xl border border-white/8 bg-black/15 p-3">
                              <p className="text-sm font-bold text-neon-cyan">{item.term}</p>
                              <p className="mt-1 text-xs font-semibold text-neon-green">{item.translation}</p>
                              <p className="mt-2 text-xs leading-5 text-muted-foreground italic">{item.context}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-7 border-t border-white/8 pt-6">
                      <p className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-neon-green">
                        <Lightbulb className="h-4 w-4" /> APLIQUE AGORA
                      </p>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.practice}</p>
                      <button
                        type="button"
                        disabled={completed || markSection.isPending}
                        onClick={() => (user ? markSection.mutate({ sectionId: section.id as (typeof allSectionIds)[number] }) : requireAccount())}
                        className="orbit-button mt-5 inline-flex items-center gap-2 rounded-lg border border-neon-green/30 bg-neon-green/10 px-4 py-2 text-sm font-bold text-neon-green disabled:cursor-default disabled:opacity-55"
                      >
                        {markSection.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Globe2 className="h-4 w-4" />
                        )}
                        {completed ? "Módulo concluído" : user ? "Marcar módulo como concluído" : "Entrar para registrar progresso"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-black/10 py-14">
          <div className="container">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-green">
              <Terminal className="h-4 w-4" /> LABORATÓRIOS GUIADOS
            </p>
            <h2 className="mt-4 font-orbitron text-3xl font-bold">Prática em cenários reais</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Quatro laboratórios executáveis que simulam o fluxo de trabalho real de um analista em uma equipe global: do glossário vivo ao handover
              profissional.
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {labs.map((lab, index) => (
                <article key={lab.id} className="module-card rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-orbitron text-sm font-bold text-neon-green">{lab.label}</span>
                    <Terminal className="h-4 w-4 text-neon-purple" />
                  </div>
                  <h3 className="mt-4 font-orbitron text-lg font-bold">{lab.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{lab.objective}</p>
                  <div className="mt-4 rounded-xl border border-white/8 bg-black/15 p-4">
                    <p className="text-xs font-bold tracking-[0.14em] text-neon-purple">CENÁRIO</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{lab.scenario}</p>
                    <p className="mt-3 font-mono text-xs text-neon-cyan">{lab.command}</p>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-xs font-bold tracking-[0.14em] text-neon-green hover:text-neon-cyan">
                      SAÍDA ESPERADA E NOTAS DO LABORATÓRIO
                    </summary>
                    <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-xs leading-5 text-muted-foreground whitespace-pre-wrap">
                      {lab.expectedOutput}
                    </pre>
                    <ul className="mt-3 space-y-2">
                      {lab.solutionNotes.map((note) => (
                        <li key={note} className="flex gap-2 text-xs leading-5 text-muted-foreground">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neon-green" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </details>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-neon-green/20 bg-neon-green/[0.035] py-14">
          <div className="container grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-green">
                <Target className="h-4 w-4" /> MISSÃO INTEGRADA
              </p>
              <h2 className="mt-4 font-orbitron text-3xl font-bold">{technicalEnglishCourse.caseStudy.title}</h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{technicalEnglishCourse.caseStudy.situation}</p>
            </div>
            <div className="module-card rounded-3xl p-6">
              <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">ENTREGÁVEIS DA MISSÃO</p>
              <ol className="mt-5 space-y-4">
                {technicalEnglishCourse.caseStudy.tasks.map((task, index) => (
                  <li key={task} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-neon-cyan/30 text-xs font-bold text-neon-cyan">
                      {index + 1}
                    </span>
                    {task}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="py-14 md:py-18">
          <div className="container max-w-4xl">
            <div className="text-center">
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-purple">
                <ClipboardCheck className="h-4 w-4" /> AVALIAÇÃO CERTIFICÁVEL
              </p>
              <h2 className="mt-4 font-orbitron text-3xl font-bold">Verifique sua compreensão</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                A conclusão dos seis módulos e uma nota mínima de 80% emite o certificado automaticamente.
              </p>
            </div>
            {!user && (
              <button
                type="button"
                onClick={requireAccount}
                className="mx-auto mt-7 flex items-center gap-2 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-5 py-3 text-sm font-bold text-neon-cyan"
              >
                <LockKeyhole className="h-4 w-4" /> Entre com seu e-mail para registrar a certificação
              </button>
            )}
            <div className="mt-9 space-y-5">
              {questions.map((item, questionIndex) => (
                <article className="module-card rounded-2xl p-5 sm:p-6" key={item.question}>
                  <p className="font-orbitron text-sm font-bold text-neon-cyan">{String(questionIndex + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-base font-bold leading-6">{item.question}</h3>
                  <div className="mt-5 grid gap-2">
                    {item.options.map((option, optionIndex) => {
                      const selected = answers[questionIndex] === optionIndex;
                      return (
                        <button
                          type="button"
                          disabled={Boolean(result) || submitAssessment.isPending}
                          onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                          key={option}
                          className={`rounded-xl border p-3 text-left text-sm transition-colors disabled:cursor-default ${selected ? "border-neon-cyan/45 bg-neon-cyan/10 text-neon-cyan" : "border-white/10 bg-black/10 text-muted-foreground hover:border-white/25"}`}
                        >
                          <span className="font-semibold">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                        </button>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                type="button"
                disabled={!allSectionsComplete || answered !== questions.length || submitAssessment.isPending || Boolean(result)}
                onClick={submit}
                className="orbit-button inline-flex items-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-5 py-3 font-bold text-neon-cyan disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitAssessment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {user ? "Concluir avaliação" : "Entre para realizar a avaliação"}
              </button>
              {!allSectionsComplete && user && (
                <p className="text-center text-sm text-muted-foreground">Conclua todos os módulos para liberar a avaliação certificável.</p>
              )}
              {submitAssessment.error && <p className="text-center text-sm text-red-300">{submitAssessment.error.message}</p>}
              {result && (
                <div
                  className={`rounded-2xl border px-5 py-4 text-center text-sm ${result.passed ? "border-neon-green/30 bg-neon-green/10 text-neon-green" : "border-amber-300/30 bg-amber-300/10 text-amber-100"}`}
                >
                  <p>
                    Nota final: <strong>{result.score}%</strong>.{" "}
                    {result.passed
                      ? "Você foi aprovado e seu certificado personalizado foi emitido automaticamente."
                      : "Você ainda não alcançou os 80% necessários; revise a aula e tente novamente."}
                  </p>
                  {issuedCertificate && (
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      <Link
                        href={`/certificate/course/${issuedCertificate.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-neon-green/35 bg-neon-green/10 px-4 py-2 font-bold text-neon-green"
                      >
                        <FileText className="h-4 w-4" /> Ver certificado
                      </Link>
                      <Link
                        href={`/verify-certificate?identifier=${encodeURIComponent(issuedCertificate.identifier)}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/20 px-4 py-2 font-bold text-foreground"
                      >
                        <Network className="h-4 w-4" /> Verificar credencial
                      </Link>
                      <button
                        type="button"
                        onClick={() => shareCertificate(issuedCertificate.identifier)}
                        className="inline-flex items-center gap-2 rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 font-bold text-neon-cyan"
                      >
                        <Share2 className="h-4 w-4" /> Compartilhar no LinkedIn
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-white/8 bg-black/10 py-14">
          <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-cyan">
                <FileText className="h-4 w-4" /> MATERIAIS DE ESTUDO
              </p>
              <h2 className="mt-4 font-orbitron text-2xl font-bold">Referências do curso</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Conteúdo 100% autoral com base nas fontes oficiais de terminologia, advisories e padrões de comunicação de equipes de segurança.
              </p>
            </div>
            <ul className="space-y-3">
              {technicalEnglishCourse.sources.map((source) => (
                <li key={source} className="flex gap-3 rounded-xl border border-white/8 bg-black/15 p-4 text-sm leading-6 text-muted-foreground">
                  <BookOpen className="mt-1 h-4 w-4 shrink-0 text-neon-purple" />
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14">
          <div className="container">
            <div className="module-card flex flex-col justify-between gap-5 rounded-3xl p-7 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-neon-green">PRÓXIMA MISSÃO</p>
                <h2 className="mt-3 font-orbitron text-2xl font-bold">Continue pelo catálogo da CyberDimension</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Combine o inglês técnico com uma rota de especialização para acelerar sua carreira em segurança.
                </p>
              </div>
              <Link href="/catalog" className="orbit-button inline-flex shrink-0 items-center gap-2 rounded-lg border border-neon-green/30 bg-neon-green/10 px-5 py-3 font-bold text-neon-green">
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
