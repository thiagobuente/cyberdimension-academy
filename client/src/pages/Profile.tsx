import { useAuth } from "@/_core/hooks/useAuth";
import { functionalCourses } from "@/data/courseCatalog";
import { buildBadgeVerificationUrl, buildCertificateVerificationUrl, buildLinkedInShareUrl } from "@/lib/linkedinShare";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Award, BadgeCheck, Camera, CheckCircle2, Cloud, Copy, Download, FileText, Folder, Headphones, Image as ImageIcon, Languages, Linkedin, Loader2, PencilLine, Rocket, ShieldCheck, Sparkles, Trash2, Upload, UserRound, Video, X, Globe } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FREE_CATEGORY_BADGES } from "@shared/freeVideoCourses";
import { PROJECT_XP_REWARD } from "@shared/cyberProjects";
import { cyberProjects, type CyberProject } from "@/data/cyberProjects";
import CareerRoadmap from "@/components/CareerRoadmap";
import ProfileCareerSummary from "@/components/ProfileCareerSummary";
import { getAcademyReadiness, getRecommendedAcademy, type RealProgress } from "@/data/careerReadiness";
import { careerGoals } from "@/data/curriculumCatalog";

const badgeNames: Record<string, string> = {
  "first-module": "Primeiro Salto",
  "all-modules": "Mapa Estelar",
  "first-lab": "Explorador",
  "all-labs": "Operador Prático",
  "assessment-passed": "Mestre da Missão",
  certified: "Orbit Certified",
  "cloud-security-specialist": "Cloud Security Specialist",
  "domain-mastery-1": "Guardião dos Fundamentos",
  "domain-mastery-2": "Engenheiro de Ameaças",
  "domain-mastery-3": "Arquiteto de Segurança",
  "domain-mastery-4": "Mestre da Operação",
  "domain-mastery-5": "Oficial de Gestão",
};

const podcastBadgeMeta: Record<string, { name: string; description: string }> = {
  "podcast-first-hop": { name: "Primeiro Salto", description: "Concluiu o primeiro episódio do CyberCast." },
  "podcast-decadia": { name: "Década de Ouvidos", description: "Concluiu 10 episódios da série." },
  "podcast-quarter": { name: "Um Quarto da Órbita", description: "Concluiu 15 episódios do CyberCast." },
  "podcast-veteran": { name: "Ouvinte Veterano", description: "Concluiu 25 episódios da série." },
  "podcast-half-orbit": { name: "Meia Órbita", description: "Concluiu 30 episódios do CyberCast." },
  "podcast-scholar": { name: "Estudioso do Éter", description: "Concluiu 50 episódios da série." },
  "podcast-full-series": { name: "Série Completa", description: "Concluiu os 60 episódios do CyberCast Security+." },
  "podcast-perfect-streak-5": { name: "Precisão de Laser", description: "Acertou 5 quizzes de revisão com nota máxima." },
  "podcast-perfect-streak-15": { name: "Ouvido Absoluto", description: "Acertou 15 quizzes de revisão com nota máxima." },
  "podcast-season-three": { name: "Explorador da Temporada 3", description: "Concluiu os dez episódios de forense, malware e cloud avançado." },
  "english-for-cyber-pros": { name: "English for Cyber Pros", description: "Concluiu o episódio especial de inglês técnico e o quiz de vocabulário." },
  "english-for-network-security": { name: "English for Network Security", description: "Concluiu o especial de entrevista para vagas de Network Security e o quiz de vocabulário." },
  "english-for-cloud-security": { name: "English for Cloud Security", description: "Concluiu o especial de entrevista para vagas de Cloud Security e o quiz de vocabulário." },
  "english-for-incident-response": { name: "English for Incident Response", description: "Concluiu o especial de entrevista para vagas de Incident Response e o quiz de vocabulário." },
  "english-for-penetration-testing": { name: "English for Penetration Testing", description: "Concluiu o especial de entrevista para vagas de Penetration Testing e o quiz de vocabulário." },
  "polyglot-cyber": { name: "Polyglot Cyber", description: "Concluiu todos os episódios e quizzes da trilha English for Cyber Pros." },
};

