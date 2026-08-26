import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useParams } from "wouter";
import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Brain,
  BookmarkPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  CirclePlay,
  GraduationCap,
  Linkedin,
  ListChecks,
  LockKeyhole,
  Shield,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import { ReadingControls } from "@/components/ReadingControls";
import CertificateDetailsDialog from "@/components/CertificateDetailsDialog";
import StudyMode from "@/components/StudyMode";
import { openLinkedInCertificateShare } from "@/lib/shareCertificate";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import { getReadingPreferenceClasses } from "@/lib/readingPreferences";
import { GAMIFICATION_RULES } from "@shared/gamification";

export default function Course() {
  const saveSelectionBookmark = trpc.lessons.saveBookmark.useMutation();
  const { domainId } = useParams<{ domainId: string }>();
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const domainIdNum = Number.parseInt(domainId || "1", 10);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [undoLessonId, setUndoLessonId] = useState<number | null>(null);
  const [celebratingLessonId, setCelebratingLessonId] = useState<number | null>(null);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const studyHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousLessonIdRef = useRef<number | null>(null);
  const { preferences } = useReadingPreferences();

  const validDomainId = Number.isFinite(domainIdNum) && domainIdNum > 0 ? domainIdNum : null;
  const domainQuery = trpc.domains.byId.useQuery(validDomainId !== null ? { id: validDomainId } : undefined as never, {
    enabled: validDomainId !== null,
  });
  const lessonsQuery = trpc.lessons.byDomain.useQuery(validDomainId !== null ? { domainId: validDomainId } : undefined as never, {
    enabled: validDomainId !== null,
  });
  const progressQuery = trpc.progress.byDomain.useQuery(validDomainId !== null ? { userId: user?.id || 0, domainId: validDomainId } : undefined as never, {
    enabled: validDomainId !== null,
  });
  const certificatesQuery = trpc.certificates.list.useQuery();
  const markComplete = trpc.progress.markComplete.useMutation();
  const markIncomplete = trpc.progress.markIncomplete.useMutation();
  const issueCertificate = trpc.certificates.issue.useMutation();
  const updateProfile = trpc.auth.updateProfile.useMutation();

  const lessons = lessonsQuery.data ?? [];
  const completedLessons = useMemo(
    () => new Set((progressQuery.data ?? []).filter((item) => item.completed && item.lessonId).map((item) => item.lessonId as number)),
    [progressQuery.data],
  );
  const completedCount = completedLessons.size;
  const totalLessons = lessons.length;
  const completion = totalLessons > 0 ? Math.min(Math.round((completedCount / totalLessons) * 100), 100) : 0;
  const allLessonsComplete = totalLessons > 0 && completedCount >= totalLessons;
  const certificate = (certificatesQuery.data ?? []).find((item) => item.domainId === domainIdNum);
  const selectedLessonIndex = lessons.findIndex((lesson) => lesson.id === selectedLesson?.id);
  const previousLesson = selectedLessonIndex > 0 ? lessons[selectedLessonIndex - 1] : null;
  const nextLesson = selectedLessonIndex >= 0 && selectedLessonIndex < lessons.length - 1 ? lessons[selectedLessonIndex + 1] : null;

  useEffect(() => {
    setSelectedLesson(null);
    setUndoLessonId(null);
    setCelebratingLessonId(null);
  }, [domainIdNum]);

  useEffect(() => {
    if (lessons.length > 0 && !selectedLesson) setSelectedLesson(lessons[0]);
  }, [lessons, selectedLesson]);

  useEffect(() => {
    if (!undoLessonId) return;
    const timeoutId = window.setTimeout(() => setUndoLessonId(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [undoLessonId]);

  useEffect(() => {
    if (!celebratingLessonId) return;
    const timeoutId = window.setTimeout(() => setCelebratingLessonId(null), 3400);
    return () => window.clearTimeout(timeoutId);
  }, [celebratingLessonId]);

  useEffect(() => {
    const lessonId = selectedLesson?.id as number | undefined;
    if (!lessonId) return;
    const previousLessonId = previousLessonIdRef.current;
    previousLessonIdRef.current = lessonId;
    if (previousLessonId === null || previousLessonId === lessonId) return;

    const frameId = window.requestAnimationFrame(() => {
      studyHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      studyHeadingRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [selectedLesson?.id]);

  const handleMarkComplete = async (lessonId: number) => {
    try {
      await markComplete.mutateAsync({ domainId: domainIdNum, lessonId });
      await progressQuery.refetch();
      setUndoLessonId(lessonId);
      setCelebratingLessonId(lessonId);
      toast.success(`Aula concluída · +${GAMIFICATION_RULES.completedLesson} XP`, {
        id: `lesson-complete-${lessonId}`,
        duration: 5000,
        action: {
          label: "Desfazer",
          onClick: () => { void handleUndoCompletion(lessonId); },
        },
      });
    } catch {
      toast.error("Não foi possível registrar a conclusão. Tente novamente.");
    }
  };

  const handleUndoCompletion = async (lessonId: number) => {
    try {
      await markIncomplete.mutateAsync({ domainId: domainIdNum, lessonId });
      await progressQuery.refetch();
      setUndoLessonId(null);
      setCelebratingLessonId(null);
      toast.dismiss(`lesson-complete-${lessonId}`);
      toast.success("Conclusão desfeita. A aula voltou para a sua lista de estudo.");
    } catch {
      toast.error("Não foi possível desfazer a conclusão. Tente novamente.");
    }
  };

  const handleSaveSelectionStudy = async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (!text || text.length < 4 || !selectedLesson) {
      toast.warning("Selecione um trecho do conteúdo da lição na área de leitura e clique novamente para salvar.");
      return;
    }
    try {
      await saveSelectionBookmark.mutateAsync({ lessonId: selectedLesson.id, excerpt: text.slice(0, 10000) });
      selection?.removeAllRanges?.();
      toast.success("Trecho salvo nos seus marcadores do modo estudo.");
    } catch {
      toast.error("Não foi possível salvar o trecho. Tente novamente.");
    }
  };

  const handleIssueCertificate = async (displayName: string) => {
    try {
      await updateProfile.mutateAsync({ name: displayName });
      const result = await issueCertificate.mutateAsync({ domainId: domainIdNum, displayName });
      await certificatesQuery.refetch();
      setCertificateDialogOpen(false);
      toast.success(`Certificado emitido: ${result.identifier}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível emitir o certificado.";
      toast.error(message);
    }
  };

  if (!user) return null;

  const domain = domainQuery.data ?? null;
  const domainNotFound = validDomainId === null || (!domainQuery.isLoading && !domain);

  if (domainNotFound) {
    return (
      <div className="min-h-screen space-canvas text-foreground">
        <header className="border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
          <div className="container flex items-center justify-between gap-4 py-3">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link>
            <Link href="/" className="flex items-center gap-2 font-orbitron text-xs font-bold tracking-[0.06em]"><span className="grid h-8 w-8 place-items-center rounded-lg border border-neon-cyan/30 bg-neon-cyan/10"><Shield className="h-4 w-4 text-neon-cyan" /></span> CYBERDIMENSION</Link>
          </div>
        </header>
        <main className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
          <Shield className="h-10 w-10 text-muted-foreground" />
          <h1 className="font-orbitron text-2xl font-bold">Domínio de estudo não encontrado</h1>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">A trilha informada não existe ou foi alterada. Volte ao painel para continuar pelos seus cinco domínios de Security+ ou navegue até a trilha de preparação.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link href="/securityplus/trilha" className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]">Abrir trilha Security+ <Target className="h-4 w-4" /></Link>
            <Link href="/dashboard" className="orbit-button inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/5 px-4 py-3 text-sm font-bold hover:bg-white/10">Voltar ao painel</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`course-study-shell reading-theme-transition min-h-screen space-canvas text-foreground ${getReadingPreferenceClasses(preferences)} ${preferences.focusMode ? "study-focus" : ""}`}>
      {!preferences.focusMode && <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />}

      <header className="study-session-header sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex items-center justify-between gap-4 py-3">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Voltar ao painel</span><span className="sm:hidden">Painel</span></Link>
          <Link href="/" className="flex items-center gap-2 font-orbitron text-xs font-bold tracking-[0.06em]"><span className="grid h-8 w-8 place-items-center rounded-lg border border-neon-cyan/30 bg-neon-cyan/10"><Shield className="h-4 w-4 text-neon-cyan" /></span> CYBERDIMENSION</Link>
        </div>
      </header>

      <main className="container relative py-6 md:py-8">
        <section className="course-intro module-card rounded-3xl p-5 md:p-7">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan"><Sparkles className="h-3.5 w-3.5" /> TRILHA DE ESTUDO</p>
              <h1 className="mt-3 font-orbitron text-2xl font-bold leading-tight md:text-3xl">{domainQuery.data?.title ?? "Carregando domínio..."}</h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">{domainQuery.data?.description ?? "Organize seus estudos, conclua as lições e avance com segurança para o próximo objetivo."}</p>
            </div>
            <div className="min-w-[15rem] rounded-2xl border border-neon-cyan/18 bg-neon-cyan/[0.055] p-4">
              <div className="flex items-center justify-between text-xs font-bold"><span className="text-muted-foreground">SEU AVANÇO</span><span className="text-neon-cyan">{completion}%</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" style={{ width: `${completion}%` }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">{completedCount} de {totalLessons || "—"} lições concluídas</p>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <ReadingControls
              onMarkComplete={selectedLesson ? () => handleMarkComplete(selectedLesson.id) : undefined}
              isMarkingComplete={markComplete.isPending}
              isComplete={selectedLesson ? completedLessons.has(selectedLesson.id) : false}
              completionDisabled={!selectedLesson}
              onUndoCompletion={selectedLesson ? () => handleUndoCompletion(selectedLesson.id) : undefined}
              undoAvailable={selectedLesson?.id === undoLessonId}
              onNextLesson={nextLesson ? () => setSelectedLesson(nextLesson) : undefined}
              nextLessonTitle={nextLesson?.title}
            />
          </div>
        </section>

        <div className="course-layout mt-6 grid gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)]">
          <aside className="course-sidebar module-card h-fit rounded-2xl p-4 lg:sticky lg:top-22">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div><p className="text-xs font-bold tracking-[0.15em] text-neon-purple">NAVEGAÇÃO</p><h2 className="mt-1 font-orbitron text-sm font-bold">Lições do domínio</h2></div>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-neon-purple/10 text-neon-purple"><BookOpen className="h-4 w-4" /></span>
            </div>

            <div className="mt-3 max-h-[44vh] space-y-1 overflow-y-auto pr-1 lg:max-h-[56vh]">
              {lessonsQuery.isLoading && <p className="px-3 py-5 text-sm text-muted-foreground">Carregando lições...</p>}
              {lessons.map((lesson, index) => {
                const active = selectedLesson?.id === lesson.id;
                const complete = completedLessons.has(lesson.id);
                return (
                  <button key={lesson.id} onClick={() => setSelectedLesson(lesson)} className={`orbit-button flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${active ? "border border-neon-cyan/25 bg-neon-cyan/10 text-neon-cyan" : "border border-transparent text-foreground hover:bg-white/6"}`}>
                    {complete ? <CheckCircle2 className="h-4 w-4 shrink-0 text-neon-green" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    <span className="min-w-0 flex-1 truncate"><span className="mr-1.5 text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>{lesson.title}</span>
                    {active && <ChevronRight className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <Link href={`/quiz/${domainIdNum}`} className="orbit-button mt-5 flex items-center justify-center gap-2 rounded-xl border border-neon-purple/30 bg-neon-purple/10 px-3 py-3 text-sm font-bold text-neon-purple hover:bg-neon-purple/15"><ListChecks className="h-4 w-4" /> Praticar este domínio</Link>
          </aside>

          <section className="course-content min-w-0">
            {selectedLesson ? (
              <article className="reading-panel module-card rounded-2xl p-5 md:p-8">
                <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">LIÇÃO {String((lessons.findIndex((item) => item.id === selectedLesson.id) + 1)).padStart(2, "0")}</p>
                    <h2 ref={studyHeadingRef} tabIndex={-1} className="study-lesson-title mt-2 scroll-mt-24 outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60">{selectedLesson.title}</h2>
                  </div>
                  {completedLessons.has(selectedLesson.id) ? (
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-neon-green/25 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green"><CheckCircle2 className="h-4 w-4" /> Concluída</span>
                  ) : (
                    <button onClick={() => handleMarkComplete(selectedLesson.id)} disabled={markComplete.isPending} className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-neon-green px-3 py-2 text-xs font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60"><CheckCircle2 className="h-4 w-4" /> {markComplete.isPending ? "Salvando..." : "Marcar como concluída"}</button>
                  )}
                </div>

                {celebratingLessonId === selectedLesson.id && (
                  <section className="lesson-completion-celebration mt-6" role="status" aria-live="polite">
                    <span className="lesson-celebration-particle particle-one" aria-hidden="true" />
                    <span className="lesson-celebration-particle particle-two" aria-hidden="true" />
                    <span className="lesson-celebration-particle particle-three" aria-hidden="true" />
                    <div className="lesson-celebration-icon"><Trophy className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-orbitron text-sm font-bold text-foreground">Aula concluída</p>
                      <p className="mt-1 text-sm text-muted-foreground">Seu progresso foi salvo com sucesso.</p>
                    </div>
                    <span className="lesson-xp-badge">+{GAMIFICATION_RULES.completedLesson} XP</span>
                  </section>
                )}

                <div className="study-copy prose mt-7 prose-headings:text-foreground prose-a:text-neon-cyan prose-strong:text-neon-cyan prose-code:rounded prose-code:bg-white/8 prose-code:px-1.5 prose-code:py-0.5 prose-li:marker:text-neon-purple">
                  <Streamdown>{selectedLesson.content}</Streamdown>
                </div>

                <div className="mt-8 flex justify-center">
                  <button type="button" onClick={handleSaveSelectionStudy} className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2.5 text-xs font-bold text-neon-cyan hover:bg-neon-cyan/15"><BookmarkPlus className="h-4 w-4" /> Salvar trecho selecionado</button>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><CirclePlay className="h-4 w-4 text-neon-purple" /> Continue no seu ritmo; o progresso é salvo automaticamente.</div>
                    <Link href={`/quiz/${domainIdNum}`} className="inline-flex items-center gap-1 text-sm font-bold text-neon-purple hover:underline">Ir ao simulado <ArrowUpRight className="h-4 w-4" /></Link>
                  </div>
                    {completedLessons.has(selectedLesson.id) && nextLesson && (
                    <section className="lesson-next-step" aria-label="Próximo conteúdo">
                      <div className="min-w-0"><p className="text-xs font-bold tracking-[0.12em] text-neon-cyan">PRÓXIMO CONTEÚDO</p><p className="mt-1 truncate text-sm font-semibold text-foreground">{nextLesson.title}</p></div>
                      <button type="button" onClick={() => setSelectedLesson(nextLesson)} className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]">Próxima aula <ChevronRight className="h-4 w-4" /></button>
                    </section>
                  )}
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => previousLesson && setSelectedLesson(previousLesson)} disabled={!previousLesson} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.035] px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Aula anterior</button>
                    <button type="button" onClick={() => nextLesson && setSelectedLesson(nextLesson)} disabled={!nextLesson} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl bg-neon-cyan px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:cursor-not-allowed disabled:opacity-40">Próxima aula <ChevronRight className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ) : (
              <div className="module-card grid min-h-80 place-items-center rounded-2xl p-8 text-center"><div><BookOpen className="mx-auto h-8 w-8 text-neon-cyan" /><p className="mt-4 text-muted-foreground">Selecione uma lição para iniciar o estudo.</p></div></div>
            )}

            <aside className="course-studymode hidden h-fit lg:sticky lg:top-22 lg:block">
              {selectedLesson && !completedLessons.has(selectedLesson.id) ? (
                <StudyMode
                  lessonId={selectedLesson.id}
                  domainId={domainIdNum}
                  lessonTitle={selectedLesson.title}
                  lessonContent={selectedLesson.content}
                  completed={false}
                  onMarkComplete={() => handleMarkComplete(selectedLesson.id)}
                  markingComplete={markComplete.isPending}
                  lessonIndex={selectedLessonIndex}
                  totalLessons={totalLessons}
                />
              ) : (
                <div className="module-card grid h-48 place-items-center rounded-2xl p-6 text-center">
                  <div>
                    <Brain className="mx-auto h-6 w-6 text-neon-cyan" />
                    <p className="mt-3 text-xs text-muted-foreground">Selecione uma lição e conclua as etapas do modo estudo para liberar o painel.</p>
                  </div>
                </div>
              )}
            </aside>
            {allLessonsComplete && (
              <section className="mt-6 overflow-hidden rounded-2xl border border-neon-green/25 bg-gradient-to-r from-neon-green/12 via-[oklch(0.1_0.03_260/0.85)] to-neon-cyan/10 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon-green/30 bg-neon-green/10"><Trophy className="h-5 w-5 text-neon-green" /></span><div><p className="font-orbitron text-lg font-bold">Domínio concluído.</p><p className="mt-1 text-sm text-muted-foreground">Você completou todas as lições desta trilha.</p></div></div>
                  {certificate ? <div className="flex flex-wrap items-center gap-2"><Link href={`/certificate/${certificate.id}`} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-neon-green/35 bg-neon-green/10 px-4 py-3 text-sm font-bold text-neon-green hover:bg-neon-green/15"><GraduationCap className="h-4 w-4" /> Ver certificado</Link><button type="button" onClick={() => { openLinkedInCertificateShare(certificate.identifier); toast.success("A janela do LinkedIn foi aberta. Conclua a publicação na aba que abriu."); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-3 text-sm font-bold text-neon-cyan hover:bg-neon-cyan/15"><Linkedin className="h-4 w-4" /> Publicar no LinkedIn</button></div> : <button type="button" onClick={() => setCertificateDialogOpen(true)} disabled={issueCertificate.isPending || updateProfile.isPending} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl bg-neon-green px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60"><GraduationCap className="h-4 w-4" /> Emitir certificado</button>}
                </div>
              </section>
            )}

            {!allLessonsComplete && <section className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-muted-foreground"><LockKeyhole className="h-4 w-4 shrink-0 text-neon-purple" /> Conclua todas as lições para liberar seu certificado digital deste domínio.</section>}
          </section>
        </div>
      </main>
      <CertificateDetailsDialog open={certificateDialogOpen} defaultName={user.name || user.email || ""} courseTitle={domain?.title || "CompTIA Security+ SY0-701"} submitting={issueCertificate.isPending || updateProfile.isPending} onClose={() => setCertificateDialogOpen(false)} onConfirm={(displayName) => void handleIssueCertificate(displayName)} />
    </div>
  );
}
