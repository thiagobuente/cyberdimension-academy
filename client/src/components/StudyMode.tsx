import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AudioLines,
  BookOpen,
  BookmarkPlus,
  Brain,
  CheckCircle2,
  Languages,
  MessageCircleQuestion,
  PencilLine,
  Play,
  RotateCcw,
  Square,
  Volume2,
  Trash2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { AIChatBox } from "@/components/AIChatBox";
import { speakLesson, lessonToSpeechLines } from "@/lib/lessonSpeech";
import { GAMIFICATION_RULES } from "@shared/gamification";

type StudyStep = "ler" | "ouvir" | "praticar" | "anotar" | "salvar" | "tutor";

interface StudyModeProps {
  lessonId: number;
  domainId: number;
  lessonTitle: string;
  lessonContent: string;
  completed: boolean;
  onMarkComplete: () => void;
  markingComplete: boolean;
  lessonIndex: number;
  totalLessons: number;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

const STEP_META: Record<StudyStep, { label: string; icon: typeof BookOpen; color: string }> = {
  ler: { label: "Ler", icon: BookOpen, color: "text-neon-cyan" },
  ouvir: { label: "Ouvir", icon: Volume2, color: "text-neon-purple" },
  praticar: { label: "Praticar", icon: Brain, color: "text-neon-green" },
  anotar: { label: "Anotar", icon: PencilLine, color: "text-neon-amber" },
  salvar: { label: "Salvar", icon: BookmarkPlus, color: "text-neon-cyan" },
  tutor: { label: "Tutor IA", icon: MessageCircleQuestion, color: "text-neon-purple" },
};

const SPEECH_RATES = [0.9, 1, 1.15, 1.5, 2];

export default function StudyMode({ lessonId, domainId, lessonTitle, lessonContent, completed, onMarkComplete, markingComplete, lessonIndex, totalLessons }: StudyModeProps) {
  const [step, setStep] = useState<StudyStep>("ler");
  const [speechIndex, setSpeechIndex] = useState(0);
  const [speechTotal, setSpeechTotal] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.15);
  const [rateIndex, setRateIndex] = useState(2);
  const handleRef = useRef<ReturnType<typeof speakLesson> | null>(null);
  const selectionRestored = useRef(false);

  // Notas pessoais da aula
  const notesQuery = trpc.lessons.notes.useQuery({ lessonId });
  const saveNote = trpc.lessons.saveNote.useMutation();
  const deleteNote = trpc.lessons.deleteNote.useMutation();
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  // Bookmarks da aula
  const bookmarksQuery = trpc.lessons.bookmarks.useQuery({ lessonId });
  const saveBookmark = trpc.lessons.saveBookmark.useMutation();
  const deleteBookmark = trpc.lessons.deleteBookmark.useMutation();