export default function Profile() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const utils = trpc.useUtils();
  const historyQuery = trpc.certificates.history.useQuery(undefined, { enabled: Boolean(user) });
  const podcastBadgesQuery = trpc.podcast.listenerBadges.useQuery(undefined, { enabled: Boolean(user) });
  const freeCourseProgressQuery = trpc.freeCourses.progress.useQuery(undefined, { enabled: Boolean(user) });
  const formationsQuery = trpc.formations.summary.useQuery(undefined, { enabled: Boolean(user) });
  const updateProfile = trpc.auth.updateProfile.useMutation();
  const portfolioQuery = trpc.portfolio.items.useQuery(undefined, { enabled: Boolean(user) });
  const portfolioLabEvidenceQuery = trpc.portfolio.labEvidence.useQuery(undefined, { enabled: Boolean(user) });
  const portfolioCountsQuery = trpc.portfolio.evidenceCounts.useQuery(undefined, { enabled: Boolean(user) });
  const cyberProjectsQuery = trpc.cyberProjects.list.useQuery();
  const cyberProjectsCompletionsQuery = trpc.cyberProjects.completions.useQuery(undefined, { enabled: Boolean(user) });
  const completeCyberProject = trpc.cyberProjects.complete.useMutation({
    onSuccess: async () => {
      await utils.cyberProjects.completions.invalidate();
      await utils.formations.summary.invalidate();
      await utils.portfolio.items.invalidate();
    },
  });
  const removeCyberProject = trpc.cyberProjects.remove.useMutation({
    onSuccess: async () => {
      await utils.cyberProjects.completions.invalidate();
      await utils.formations.summary.invalidate();
    },
  });
  const [completedProject, setCompletedProject] = useState<CyberProject | null>(null);
  const [completionSummary, setCompletionSummary] = useState("");
  const attachEvidence = trpc.portfolio.attachEvidence.useMutation();
  const removeEvidence = trpc.portfolio.removeEvidence.useMutation();
  const setPublicPortfolio = trpc.portfolio.setPublic.useMutation({
    onSuccess: async () => {
      await utils.portfolio.items.invalidate();
    },
  });
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  const [portfolioMessage, setPortfolioMessage] = useState<string | null>(null);
  const [publicPortfolioEnabled, setPublicPortfolioEnabled] = useState(false);
  const [publicPortfolioToken, setPublicPortfolioToken] = useState<string | null>(null);
  const [copiedPublicLink, setCopiedPublicLink] = useState(false);
  const [pendingEvidence, setPendingEvidence] = useState<{ labId: number; courseSlug: string; labIndex: number; labTitle: string } | null>(null);
  const [pendingEvidenceTitle, setPendingEvidenceTitle] = useState("");
  const [pendingEvidenceDescription, setPendingEvidenceDescription] = useState("");
  const [pendingEvidenceDataUrl, setPendingEvidenceDataUrl] = useState<string | null>(null);
  const [pendingEvidenceFileName, setPendingEvidenceFileName] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null | undefined>(undefined);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name ?? "");
    setAvatarPreview(user?.avatarUrl ?? null);
    setAvatarDataUrl(undefined);
  }, [user?.avatarUrl, user?.id, user?.name]);

  const readinessQuery = trpc.formations.readiness.useQuery(undefined, { enabled: Boolean(user) });
  const cyberCompletions = cyberProjectsCompletionsQuery.data ?? [];
  const readinessProgress: RealProgress = readinessQuery.data
    ? { modules: readinessQuery.data.modules, labs: readinessQuery.data.labs, certificates: readinessQuery.data.certificates }
    : { modules: [], labs: [], certificates: [] };
  const recommendedAcademy = getRecommendedAcademy(readinessQuery.data?.quizArea ?? null);
  const goalReadiness = recommendedAcademy ? getAcademyReadiness(recommendedAcademy, readinessProgress) : null;
  const goalCareer = careerGoals.find((item) => item.academy === recommendedAcademy);
  const nextSteps = goalReadiness?.competencies.map((item, index) => {
    const earlierDone = index === 0 ? true : goalReadiness.competencies.slice(0, index).every((prev) => prev.status === "done");
    const status = item.status === "done" ? ("done" as const) : item.status === "in-progress" ? ("in-progress" as const) : earlierDone ? ("next" as const) : ("locked" as const);
    return { title: item.title, slug: item.slug, status };
  }) ?? [];
  const firstOpenStep = nextSteps.find((step) => step.status === "next" || step.status === "in-progress");
  const goalReached = nextSteps.length > 0 && nextSteps.every((step) => step.status === "done");

  if (!user) return null;

  const history = historyQuery.data ?? [];
  const podcastBadges = podcastBadgesQuery.data?.badges ?? [];
  const freeCourseProgress = freeCourseProgressQuery.data;
  const freeCourseMilestones = freeCourseProgress?.earnedMilestones ?? [];
  const freeCategoryBadges = (freeCourseProgress?.earnedCategoryBadges ?? [])
    .map((code) => FREE_CATEGORY_BADGES.find((badge) => badge.code === code))
    .filter((badge): badge is (typeof FREE_CATEGORY_BADGES)[number] => Boolean(badge));
  const freeCourseMeta: Record<string, { title: string; description: string }> = {
    "free-courses-10": { title: "Colecionador Gratuito I", description: "Assistiu a 10 cursos da biblioteca gratuita em vídeo." },
    "free-courses-20": { title: "Colecionador Gratuito II", description: "Assistiu a 20 cursos da biblioteca gratuita em vídeo." },
    "free-courses-30": { title: "Colecionador Gratuito III", description: "Assistiu a 30 cursos da biblioteca gratuita em vídeo." },
  };
  const achievements = formationsQuery.data?.achievements ?? [];
  const downloadCertificate = (downloadUrl: string) => window.open(`${downloadUrl}?download=1`, "_blank", "noopener,noreferrer");
  const shareOnLinkedIn = (url: string, text: string) => {
    void navigator.clipboard?.writeText(text);
    window.open(buildLinkedInShareUrl(url), "_blank", "noopener,noreferrer");
  };
  const publicPortfolioLink = publicPortfolioEnabled && publicPortfolioToken ? `${window.location.origin}/portfolio-publico/${publicPortfolioToken}` : null;
  const togglePublicPortfolio = async (enabled: boolean) => {
    const result = await setPublicPortfolio.mutateAsync({ enabled });
    setPublicPortfolioEnabled(enabled);
    setPublicPortfolioToken(result.token ?? null);
    setCopiedPublicLink(false);
    setPortfolioMessage(enabled ? "Seu portfólio público foi ativado. Copie o link e compartilhe com recrutadores." : "Portfólio público desativado. Apenas você vê suas evidências no perfil.");
  };
  const copyPublicPortfolioLink = async () => {
    if (!publicPortfolioLink) return;
    await navigator.clipboard.writeText(publicPortfolioLink);
    setCopiedPublicLink(true);
    setTimeout(() => setCopiedPublicLink(false), 2200);
  };
  const getCourseTitle = (slug: string) => slug === "cloud-security-specialization" ? "Trilha Cloud Security" : functionalCourses.find((course) => course.slug === slug)?.shortTitle || slug.replace(/-/g, " ");

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfileError(null);
    setProfileMessage(null);
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setProfileError("Escolha uma imagem PNG, JPEG ou WebP.");
      return;
    }
    if (file.size > 1_000_000) {
      setProfileError("A foto deve ter no máximo 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) {
        setProfileError("Não foi possível ler a imagem selecionada.");
        return;
      }
      setAvatarDataUrl(dataUrl);
      setAvatarPreview(dataUrl);
    };
    reader.onerror = () => setProfileError("Não foi possível ler a imagem selecionada.");
    reader.readAsDataURL(file);
  };

  const submitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileError(null);
    setProfileMessage(null);
    try {
      const result = await updateProfile.mutateAsync({ name: name.trim(), avatarDataUrl });
      utils.auth.me.setData(undefined, result.user);
      setAvatarPreview(result.user.avatarUrl ?? null);
      setAvatarDataUrl(undefined);
      setProfileMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Não foi possível atualizar seu perfil.");
    }
  };

  const handlePendingEvidenceFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPortfolioError(null);
    if (!["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(file.type)) {
      setPortfolioError("Escolha um arquivo PNG, JPEG, WebP ou PDF.");
      return;
    }
    if (file.size > 4_000_000) {
      setPortfolioError("A evidência deve ter no máximo 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : null;
      if (!dataUrl) {
        setPortfolioError("Não foi possível ler o arquivo selecionado.");
        return;
      }
      setPendingEvidenceDataUrl(dataUrl);
      setPendingEvidenceFileName(file.name);
      if (!pendingEvidenceTitle.trim()) {
        setPendingEvidenceTitle(file.name.replace(/\.(png|jpe?g|webp|pdf)$/i, "").slice(0, 200));
      }
    };
    reader.onerror = () => setPortfolioError("Não foi possível ler o arquivo selecionado.");
    reader.readAsDataURL(file);
  };

  const submitPendingEvidence = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pendingEvidence) return;
    setPortfolioError(null);
    setPortfolioMessage(null);
    if (!pendingEvidenceTitle.trim()) {
      setPortfolioError("Dê um título para a evidência.");
      return;
    }
    if (!pendingEvidenceDataUrl) {
      setPortfolioError("Selecione o arquivo de evidência.");
      return;
    }
    try {
      await attachEvidence.mutateAsync({
        courseSlug: pendingEvidence.courseSlug,
        labIndex: pendingEvidence.labIndex,
        title: pendingEvidenceTitle.trim(),
        description: pendingEvidenceDescription.trim() || undefined,
        evidenceDataUrl: pendingEvidenceDataUrl,
      });
      await utils.portfolio.items.invalidate();
      await utils.portfolio.labEvidence.invalidate();
      await utils.portfolio.evidenceCounts.invalidate();
      setPortfolioMessage(`Evidência "${pendingEvidence.labTitle}" anexada ao portfólio.`);
      closePendingEvidenceForm();
    } catch (error) {
      setPortfolioError(error instanceof Error ? error.message : "Não foi possível anexar a evidência.");
    }
  };

  const closePendingEvidenceForm = () => {
    setPendingEvidence(null);
    setPendingEvidenceTitle("");
    setPendingEvidenceDescription("");
    setPendingEvidenceDataUrl(null);
    setPendingEvidenceFileName(null);
    if (pendingFileInputRef.current) pendingFileInputRef.current.value = "";
  };

  const portfolioItems = portfolioQuery.data ?? [];
  const evidenceCounts = new Map(
    (portfolioCountsQuery.data ?? []).map((row) => [`${row.courseSlug}:${row.labIndex}`, row.count] as const),
  );
  const labsWithEvidence = (portfolioLabEvidenceQuery.data ?? [])
    .filter((lab) => (evidenceCounts.get(`${lab.courseSlug}:${lab.labIndex}`) ?? 0) > 0)
    .map((lab) => ({ ...lab, evidenceCount: evidenceCounts.get(`${lab.courseSlug}:${lab.labIndex}`) ?? 0 }));
  const pendingLabOptions = (portfolioLabEvidenceQuery.data ?? [])
    .filter((lab) => !labsWithEvidence.some((labEntry) => labEntry.courseSlug === lab.courseSlug && labEntry.labIndex === lab.labIndex));
  const sharePortfolioText = `Construí meu portfólio prático com ${portfolioItems.length} evidência${portfolioItems.length === 1 ? "" : "s"} de laboratórios na CyberDimension Academy — acompanhe minha evolução em cibersegurança.`;

  const confirmRemoveEvidence = async (itemId: number, itemTitle: string) => {
    if (!window.confirm(`Remover a evidência "${itemTitle}" do seu portfólio?`)) return;
    setPortfolioError(null);
    try {
      await removeEvidence.mutateAsync({ itemId });
      await utils.portfolio.items.invalidate();
      setPortfolioMessage("Evidência removida do portfólio.");
    } catch (error) {
      setPortfolioError(error instanceof Error ? error.message : "Não foi possível remover a evidência.");
    }
  };

  const submitCompletion = async (event: FormEvent) => {
    event.preventDefault();
    if (!completedProject) return;
    setPortfolioError(null);
    try {
      const result = await completeCyberProject.mutateAsync({ projectId: completedProject.id, summary: completionSummary.trim() || undefined });
      setCompletedProject(null);
      setCompletionSummary("");
      setPortfolioMessage(`Projeto "${result.project.title}" registrado como entregue — ${result.xp} XP adicionados!`);
    } catch (error) {
      setPortfolioError(error instanceof Error ? error.message : "Não foi possível registrar a entrega do projeto.");
    }
  };

  const confirmRemoveCyberProject = async (projectId: string, projectTitle: string) => {
    if (!window.confirm(`Reabrir o projeto "${projectTitle}"? A entrega será removida do seu portfólio.`)) return;
    setPortfolioError(null);
    try {
      await removeCyberProject.mutateAsync({ projectId });
      setPortfolioMessage("Entrega removida — você pode registrar uma nova entrega quando concluir novamente.");
    } catch (error) {
      setPortfolioError(error instanceof Error ? error.message : "Não foi possível remover a entrega do projeto.");
    }
  };

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Painel</Link>
          <Link href="/" className="font-orbitron text-xs font-bold tracking-[0.08em]">CYBERDIMENSION <span className="text-neon-cyan">ACADEMY</span></Link>
        </div>
      </header>
      <main className="container relative py-7 md:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(0.13_0.05_260/0.96),oklch(0.08_0.025_270/0.93))] p-6 md:p-8">
          <div className="absolute -right-10 -top-16 h-60 w-60 rounded-full bg-neon-purple/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan"><UserRound className="h-4 w-4" /> PERFIL DO ALUNO</p>
              <h1 className="mt-3 font-orbitron text-2xl font-bold md:text-4xl">{user.name || "Explorador CyberDimension"}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Sua central para acompanhar conquistas e preservar cada certificado emitido pela Academia.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-neon-cyan/25 bg-neon-cyan/10 p-3 text-center"><p className="font-orbitron text-xl font-bold text-neon-cyan">{history.length}</p><p className="mt-1 text-[10px] font-bold tracking-[0.12em] text-muted-foreground">CERTIFICADOS</p></div>
              <div className="rounded-xl border border-neon-purple/25 bg-neon-purple/10 p-3 text-center"><p className="font-orbitron text-xl font-bold text-neon-purple">{achievements.length}</p><p className="mt-1 text-[10px] font-bold tracking-[0.12em] text-muted-foreground">BADGES</p></div>
              <div className="hidden rounded-xl border border-neon-green/25 bg-neon-green/10 p-3 text-center sm:block"><p className="font-orbitron text-xl font-bold text-neon-green">{portfolioItems.length}</p><p className="mt-1 text-[10px] font-bold tracking-[0.12em] text-muted-foreground">EVIDÊNCIAS</p></div>
            </div>
          </div>
        </section>

        <ProfileCareerSummary
          progress={readinessProgress}
          quizArea={readinessQuery.data?.quizArea ?? null}
          completedProjectIds={cyberCompletions.map((entry) => entry.projectId)}
          certificateCount={history.length}
          evidenceCount={portfolioItems.length}
        />

        {recommendedAcademy && goalReadiness ? (
          <section className="module-card mt-6 rounded-2xl border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/8 via-transparent to-neon-purple/8 p-5 md:p-6">
            <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">SEU PRÓXIMO OBJETIVO</p>
                <h2 className="mt-1 font-orbitron text-lg font-bold">Carreira recomendada: {goalReadiness.academyName}</h2>
                <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
                  {goalCareer?.recommendedTrilha
                    ? `Direcionamento do seu teste vocacional — ${goalCareer.recommendedTrilha}.`
                    : "Baseado no seu teste vocacional. Continue de onde parou e fortaleça as competências da rota."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="font-orbitron text-2xl font-bold text-neon-cyan">{goalReadiness.score}%</p>
                  <p className="text-[0.6rem] font-bold tracking-[0.12em] text-muted-foreground">PRONTIDÃO</p>
                </div>
                <div className="relative h-16 w-16">
                  <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3.2" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="oklch(0.85 0.2 200)" strokeWidth="3.2" strokeDasharray={`${goalReadiness.score}, 100`} strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <CareerRoadmap steps={nextSteps} goalLabel={goalCareer?.recommendedTrilha ?? goalReadiness.academyName} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {goalReached ? (
                <Link href="/certificados" className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-green to-[oklch(0.75_0.18_155)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"><Award className="h-4 w-4" /> Objetivo alcançado — confira seus certificados</Link>
              ) : firstOpenStep ? (
                firstOpenStep.slug ? (
                  <Link href={`/catalog/${firstOpenStep.slug}`} className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"><Rocket className="h-4 w-4" /> Continuar treinamento: {firstOpenStep.title}</Link>
                ) : (
                  <Link href="/catalog" className="orbit-button inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)]"><Rocket className="h-4 w-4" /> Explorar catálogo</Link>
                )
              ) : (
                <Link href="/carreira" className="orbit-button inline-flex items-center gap-2 rounded-xl border border-neon-purple/40 bg-neon-purple/10 px-5 py-3 text-sm font-bold text-neon-purple"><Award className="h-4 w-4" /> Fazer o teste vocacional</Link>
              )}
              {nextSteps.some((step) => step.status === "locked") && (
                <p className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5" /> As etapas seguintes se abrem conforme você conclui as anteriores.</p>
              )}
            </div>
          </section>
        ) : null}
        <section className="module-card mt-6 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
            <div><p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">DADOS DA CONTA</p><h2 className="mt-1 font-orbitron text-lg font-bold">Identidade do explorador</h2></div>
            <p className="text-xs text-muted-foreground">Seu e-mail de acesso: {user.email}</p>
          </div>
          <form className="mt-5 grid gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-start" onSubmit={submitProfile}>
            <div className="flex flex-col items-center gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="group relative grid h-28 w-28 place-items-center overflow-hidden rounded-full border border-neon-cyan/35 bg-neon-cyan/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan" aria-label="Alterar foto de perfil">
                {avatarPreview ? <img src={avatarPreview} alt="Foto de perfil" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-neon-cyan" />}
                <span className="absolute inset-0 grid place-items-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"><Camera className="h-5 w-5 text-white" /></span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
              <button type="button" onClick={() => { setAvatarDataUrl(null); setAvatarPreview(null); }} className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-red-200"><X className="h-3.5 w-3.5" /> Remover foto</button>
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-bold text-foreground">Nome de exibição<input required minLength={2} maxLength={255} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-neon-cyan/60 focus:ring-2 focus:ring-neon-cyan/15" placeholder="Como podemos chamar você?" /></label>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">A imagem é opcional e deve ser PNG, JPEG ou WebP, com até 1 MB.</p>
              {profileError && <p className="mt-3 rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-200">{profileError}</p>}
              {profileMessage && <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-neon-green/25 bg-neon-green/10 px-3 py-2 text-sm text-neon-green"><CheckCircle2 className="h-4 w-4" /> {profileMessage}</p>}
              <button disabled={updateProfile.isPending} className="orbit-button mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:cursor-not-allowed disabled:opacity-60">{updateProfile.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Salvar alterações</button>
            </div>
          </form>
        </section>

        {podcastBadges.length > 0 ? (
          <section className="module-card mt-6 rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-green">CYBERCAST</p><h2 className="mt-1 font-orbitron text-lg font-bold">Badges de ouvinte</h2></div><Headphones className="h-6 w-6 text-neon-green" /></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {podcastBadges.map((entry) => {
                const meta = podcastBadgeMeta[entry.code];
                const title = meta?.name ?? entry.code;
                const isEnglishBadge = entry.code.startsWith("english-for-") || entry.code === "polyglot-cyber";
                return <div key={entry.code} className={`rounded-xl border p-3 ${isEnglishBadge ? "border-neon-cyan/30 bg-neon-cyan/10" : "border-neon-green/25 bg-neon-green/10"}`}>{isEnglishBadge ? <Languages className={`h-5 w-5 ${isEnglishBadge ? "text-neon-cyan" : "text-neon-green"}`} /> : <BadgeCheck className="h-5 w-5 text-neon-green" />}<p className="mt-3 text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{meta?.description ?? "Conquista da série de áudio CyberCast."}</p><p className="mt-2 text-[0.65rem] text-muted-foreground">CyberCast · {new Date(entry.awardedAt).toLocaleDateString("pt-BR")}</p></div>;
              })}
            </div>
          </section>
        ) : null}

        {freeCourseProgress && (freeCourseMilestones.length > 0 || freeCategoryBadges.length > 0) ? (
          <section className="module-card mt-6 rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-purple">CURSOS GRATUITOS</p><h2 className="mt-1 font-orbitron text-lg font-bold">Conquistas da biblioteca de vídeos</h2><p className="mt-1 text-sm text-muted-foreground">{freeCourseProgress.watchedCount} cursos assistidos · marcos em 10, 20 e 30 e conclusão de cada categoria.</p></div><Video className="h-6 w-6 text-neon-purple" /></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {freeCourseMilestones.map((code) => {
                const meta = freeCourseMeta[code];
                return <div key={code} className="rounded-xl border border-neon-purple/25 bg-neon-purple/10 p-3"><BadgeCheck className="h-5 w-5 text-neon-purple" /><p className="mt-3 text-sm font-bold">{meta?.title ?? code}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{meta?.description ?? "Marco da biblioteca gratuita."}</p><p className="mt-2 text-[0.65rem] text-muted-foreground">Biblioteca gratuita · <Link href="/cursos-gratuitos" className="font-bold text-neon-purple hover:underline">ver biblioteca</Link></p></div>;
              })}
              {freeCategoryBadges.map((badge) => (
                <div key={badge.code} className="rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 p-3"><BadgeCheck className="h-5 w-5 text-neon-cyan" /><p className="mt-3 text-sm font-bold">{badge.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{badge.description}</p><p className="mt-2 text-[0.65rem] text-muted-foreground">Biblioteca gratuita · <Link href="/cursos-gratuitos" className="font-bold text-neon-cyan hover:underline">ver biblioteca</Link></p></div>
              ))}
            </div>
          </section>
        ) : null}

        {portfolioError && <p className="mt-6 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">{portfolioError}</p>}
        {portfolioMessage && <p className="mt-6 inline-flex items-center gap-2 rounded-xl border border-neon-green/25 bg-neon-green/10 px-4 py-3 text-sm text-neon-green"><CheckCircle2 className="h-4 w-4" /> {portfolioMessage}</p>}

        <section className="module-card mt-6 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
            <div><p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">PORTFÓLIO</p><h2 className="mt-1 font-orbitron text-lg font-bold">Evidências de laboratórios</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Anexe prints e relatórios dos laboratórios concluídos para documentar sua evolução prática. Somente laboratórios já concluídos podem receber evidências.</p></div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={() => shareOnLinkedIn(`${window.location.origin}/profile`, sharePortfolioText)} disabled={portfolioItems.length === 0} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-[#0A66C2]/45 bg-[#0A66C2]/15 px-3 py-2 text-xs font-bold text-[#7db7f3] disabled:cursor-not-allowed disabled:opacity-50"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</button>
              <Folder className="h-7 w-7 text-neon-cyan" />
            </div>
          </div>
          {portfolioQuery.isLoading ? <p className="py-8 text-sm text-muted-foreground">Carregando portfólio...</p> : portfolioItems.length === 0 && pendingLabOptions.length === 0 ? (
            <div className="py-8 text-center">
              <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">Seu portfólio está vazio. Conclua laboratórios guiados para anexar suas primeiras evidências.</p>
              <Link href="/formacoes" className="orbit-button mt-4 inline-flex items-center gap-2 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-2 text-xs font-bold text-neon-cyan">Explorar laboratórios</Link>
            </div>
          ) : (
            <>
              {labsWithEvidence.length > 0 ? (
                <div className="mt-5">
                  <p className="text-xs font-bold tracking-[0.15em] text-neon-green">LABORATÓRIOS COM EVIDÊNCIAS</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {labsWithEvidence.map((lab) => (
                      <div key={lab.id} className="inline-flex items-center gap-2 rounded-xl border border-neon-cyan/25 bg-neon-cyan/10 py-2 pl-3 pr-1">
                        <p className="text-xs font-bold">{lab.labTitle || `${lab.courseTitle} · Lab ${lab.labIndex + 1}`}</p>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-neon-green/15 px-2 py-0.5 text-[0.65rem] font-bold text-neon-green"><ImageIcon className="h-3 w-3" /> {lab.evidenceCount} evidência{lab.evidenceCount === 1 ? "" : "s"}</span>
                        <button type="button" onClick={() => { setPendingEvidence({ labId: lab.id, courseSlug: lab.courseSlug, labIndex: lab.labIndex, labTitle: lab.labTitle || `${lab.courseTitle} · Lab ${lab.labIndex + 1}` }); setPortfolioError(null); }} className="m-1 rounded-lg border border-neon-cyan/35 px-2 py-1 text-[0.65rem] font-bold text-neon-cyan transition-colors hover:border-neon-cyan/60 hover:bg-neon-cyan/10">Adicionar</button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {portfolioItems.map((item) => {
                  const isPdf = item.mimeType === "application/pdf";
                  const labMeta = portfolioLabEvidenceQuery.data?.find((lab) => lab.courseSlug === item.courseSlug && lab.labIndex === item.labIndex);
                  return (
                    <article key={item.id} className={`group relative flex flex-col rounded-xl border bg-black/15 p-4 ${item.validLab ? "border-neon-cyan/25" : "border-amber-300/30"}`}>
                      {!item.validLab && <p className="mb-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-300/15 px-2 py-1 text-[0.65rem] font-bold text-amber-200"><ShieldCheck className="h-3 w-3" /> Laboratório reaberto — revalide a conclusão</p>}
                      {isPdf ? (
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="grid h-28 place-items-center rounded-lg border border-white/10 bg-neon-cyan/5 transition-colors group-hover:border-neon-cyan/40">
                          <FileText className="h-8 w-8 text-neon-cyan" />
                        </a>
                      ) : (
                        <button type="button" onClick={() => setPreviewZoom(item.fileUrl)} className="grid h-28 place-items-center overflow-hidden rounded-lg border border-white/10 bg-neon-cyan/5 transition-colors group-hover:border-neon-cyan/40" aria-label={`Ampliar evidência ${item.title}`}>
                          <img src={item.fileUrl} alt={item.title} className="max-h-28 max-w-full object-contain" />
                        </button>
                      )}
                      <h3 className="mt-3 text-sm font-bold leading-5">{item.title}</h3>
                      {item.description ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p> : null}
                      <p className="mt-2 text-[0.65rem] font-bold tracking-[0.1em] text-neon-cyan">{item.courseSlug.toUpperCase()} · LAB {item.labIndex + 1}</p>
                      <p className="mt-0.5 text-[0.65rem] text-muted-foreground">Anexado em {new Date(item.createdAt).toLocaleDateString("pt-BR")}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground">{isPdf ? <FileText className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />} Abrir</a>
                        <button onClick={() => void confirmRemoveEvidence(item.id, item.title)} disabled={removeEvidence.isPending} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-red-300/30 px-3 py-2 text-xs font-bold text-red-200 disabled:opacity-60"><Trash2 className="h-3.5 w-3.5" /> Remover</button>
                      </div>
                    </article>
                  );
                })}
                {pendingLabOptions.map((lab) => (
                  <button key={lab.id} type="button" onClick={() => { setPendingEvidence({ labId: lab.id, courseSlug: lab.courseSlug, labIndex: lab.labIndex, labTitle: lab.labTitle }); setPortfolioError(null); }} className="flex flex-col gap-2 rounded-xl border border-dashed border-neon-cyan/35 bg-neon-cyan/5 p-4 text-left transition-colors hover:border-neon-cyan/60 hover:bg-neon-cyan/10">
                    <Upload className="h-5 w-5 text-neon-cyan" />
                    <p className="text-sm font-bold leading-5">Anexar evidência</p>
                    <p className="text-xs text-muted-foreground">{lab.courseTitle} · Lab {lab.labIndex + 1}</p>
                    <p className="mt-1 text-[0.65rem] font-bold tracking-[0.1em] text-neon-green">LABORATÓRIO CONCLUÍDO</p>
                  </button>
                ))}
              </div>
              {pendingEvidence ? (
                <form onSubmit={submitPendingEvidence} className="mt-5 rounded-xl border border-neon-cyan/35 bg-neon-cyan/5 p-4 md:p-5">
                  <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-center">
                    <div><p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">NOVA EVIDÊNCIA</p><h3 className="mt-1 font-orbitron text-base font-bold">{pendingEvidence.labTitle || `${pendingEvidence.courseSlug} · Lab ${pendingEvidence.labIndex + 1}`}</h3></div>
                    <button type="button" onClick={closePendingEvidenceForm} className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-red-200"><X className="h-3.5 w-3.5" /> Cancelar</button>
                  </div>
                  <label className="mt-4 block text-sm font-bold text-foreground">Título<input required minLength={2} maxLength={200} value={pendingEvidenceTitle} onChange={(event) => setPendingEvidenceTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-neon-cyan/60 focus:ring-2 focus:ring-neon-cyan/15" placeholder="Ex.: Flag capturada no lab de enumeração" /></label>
                  <label className="mt-3 block text-sm font-bold text-foreground">Descrição (opcional)<textarea maxLength={3000} value={pendingEvidenceDescription} onChange={(event) => setPendingEvidenceDescription(event.target.value)} rows={2} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-neon-cyan/60 focus:ring-2 focus:ring-neon-cyan/15" placeholder="O que esta evidência mostra?" /></label>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="min-w-0 flex-1">
                      <input ref={pendingFileInputRef} type="file" accept="image/png,image/jpeg,image/webp,application/pdf" className="hidden" onChange={handlePendingEvidenceFile} />
                      <button type="button" onClick={() => pendingFileInputRef.current?.click()} className="orbit-button inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 px-4 py-3 text-xs font-bold text-neon-cyan sm:w-auto"><Upload className="h-4 w-4" /> Selecionar arquivo (PNG, JPEG, WebP ou PDF · 4 MB)</button>
                      {pendingEvidenceFileName ? <p className="mt-2 truncate text-xs text-neon-cyan">Arquivo: {pendingEvidenceFileName}</p> : null}
                    </div>
                    <button type="submit" disabled={attachEvidence.isPending} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:cursor-not-allowed disabled:opacity-60">{attachEvidence.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PencilLine className="h-4 w-4" />} Anexar ao portfólio</button>
                  </div>
                  {pendingEvidenceDataUrl && pendingEvidenceDataUrl.startsWith("data:image") ? (
                    <img src={pendingEvidenceDataUrl} alt="Prévia da evidência" className="mt-3 max-h-48 rounded-lg border border-white/10 object-contain" />
                  ) : null}
                </form>
              ) : null}
            </>
          )}
        </section>

        <section className="module-card mt-6 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
            <div><p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">CYBER PROJECTS</p><h2 className="mt-1 font-orbitron text-lg font-bold">Projetos práticos</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Consolide a formação entregando projetos práticos de portfólio profissional: relatório de incidente, auditoria web, programa GRC, postura cloud ou intelligence report. Cada projeto concluído rende {PROJECT_XP_REWARD} XP e entra no seu portfólio público.</p></div>
            <Link href="/cyber-projects" className="orbit-button inline-flex shrink-0 items-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-3 py-2 text-xs font-bold text-neon-cyan">Explorar projetos</Link>
          </div>
          {cyberProjectsQuery.isLoading || cyberProjectsCompletionsQuery.isLoading ? (
            <p className="py-8 text-sm text-muted-foreground">Carregando projetos...</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {(cyberProjectsQuery.data ?? []).map((project) => {
                const completed = (cyberProjectsCompletionsQuery.data ?? []).find((completion) => completion.projectId === project.id);
                return (
                  <article key={project.id} className={`flex flex-col rounded-xl border p-4 ${completed ? "border-neon-green/30 bg-neon-green/5" : "border-neon-cyan/25 bg-black/15"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div><p className="text-[0.65rem] font-bold tracking-[0.12em] text-neon-cyan">{project.area.toUpperCase()}</p><h3 className="mt-1 text-sm font-bold leading-5">{project.title}</h3><p className="mt-0.5 text-[0.65rem] font-bold tracking-[0.08em] text-muted-foreground">{project.level.toUpperCase()} · {project.duration}</p></div>
                      {completed ? <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neon-green/15 px-2 py-1 text-[0.65rem] font-bold text-neon-green"><BadgeCheck className="h-3 w-3" /> Entregue</span> : <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neon-cyan/15 px-2 py-1 text-[0.65rem] font-bold text-neon-cyan">+{PROJECT_XP_REWARD} XP</span>}
                    </div>
                    <p className="mt-2 line-clamp-3 flex-1 text-xs leading-5 text-muted-foreground">{project.objective}</p>
                    {completed ? (
                      <button type="button" onClick={() => void confirmRemoveCyberProject(project.id, project.title)} disabled={removeCyberProject.isPending} className="orbit-button mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-red-300/30 px-3 py-2 text-xs font-bold text-red-200 disabled:opacity-60"><Trash2 className="h-3.5 w-3.5" /> Reabrir</button>
                    ) : (
                      <button type="button" onClick={() => { setCompletedProject(project as CyberProject); setCompletionSummary(""); }} className="orbit-button mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-3 py-2 text-xs font-bold text-neon-cyan">Marcar como entregue</button>
                    )}
                  </article>
                );
              })}
            </div>
          )}
          {completedProject ? (
            <form onSubmit={submitCompletion} className="mt-4 rounded-xl border border-neon-cyan/35 bg-neon-cyan/5 p-4 md:p-5">
              <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-center">
                <div><p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">ENTREGA DE PROJETO</p><h3 className="mt-1 font-orbitron text-base font-bold">{completedProject.title}</h3><p className="mt-1 text-xs text-muted-foreground">{completedProject.deliverable}</p></div>
                <button type="button" onClick={() => setCompletedProject(null)} className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-red-200"><X className="h-3.5 w-3.5" /> Cancelar</button>
              </div>
              <label className="mt-4 block text-sm font-bold text-foreground">Resumo da entrega (opcional)<textarea maxLength={3000} value={completionSummary} onChange={(event) => setCompletionSummary(event.target.value)} rows={3} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-neon-cyan/60 focus:ring-2 focus:ring-neon-cyan/15" placeholder="Descreva o que foi entregue no projeto (relatório, documentos, achados principais)..." /></label>
              <button type="submit" disabled={completeCyberProject.isPending} className="orbit-button mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-5 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:cursor-not-allowed disabled:opacity-60">{completeCyberProject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />} Registrar entrega ({PROJECT_XP_REWARD} XP)</button>
            </form>
          ) : null}
        </section>

        <section className="module-card mt-6 rounded-2xl p-5 md:p-6">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
            <div><p className="text-xs font-bold tracking-[0.15em] text-neon-purple">COMPARTILHAMENTO</p><h2 className="mt-1 font-orbitron text-lg font-bold">Portfólio público</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Ative a galeria pública para exibir suas evidências e certificados em uma página exclusiva, ideal para incluir no currículo e no LinkedIn.</p></div>
            <Globe className="h-7 w-7 text-neon-purple" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => void togglePublicPortfolio(!publicPortfolioEnabled)}
              disabled={setPublicPortfolio.isPending}
              className={`orbit-button inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-bold disabled:opacity-60 ${publicPortfolioEnabled ? "border-neon-green/40 bg-neon-green/15 text-neon-green" : "border-white/15 bg-white/5 text-muted-foreground hover:text-foreground"}`}
            >
              {setPublicPortfolio.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
              {publicPortfolioEnabled ? "Ativado — Desativar" : "Ativar portfólio público"}
            </button>
            {publicPortfolioLink ? (
              <div className="min-w-0 flex-1 sm:max-w-md">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                  <p className="truncate font-mono text-xs text-neon-cyan">{publicPortfolioLink}</p>
                  <button type="button" onClick={copyPublicPortfolioLink} className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-neon-cyan/35 px-2 py-1 text-[0.65rem] font-bold text-neon-cyan transition-colors hover:border-neon-cyan/60 hover:bg-neon-cyan/10">
                    {copiedPublicLink ? <><CheckCircle2 className="h-3 w-3" /> Copiado</> : <><Copy className="h-3 w-3" /> Copiar</>}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          {publicPortfolioLink ? (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button onClick={() => shareOnLinkedIn(publicPortfolioLink, `Explore meu portfólio público de evidências de laboratórios de cibersegurança na CyberDimension Academy.`)} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-[#0A66C2]/45 bg-[#0A66C2]/15 px-3 py-2 text-xs font-bold text-[#7db7f3]"><Linkedin className="h-3.5 w-3.5" /> Compartilhar no LinkedIn</button>
              <a href={publicPortfolioLink} target="_blank" rel="noopener noreferrer" className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"><Globe className="h-3.5 w-3.5" /> Visualizar página pública</a>
            </div>
          ) : (
            <p className="mt-4 text-xs text-muted-foreground">Ative o portfólio público para receber sua galeria exclusiva.</p>
          )}
        </section>

        {previewZoom ? (
          <div role="dialog" aria-modal="true" aria-label="Visualizar evidência" className="fixed inset-0 z-40 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setPreviewZoom(null)}>
            <button type="button" onClick={() => setPreviewZoom(null)} aria-label="Fechar visualização" className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/60 p-2 text-white hover:bg-black/80"><X className="h-5 w-5" /></button>
            <img src={previewZoom} alt="Evidência do laboratório" className="max-h-[85vh] max-w-full rounded-xl border border-white/15 object-contain" onClick={(event) => event.stopPropagation()} />
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.76fr_1.24fr]">
          <section className="module-card rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-purple">CONQUISTAS</p><h2 className="mt-1 font-orbitron text-lg font-bold">Badges obtidos</h2></div><Sparkles className="h-6 w-6 text-neon-purple" /></div>
            {formationsQuery.isLoading ? <p className="py-8 text-sm text-muted-foreground">Carregando conquistas...</p> : achievements.length === 0 ? <div className="py-8 text-sm leading-6 text-muted-foreground">Conclua módulos, laboratórios e avaliações para desbloquear suas primeiras insígnias.</div> : <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{achievements.map((achievement) => {
              const badgeName = badgeNames[achievement.badgeCode] || achievement.badgeCode;
              const courseTitle = getCourseTitle(achievement.courseSlug);
              const shareText = `Conquistei o badge ${badgeName} na formação ${courseTitle} da CyberDimension Academy. Minha conquista pode ser verificada publicamente.`;
              const badgeUrl = buildBadgeVerificationUrl(window.location.origin, achievement.id);
              const isCloudSpecialist = achievement.badgeCode === "cloud-security-specialist";
              const isDomainMastery = achievement.badgeCode.startsWith("domain-mastery");
              return <div key={achievement.id} className={`rounded-xl border p-3 ${isCloudSpecialist ? "border-neon-cyan/45 bg-gradient-to-br from-neon-cyan/15 via-neon-purple/10 to-neon-green/10" : "border-neon-purple/25 bg-neon-purple/10"}`}>{isCloudSpecialist ? <Cloud className="h-5 w-5 text-neon-cyan" /> : <BadgeCheck className="h-5 w-5 text-neon-purple" />}<p className="mt-3 text-sm font-bold">{badgeName}</p><p className="mt-1 text-xs text-muted-foreground">{isCloudSpecialist ? "ESPECIALIZAÇÃO CLOUD" : achievement.courseSlug.toUpperCase()} · {new Date(achievement.unlockedAt).toLocaleDateString("pt-BR")}</p><div className="mt-3 grid grid-cols-2 gap-2"><Link href={`/badge/${achievement.id}`} className={`orbit-button inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${isCloudSpecialist ? "border-neon-cyan/40 text-neon-cyan" : "border-neon-purple/35 text-neon-purple"}`}><ShieldCheck className="h-3.5 w-3.5" /> Validar</Link><button onClick={() => shareOnLinkedIn(badgeUrl, shareText)} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-[#0A66C2]/45 bg-[#0A66C2]/15 px-3 py-2 text-xs font-bold text-[#7db7f3]"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</button></div></div>;
            })}</div>}
          </section>
          <section className="module-card rounded-2xl p-5">
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-green">DOCUMENTOS</p><h2 className="mt-1 font-orbitron text-lg font-bold">Histórico de certificados</h2><p className="mt-1 text-sm text-muted-foreground">Visualize, baixe e compartilhe suas credenciais verificáveis.</p></div><Award className="h-7 w-7 text-neon-green" /></div>
            {historyQuery.isLoading ? <p className="py-10 text-sm text-muted-foreground">Carregando histórico...</p> : history.length === 0 ? <div className="py-10 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">Seu histórico aparecerá aqui quando você concluir uma formação ou domínio.</p></div> : <div className="mt-4 space-y-3">{history.map((certificate) => {
              const shareText = `Concluí ${certificate.title} na CyberDimension Academy. Meu certificado pode ser validado publicamente pelo identificador ${certificate.identifier}.`;
              const verificationUrl = buildCertificateVerificationUrl(window.location.origin, certificate.identifier);
              return <article key={`${certificate.type}-${certificate.id}`} className="rounded-xl border border-white/10 bg-black/15 p-4"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className={`text-[10px] font-bold tracking-[0.14em] ${certificate.type === "formation" ? "text-neon-cyan" : "text-neon-green"}`}>{certificate.type === "formation" ? "FORMAÇÃO ORBIT" : "COMPTIA SECURITY+"}</p><h3 className="mt-1 text-sm font-bold">{certificate.title}</h3><p className="mt-1 break-all font-mono text-xs text-muted-foreground">{certificate.identifier} · {new Date(certificate.issuedAt).toLocaleDateString("pt-BR")}</p></div><div className="flex shrink-0 flex-wrap gap-2"><Link href={certificate.downloadUrl} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"><Award className="h-3.5 w-3.5" /> Abrir</Link><button onClick={() => downloadCertificate(certificate.downloadUrl)} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-neon-green/30 bg-neon-green/10 px-3 py-2 text-xs font-bold text-neon-green"><Download className="h-3.5 w-3.5" /> Baixar</button><button onClick={() => shareOnLinkedIn(verificationUrl, shareText)} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-[#0A66C2]/45 bg-[#0A66C2]/15 px-3 py-2 text-xs font-bold text-[#7db7f3]"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</button></div></div></article>;
            })}</div>}
          </section>
        </div>
      </main>
    </div>
  );
}
