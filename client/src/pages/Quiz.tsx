import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useParams } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  ListChecks,
  RotateCcw,
  Shield,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ReadingControls } from "@/components/ReadingControls";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import { getReadingPreferenceClasses } from "@/lib/readingPreferences";

type QuizAnswer = { questionId: number; selectedAnswer: number; correct: boolean };

export default function Quiz() {
  const { domainId } = useParams<{ domainId?: string }>();
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const domainIdNum = domainId ? Number.parseInt(domainId, 10) : 0;
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const { preferences } = useReadingPreferences();
  const readingClasses = getReadingPreferenceClasses(preferences);

  const [revisionMode, setRevisionMode] = useState<boolean>(false);
  const domainQuery = trpc.domains.byId.useQuery({ id: domainIdNum }, { enabled: domainIdNum > 0 });
  const questionsQuery = trpc.questions.byDomain.useQuery({ domainId: domainIdNum }, { enabled: quizStarted && domainIdNum > 0 });
  const allQuestionsQuery = trpc.questions.all.useQuery(undefined, { enabled: quizStarted && domainIdNum === 0 });
  const wrongIdsQuery = trpc.quiz.wrongQuestionIds.useQuery({ domainId: domainIdNum }, { enabled: revisionMode && domainIdNum > 0 && quizStarted });
  const submitQuiz = trpc.quiz.submit.useMutation();

  const loadingQuestions = quizStarted && (revisionMode && domainIdNum > 0 ? wrongIdsQuery.isLoading : domainIdNum > 0 ? questionsQuery.isLoading : allQuestionsQuery.isLoading);
  const queryError = revisionMode && domainIdNum > 0 ? wrongIdsQuery.error : domainIdNum > 0 ? questionsQuery.error : allQuestionsQuery.error;
  const quizTitle = domainIdNum > 0 ? domainQuery.data?.title ?? `Domínio ${domainIdNum}` : "Simulado geral";

  useEffect(() => {
    const nextQuestions = revisionMode && domainIdNum > 0
      ? (questionsQuery.data ?? []).filter((question: { id: number }) => (wrongIdsQuery.data?.wrongIds ?? []).includes(question.id))
      : (domainIdNum > 0 ? questionsQuery.data : allQuestionsQuery.data);
    if (nextQuestions) setQuestions(nextQuestions);
  }, [questionsQuery.data, allQuestionsQuery.data, wrongIdsQuery.data, domainIdNum, revisionMode]);

  const correctCount = useMemo(() => answers.filter((answer) => answer.correct).length, [answers]);
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const startQuiz = (revision: boolean = false) => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResults(false);
    setRevisionMode(revision);
    setQuizStarted(true);
  };

  const retryQuestionLoad = async () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    const result = domainIdNum > 0 ? await questionsQuery.refetch() : await allQuestionsQuery.refetch();
    if (result.error) toast.error("Ainda não foi possível preparar a sessão. Tente novamente em alguns instantes.");
  };

  const handleAnswer = async () => {
    const question = questions[currentQuestion];
    if (selectedAnswer === null || !question || submitQuiz.isPending) return;

    const currentAnswer: QuizAnswer = {
      questionId: question.id,
      selectedAnswer,
      correct: selectedAnswer === question.correctAnswer,
    };
    const nextAnswers = [...answers, currentAnswer];
    setAnswers(nextAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((value) => value + 1);
      setSelectedAnswer(null);
      return;
    }

    try {
      await submitQuiz.mutateAsync({
        domainId: domainIdNum,
        score: nextAnswers.filter((answer) => answer.correct).length,
        totalQuestions: questions.length,
        answers: nextAnswers,
      });
      setShowResults(true);
    } catch {
      toast.error("Não foi possível registrar o resultado. Tente novamente.");
    }
  };

  if (!user) return null;

 if (!quizStarted) {
   return (
      <div className={`quiz-study reading-theme-transition min-h-screen space-canvas text-foreground ${readingClasses} ${preferences.focusMode ? "study-focus" : ""}`}>
       {!preferences.focusMode && <div className="pointer-events-none fixed inset-0 space-grid opacity-55" />}
        <header className="relative z-10 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl"><div className="container flex items-center justify-between py-3"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link><span className="flex items-center gap-2 font-orbitron text-xs font-bold"><Shield className="h-4 w-4 text-neon-cyan" /> CYBERDIMENSION</span></div></header>
        <main className="container relative grid min-h-[calc(100vh-4rem)] place-items-center py-10">
          <section className="module-card w-full max-w-2xl overflow-hidden rounded-3xl p-6 text-center md:p-10">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-neon-purple/25 bg-neon-purple/10"><ListChecks className="h-7 w-7 text-neon-purple" /></span>
            <p className="mt-6 text-xs font-bold tracking-[0.17em] text-neon-cyan">MODO PRÁTICA</p>
            <h1 className="mt-3 font-orbitron text-3xl font-bold md:text-4xl">{quizTitle}</h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground">{quizTitle ? "Uma sessão de revisão focada nos conceitos desta trilha." : "Uma sessão de revisão que combina os cinco domínios do Security+ SY0-701."}</p>

            {domainIdNum > 0 && (
              <button
                onClick={(event) => {
                  event.preventDefault();
                  startQuiz(true);
                }}
                disabled={wrongIdsQuery.isLoading}
                className="mt-5 inline-flex w-full items-center justify-between gap-3 rounded-2xl border border-neon-purple/25 bg-neon-purple/[0.08] p-4 text-left transition-colors hover:border-neon-purple/50"
              >
                <span>
                  <p className="flex items-center gap-2 text-sm font-bold text-neon-purple"><RotateCcw className="h-4 w-4" /> Modo revisão das questões erradas</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {wrongIdsQuery.data
                      ? wrongIdsQuery.data.wrongIds.length > 0
                        ? `Refazer ${wrongIdsQuery.data.wrongIds.length} questões que você errou na última tentativa`
                        : "Nenhuma questão errada registrada ainda — faça o simulado completo primeiro"
                      : "Buscando suas questões erradas..."}
                  </p>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-neon-purple" />
              </button>
            )}

            <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
              {[
                [ClipboardCheck, "10 questões", "uma por vez"],
                [Target, "Resultado salvo", "para acompanhar sua evolução"],
                [Brain, "Explicações", "disponíveis ao final"],
              ].map(([Icon, title, caption]) => {
                const ItemIcon = Icon as typeof ClipboardCheck;
                return <div key={String(title)} className="quiz-study-surface rounded-xl border border-white/10 bg-black/15 p-4"><ItemIcon className="h-5 w-5 text-neon-cyan" /><p className="mt-3 text-sm font-bold">{String(title)}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{String(caption)}</p></div>;
              })}
            </div>

            <button onClick={() => startQuiz(false)} className="orbit-button mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-6 py-3.5 font-bold text-[oklch(0.1_0.02_260)] shadow-[0_0_30px_oklch(0.85_0.2_195/0.2)] hover:opacity-90"><Sparkles className="h-5 w-5" /> Iniciar sessão <ChevronRight className="h-4 w-4" /></button>
            <p className="mt-4 text-xs text-muted-foreground">Este simulado é uma ferramenta de estudo; não reproduz a pontuação oficial do exame.</p>
            <div className="mt-5 flex justify-center"><ReadingControls /></div>
          </section>
        </main>
      </div>
    );
  }

 if (showResults) {
   const reachedStudyGoal = scorePercent >= 70;
   return (
      <div className={`quiz-study reading-theme-transition min-h-screen space-canvas text-foreground ${readingClasses} ${preferences.focusMode ? "study-focus" : ""}`}>
       {!preferences.focusMode && <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />}
        <header className="relative z-10 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl"><div className="container flex items-center justify-between py-3"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link><Link href={domainIdNum > 0 ? `/course/${domainIdNum}` : "/quiz"} className="text-sm font-bold text-neon-cyan hover:underline">{domainIdNum > 0 ? "Voltar ao estudo" : "Novo simulado"}</Link></div></header>
        <main className="container relative max-w-4xl py-8 md:py-10">
          <section className={`module-card overflow-hidden rounded-3xl border p-6 text-center md:p-9 ${reachedStudyGoal ? "border-neon-green/25" : "border-neon-purple/25"}`}>
            <span className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl ${reachedStudyGoal ? "bg-neon-green/10 text-neon-green" : "bg-neon-purple/10 text-neon-purple"}`}>{reachedStudyGoal ? <CheckCircle2 className="h-8 w-8" /> : <CircleAlert className="h-8 w-8" />}</span>
            <p className={`mt-5 text-xs font-bold tracking-[0.16em] ${reachedStudyGoal ? "text-neon-green" : "text-neon-purple"}`}>{revisionMode ? "MODO REVISÃO · " : ""}{reachedStudyGoal ? "META DE REVISÃO ATINGIDA" : "CONTINUE A REVISÃO"}</p>
            <h1 className="mt-2 font-orbitron text-3xl font-bold">{scorePercent}%</h1>
            <p className="mt-2 text-muted-foreground">{correctCount} de {questions.length} questões respondidas corretamente</p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{reachedStudyGoal ? "Bom resultado para a sua revisão. Use as explicações abaixo para consolidar cada decisão." : "Use as explicações abaixo para revisar os pontos que merecem atenção antes da próxima tentativa."}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href={domainIdNum > 0 ? `/quiz/${domainIdNum}` : "/quiz"} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl bg-neon-cyan px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] hover:opacity-90"><RotateCcw className="h-4 w-4" /> Tentar novamente</Link>{domainIdNum > 0 && <Link href={`/course/${domainIdNum}`} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/5 px-5 py-3 text-sm font-bold hover:bg-white/10"><BookIcon className="h-4 w-4 text-neon-green" /> Revisar lições</Link>}</div>
          </section>

          <section className="mt-8"><div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">REVISÃO GUIADA</p><h2 className="mt-2 font-orbitron text-xl font-bold">Entenda cada resposta</h2></div><span className="text-xs font-bold text-muted-foreground">{questions.length} itens</span></div>
            <div className="space-y-4">{questions.map((question, index) => {
              const answer = answers.find((item) => item.questionId === question.id);
              return <article key={question.id} className={`module-card rounded-2xl border p-5 ${answer?.correct ? "border-neon-green/20" : "border-red-400/20"}`}><div className="flex items-start gap-3"><span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${answer?.correct ? "bg-neon-green/10 text-neon-green" : "bg-red-500/10 text-red-400"}`}>{answer?.correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}</span><div className="min-w-0"><p className="text-xs font-bold tracking-[0.12em] text-muted-foreground">QUESTÃO {String(index + 1).padStart(2, "0")}</p><p className="mt-2 leading-6">{question.question}</p></div></div>
                <div className="mt-5 space-y-2 pl-0 sm:pl-10">{question.options.map((option: string, optionIndex: number) => { const correct = optionIndex === question.correctAnswer; const picked = optionIndex === answer?.selectedAnswer; return <div key={optionIndex} className={`rounded-lg border px-3 py-2.5 text-sm ${correct ? "border-neon-green/25 bg-neon-green/10 text-neon-green" : picked ? "border-red-400/25 bg-red-500/10 text-red-300" : "quiz-option-neutral border-white/7 bg-black/10 text-muted-foreground"}`}><span className="mr-2 font-bold">{String.fromCharCode(65 + optionIndex)}.</span>{option}{correct && <span className="ml-2 text-xs font-bold">— resposta correta</span>}{picked && !correct && <span className="ml-2 text-xs font-bold">— sua resposta</span>}</div>; })}
                {question.explanation && <div className="mt-3 rounded-xl border border-neon-cyan/15 bg-neon-cyan/[0.055] p-3 text-sm leading-6 text-muted-foreground"><span className="font-bold text-neon-cyan">Explicação: </span>{question.explanation}</div>}</div>
              </article>;
            })}</div>
          </section>
        </main>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const activeProgress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
      <div className={`quiz-study reading-theme-transition min-h-screen space-canvas text-foreground ${readingClasses} ${preferences.focusMode ? "study-focus" : ""}`}>
       {!preferences.focusMode && <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />}
      <header className="relative z-10 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl"><div className="container flex items-center justify-between gap-4 py-3"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Sair</Link><div className="flex items-center gap-3"><div className="text-right"><p className="text-xs font-bold text-neon-cyan">{quizTitle}</p><p className="mt-0.5 text-xs text-muted-foreground">{revisionMode ? "Modo revisão · " : ""}Questão {Math.min(currentQuestion + 1, questions.length || 1)} de {questions.length || "—"}</p></div><ReadingControls compact /></div></div></header>
      <main className="container relative max-w-3xl py-8 md:py-12">
        {loadingQuestions && <div className="module-card grid min-h-72 place-items-center rounded-3xl p-8 text-center"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-neon-cyan/10"><Shield className="h-6 w-6 animate-pulse text-neon-cyan" /></span><p className="mt-4 font-orbitron text-lg font-bold">Preparando a sessão</p><p className="mt-2 text-sm text-muted-foreground">Selecionando questões de prática...</p></div></div>}
        {!loadingQuestions && queryError && <div className="module-card rounded-3xl border border-red-400/25 p-8 text-center"><XCircle className="mx-auto h-9 w-9 text-red-400" /><p className="mt-4 font-bold">Não foi possível carregar as questões.</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Nenhum progresso foi perdido. Você pode tentar carregar uma nova seleção de questões agora.</p><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={retryQuestionLoad} disabled={questionsQuery.isFetching || allQuestionsQuery.isFetching} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60"><RotateCcw className="h-4 w-4" /> Tentar novamente</button><Link href="/dashboard" className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/5 px-4 py-3 text-sm font-bold hover:bg-white/10">Voltar ao painel</Link></div></div>}
        {!loadingQuestions && !queryError && questions.length === 0 && <div className="module-card rounded-3xl p-8 text-center"><CircleAlert className="mx-auto h-9 w-9 text-neon-purple" /><p className="mt-4 font-bold">Nenhuma questão disponível neste momento.</p><p className="mt-2 text-sm text-muted-foreground">Escolha outro domínio ou tente o simulado geral.</p></div>}
        {question && <section className="reading-panel module-card rounded-3xl p-5 md:p-8"><div className="flex items-center justify-between gap-4"><p className="text-xs font-bold tracking-[0.15em] text-neon-purple">DESAFIO {String(currentQuestion + 1).padStart(2, "0")}</p><span className="text-xs font-bold text-muted-foreground">{Math.round(activeProgress)}% concluído</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" style={{ width: `${activeProgress}%` }} /></div>
          <h1 className="study-question-title mt-8 text-xl font-semibold leading-8 md:text-2xl">{question.question}</h1>
          <div className="mt-7 space-y-3">{question.options.map((option: string, index: number) => { const selected = selectedAnswer === index; return <button key={index} onClick={() => setSelectedAnswer(index)} className={`quiz-answer-option orbit-button flex w-full items-center gap-4 rounded-xl border p-4 text-left ${selected ? "border-neon-cyan/65 bg-neon-cyan/10 shadow-[0_0_20px_oklch(0.85_0.2_195/0.09)]" : "border-white/10 bg-black/12 hover:border-white/22 hover:bg-white/[0.045]"}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-xs font-bold ${selected ? "border-neon-cyan bg-neon-cyan text-[oklch(0.1_0.02_260)]" : "border-white/15 text-muted-foreground"}`}>{String.fromCharCode(65 + index)}</span><span className="text-sm leading-6 md:text-base">{option}</span></button>; })}</div>
          <button onClick={handleAnswer} disabled={selectedAnswer === null || submitQuiz.isPending} className="orbit-button mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan px-6 py-3.5 font-bold text-[oklch(0.1_0.02_260)] disabled:cursor-not-allowed disabled:opacity-45">{submitQuiz.isPending ? "Registrando..." : currentQuestion < questions.length - 1 ? <>Próxima questão <ChevronRight className="h-4 w-4" /></> : <>Ver resultado <Trophy className="h-4 w-4" /></>}</button>
        </section>}
      </main>
    </div>
  );
}

function BookIcon({ className }: { className?: string }) {
  return <Shield className={className} />;
}
