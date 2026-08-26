import { CAREER_AREAS, CAREER_QUESTIONS, CAREER_XP_REWARD, getAreaInfo, type CareerArea, type CareerResult } from "@shared/careerQuiz";
import { buildLinkedInShareUrl } from "@/lib/linkedinShare";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { openLinkedInCertificateShare } from "@/lib/shareCertificate";
import { ArrowLeft, Award, BadgeCheck, CheckCircle2, Compass, Medal, Loader2, Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type Phase = "intro" | "quiz" | "result";

export default function CareerQuiz() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<number, CareerArea>>({});
  const [guestWarning, setGuestWarning] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ result: CareerResult; xp: number } | null>(null);

  const questionsQuery = trpc.career.questions.useQuery();
  const isAuthenticated = trpc.auth.me.useQuery();
  const myResultQuery = trpc.career.myResult.useQuery(undefined, { enabled: phase === "intro" && isAuthenticated.data !== null && isAuthenticated.data !== undefined });
  const submitMutation = trpc.career.submit.useMutation();
  const myCertificateQuery = trpc.career.myCertificate.useQuery(undefined, { enabled: isAuthenticated.data !== null && isAuthenticated.data !== undefined });

  const totalQuestions = CAREER_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const isFirstTime = !myResultQuery.data;

  useEffect(() => {
    if (phase === "intro" && myResultQuery.data && isFirstTime) {
      // Usuário já fez o teste: mostrar resultado salvo imediatamente.
    }
  }, [myResultQuery.data, phase, isFirstTime]);

  const startQuiz = () => {
    if (isAuthenticated.data === null) {
      setGuestWarning(true);
      return;
    }
    setAnswers({});
    setGuestWarning(false);
    setPhase("quiz");
  };

  const pickAnswer = (questionId: number, area: CareerArea) => {
    setAnswers((current) => ({ ...current, [questionId]: area }));
  };

  const submitQuiz = async () => {
    if (!allAnswered) return;
    const data = await submitMutation.mutateAsync({ answers });
    setSubmitResult(data);
    setPhase("result");
  };

  const shareResult = (areaLabel: string, areaTagline?: string) => {
    const cert = myCertificateQuery.data;
    if (cert) {
      openLinkedInCertificateShare(cert.identifier, `o teste Descubra Sua Carreira com o perfil de ${areaLabel} — ${areaTagline ?? ""}`);
      return;
    }
    const url = window.location.origin;
    const text = `Fiz o teste vocacional da CyberDimension Academy e meu perfil é ${areaLabel}! Descubra sua área na cibersegurança.`;
    void navigator.clipboard?.writeText(text);
    window.open(buildLinkedInShareUrl(url), "_blank", "noopener,noreferrer");
  };

  const areaOf = myResultQuery.data ? getAreaInfo(myResultQuery.data.topArea as CareerArea) : undefined;

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Catálogo</Link>
          <Link href="/" className="font-orbitron text-xs font-bold tracking-[0.08em]">CYBERDIMENSION <span className="text-neon-cyan">ACADEMY</span></Link>
        </div>
      </header>
      <main className="container relative py-10 md:py-14">
        {phase === "intro" ? (
          <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(0.13_0.05_260/0.96),oklch(0.08_0.025_270/0.93))] p-6 text-center md:p-12">
            <div className="absolute -left-12 -top-16 h-60 w-60 rounded-full bg-neon-purple/15 blur-3xl" />
            <div className="absolute -bottom-16 -right-12 h-60 w-60 rounded-full bg-neon-cyan/15 blur-3xl" />
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-neon-cyan/35 bg-neon-cyan/10"><Compass className="h-8 w-8 text-neon-cyan" /></div>
            <p className="relative mt-6 text-xs font-bold tracking-[0.16em] text-neon-cyan">TESTE VOCACIONAL</p>
            <h1 className="relative mt-3 font-orbitron text-3xl font-bold md:text-5xl">Descubra Sua Carreira</h1>
            <p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              Responda {totalQuestions} situações de perfil e descubra qual área da cibersegurança combina mais com você: Blue Team & SOC, Red Team & Pentest, GRC, Cloud Security, Forense Digital ou Engenharia de Segurança.
              Você recebe <strong className="text-neon-green">{CAREER_XP_REWARD} XP</strong> ao concluir o teste.
            </p>
            {myResultQuery.data && areaOf ? (
              <div className="relative mt-8 rounded-2xl border border-neon-green/30 bg-neon-green/10 p-6 text-left">
                <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-neon-green"><Award className="h-4 w-4" /> VOCÊ JÁ CONCLUIU O TESTE</p>
                <h2 className="mt-2 font-orbitron text-xl font-bold">{areaOf.label}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{areaOf.tagline}</p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button onClick={() => setPhase("result")} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-4 py-2.5 text-xs font-bold text-neon-cyan"><Sparkles className="h-4 w-4" /> Ver meu resultado</button>
                  <button onClick={startQuiz} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground">Refazer o teste</button>
                </div>
              </div>
            ) : (
              <>
                {guestWarning ? <p className="mt-6 rounded-xl border border-neon-cyan/25 bg-neon-cyan/10 px-4 py-3 text-xs text-neon-cyan">Faça login para salvar seu resultado, ganhar <strong>+{CAREER_XP_REWARD} XP</strong> e refazer o teste quando quiser.</p> : null}
                <button onClick={startQuiz} className="orbit-button relative mt-8 inline-flex items-center gap-2 rounded-xl border border-neon-cyan/40 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 px-8 py-3.5 text-sm font-bold text-neon-cyan"><Rocket className="h-4 w-4" /> Começar o teste</button>
              </>
            )}
          </section>
        ) : null}

        {phase === "quiz" ? (
          <>
            <div className="mx-auto mb-8 max-w-3xl">
              <p className="text-xs font-bold tracking-[0.16em] text-neon-cyan">DESCUBRA SUA CARREIRA</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full border border-white/10 bg-black/20">
                <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-300" style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{answeredCount} de {totalQuestions} questões respondidas</p>
            </div>
            <div className="mx-auto max-w-3xl space-y-6">
              {CAREER_QUESTIONS.map((question) => (
                <section key={question.id} className="rounded-2xl border border-white/10 bg-[oklch(0.13_0.045_260/0.96)] p-5 md:p-6">
                  <p className="text-xs font-bold tracking-[0.12em] text-neon-purple">QUESTÃO {question.id}</p>
                  <h2 className="mt-2 text-lg font-bold">{question.title}</h2>
                  <div className="mt-4 grid gap-2.5">
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option.area;
                      const areaLabel = getAreaInfo(option.area)?.label ?? option.area;
                      return (
                        <button
                          key={option.area}
                          type="button"
                          onClick={() => pickAnswer(question.id, option.area)}
                          className={`orbit-button flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors ${selected ? "border-neon-cyan/50 bg-neon-cyan/15 text-foreground" : "border-white/10 bg-black/15 text-muted-foreground hover:border-neon-cyan/30 hover:text-foreground"}`}
                        >
                          {selected ? <CheckCircle2 className="h-4 w-4 shrink-0 text-neon-cyan" /> : <span className="h-4 w-4 shrink-0 rounded-full border border-white/25" />}
                          <span>{option.text}</span>
                          <span className={`ml-auto hidden shrink-0 rounded-full border px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.08em] sm:inline-block ${selected ? "border-neon-cyan/40 text-neon-cyan" : "border-white/15 text-muted-foreground"}`}>{areaLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
              <div className="flex justify-end pb-10">
                <button
                  onClick={submitQuiz}
                  disabled={!allAnswered || submitMutation.isPending}
                  className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-6 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Ver meu resultado
                </button>
              </div>
              {submitMutation.error ? <p className="mx-auto max-w-3xl rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">{submitMutation.error.message}</p> : null}
            </div>
          </>
        ) : null}

        {phase === "result" ? (() => {
          const stored = myResultQuery.data;
          const topAreaKey = submitResult?.result.topArea ?? (stored?.topArea as CareerArea | undefined);
          const runnerUpKey = submitResult?.result.runnerUpArea ?? (stored?.runnerUpArea as CareerArea | undefined);
          const topInfo = topAreaKey ? getAreaInfo(topAreaKey) : undefined;
          const runnerUpInfo = runnerUpKey ? getAreaInfo(runnerUpKey) : undefined;
          const xpEarned = submitResult ? CAREER_XP_REWARD : 0;
          return (
            <div className="mx-auto max-w-3xl space-y-6">
              {submitResult && myCertificateQuery.data ? (
                <div className="rounded-2xl border border-neon-green/35 bg-gradient-to-br from-neon-green/15 via-neon-cyan/10 to-neon-purple/10 p-6 text-center">
                  <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-green"><Award className="h-4 w-4" /> TESTE CONCLUÍDO · +{xpEarned} XP · CERTIFICADO EMITIDO</p>
                  <h1 className="mt-3 font-orbitron text-3xl font-bold md:text-4xl">{topInfo?.label ?? topAreaKey}</h1>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{topInfo?.tagline}</p>
                  <div className="relative mt-5 inline-flex items-center gap-2 rounded-xl border border-neon-cyan/30 bg-black/20 px-4 py-2 text-left">
                    <Medal className="h-4 w-4 text-neon-cyan" />
                    <div className="flex flex-col items-start">
                      <span className="text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground">CERTIFICADO OFICIAL</span>
                      <span className="break-all font-mono text-[0.65rem] font-bold text-neon-cyan">{myCertificateQuery.data.identifier}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    <Link href={`/certificate/course/${myCertificateQuery.data.id}`} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-4 py-2 text-xs font-bold text-neon-cyan"><BadgeCheck className="h-4 w-4" /> Ver certificado</Link>
                    <button onClick={() => shareResult(topInfo?.label ?? "", topInfo?.tagline)} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-[#0A66C2]/45 bg-[#0A66C2]/15 px-4 py-2 text-xs font-bold text-[#7db7f3]">Publicar no LinkedIn</button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 p-6 text-center">
                  <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan"><Award className="h-4 w-4" /> SEU RESULTADO SALVO</p>
                  <h1 className="mt-3 font-orbitron text-3xl font-bold md:text-4xl">{topInfo?.label ?? topAreaKey}</h1>
                </div>
              )}
              {topInfo ? (
                <section className="rounded-2xl border border-white/10 bg-[oklch(0.13_0.045_260/0.96)] p-6">
                  <p className="text-xs font-bold tracking-[0.15em] text-neon-purple">SOBRE ESSA ÁREA</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/90">{topInfo.description}</p>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="text-[0.65rem] font-bold tracking-[0.14em] text-muted-foreground">CARGOS DE ENTRADA</p>
                      <ul className="mt-2 space-y-1.5">
                        {topInfo.roles.map((role) => <li key={role} className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon-green" /> {role}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-bold tracking-[0.14em] text-muted-foreground">TRILHAS SUGERIDAS NA ACADEMIA</p>
                      <ul className="mt-2 space-y-1.5">
                        {topInfo.suggestedTracks.map((track) => <li key={track} className="flex items-start gap-2 text-sm text-foreground/80"><Rocket className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon-cyan" /> {track}</li>)}
                      </ul>
                    </div>
                  </div>
                </section>
              ) : null}
              {runnerUpInfo ? (
                <section className="rounded-2xl border border-white/10 bg-black/15 p-6">
                  <p className="text-xs font-bold tracking-[0.15em] text-muted-foreground">SEGUNDA OPÇÃO</p>
                  <h2 className="mt-1 font-orbitron text-lg font-bold">{runnerUpInfo.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{runnerUpInfo.description}</p>
                </section>
              ) : null}
              <section className="rounded-2xl border border-white/10 bg-black/15 p-6">
                <p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">OUTRAS ÁREAS DA CIBERSEGURANÇA</p>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {CAREER_AREAS.filter((area) => area.key !== topAreaKey && area.key !== runnerUpKey).map((area) => (
                    <div key={area.key} className="rounded-xl border border-white/10 bg-black/15 p-3.5">
                      <p className="text-sm font-bold">{area.label}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{area.tagline}</p>
                    </div>
                  ))}
                </div>
              </section>
              <div className="flex flex-wrap justify-center gap-3 pb-10">
                {topInfo ? <button onClick={() => shareResult(topInfo.label)} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-[#0A66C2]/45 bg-[#0A66C2]/15 px-5 py-2.5 text-sm font-bold text-[#7db7f3]">Compartilhar no LinkedIn</button> : null}
                <Link href="/catalog" className="orbit-button inline-flex items-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-5 py-2.5 text-sm font-bold text-neon-cyan">Explorar formações</Link>
                {isFirstTime && submitResult ? <Link href="/dashboard" className="orbit-button inline-flex items-center gap-2 rounded-lg border border-neon-green/30 bg-neon-green/10 px-5 py-2.5 text-sm font-bold text-neon-green">Ir ao painel</Link> : null}
              </div>
            </div>
          );
        })() : null}
      </main>
    </div>
  );
}
