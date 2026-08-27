import { useAuth } from "@/_core/hooks/useAuth";
import { getStarterCourse } from "@/data/courseCatalog";
import { getPmsecModuleMaterial } from "@/data/pmsecMaterials";
import { aiAcademyCourse, aiAcademyPromptLab, aiAcademyProjects } from "@shared/aiAcademyCourse";
import { trpc } from "@/lib/trpc";
import NotFound from "@/pages/NotFound";
import { Link, useParams } from "wouter";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Captions,
  CheckCircle2,
  ChevronRight,
  Circle,
  CirclePlay,
  ClipboardCheck,
  Code2,
  Cpu,
  Expand,
  FlaskConical,
  Heart,
  Headphones,
  Lightbulb,
  ListVideo,
  NotebookPen,
  Network,
  Play,
  Save,
  Shield,
  Sparkles,
  Terminal,
  Trash2,
  Trophy,
  Linkedin,
  FileUp,
} from "lucide-react";
import { toast } from "sonner";
import { ReadingControls } from "@/components/ReadingControls";
import { useReadingPreferences } from "@/contexts/ReadingPreferencesContext";
import { getReadingPreferenceClasses } from "@/lib/readingPreferences";
import { ContentTransparency } from "@/components/ContentTransparency";
import { openLinkedInCertificateShare } from "@/lib/shareCertificate";
import { LearningJourney } from "@/components/LearningJourney";
import { getAuthorialVideoLessons } from "@/lib/authorialVideoCatalog";
import CertificateDetailsDialog from "@/components/CertificateDetailsDialog";

const iconMap = { cpu: Cpu, shield: Shield, network: Network, terminal: Terminal };
const accentMap = {
  cyan: { text: "text-neon-cyan", border: "border-neon-cyan/30", surface: "bg-neon-cyan/10", button: "bg-neon-cyan", progress: "from-neon-cyan to-neon-purple" },
  purple: { text: "text-neon-purple", border: "border-neon-purple/30", surface: "bg-neon-purple/10", button: "bg-neon-purple", progress: "from-neon-purple to-neon-cyan" },
  green: { text: "text-neon-green", border: "border-neon-green/30", surface: "bg-neon-green/10", button: "bg-neon-green", progress: "from-neon-green to-neon-cyan" },
  blue: { text: "text-blue-300", border: "border-blue-300/30", surface: "bg-blue-300/10", button: "bg-blue-300", progress: "from-blue-300 to-neon-cyan" },
};

const badgeCatalog = [
  { code: "first-module", title: "Primeiro Salto", description: "Primeiro módulo concluído", tone: "cyan" },
  { code: "all-modules", title: "Mapa Estelar", description: "Rota de módulos completa", tone: "purple" },
  { code: "first-lab", title: "Explorador", description: "Primeira missão validada", tone: "green" },
  { code: "all-labs", title: "Operador Prático", description: "Todos os labs concluídos", tone: "green" },
  { code: "assessment-passed", title: "Mestre da Missão", description: "Avaliação final aprovada", tone: "purple" },
  { code: "certified", title: "Orbit Certified", description: "Certificado nominal emitido", tone: "cyan" },
] as const;

type QuizStreakFeedback = {
  currentStreak: number;
  bonusXp: number;
  milestone: { label: string; xp: number } | null;
};

type QuizFeedback = {
  score: number;
  totalQuestions: number;
  percentage: number;
  completed?: boolean;
  review: { id: string; correct: boolean; correctAnswer: number; explanation: string }[];
  streak?: QuizStreakFeedback;
};

function QuizStreakNotice({ streak }: { streak?: QuizStreakFeedback }) {
  if (!streak || streak.currentStreak < 2) return null;
  const earnedBonus = streak.bonusXp > 0;
  return <div className={`mt-3 flex items-start gap-3 rounded-lg border px-3 py-3 text-sm ${earnedBonus ? "border-neon-green/30 bg-neon-green/10 text-neon-green" : "border-neon-cyan/25 bg-neon-cyan/[0.08] text-neon-cyan"}`}>
    <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
    <div><p className="font-bold">{earnedBonus ? `${streak.milestone?.label}: +${streak.bonusXp} XP` : `Sequência perfeita: ${streak.currentStreak} quizzes`}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{earnedBonus ? `Marco de ${streak.currentStreak} acertos perfeitos registrado no seu progresso.` : "Acerte todos os itens dos próximos quizzes para alcançar o próximo marco de XP."}</p></div>
  </div>;
}