  // Quiz do modo estudo: 3 questões do domínio (o servidor já randomiza)
  const questionsQuery = trpc.questions.byDomain.useQuery({ domainId });
  const quizSubmit = trpc.quiz.submit.useMutation();
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizDone, setQuizDone] = useState(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);

  // Tutor IA com contexto da lição
  const tutorChat = trpc.tutor.chat.useMutation();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatContext, setChatContext] = useState("");

  const questions = useMemo(() => (questionsQuery.data ?? []).slice(0, 3), [questionsQuery.data]);
  const notes = notesQuery.data ?? [];
  const bookmarks = bookmarksQuery.data ?? [];

  // Narração da lição (TTS)
  const speechLines = useMemo(() => lessonToSpeechLines(lessonContent), [lessonContent]);
  const lessonSummary = useMemo(
    () => `${lessonTitle}\n\n${lessonToSpeechLines(lessonContent).slice(0, 24).join(" ")}`,
    [lessonTitle, lessonContent],
  );

  const stopSpeech = useCallback(() => {
    handleRef.current?.destroy();
    handleRef.current = null;
    setSpeaking(false);
  }, []);

  const startSpeech = useCallback(() => {
    if (speechLines.length === 0) {
      toast.warning("Esta lição não possui conteúdo para narração. Continue pela leitura.");
      return;
    }
    stopSpeech();
    const handle = speakLesson(speechLines, {
      onLine: (idx, total) => {
        setSpeechIndex(idx);
        setSpeechTotal(total);
      },
      onEnd: () => {
        setSpeaking(false);
        setSpeechIndex(speechLines.length);
      },
    });
    handle.setRate(speechRate);
    handleRef.current = handle;
    handle.play();
    setSpeaking(true);
    setSpeechIndex(0);
    setSpeechTotal(speechLines.length);
  }, [speechLines, speechRate, stopSpeech]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Reiniciar a narração quando a aula muda
  useEffect(() => {
    stopSpeech();
    setSpeechIndex(0);
    setChatMessages([]);
    setChatContext("");
    setQuizDone(false);
    setQuizResult(null);
    setQuizAnswers({});
  }, [lessonId, stopSpeech]);

  const toggleSpeech = () => {
    if (speaking) stopSpeech();
    else startSpeech();
  };

  const cycleRate = () => {
    const nextIndex = (rateIndex + 1) % SPEECH_RATES.length;
    setRateIndex(nextIndex);
    setSpeechRate(SPEECH_RATES[nextIndex]);
    if (handleRef.current) handleRef.current.setRate(SPEECH_RATES[nextIndex]);
    toast.info(`Velocidade da narração: ${SPEECH_RATES[nextIndex]}x`);
  };

  // Salvar nota pessoal
  const handleSaveNote = async () => {
    if (noteTitle.trim().length === 0 || noteContent.trim().length === 0) {
      toast.warning("Informe um título e o conteúdo da nota.");
      return;
    }
    try {
      await saveNote.mutateAsync({ lessonId, title: noteTitle.trim(), content: noteContent.trim() });
      setNoteTitle("");
      setNoteContent("");
      toast.success("Nota salva no seu perfil.");
      await notesQuery.refetch();
    } catch {
      toast.error("Não foi possível salvar a nota. Tente novamente.");
    }
  };

  // Salvar trecho selecionado (bookmark)
  const handleSaveSelection = async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (!text || text.length < 4) {
      toast.warning("Selecione um trecho do conteúdo da lição para salvar.");
      return;
    }
    try {
      await saveBookmark.mutateAsync({ lessonId, excerpt: text.slice(0, 10000) });
      selection?.removeAllRanges?.();
      selectionRestored.current = false;
      toast.success("Trecho salvo nos seus marcadores.");
      await bookmarksQuery.refetch();
    } catch {
      toast.error("Não foi possível salvar o trecho. Tente novamente.");
    }
  };

  // Enviar ao tutor IA com contexto da lição
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    const userMsg: ChatMessage = { role: "user", content: message };
    const contextSnippet = chatContext || lessonSummary;
    setChatMessages((messages) => [...messages, userMsg]);
    try {
      const result = await tutorChat.mutateAsync({
        message: userMsg.content,
        history: [...chatMessages, userMsg].slice(-8).map((message) => ({ role: message.role, content: message.content })),
        context: "security-plus" as const,
        lessonContext: contextSnippet,
      });
      setChatMessages((messages) => [...messages, { role: "assistant", content: result.response }]);
      if (!chatContext && result.response.length > 0) setChatContext(lessonSummary);
    } catch {
      setChatMessages((messages) => [...messages, { role: "assistant", content: "Não consegui processar sua pergunta agora. Tente novamente." }]);
    }
  };

  // Enviar respostas do mini-quiz
  const answersList = useMemo(
    () => questions.map((question) => ({ questionId: question.id, selectedAnswer: quizAnswers[question.id] ?? -1, correct: false })),
    [questions, quizAnswers],
  );
  const quizReady = questions.length > 0 && answersList.every((answer) => answer.selectedAnswer >= 0);

  const handleSubmitQuiz = async () => {
    if (!quizReady) {
      toast.warning("Responda as três questões antes de enviar.");
      return;
    }
    try {
      const result = await quizSubmit.mutateAsync({ domainId, score: 0, totalQuestions: answersList.length, answers: answersList });
      setQuizResult({ score: result.verifiedScore, total: result.verifiedTotal });
      setQuizDone(true);
      const passed = result.verifiedScore === result.verifiedTotal;
      toast.success(passed
        ? `Quiz concluído: ${result.verifiedScore}/${result.verifiedTotal} · +${GAMIFICATION_RULES.approvedQuiz ?? GAMIFICATION_RULES.completedLesson} XP`
        : `Quiz concluído: ${result.verifiedScore}/${result.verifiedTotal}. Revise a lição e tente novamente.`,
        { duration: 6000 },
      );
      if (passed && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("lesson-completion-celebration"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível enviar o quiz. Tente novamente.";
      toast.error(message);
    }
  };

  const retryQuiz = () => {
    setQuizAnswers({});
    setQuizDone(false);
    setQuizResult(null);
    void questionsQuery.refetch();
  };

  const steps: StudyStep[] = ["ler", "ouvir", "praticar", "anotar", "salvar", "tutor"];

  return (
    <aside className="study-mode-panel h-fit rounded-2xl border border-white/10 bg-[oklch(0.09_0.03_260/0.55)] p-4 lg:sticky lg:top-22">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">MODO ESTUDO</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Lição {String(lessonIndex + 1).padStart(2, "0")} de {totalLessons}</p>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-neon-cyan/10 text-neon-cyan"><Languages className="h-4 w-4" /></span>
      </div>

      {/* Trilha guiada */}
      <div className="mt-3 grid grid-cols-6 gap-1" role="tablist" aria-label="Etapas do modo estudo">
        {steps.map((stepKey) => {
          const meta = STEP_META[stepKey];
          const Icon = meta.icon;
          const active = step === stepKey;
          return (
            <button
              key={stepKey}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStep(stepKey)}
              title={meta.label}
              className={`orbit-button grid place-items-center rounded-lg px-1 py-2 ${active ? "border border-neon-cyan/30 bg-neon-cyan/10" : "border border-transparent text-muted-foreground hover:bg-white/6"}`}
            >
              <Icon className={`h-4 w-4 ${meta.color}`} />
              <span className={`mt-1 hidden text-[10px] font-bold lg:block ${active ? "text-neon-cyan" : ""}`}>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Etapa: Ler (padrão, painel de progresso de leitura) */}
      {step === "ler" && (
        <div className="mt-4 space-y-3 text-xs text-muted-foreground">
          <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon-cyan" /> Leia a lição completa com atenção. Use a régua de leitura e o modo foco do leitor.</p>
          <p className="flex items-start gap-2"><AudioLines className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon-purple" /> Depois de ler, siga para <button type="button" onClick={() => setStep("ouvir")} className="font-bold text-neon-purple underline underline-offset-2">Ouvir</button> para reforçar com a narração.</p>
          <p className="flex items-start gap-2"><Brain className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neon-green" /> Fixe o conteúdo em <button type="button" onClick={() => setStep("praticar")} className="font-bold text-neon-green underline underline-offset-2">Praticar</button> com o mini-quiz da lição.</p>
          {completed ? (
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-neon-green/25 bg-neon-green/10 px-3 py-2 font-bold text-neon-green"><CheckCircle2 className="h-4 w-4" /> Lição concluída</p>
          ) : (
            <button type="button" onClick={onMarkComplete} disabled={markingComplete} className="mt-3 orbit-button inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60"><CheckCircle2 className="h-4 w-4" /> {markingComplete ? "Salvando..." : "Concluir aula · +XP"}</button>
          )}
        </div>
      )}

      {/* Etapa: Ouvir (narração TTS) */}
      {step === "ouvir" && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleSpeech} className="orbit-button inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-neon-purple px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
              {speaking ? <><Square className="h-4 w-4" /> Parar narração</> : <><Play className="h-4 w-4" /> {speechIndex > 0 ? "Continuar" : "Ouvir lição"}</>}
            </button>
            <button type="button" onClick={cycleRate} title="Velocidade da narração" className="orbit-button inline-flex items-center justify-center gap-1 rounded-xl border border-white/14 bg-white/[0.035] px-3 py-3 text-xs font-bold text-muted-foreground hover:bg-white/10">
              {speechRate}x
            </button>
            <button type="button" onClick={() => { setSpeechIndex(0); startSpeech(); }} title="Reiniciar narração" className="orbit-button inline-flex items-center justify-center rounded-xl border border-white/14 bg-white/[0.035] px-3 py-3 text-muted-foreground hover:bg-white/10"><RotateCcw className="h-4 w-4" /></button>
          </div>
          {speaking && (
            <div className="overflow-hidden rounded-xl border border-neon-purple/25 bg-neon-purple/10 p-3 text-xs">
              <p className="font-bold text-neon-purple">NARRANDO · {speechRate}x</p>
              <p className="mt-1 text-muted-foreground">Trecho {speechIndex + 1} de {speechTotal || speechLines.length}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan" style={{ width: `${speechTotal > 0 ? Math.round((speechIndex / speechTotal) * 100) : 0}%` }} /></div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">A narração usa o texto da própria lição, com voz em português. Pausas acompanham títulos e parágrafos.</p>
        </div>
      )}

      {/* Etapa: Praticar (mini-quiz de 3 questões) */}
      {step === "praticar" && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <p className="font-bold tracking-[0.12em] text-neon-green">MINI-QUIZ DA LIÇÃO</p>
            {questionsQuery.isLoading && <p className="text-muted-foreground">Carregando questões...</p>}
          </div>
          {questions.length === 0 && !questionsQuery.isLoading && (
            <p className="text-xs text-muted-foreground">Nenhuma questão disponível para este domínio neste momento. Pratique pelo simulado completo.</p>
          )}
          {questions.map((question, qIndex) => {
            const options = question.options as string[];
            return (
              <div key={question.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs font-semibold text-foreground">{qIndex + 1}. {question.question}</p>
                <div className="mt-2 space-y-1.5">
                  {options.map((option, optionIndex) => {
                    const selected = quizAnswers[question.id] === optionIndex;
                    const revealed = quizDone;
                    const isCorrect = revealed && question.correctAnswer === optionIndex;
                    const isWrong = revealed && selected && !isCorrect;
                    return (
                      <button
                        key={optionIndex}
                        type="button"
                        disabled={quizDone}
                        onClick={() => setQuizAnswers((current) => ({ ...current, [question.id]: optionIndex }))}
                        className={`orbit-button flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs ${selected ? "border-neon-purple/40 bg-neon-purple/15 text-foreground" : "border-white/10 bg-white/[0.03] text-muted-foreground hover:bg-white/8"} ${isCorrect ? "border-neon-green/50 bg-neon-green/12 text-neon-green" : ""} ${isWrong ? "border-neon-red/50 bg-neon-red/12 text-neon-red" : ""}`}
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/15 text-[10px] font-bold">{String.fromCharCode(65 + optionIndex)}</span>
                        <span className="min-w-0 flex-1">{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {quizResult && (
            <div className="rounded-xl border border-neon-purple/25 bg-neon-purple/10 p-3 text-xs">
              <p className="font-bold text-neon-purple">Resultado: {quizResult.score}/{quizResult.total}</p>
              {quizResult.score === quizResult.total && <p className="mt-1 text-neon-green">Todos os acertos. A competência do domínio foi reforçada!</p>}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={handleSubmitQuiz} disabled={!quizReady || quizSubmit.isPending} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl bg-neon-green px-3 py-2.5 text-xs font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-50">{quizSubmit.isPending ? "Enviando..." : quizDone ? "Enviar novamente" : "Enviar respostas"}</button>
            {quizDone && <button type="button" onClick={retryQuiz} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.035] px-3 py-2.5 text-xs font-bold text-muted-foreground hover:bg-white/10"><RotateCcw className="h-3.5 w-3.5" /> Refazer</button>}
          </div>
        </div>
      )}

      {/* Etapa: Anotar (notas pessoais) */}
      {step === "anotar" && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={noteTitle}
              onChange={(event) => setNoteTitle(event.target.value)}
              placeholder="Título da nota"
              maxLength={180}
              className="orbit-input min-w-0 flex-1 rounded-lg border border-white/12 bg-black/25 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <textarea
            value={noteContent}
            onChange={(event) => setNoteContent(event.target.value)}
            placeholder="Escreva suas anotações desta lição (resumo, exemplos, dúvidas)..."
            maxLength={20000}
            rows={4}
            className="orbit-input w-full resize-y rounded-lg border border-white/12 bg-black/25 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground"
          />
          <button type="button" onClick={handleSaveNote} disabled={saveNote.isPending} className="orbit-button inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon-amber px-4 py-2.5 text-xs font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60"><PencilLine className="h-3.5 w-3.5" /> {saveNote.isPending ? "Salvando..." : "Salvar nota"}</button>
          {notes.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold tracking-[0.12em] text-neon-amber">SUAS NOTAS NESTA LIÇÃO ({notes.length})</p>
              {notes.map((note) => (
                <div key={note.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 text-xs font-bold text-foreground">{note.title}</p>
                    <button type="button" onClick={async () => { await deleteNote.mutateAsync({ noteId: note.id }); await notesQuery.refetch(); toast.success("Nota removida."); }} className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-neon-red/15 hover:text-neon-red"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">{note.content}</p>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">Suas notas ficam salvas no perfil e podem ser revistas a qualquer momento.</p>
        </div>
      )}

      {/* Etapa: Salvar (bookmarks de trechos) */}
      {step === "salvar" && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground">Selecione um trecho no conteúdo da lição e clique em salvar para armazená-lo como marcador.</p>
          <button type="button" onClick={handleSaveSelection} disabled={saveBookmark.isPending} className="orbit-button inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neon-cyan px-4 py-2.5 text-xs font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60"><BookmarkPlus className="h-3.5 w-3.5" /> {saveBookmark.isPending ? "Salvando..." : "Salvar trecho selecionado"}</button>
          {bookmarks.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold tracking-[0.12em] text-neon-cyan">TRECHOS SALVOS ({bookmarks.length})</p>
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 whitespace-pre-wrap border-l-2 border-neon-cyan/50 pl-3 text-xs italic leading-5 text-foreground">“{bookmark.excerpt}”</p>
                    <button type="button" onClick={async () => { await deleteBookmark.mutateAsync({ bookmarkId: bookmark.id }); await bookmarksQuery.refetch(); toast.success("Marcador removido."); }} className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-neon-red/15 hover:text-neon-red"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Etapa: Tutor IA */}
      {step === "tutor" && (
        <div className="mt-4">
          <AIChatBox
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={tutorChat.isPending}
            placeholder="Pergunte sobre esta lição..."
            className="rounded-xl border border-white/10"
            height="220px"
            emptyStateMessage="Pergunte ao tutor sobre o conteúdo desta lição. Ele responde com base no texto que você acabou de estudar."
            suggestedPrompts={[
              "Explique o conceito central desta lição com um exemplo prático.",
              "Crie uma pergunta de revisão sobre esta lição.",
              "Como esse tema aparece na prova Security+?",
            ]}
          />
          <p className="mt-2 text-[11px] text-muted-foreground">O tutor responde considerando o conteúdo da lição {String(lessonIndex + 1).padStart(2, "0")} aberta.</p>
        </div>
      )}
    </aside>
  );
}