export default function FormationStudy() {
  const { slug } = useParams<{ slug: string }>();
  const course = getStarterCourse(slug || "");
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedLab, setSelectedLab] = useState(0);
  const [labRun, setLabRun] = useState<{ runId: number; success: boolean; output: string } | null>(null);
  const [labAnswer, setLabAnswer] = useState("");
  const [labHintVisible, setLabHintVisible] = useState(false);
  const [moduleQuizAnswers, setModuleQuizAnswers] = useState<number[]>([]);
  const [moduleQuestionIndex, setModuleQuestionIndex] = useState(0);
  const [moduleQuestionFeedback, setModuleQuestionFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [moduleQuizResult, setModuleQuizResult] = useState<QuizFeedback | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<number[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<{ percentage: number; passed: boolean } | null>(null);
  const [selectedVideoChapter, setSelectedVideoChapter] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoNoteDraft, setVideoNoteDraft] = useState("");
  const [videoQuizAnswers, setVideoQuizAnswers] = useState<number[]>([]);
  const [videoQuizResult, setVideoQuizResult] = useState<QuizFeedback | null>(null);
  const [videoQuizVisible, setVideoQuizVisible] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [projectSummary, setProjectSummary] = useState("");
  const [projectRubric, setProjectRubric] = useState<Record<string, number>>({ escopo: 0, risco: 0, controles: 0, governanca: 0, metricas: 0 });
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const videoFrameRef = useRef<HTMLIFrameElement>(null);
  const videoFrameContainerRef = useRef<HTMLDivElement>(null);
  const studyHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousModuleRef = useRef<number | null>(null);
  const { preferences } = useReadingPreferences();
  const courseSlug = course?.slug ?? "fundamentos-ti";
  const authorialVideoLessons = useMemo(() => course ? getAuthorialVideoLessons(course) : [], [course]);
  const pmsecMaterial = courseSlug === "gestao-projetos-seguranca-cibernetica" ? getPmsecModuleMaterial(selectedModule) : undefined;
  const utils = trpc.useUtils();
  const progressQuery = trpc.formations.progress.useQuery({ courseSlug });
  const assessmentQuery = trpc.formations.assessment.useQuery({ courseSlug });
  const moduleQuizQuery = trpc.formations.moduleQuiz.useQuery({ courseSlug, moduleIndex: selectedModule });
  const videoQuizQuery = trpc.formations.videoQuiz.useQuery({ courseSlug, moduleIndex: selectedModule });
  const submitModuleQuiz = trpc.formations.submitModuleQuiz.useMutation();
  const submitModuleQuestion = trpc.formations.submitModuleQuestion.useMutation();
  const submitVideoQuiz = trpc.formations.submitVideoQuiz.useMutation();
  const runLab = trpc.formations.runLab.useMutation();
  const verifyLab = trpc.formations.verifyLab.useMutation();
  const issueCertificate = trpc.formations.issueCertificate.useMutation();
  const updateProfile = trpc.auth.updateProfile.useMutation();
  const submitAssessment = trpc.formations.submitAssessment.useMutation();
  const saveVideoProgress = trpc.formations.saveVideoProgress.useMutation();
  const saveVideoNote = trpc.formations.saveVideoNote.useMutation();
  const removeVideoNote = trpc.formations.removeVideoNote.useMutation();
  const setFavorite = trpc.formations.setFavorite.useMutation();
  const projectCompletionsQuery = trpc.cyberProjects.completions.useQuery(undefined, { enabled: Boolean(user) });
  const completeProject = trpc.cyberProjects.complete.useMutation();
  const attachProjectEvidence = trpc.portfolio.attachEvidence.useMutation();

  const completedModules = useMemo(
    () => new Set((progressQuery.data?.modules ?? []).filter((item) => item.completed).map((item) => item.moduleIndex)),
    [progressQuery.data?.modules],
  );
  const completedLabs = useMemo(
    () => new Set((progressQuery.data?.labs ?? []).filter((item) => item.completed).map((item) => item.labIndex)),
    [progressQuery.data?.labs],
  );

  useEffect(() => {
    setLabRun(null);
    setLabAnswer("");
  }, [selectedLab, courseSlug]);

  useEffect(() => {
    setModuleQuizAnswers([]);
    setModuleQuestionIndex(0);
    setModuleQuestionFeedback(null);
    setModuleQuizResult(null);
  }, [selectedModule, courseSlug]);

  useEffect(() => {
    const previousModule = previousModuleRef.current;
    previousModuleRef.current = selectedModule;
    if (previousModule === null || previousModule === selectedModule) return;

    const frameId = window.requestAnimationFrame(() => {
      studyHeadingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      studyHeadingRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [selectedModule]);

  useEffect(() => {
    setVideoQuizAnswers([]);
    setVideoQuizResult(null);
    setVideoQuizVisible(false);
  }, [selectedModule, courseSlug]);

  useEffect(() => {
    const savedChapter = progressQuery.data?.videoProgress.find((item) => item.moduleIndex === selectedModule)?.chapterIndex;
    setSelectedVideoChapter(savedChapter ?? 0);
  }, [courseSlug, progressQuery.data?.videoProgress, selectedModule]);

  useEffect(() => {
    const savedNote = progressQuery.data?.videoNotes.find((item) => item.moduleIndex === selectedModule && item.chapterIndex === selectedVideoChapter);
    setVideoNoteDraft(savedNote?.content ?? "");
  }, [courseSlug, progressQuery.data?.videoNotes, selectedModule, selectedVideoChapter]);

  const eventVideoSession = course?.videoLearning?.sessions.find((session) => session.moduleIndex === selectedModule);
  useEffect(() => {
    if (!eventVideoSession) return;
    const handlePlayerState = (event: MessageEvent) => {
      if (!event.origin.includes("youtube.com")) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onStateChange" && data.info === 0) {
          setVideoQuizVisible(true);
          toast.message("Vídeo concluído. Seu quiz rápido está pronto.");
        }
      } catch {
        // Ignore non-player messages posted by the embedded provider.
      }
    };
    window.addEventListener("message", handlePlayerState);
    return () => window.removeEventListener("message", handlePlayerState);
  }, [eventVideoSession, courseSlug, selectedModule]);

  if (!user) return null;
  if (!course) return <NotFound />;

  const accent = accentMap[course.accent];
  const Icon = iconMap[course.icon];
  const activeModule = course.modules[selectedModule];
  const activeLab = course.labsList[selectedLab];
  const activeVideoSession = course.videoLearning?.sessions.find((session) => session.moduleIndex === selectedModule);
  const activeVideoChapter = activeVideoSession?.chapters[selectedVideoChapter] ?? activeVideoSession?.chapters[0];
  const [chapterMinutes = "0", chapterSeconds = "0"] = activeVideoChapter?.time.split(":") ?? [];
  const videoStartSeconds = Number(chapterMinutes) * 60 + Number(chapterSeconds);
  const videoEmbedUrl = activeVideoSession && course.videoLearning ? `${course.videoLearning.embedUrl}&start=${videoStartSeconds}&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}` : "";
  const savedVideoProgress = progressQuery.data?.videoProgress.find((item) => item.moduleIndex === selectedModule);
  const savedVideoNote = progressQuery.data?.videoNotes.find((item) => item.moduleIndex === selectedModule && item.chapterIndex === selectedVideoChapter);
  const latestVideoQuizAttempt = progressQuery.data?.videoQuizAttempts.find((item) => item.moduleIndex === selectedModule);
  const assessmentCompleted = progressQuery.data?.assessment ? 1 : 0;
  const completedItems = completedModules.size + completedLabs.size + assessmentCompleted;
  const requiredItems = course.modules.length + course.labsList.length + 1;
  const completion = requiredItems > 0 ? Math.min(Math.round((completedItems / requiredItems) * 100), 100) : 0;
  const assessmentUnlocked = completedModules.size === course.modules.length && completedLabs.size === course.labsList.length;
  const assessmentPassed = progressQuery.data?.assessment?.passed ?? false;
  const readyForCertificate = assessmentUnlocked && assessmentPassed;
  const certificate = progressQuery.data?.certificate;
  const earnedBadgeCodes = new Set((progressQuery.data?.achievements ?? []).map((item) => item.badgeCode));

  const refreshProgress = async () => {
    await Promise.all([
      progressQuery.refetch(),
      utils.formations.summary.invalidate(),
    ]);
  };

  const handleToggleFavorite = async () => {
    try {
      const favorite = !progressQuery.data?.isFavorite;
      await setFavorite.mutateAsync({ courseSlug, favorite });
      await Promise.all([progressQuery.refetch(), utils.formations.summary.invalidate()]);
      toast.success(favorite ? "Formação salva nos seus favoritos." : "Formação removida dos seus favoritos.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar seus favoritos.");
    }
  };

  const handleVideoChapter = async (chapterIndex: number) => {
    if (!activeVideoSession) return;
    const previousChapter = selectedVideoChapter;
    setSelectedVideoChapter(chapterIndex);
    try {
      await saveVideoProgress.mutateAsync({ courseSlug, moduleIndex: selectedModule, chapterIndex });
      await Promise.all([refreshProgress(), utils.formations.summary.invalidate()]);
      toast.success("Ponto de retomada salvo.");
    } catch (error) {
      setSelectedVideoChapter(previousChapter);
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar o ponto de retomada.");
    }
  };

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    videoFrameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "setPlaybackRate", args: [rate] }), "*");
    toast.success(`Velocidade de reprodução: ${rate.toLocaleString("pt-BR")}x`);
  };

  const handleVideoFrameLoaded = () => {
    const playerWindow = videoFrameRef.current?.contentWindow;
    playerWindow?.postMessage(JSON.stringify({ event: "listening" }), "*");
    playerWindow?.postMessage(JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }), "*");
  };

  const handleToggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await videoFrameContainerRef.current?.requestFullscreen();
    } catch {
      toast.error("A tela cheia não está disponível neste navegador.");
    }
  };

  const handleSaveVideoNote = async () => {
    const content = videoNoteDraft.trim();
    if (!content) {
      toast.message("Escreva uma nota antes de salvar.");
      return;
    }
    try {
      await saveVideoNote.mutateAsync({ courseSlug, moduleIndex: selectedModule, chapterIndex: selectedVideoChapter, content });
      await refreshProgress();
      toast.success("Nota pessoal salva neste capítulo.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar sua nota.");
    }
  };

  const handleRemoveVideoNote = async () => {
    if (!savedVideoNote) {
      setVideoNoteDraft("");
      return;
    }
    try {
      await removeVideoNote.mutateAsync({ courseSlug, moduleIndex: selectedModule, chapterIndex: selectedVideoChapter });
      setVideoNoteDraft("");
      await refreshProgress();
      toast.success("Nota removida deste capítulo.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível remover sua nota.");
    }
  };

  const handleSubmitVideoQuiz = async () => {
    const totalQuestions = videoQuizQuery.data?.questions.length ?? 0;
    if (totalQuestions === 0) {
      toast.message("Este quiz estará disponível assim que a sessão carregar.");
      return;
    }
    if (videoQuizAnswers.length !== totalQuestions || videoQuizAnswers.some((answer) => answer === undefined)) {
      toast.message("Responda todas as perguntas rápidas antes de enviar.");
      return;
    }
    try {
      const result = await submitVideoQuiz.mutateAsync({ courseSlug, moduleIndex: selectedModule, answers: videoQuizAnswers });
      setVideoQuizResult(result);
      await refreshProgress();
      if (result.streak.bonusXp > 0) toast.success(`${result.streak.milestone?.label}: +${result.streak.bonusXp} XP por sequência perfeita.`);
      else toast.success(`Quiz da sessão corrigido: ${result.percentage}%.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível corrigir o quiz desta sessão.");
    }
  };

  const handleModuleQuestionAnswer = async (answer: number) => {
    if (moduleQuestionFeedback?.correct || submitModuleQuestion.isPending || moduleQuizResult) return;
    try {
      const result = await submitModuleQuestion.mutateAsync({ courseSlug, moduleIndex: selectedModule, questionIndex: moduleQuestionIndex, answer });
      setModuleQuestionFeedback(result);
      if (result.correct) {
        setModuleQuizAnswers((previous) => { const next = [...previous]; next[moduleQuestionIndex] = answer; return next; });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível corrigir esta questão.");
    }
  };

  const handleNextModuleQuestion = async () => {
    const totalQuestions = moduleQuizQuery.data?.questions.length ?? 0;
    if (!moduleQuestionFeedback?.correct) return;
    if (moduleQuestionIndex < totalQuestions - 1) {
      setModuleQuestionIndex((previous) => previous + 1);
      setModuleQuestionFeedback(null);
      return;
    }
    try {
      const result = await submitModuleQuiz.mutateAsync({ courseSlug, moduleIndex: selectedModule, answers: moduleQuizAnswers });
      setModuleQuizResult(result);
      await refreshProgress();
      if (result.streak.bonusXp > 0) toast.success(`${result.streak.milestone?.label}: +${result.streak.bonusXp} XP por sequência perfeita.`);
      else toast.success("Quiz concluído. Módulo liberado e progresso salvo.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível concluir o quiz de fixação.");
    }
  };

  const executeLab = async () => {
    try {
      const result = await runLab.mutateAsync({ courseSlug, labIndex: selectedLab, command: activeLab.command });
      setLabRun(result);
      if (result.success) toast.success("Missão executada no ambiente seguro. Agora registre a evidência.");
      else toast.error("O ambiente não reconheceu este comando. Revise a missão e tente novamente.");
    } catch {
      toast.error("Não foi possível executar a missão prática.");
    }
  };

  const completeLab = async () => {
    if (!labRun?.success || !labAnswer) {
      toast.message("Execute a missão e selecione a evidência correta antes de concluir o laboratório.");
      return;
    }
    try {
      await verifyLab.mutateAsync({ courseSlug, labIndex: selectedLab, runId: labRun.runId, answer: labAnswer });
      await refreshProgress();
      toast.success("Laboratório guiado concluído.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível validar a evidência do laboratório.");
    }
  };

  const handleIssueCertificate = async (displayName: string) => {
    try {
      await updateProfile.mutateAsync({ name: displayName });
      const result = await issueCertificate.mutateAsync({ courseSlug, displayName });
      await refreshProgress();
      setCertificateDialogOpen(false);
      toast.success(`Certificado nominal emitido: ${result.identifier}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível emitir o certificado.");
    }
  };

  const handleSubmitProject = async () => {
    if (projectSummary.trim().length < 40) { toast.message("Descreva em pelo menos 40 caracteres o que você entregou no projeto final."); return; }
    if (Object.values(projectRubric).some((score) => score < 1)) { toast.message("Preencha todos os critérios da rubrica antes de enviar."); return; }
    try {
      await completeProject.mutateAsync({ projectId: "pmsec-security-project", summary: projectSummary.trim(), rubric: projectRubric });
      if (projectFile) {
        if (projectFile.size > 4 * 1024 * 1024) { toast.error("O arquivo deve ter no máximo 4 MB."); return; }
        const allowed = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
        if (!allowed.includes(projectFile.type)) { toast.error("Envie PNG, JPG, WEBP ou PDF."); return; }
        const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(projectFile); });
        await attachProjectEvidence.mutateAsync({ courseSlug, labIndex: 4, title: `Projeto final PMSEC-01 — ${projectFile.name}`, description: "Evidência anexada ao projeto final autoral.", evidenceDataUrl: dataUrl });
      }
      await projectCompletionsQuery.refetch(); setProjectSummary(""); setProjectFile(null); setProjectRubric({ escopo: 0, risco: 0, controles: 0, governanca: 0, metricas: 0 });
      toast.success("Projeto final enviado e exportado para o portfólio.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível enviar o projeto final."); }
  };

  const handleSubmitAssessment = async () => {
    const totalQuestions = assessmentQuery.data?.questions.length ?? 0;
    if (assessmentAnswers.length !== totalQuestions || assessmentAnswers.some((answer) => answer === undefined)) {
      toast.message("Responda todas as questões antes de enviar a avaliação final.");
      return;
    }
    try {
      const result = await submitAssessment.mutateAsync({ courseSlug, answers: assessmentAnswers });
      setAssessmentResult({ percentage: result.percentage, passed: result.passed });
      await refreshProgress();
      if (result.passed) toast.success(`Avaliação aprovada com ${result.percentage}%. Badge desbloqueado.`);
      else toast.error(`Resultado: ${result.percentage}%. Revise o conteúdo e tente novamente.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a avaliação final.");
    }
  };

  return (
    <div className={`study-session formation-study reading-theme-transition min-h-screen space-canvas text-foreground ${getReadingPreferenceClasses(preferences)} ${preferences.focusMode ? "study-focus" : ""}`}>
      {!preferences.focusMode && <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />}
      <header className="study-session-header sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link>
          <Link href="/" className="font-orbitron text-xs font-bold tracking-[0.08em]">CYBERDIMENSION <span className="text-neon-cyan">ACADEMY</span></Link>
        </div>
      </header>

      <main className="container relative py-6 md:py-8">
        <section className="study-hero relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(0.12_0.04_260/0.96),oklch(0.08_0.025_270/0.92))] p-6 md:p-8">
          <div className={`absolute -right-12 -top-12 h-56 w-56 rounded-full ${accent.surface} blur-3xl`} />
          <div className="relative grid gap-7 lg:grid-cols-[1fr_18rem] lg:items-end">
            <div>
              <p className={`inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] ${accent.text}`}><Icon className="h-4 w-4" /> MISSÃO {course.code} EM ANDAMENTO</p>
              <h1 className="mt-3 font-orbitron text-2xl font-bold leading-tight md:text-4xl">{course.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">Conclua os módulos e execute os laboratórios guiados para liberar seu certificado nominal CyberDimension.</p>
            </div>
            <div className={`rounded-2xl border ${accent.border} bg-black/20 p-4`}>
              <div className="flex items-center justify-between text-xs font-bold"><span className="text-muted-foreground">PROGRESSO REAL</span><span className={accent.text}>{completion}%</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full bg-gradient-to-r ${accent.progress}`} style={{ width: `${completion}%` }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">{completedItems} de {requiredItems} marcos concluídos</p>
            </div>
          </div>
          <div className="mt-5 flex justify-end"><ReadingControls /></div>
        </section>

        <div className="formation-layout mt-6 grid gap-6 xl:grid-cols-[19rem_minmax(0,1fr)]">
          <aside className="formation-sidebar space-y-5 xl:sticky xl:top-24 xl:h-fit">
            <section className="module-card rounded-2xl p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><p className={`text-xs font-bold tracking-[0.15em] ${accent.text}`}>ROTA DE MÓDULOS</p><h2 className="mt-1 font-orbitron text-sm font-bold">Estudo guiado</h2></div><BookOpen className={`h-5 w-5 ${accent.text}`} /></div>
              <div className="mt-3 space-y-1">{course.modules.map((module, index) => {
                const complete = completedModules.has(index);
                const active = selectedModule === index;
                const unlocked = index === 0 || completedModules.has(index - 1);
                return <button key={module.title} onClick={() => setSelectedModule(index)} disabled={!unlocked} aria-disabled={!unlocked} className={`orbit-button flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm disabled:cursor-not-allowed disabled:opacity-45 ${active ? `${accent.surface} ${accent.text}` : "hover:bg-white/6"}`}>
                  {complete ? <CheckCircle2 className="h-4 w-4 shrink-0 text-neon-green" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}<span className="min-w-0 flex-1 truncate"><span className="mr-1 text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>{module.title}</span>{active && <ChevronRight className="h-4 w-4" />}
                </button>;
              })}</div>
            </section>

            <section className="module-card rounded-2xl p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-green">LABORATÓRIOS</p><h2 className="mt-1 font-orbitron text-sm font-bold">Prática segura</h2></div><FlaskConical className="h-5 w-5 text-neon-green" /></div>
              <div className="mt-3 space-y-1">{course.labsList.map((lab, index) => {
                const complete = completedLabs.has(index);
                const active = selectedLab === index;
                return <button key={lab.title} onClick={() => setSelectedLab(index)} className={`orbit-button flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${active ? "border border-neon-green/25 bg-neon-green/10 text-neon-green" : "hover:bg-white/6"}`}>
                  {complete ? <CheckCircle2 className="h-4 w-4 shrink-0 text-neon-green" /> : <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />}<span className="min-w-0 flex-1 truncate"><span className="mr-1 text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>{lab.title}</span>
                </button>;
              })}</div>
            </section>
          </aside>

          <section className="min-w-0 space-y-6">
            <article className="reading-panel study-module module-card rounded-2xl p-5 md:p-7">
              <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start"><div><p className={`text-xs font-bold tracking-[0.15em] ${accent.text}`}>MÓDULO {String(selectedModule + 1).padStart(2, "0")}</p><h2 ref={studyHeadingRef} tabIndex={-1} className="study-module-title mt-2 scroll-mt-24 outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60">{activeModule.title}</h2><p className="study-module-copy mt-3 max-w-2xl">{activeModule.description}</p></div><span className={`shrink-0 rounded-lg border ${accent.border} ${accent.surface} px-3 py-2 text-xs font-bold ${accent.text}`}>{activeModule.lessons} lições</span></div>
              <div className="mt-6 grid gap-3 md:grid-cols-3"><div className="study-surface-subtle rounded-xl border border-white/10 bg-black/15 p-4"><BookOpen className={`h-5 w-5 ${accent.text}`} /><p className="mt-3 text-sm font-bold">Aprenda</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Estude os conceitos em sequência e revise o essencial.</p></div><div className="study-surface-subtle rounded-xl border border-white/10 bg-black/15 p-4"><ClipboardCheck className={`h-5 w-5 ${accent.text}`} /><p className="mt-3 text-sm font-bold">Consolide</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Relacione o conteúdo com os cenários de prática do curso.</p></div><div className="study-surface-subtle rounded-xl border border-white/10 bg-black/15 p-4"><CirclePlay className={`h-5 w-5 ${accent.text}`} /><p className="mt-3 text-sm font-bold">Fixe</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Responda ao quiz curto para consolidar o conteúdo antes de avançar.</p></div></div>
              {pmsecMaterial && <section className="mt-6 rounded-2xl border border-blue-300/25 bg-blue-300/[0.05] p-4 md:p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="text-xs font-bold tracking-[0.15em] text-blue-200">MATERIAL AUTORAL · PMSEC-01</p><h3 className="mt-2 font-orbitron text-lg font-bold">Guia detalhado do módulo</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{pmsecMaterial.objective}</p></div><span className="shrink-0 rounded-lg border border-blue-300/25 bg-blue-300/10 px-3 py-2 text-xs font-bold text-blue-200">{pmsecMaterial.lessons.length} aulas</span></div><div className="mt-4 flex flex-wrap gap-2">{pmsecMaterial.keyTerms.map((term) => <span key={term} className="rounded-full border border-blue-300/20 bg-blue-300/10 px-2.5 py-1 text-xs font-bold text-blue-100">{term}</span>)}</div><div className="mt-5 grid gap-3 md:grid-cols-2">{pmsecMaterial.lessons.map((lesson, lessonIndex) => <article key={lesson.title} className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-xs font-bold tracking-[0.12em] text-blue-200">AULA {String(lessonIndex + 1).padStart(2, "0")}</p><h4 className="mt-2 text-sm font-bold">{lesson.title}</h4><p className="mt-2 text-sm leading-6 text-foreground/90">{lesson.concept}</p><p className="mt-3 text-xs leading-5 text-muted-foreground"><strong className="text-blue-100">Prática:</strong> {lesson.practice}</p><p className="mt-2 text-xs leading-5 text-muted-foreground"><strong className="text-blue-100">Checkpoint:</strong> {lesson.checkpoint}</p></article>)}</div></section>}
              {course.audioGuide && <section className="mt-6 rounded-2xl border border-neon-cyan/25 bg-neon-cyan/[0.05] p-4 md:p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-cyan"><Headphones className="h-4 w-4" /> AUDIOGUIA AUTORAL</p><h3 className="mt-2 font-orbitron text-lg font-bold">{course.audioGuide.label}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{course.audioGuide.description}</p></div><span className="shrink-0 rounded-lg border border-neon-cyan/25 bg-neon-cyan/10 px-3 py-2 text-xs font-bold text-neon-cyan">{course.audioGuide.duration}</span></div>
                <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3"><audio className="w-full" controls preload="metadata" src={course.audioGuide.sourceUrl}>Seu navegador não oferece suporte à reprodução de áudio.</audio><p className="mt-3 text-xs leading-5 text-muted-foreground"><span className="font-bold text-foreground">Produção:</span> {course.audioGuide.narration}. Este material é próprio da CyberDimension Academy e complementa as aulas, a prática e a avaliação do módulo.</p></div>
              </section>}
              {course.videoLearning && activeVideoSession && <section className="mt-6 overflow-hidden rounded-2xl border border-neon-purple/30 bg-[linear-gradient(135deg,oklch(0.12_0.055_295/0.26),oklch(0.08_0.025_260/0.82))] p-4 md:p-5">
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-start"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-purple"><CirclePlay className="h-4 w-4" /> MODO VÍDEO · MATERIAL COMPLEMENTAR</p><h3 className="mt-2 font-orbitron text-lg font-bold">{activeVideoSession.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{activeVideoSession.focus}</p></div><span className="shrink-0 rounded-lg border border-neon-purple/30 bg-neon-purple/10 px-3 py-2 text-xs font-bold text-neon-purple">{activeVideoSession.duration}</span></div>
                <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]"><div ref={videoFrameContainerRef} className="overflow-hidden rounded-xl border border-white/10 bg-black/30"><div className="aspect-video"><iframe ref={videoFrameRef} onLoad={handleVideoFrameLoaded} className="h-full w-full" src={videoEmbedUrl} title={`${course.videoLearning.label} — ${activeVideoSession.title}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/50 px-3 py-2.5"><div className="flex items-center gap-1" aria-label="Velocidade de reprodução">{[0.75, 1, 1.25, 1.5].map((rate) => <button key={rate} type="button" onClick={() => handlePlaybackRate(rate)} aria-pressed={playbackRate === rate} className={`orbit-button rounded-md px-2 py-1 text-xs font-bold ${playbackRate === rate ? "bg-neon-purple/20 text-neon-purple" : "text-muted-foreground hover:text-foreground"}`}>{rate.toLocaleString("pt-BR")}x</button>)}</div><button type="button" onClick={handleToggleFullscreen} className="orbit-button inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold text-neon-purple"><Expand className="h-3.5 w-3.5" /> Tela cheia</button></div></div><aside className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-xs font-bold tracking-[0.14em] text-neon-purple">ROTEIRO DE FOCO</p><ol className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground"><li className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neon-purple/15 text-xs font-bold text-neon-purple">1</span><span>Assista com uma pergunta em mente: qual controle reduz o risco apresentado?</span></li><li className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neon-purple/15 text-xs font-bold text-neon-purple">2</span><span>Registre uma ideia e conecte-a ao cenário deste módulo.</span></li><li className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neon-purple/15 text-xs font-bold text-neon-purple">3</span><span>Quando o vídeo terminar, o quiz aparecerá automaticamente abaixo.</span></li></ol><a href={course.videoLearning.sourceUrl} target="_blank" rel="noreferrer" className="orbit-button mt-5 inline-flex items-center gap-2 text-xs font-bold text-neon-purple">Abrir fonte no YouTube <ChevronRight className="h-4 w-4" /></a></aside></div>
                <p className="mt-4 text-xs leading-5 text-muted-foreground">{course.videoLearning.attribution}</p>
              </section>}
              <section className="mt-6 rounded-2xl border border-neon-cyan/25 bg-neon-cyan/[0.05] p-4 md:p-5" aria-labelledby="authorial-video-title"><div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-cyan"><CirclePlay className="h-4 w-4" /> VIDEOAULAS AUTORAIS</p><h3 id="authorial-video-title" className="mt-2 font-orbitron text-lg font-bold">Dez aulas para acompanhar esta formação</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Roteiros próprios da CyberDimension Academy, organizados em episódios curtos. A mídia final pode ser adicionada ao acervo sem alterar o conteúdo didático, o progresso ou os quizzes.</p></div><span className="shrink-0 rounded-lg border border-neon-cyan/25 bg-neon-cyan/10 px-3 py-2 text-xs font-bold text-neon-cyan">{authorialVideoLessons.length} aulas</span></div><div className="mt-4 grid gap-3 md:grid-cols-2">{authorialVideoLessons.map((lesson) => <article key={lesson.id} className="rounded-xl border border-white/10 bg-black/15 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-[0.13em] text-neon-cyan">AULA {String(lesson.lessonNumber).padStart(2, "0")} · {lesson.duration}</p><h4 className="mt-2 text-sm font-bold leading-5">{lesson.title}</h4></div><span className={`shrink-0 rounded-md border px-2 py-1 text-[0.6rem] font-bold ${lesson.status === "publicado" ? "border-neon-green/25 bg-neon-green/10 text-neon-green" : "border-amber-300/25 bg-amber-300/10 text-amber-200"}`}>{lesson.status === "publicado" ? "PUBLICADO" : "ROTEIRO"}</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{lesson.focus}</p>{lesson.mediaUrl ? <div className="mt-4 space-y-2"><video className="aspect-video w-full rounded-lg border border-neon-green/25 bg-black/40 object-contain" controls preload="metadata" playsInline aria-label={`Videoaula ${lesson.title}`}><source src={lesson.mediaUrl} type="video/mp4" />Seu navegador não conseguiu carregar este vídeo.</video><a href={lesson.mediaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-neon-cyan hover:underline">Abrir mídia em nova aba <ChevronRight className="h-3.5 w-3.5" /></a></div> : null}<details className="mt-3 rounded-lg border border-white/8 bg-black/15 p-3"><summary className="cursor-pointer text-xs font-bold text-foreground">Ver capítulos e transcrição</summary><div className="mt-3 space-y-2">{lesson.chapters.map((chapter) => <div key={`${lesson.id}-${chapter.time}`} className="text-xs leading-5"><span className="font-bold text-neon-cyan">{chapter.time}</span><span className="ml-2 font-bold">{chapter.title}</span><p className="mt-1 text-muted-foreground">{chapter.summary}</p></div>)}</div></details></article>)}</div></section>
              <div className="mt-6 grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
                <LearningJourney hasVideo={Boolean(course.videoLearning)} compact />
                <ContentTransparency course={course} compact />
              </div>
              {course.videoLearning && activeVideoSession && <section className="mt-4 grid gap-4 lg:grid-cols-[0.86fr_1.14fr]">
                <div className="rounded-2xl border border-neon-purple/25 bg-neon-purple/[0.05] p-4 md:p-5">
                  <div className="flex items-center justify-between gap-3"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-neon-purple"><ListVideo className="h-4 w-4" /> CAPÍTULOS E RETOMADA</p><button type="button" onClick={handleToggleFavorite} disabled={setFavorite.isPending} aria-label={progressQuery.data?.isFavorite ? "Remover formação dos favoritos" : "Salvar formação nos favoritos"} aria-pressed={Boolean(progressQuery.data?.isFavorite)} className={`orbit-button inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-bold disabled:opacity-60 ${progressQuery.data?.isFavorite ? "border-neon-purple/45 bg-neon-purple/15 text-neon-purple" : "border-white/15 bg-black/15 text-muted-foreground hover:text-neon-purple"}`}><Heart className={`h-4 w-4 ${progressQuery.data?.isFavorite ? "fill-current" : ""}`} /> {progressQuery.data?.isFavorite ? "Salvo" : "Favoritar"}</button></div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">Escolha um marcador para salvar onde você parou. A retomada é vinculada à sua conta.</p>
                  <div className="mt-4 space-y-2">{activeVideoSession.chapters.map((chapter, chapterIndex) => {
                    const isSaved = Boolean(savedVideoProgress && savedVideoProgress.chapterIndex === chapterIndex);
                    const isSelected = selectedVideoChapter === chapterIndex;
                    return <button key={`${chapter.time}-${chapter.title}`} type="button" onClick={() => handleVideoChapter(chapterIndex)} disabled={saveVideoProgress.isPending} aria-pressed={isSaved} aria-label={`${isSaved ? "Retomada salva" : "Salvar retomada"} em ${chapter.time} — ${chapter.title}`} className={`orbit-button w-full rounded-xl border p-3 text-left disabled:opacity-60 ${isSaved ? "border-neon-purple/50 bg-neon-purple/15 ring-1 ring-neon-purple/30" : `border-white/10 bg-black/15 ${isSelected ? "border-neon-purple/25 hover:border-neon-purple/40" : "hover:border-neon-purple/25"}`}`}><span className={`text-xs font-bold ${isSaved ? "text-neon-green" : "text-neon-purple"}`}>{chapter.time}</span>{isSaved && <CheckCircle2 className="ml-1 inline h-3.5 w-3.5 text-neon-green" aria-hidden="true" />}<span className="ml-2 text-sm font-bold text-foreground">{chapter.title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{chapter.summary}</span></button>;
                  })}</div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"><span className="text-xs text-muted-foreground">{savedVideoProgress ? `Retomada salva no capítulo ${String(savedVideoProgress.chapterIndex + 1).padStart(2, "0")}.` : "Nenhum ponto salvo neste módulo."}</span>{savedVideoProgress ? <a href={videoEmbedUrl} target="_blank" rel="noreferrer" className="orbit-button inline-flex items-center gap-1 text-xs font-bold text-neon-purple">Abrir em {activeVideoChapter?.time} <ChevronRight className="h-3.5 w-3.5" /></a> : <button type="button" disabled aria-label="Abra o vídeo após salvar um ponto de retomada" className="orbit-button inline-flex cursor-not-allowed items-center gap-1 text-xs font-bold text-muted-foreground opacity-50" aria-disabled>Salvar retomada para abrir do ponto</button>}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/15 p-4 md:p-5"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-neon-purple"><Captions className="h-4 w-4" /> TRANSCRIÇÃO DE APOIO</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Material textual autoral para revisão, acessibilidade e tomada de notas. Não substitui a fonte audiovisual externa.</p><div className="mt-4 max-h-48 space-y-3 overflow-y-auto pr-1">{activeVideoSession.transcript.map((entry) => <div key={`${entry.time}-${entry.text}`} className="border-l-2 border-neon-purple/25 pl-3"><p className="text-xs font-bold text-neon-purple">{entry.time}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.text}</p></div>)}</div><div className="mt-5 border-t border-white/10 pt-4"><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-neon-purple"><NotebookPen className="h-4 w-4" /> MINHA NOTA · {activeVideoChapter?.time}</p><label className="sr-only" htmlFor="video-note">Nota pessoal do capítulo</label><textarea id="video-note" value={videoNoteDraft} onChange={(event) => setVideoNoteDraft(event.target.value)} maxLength={5000} placeholder="Registre um conceito, dúvida ou conexão com o laboratório…" className="mt-3 min-h-28 w-full resize-y rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground focus:border-neon-purple/50" /><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{savedVideoNote ? "Nota privada salva na sua conta." : "A nota fica visível somente para você."}</span><div className="flex gap-2"><button type="button" onClick={handleRemoveVideoNote} disabled={removeVideoNote.isPending || !savedVideoNote} className="orbit-button inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-2 text-xs font-bold text-muted-foreground disabled:opacity-40"><Trash2 className="h-3.5 w-3.5" /> Remover</button><button type="button" onClick={handleSaveVideoNote} disabled={saveVideoNote.isPending || !videoNoteDraft.trim()} className="orbit-button inline-flex items-center gap-1.5 rounded-lg border border-neon-purple/35 bg-neon-purple/10 px-2.5 py-2 text-xs font-bold text-neon-purple disabled:opacity-40"><Save className="h-3.5 w-3.5" /> {saveVideoNote.isPending ? "Salvando…" : "Salvar nota"}</button></div></div></div></div>
              </section>}
              {course.videoLearning && activeVideoSession && (videoQuizVisible || videoQuizResult || latestVideoQuizAttempt) && <section className="mt-4 rounded-2xl border border-neon-purple/35 bg-neon-purple/[0.06] p-4 md:p-5">
                <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-purple"><ClipboardCheck className="h-4 w-4" /> QUIZ RÁPIDO · SESSÃO CONCLUÍDA</p><h3 className="mt-1 font-orbitron text-base font-bold">Fixe o que acabou de assistir</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Duas questões de múltipla escolha com correção e explicação imediatas. A tentativa fica registrada no seu progresso.</p></div>{latestVideoQuizAttempt && !videoQuizResult && <span className="shrink-0 rounded-lg border border-neon-green/25 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green">Última tentativa: {latestVideoQuizAttempt.score}/{latestVideoQuizAttempt.totalQuestions}</span>}</div>
                {videoQuizQuery.isLoading ? <p className="py-6 text-sm text-muted-foreground">Preparando o quiz da sessão…</p> : <div className="mt-5 space-y-5">{videoQuizQuery.data?.questions.map((question, questionIndex) => <div key={question.id} className="study-surface-subtle rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-sm font-bold leading-6"><span className="mr-2 text-neon-purple">{String(questionIndex + 1).padStart(2, "0")}</span>{question.prompt}</p><div className="mt-3 grid gap-2">{question.options.map((option, optionIndex) => <button key={option} type="button" onClick={() => setVideoQuizAnswers((previous) => { const next = [...previous]; next[questionIndex] = optionIndex; return next; })} disabled={Boolean(videoQuizResult)} className={`orbit-button rounded-lg border px-3 py-2.5 text-left text-sm disabled:opacity-70 ${videoQuizAnswers[questionIndex] === optionIndex ? "border-neon-purple/40 bg-neon-purple/10 text-neon-purple" : "study-surface-subtle border-white/10 bg-black/15 text-muted-foreground hover:border-white/25"}`}>{String.fromCharCode(65 + optionIndex)}. {option}</button>)}</div>{videoQuizResult?.review[questionIndex] && <p className={`mt-3 text-xs leading-5 ${videoQuizResult.review[questionIndex].correct ? "text-neon-green" : "text-amber-200"}`}><strong>{videoQuizResult.review[questionIndex].correct ? "Correto. " : "Revise este ponto. "}</strong>{videoQuizResult.review[questionIndex].explanation}</p>}</div>)}
                  {videoQuizResult && <><p className={`rounded-lg border px-3 py-3 text-sm font-bold ${videoQuizResult.percentage >= 70 ? "border-neon-green/25 bg-neon-green/10 text-neon-green" : "border-amber-300/25 bg-amber-300/10 text-amber-100"}`}>Resultado da sessão: {videoQuizResult.score}/{videoQuizResult.totalQuestions} ({videoQuizResult.percentage}%). Revise as explicações e siga para o quiz do módulo.</p><QuizStreakNotice streak={videoQuizResult.streak} /></>}
                  <button type="button" onClick={handleSubmitVideoQuiz} disabled={submitVideoQuiz.isPending || Boolean(videoQuizResult) || (videoQuizQuery.data?.questions.length ?? 0) === 0} className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-purple px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60"><ClipboardCheck className="h-4 w-4" /> {submitVideoQuiz.isPending ? "Corrigindo…" : videoQuizResult ? "Quiz da sessão concluído" : "Enviar quiz rápido"}</button>
                </div>}
              </section>}
              {!completedModules.has(selectedModule) && <section className={`study-surface-soft mt-6 rounded-2xl border ${accent.border} bg-black/20 p-4 md:p-5`}>
                <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start"><div><p className={`text-xs font-bold tracking-[0.15em] ${accent.text}`}>QUIZ DE FIXAÇÃO</p><h3 className="mt-1 font-orbitron text-base font-bold">Cheque o essencial antes de avançar</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Duas perguntas rápidas, com explicação imediata após o envio. A tentativa registra a conclusão do módulo.</p></div><ClipboardCheck className={`h-6 w-6 shrink-0 ${accent.text}`} /></div>
                {moduleQuizQuery.isLoading ? <p className="py-6 text-sm text-muted-foreground">Preparando o quiz de fixação…</p> : <div className="mt-5 space-y-5">{(() => {
                    const question = moduleQuizQuery.data?.questions[moduleQuestionIndex];
                    if (!question) return <p className="py-6 text-sm text-muted-foreground">Nenhuma questão disponível para este módulo.</p>;
                    return <div className="study-surface-subtle rounded-xl border border-white/10 bg-black/15 p-4 md:p-5">
                      <div className="flex items-center justify-between gap-3"><p className={`text-xs font-bold tracking-[0.14em] ${accent.text}`}>QUESTÃO {String(moduleQuestionIndex + 1).padStart(2, "0")} DE {moduleQuizQuery.data?.questions.length ?? 0}</p><span className="text-xs text-muted-foreground">Avance somente após acertar</span></div>
                      <p className="mt-3 text-base font-bold leading-7">{question.prompt}</p>
                      <div className="mt-4 grid gap-2">{question.options.map((option, optionIndex) => <button key={option} type="button" onClick={() => handleModuleQuestionAnswer(optionIndex)} disabled={Boolean(moduleQuestionFeedback?.correct) || submitModuleQuestion.isPending} className={`orbit-button rounded-lg border px-3 py-2.5 text-left text-sm disabled:cursor-not-allowed disabled:opacity-70 ${moduleQuizAnswers[moduleQuestionIndex] === optionIndex ? `${accent.border} ${accent.surface} ${accent.text}` : "study-surface-subtle border-white/10 bg-black/15 text-muted-foreground hover:border-white/25"}`}>{String.fromCharCode(65 + optionIndex)}. {option}</button>)}</div>
                      {submitModuleQuestion.isPending && <p className="mt-3 text-xs text-muted-foreground">Corrigindo sua resposta…</p>}
                      {moduleQuestionFeedback && <div className={`mt-4 rounded-lg border px-3 py-3 text-sm leading-6 ${moduleQuestionFeedback.correct ? "border-neon-green/25 bg-neon-green/10 text-neon-green" : "border-amber-300/25 bg-amber-300/10 text-amber-100"}`}><strong>{moduleQuestionFeedback.correct ? "Resposta correta. " : "Ainda não. Revise e tente novamente. "}</strong>{moduleQuestionFeedback.explanation}</div>}
                      {moduleQuestionFeedback?.correct && <button type="button" onClick={handleNextModuleQuestion} disabled={submitModuleQuiz.isPending} className={`orbit-button mt-4 inline-flex items-center gap-2 rounded-xl ${accent.button} px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60`}><ChevronRight className="h-4 w-4" /> {submitModuleQuiz.isPending ? "Salvando…" : moduleQuestionIndex === (moduleQuizQuery.data?.questions.length ?? 1) - 1 ? "Concluir módulo" : "Próxima questão"}</button>}
                    </div>;
                  })()}
                  {moduleQuizResult && <><p className="rounded-lg border border-neon-green/25 bg-neon-green/10 px-3 py-3 text-sm font-bold text-neon-green">Parabéns! Você acertou todas as questões: {moduleQuizResult.score}/{moduleQuizResult.totalQuestions} ({moduleQuizResult.percentage}%). Módulo concluído e salvo.</p><QuizStreakNotice streak={moduleQuizResult.streak} /></>}
                </div>}
              </section>}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5"><span className="text-sm text-muted-foreground">Seu progresso fica registrado na sua conta.</span>{completedModules.has(selectedModule) ? <span className="inline-flex items-center gap-2 text-sm font-bold text-neon-green"><CheckCircle2 className="h-4 w-4" /> Quiz e módulo concluídos</span> : <span className={`inline-flex items-center gap-2 text-sm font-bold ${accent.text}`}><Circle className="h-4 w-4" /> Quiz pendente</span>}</div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-neon-green/25 bg-[linear-gradient(135deg,oklch(0.1_0.05_165/0.28),oklch(0.08_0.025_260/0.94))] p-5 md:p-7">
              <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-green">LAB {String(selectedLab + 1).padStart(2, "0")} · AMBIENTE GUIADO</p><h2 className="mt-2 font-orbitron text-xl font-bold md:text-2xl">{activeLab.title}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{activeLab.description}</p></div><span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-neon-green/25 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green"><Shield className="h-4 w-4" /> Simulação segura</span></div>
              <div className="mt-6 grid gap-5 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-xs font-bold tracking-[0.14em] text-neon-green">OBJETIVO</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{activeLab.objective}</p><p className="mt-4 rounded-lg border border-neon-green/20 bg-neon-green/[0.07] p-3 text-xs leading-5 text-muted-foreground"><span className="font-bold text-neon-green">COMO FUNCIONA · </span>Nesta missão você vai reproduzir a situação descrita acima em um terminal de simulação segura. Ao clicar em <span className="font-bold text-neon-green">"Executar missão"</span>, o comando indicado é validado pelo ambiente e retorna o resultado da simulação. Depois, selecione a alternativa correta na validação de evidência e clique em <span className="font-bold text-neon-green">"Validar e concluir"</span> para registrar o laboratório e ganhar XP.</p><ol className="mt-5 space-y-3 text-sm"><li className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neon-green/15 text-xs font-bold text-neon-green">1</span><span>Leia o cenário e identifique o resultado esperado.</span></li><li className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neon-green/15 text-xs font-bold text-neon-green">2</span><span>Execute o comando permitido no ambiente seguro.</span></li><li className="flex gap-3"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neon-green/15 text-xs font-bold text-neon-green">3</span><span>Interprete o retorno e registre a evidência da missão.</span></li></ol></div>
                <div className="overflow-hidden rounded-xl border border-neon-green/25 bg-[oklch(0.055_0.02_260)]"><div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3"><Code2 className="h-4 w-4 text-neon-green" /><span className="font-mono text-xs text-muted-foreground">cyberdimension-lab:~$</span></div><div className="min-h-44 p-4 font-mono text-xs leading-6 text-neon-green/90"><p className="text-muted-foreground"># Missão: {activeLab.title}</p><p className="text-muted-foreground"># O que você vai simular: {activeLab.description}</p><p className="mt-2 text-foreground">$ {activeLab.command}</p>{labRun ? <pre className={`mt-3 whitespace-pre-wrap ${labRun.success ? "text-neon-green" : "text-red-300"}`}>{labRun.output}</pre> : <p className="mt-3 text-muted-foreground">Aguardando execução no ambiente seguro. O terminal acima mostra o comando que será validado pelo ambiente simulado.</p>}{completedLabs.has(selectedLab) && !labRun && <div className="mt-3 rounded-lg border border-neon-green/25 bg-neon-green/10 p-3 text-xs font-bold text-neon-green"><CheckCircle2 className="mr-2 inline h-3.5 w-3.5" />Laboratório já concluído — sua evidência foi registrada.</div>}</div><div className="border-t border-white/10 p-3">{completedLabs.has(selectedLab) ? <span className="inline-flex items-center gap-2 text-xs font-bold text-neon-green"><CheckCircle2 className="h-3.5 w-3.5" />Concluído</span> : <button onClick={executeLab} disabled={runLab.isPending || labRun?.success} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-neon-green/30 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green disabled:opacity-60"><Play className="h-3.5 w-3.5" /> {runLab.isPending ? "Executando..." : labRun?.success ? "Missão executada" : "Executar missão"}</button>}</div></div>
              </div>
              {!completedLabs.has(selectedLab) && labRun?.success && <div className="mt-5 rounded-xl border border-neon-green/20 bg-neon-green/[0.06] p-4"><p className="text-xs font-bold tracking-[0.14em] text-neon-green">VALIDAÇÃO DA EVIDÊNCIA</p><p className="mt-2 text-sm text-muted-foreground">O terminal acima já mostrou o resultado da simulação e o próximo passo. Selecione a <span className="font-bold text-neon-green">ação correta</span> para registrar a missão — boas práticas de segurança sempre incluem registrar a evidência da execução.</p><button type="button" onClick={() => setLabHintVisible((visible) => !visible)} aria-expanded={labHintVisible} aria-controls="lab-hint-card" className="orbit-button mt-3 inline-flex items-center gap-2 rounded-lg border border-neon-green/30 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green"><Lightbulb className="h-3.5 w-3.5" /> Dica</button>{labHintVisible && <div id="lab-hint-card" className="mt-3 rounded-lg border border-neon-green/25 bg-neon-green/[0.08] p-3.5 text-xs leading-5 text-muted-foreground"><p className="font-bold text-neon-green">COMO ESCOLHER A EVIDÊNCIA CORRETA</p><p className="mt-2">Lembre-se: em segurança, todo teste em laboratório é registrado, nunca aplicado em produção. A alternativa correta é aquela que <span className="font-bold text-neon-green">documenta o que o terminal retornou</span> — anotar o comando executado, o retorno da simulação e a conclusão da missão. Alternativas que mexem em infraestrutura real ou que ignoram o retorno deixam a missão sem registro e não contam como evidência válida.</p></div>}<div className="mt-3 grid gap-2 sm:grid-cols-3">{[{ value: "registrar-evidencia", label: "Registrar a evidência e documentar a execução." }, { value: "alterar-infraestrutura", label: "Alterar uma infraestrutura real para repetir o teste." }, { value: "ignorar-retorno", label: "Ignorar o retorno e marcar a prática sem evidência." }].map((option) => <button key={option.value} onClick={() => setLabAnswer(option.value)} className={`orbit-button rounded-lg border px-3 py-3 text-left text-xs leading-5 ${labAnswer === option.value ? "border-neon-green/60 bg-neon-green/15 text-neon-green" : "border-white/10 bg-black/15 text-muted-foreground hover:border-neon-green/30"}`}>{option.label}</button>)}</div></div>}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">{completedLabs.has(selectedLab) ? <span className="inline-flex items-center gap-2 text-sm font-bold text-neon-green"><CheckCircle2 className="h-4 w-4" /> Laboratório concluído — evidência registrada</span> : <span className="text-sm text-muted-foreground">Conclua a missão e valide a evidência para registrar o laboratório.</span>} {!completedLabs.has(selectedLab) && <button onClick={completeLab} disabled={verifyLab.isPending || !labRun?.success || !labAnswer} className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-green px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-50"><FlaskConical className="h-4 w-4" /> {verifyLab.isPending ? "Validando..." : "Validar e concluir"}</button>}</div>
            </article>

            <article className="module-card rounded-2xl p-5 md:p-7">
              <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-purple">CONQUISTAS DA MISSÃO</p><h2 className="mt-2 font-orbitron text-xl font-bold">Badges desbloqueáveis</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Cada marco salvo no seu progresso libera uma insígnia visual da sua formação.</p></div><Sparkles className="h-9 w-9 text-neon-purple" /></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{badgeCatalog.map((badge) => {
                const earned = earnedBadgeCodes.has(badge.code);
                const colors = badge.tone === "green" ? "border-neon-green/30 bg-neon-green/10 text-neon-green" : badge.tone === "purple" ? "border-neon-purple/30 bg-neon-purple/10 text-neon-purple" : "border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan";
                return <div key={badge.code} className={`rounded-xl border p-3 ${earned ? colors : "border-white/8 bg-black/15 text-muted-foreground opacity-65"}`}><div className="flex items-center justify-between"><Award className="h-5 w-5" /><span className="text-[10px] font-bold tracking-[0.12em]">{earned ? "CONQUISTADO" : "BLOQUEADO"}</span></div><p className="mt-3 text-sm font-bold text-foreground">{badge.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{badge.description}</p></div>;
              })}</div>
            </article>

            <article className="overflow-hidden rounded-2xl border border-neon-purple/30 bg-[linear-gradient(135deg,oklch(0.12_0.07_295/0.36),oklch(0.08_0.025_260/0.95))] p-5 md:p-7">
              <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-purple">AVALIAÇÃO FINAL</p><h2 className="mt-2 font-orbitron text-xl font-bold">Teste seu conhecimento</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">A aprovação com pelo menos {assessmentQuery.data?.passingScore ?? 70}% é necessária para liberar o certificado nominal.</p></div><ClipboardCheck className="h-9 w-9 text-neon-purple" /></div>
              {!assessmentUnlocked ? <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground">Conclua os módulos e laboratórios guiados para liberar esta etapa final.</div> : assessmentPassed ? <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neon-green/25 bg-neon-green/10 p-4"><span className="inline-flex items-center gap-2 text-sm font-bold text-neon-green"><CheckCircle2 className="h-4 w-4" /> Avaliação aprovada. Você desbloqueou o badge Mestre da Missão.</span><span className="text-xs text-muted-foreground">Melhor resultado: {progressQuery.data?.assessment?.score}%</span></div> : <div className="mt-5 space-y-5">{assessmentQuery.data?.questions.map((question, questionIndex) => <div key={question.id} className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-sm font-bold leading-6"><span className="mr-2 text-neon-purple">{String(questionIndex + 1).padStart(2, "0")}</span>{question.prompt}</p><div className="mt-3 grid gap-2">{question.options.map((option, optionIndex) => <button key={option} onClick={() => setAssessmentAnswers((previous) => { const next = [...previous]; next[questionIndex] = optionIndex; return next; })} className={`orbit-button rounded-lg border px-3 py-2.5 text-left text-sm ${assessmentAnswers[questionIndex] === optionIndex ? "border-neon-purple/60 bg-neon-purple/15 text-neon-purple" : "border-white/10 bg-black/15 text-muted-foreground hover:border-neon-purple/30"}`}>{String.fromCharCode(65 + optionIndex)}. {option}</button>)}</div></div>)}
                {assessmentResult && <p className={`text-sm font-bold ${assessmentResult.passed ? "text-neon-green" : "text-red-300"}`}>{assessmentResult.passed ? "Aprovado" : "Ainda não aprovado"}: {assessmentResult.percentage}%</p>}
                <button onClick={handleSubmitAssessment} disabled={submitAssessment.isPending} className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-purple px-4 py-3 text-sm font-bold text-white disabled:opacity-60"><ClipboardCheck className="h-4 w-4" /> {submitAssessment.isPending ? "Corrigindo..." : "Enviar avaliação"}</button>
              </div>}
            </article>

            {courseSlug === aiAcademyCourse.slug && <>
              <article className="overflow-hidden rounded-2xl border border-neon-cyan/25 bg-neon-cyan/[0.035] p-5 md:p-7">
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start"><div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-neon-cyan"><Sparkles className="h-4 w-4" /> PROMPT LAB · OFICINA TRANSVERSAL</p><h2 className="mt-2 font-orbitron text-xl font-bold">Experimente, compare e refine.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Use modelos de prompt autorais como ponto de partida. Não inclua secrets, dados pessoais ou informações confidenciais nas entradas.</p></div><Code2 className="h-9 w-9 text-neon-cyan" /></div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">{aiAcademyPromptLab.map((item) => <div key={item.title} className="rounded-xl border border-white/10 bg-black/15 p-4"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold">{item.title}</h3><span className="rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-neon-cyan">{item.category}</span></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.prompt}</p><button type="button" onClick={() => { void navigator.clipboard?.writeText(item.prompt); toast.success("Prompt copiado para a área de transferência."); }} className="orbit-button mt-4 inline-flex items-center gap-2 rounded-lg border border-neon-cyan/25 bg-neon-cyan/10 px-3 py-2 text-xs font-bold text-neon-cyan"><Save className="h-3.5 w-3.5" /> Copiar prompt</button></div>)}</div>
              </article>
              <article className="mt-5 overflow-hidden rounded-2xl border border-neon-purple/25 bg-neon-purple/[0.035] p-5 md:p-7">
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-purple">PROJETOS FINAIS · PORTFÓLIO</p><h2 className="mt-2 font-orbitron text-xl font-bold">Construa evidências aplicáveis.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Escolha um projeto, produza apenas com dados sintéticos e registre a entrega no seu portfólio CyberDimension.</p></div><NotebookPen className="h-9 w-9 text-neon-purple" /></div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">{aiAcademyProjects.map((project) => <div key={project.title} className="rounded-xl border border-white/10 bg-black/15 p-4"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold">{project.title}</h3><span className="text-xs font-bold text-neon-purple">{project.level}</span></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{project.deliverable}</p><Link href="/portfolio" className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-neon-cyan">Abrir portfólio <ChevronRight className="h-3.5 w-3.5" /></Link></div>)}</div>
              </article>
              <article className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-lime-300/25 bg-lime-300/[0.04] p-5 sm:flex-row sm:items-center md:p-6"><div><p className="text-xs font-bold tracking-[0.15em] text-lime-300">CONEXÃO DE ESPECIALIZAÇÃO</p><h2 className="mt-2 font-orbitron text-lg font-bold">Aprofunde em AI Security</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Depois dos fundamentos, explore a academia especializada em riscos, red teaming autorizado e governança de IA.</p></div><Link href="/academias/ai-security" className="orbit-button inline-flex shrink-0 items-center gap-2 rounded-xl border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-sm font-bold text-lime-200">Abrir AI Security <ChevronRight className="h-4 w-4" /></Link></article>
            </>}
            {courseSlug === "gestao-projetos-seguranca-cibernetica" && <article className="overflow-hidden rounded-2xl border border-blue-300/25 bg-blue-300/[0.035] p-5 md:p-7"><p className="text-xs font-bold tracking-[0.15em] text-blue-200">CHECKLIST DE QUALIDADE · PROJETO FINAL</p><h2 className="mt-2 font-orbitron text-lg font-bold">Autoavaliação antes de enviar</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Use a escala de 1 a 4 para conferir se sua entrega cobre os critérios essenciais. Esta rubrica orienta o trabalho e não substitui uma revisão administrativa.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{[{ key: "escopo", label: "Escopo e entregáveis" }, { key: "risco", label: "Riscos e priorização" }, { key: "controles", label: "Controles de segurança" }, { key: "governanca", label: "Governança e comunicação" }, { key: "metricas", label: "Métricas e melhoria" }].map((criterion) => <label key={criterion.key} className="rounded-xl border border-white/10 bg-black/15 p-3 text-sm"><span className="font-bold">{criterion.label}</span><select value={projectRubric[criterion.key]} onChange={(event) => setProjectRubric((previous) => ({ ...previous, [criterion.key]: Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-foreground"><option value={0}>Selecionar nota</option><option value={1}>1 — precisa revisar</option><option value={2}>2 — parcialmente atendido</option><option value={3}>3 — bem atendido</option><option value={4}>4 — evidência consistente</option></select></label>)}</div><label className="mt-4 block text-sm font-bold" htmlFor="pmsec-project-file">Anexar evidência opcional <span className="font-normal text-muted-foreground">(PNG, JPG, WEBP ou PDF · até 4 MB)</span></label><input id="pmsec-project-file" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => setProjectFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-white/10 bg-black/15 p-3 text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-blue-300 file:px-3 file:py-2 file:font-bold file:text-[oklch(0.1_0.02_260)]" />{projectFile && <p className="mt-2 text-xs text-blue-200">Arquivo selecionado: {projectFile.name}</p>}</article>}
            {courseSlug === "gestao-projetos-seguranca-cibernetica" && <article className="overflow-hidden rounded-2xl border border-blue-300/30 bg-blue-300/[0.05] p-6 md:p-7"><div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold tracking-[0.15em] text-blue-200">PROJETO FINAL · PORTFÓLIO</p><h2 className="mt-2 font-orbitron text-xl font-bold">Plano de Transformação de Segurança</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Registre um resumo do projeto final da PMSEC-01 e exporte a entrega como um item do seu portfólio CyberDimension. Use apenas cenários fictícios e não inclua segredos, dados pessoais ou informações de organizações reais.</p></div><FileUp className="h-9 w-9 text-blue-200" /></div>{projectCompletionsQuery.data?.some((item) => item.projectId === "pmsec-security-project") ? <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neon-green/25 bg-neon-green/10 p-4"><span className="inline-flex items-center gap-2 text-sm font-bold text-neon-green"><CheckCircle2 className="h-4 w-4" /> Projeto exportado para o portfólio.</span><Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-bold text-neon-cyan">Ver portfólio <ChevronRight className="h-4 w-4" /></Link></div> : <div className="mt-5 space-y-4"><label htmlFor="pmsec-project-summary" className="text-sm font-bold">Resumo da entrega</label><textarea id="pmsec-project-summary" value={projectSummary} onChange={(event) => setProjectSummary(event.target.value)} maxLength={3000} placeholder="Descreva o cenário, decisões, entregáveis, riscos e métricas que você definiu…" className="min-h-36 w-full resize-y rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground focus:border-blue-200/50" /><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{projectSummary.length}/3000 caracteres · o registro fica privado até você compartilhar o portfólio.</span><button type="button" onClick={handleSubmitProject} disabled={completeProject.isPending || projectSummary.trim().length < 40} className="orbit-button inline-flex items-center gap-2 rounded-xl bg-blue-300 px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:cursor-not-allowed disabled:opacity-50"><FileUp className="h-4 w-4" /> {completeProject.isPending ? "Exportando…" : "Exportar para o portfólio"}</button></div></div>}</article>}

            <article className="overflow-hidden rounded-2xl border border-neon-green/30 bg-gradient-to-r from-neon-green/12 via-[oklch(0.1_0.03_260/0.92)] to-neon-cyan/10 p-6 md:p-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-green">CERTIFICAÇÃO NOMINAL</p><h2 className="mt-2 font-orbitron text-xl font-bold">Sua conquista, registrada no seu nome.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">O certificado é liberado após todos os módulos, laboratórios guiados e aprovação na avaliação final. Ele inclui nome do aluno, data de emissão e identificador público verificável.</p></div><Award className="h-11 w-11 shrink-0 text-neon-green" /></div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">{certificate ? <><span className="text-sm text-neon-green">Certificado emitido com sucesso.</span><div className="flex flex-wrap items-center gap-2"><Link href={`/certificate/course/${certificate.id}`} className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-green/35 bg-neon-green/10 px-4 py-3 text-sm font-bold text-neon-green"><Trophy className="h-4 w-4" /> Ver certificado</Link><button type="button" onClick={() => { openLinkedInCertificateShare(certificate.identifier); toast.success("A janela do LinkedIn foi aberta. Conclua a publicação na aba que abriu."); }} className="inline-flex items-center gap-2 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-3 text-sm font-bold text-neon-cyan"><Linkedin className="h-4 w-4" /> Publicar no LinkedIn</button></div></> : readyForCertificate ? <><span className="text-sm text-neon-green">Todos os requisitos foram concluídos.</span><button type="button" onClick={() => setCertificateDialogOpen(true)} disabled={issueCertificate.isPending || updateProfile.isPending} className="orbit-button inline-flex items-center gap-2 rounded-xl bg-neon-green px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-60"><Award className="h-4 w-4" /> Emitir certificado</button></> : <><span className="text-sm text-muted-foreground">Conclua módulos, laboratórios e a avaliação final para liberar a certificação.</span><span className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground"><Circle className="h-4 w-4" /> Bloqueado até a conclusão</span></>}</div>
            </article>
          </section>
        </div>
        </main>
        <CertificateDetailsDialog open={certificateDialogOpen} defaultName={user?.name || user?.email || ""} courseTitle={course?.title || "Formação CyberDimension"} submitting={issueCertificate.isPending || updateProfile.isPending} onClose={() => setCertificateDialogOpen(false)} onConfirm={(displayName) => void handleIssueCertificate(displayName)} />
    </div>
  );
}
