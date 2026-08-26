import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Fragment, useState } from "react";
import { trpc } from "@/lib/trpc";
import { buildAdminUserRowKey } from "@/lib/adminRowKeys";
import { Shield, Users, Trophy, BookOpen, BarChart3, ArrowLeft, Eye, ExternalLink, PlusCircle, Radio, Headphones, ClipboardList, FolderOpen, FileText, Image as ImageIcon, Trash2, Loader2, Search, Filter, AlertCircle, RefreshCw } from "lucide-react";

const initialExternalSource = {
  courseSlug: "",
  category: "YouTube" as const,
  title: "",
  source: "",
  license: "",
  usage: "",
  href: "",
};

function AdminStatValue({ value, isLoading }: { value: number | undefined; isLoading: boolean }) {
  return isLoading ? <span className="inline-block h-9 w-20 animate-pulse rounded-md bg-white/10" aria-label="Carregando indicador" /> : <>{value ?? 0}</>;
}

function AdminDataBanner({ errorMessages, isLoading, onRetry }: { errorMessages: string[]; isLoading: boolean; onRetry: () => void }) {
  if (errorMessages.length > 0) {
    return <div role="alert" className="mb-6 flex flex-col gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" /><div><p className="font-semibold">Não foi possível carregar todos os dados administrativos.</p><p className="mt-1 text-red-100/75">{errorMessages[0]}</p><p className="mt-1 text-xs text-red-100/60">As informações podem estar incompletas. Tente novamente antes de tomar uma decisão de moderação.</p></div></div><button type="button" onClick={onRetry} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200/30 px-3 py-2 text-xs font-semibold text-red-100 hover:bg-red-100/10"><RefreshCw className="h-3.5 w-3.5" /> Tentar novamente</button></div>;
  }
  if (isLoading) return <div className="mb-6 flex items-center gap-3 rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.06] p-4 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin text-neon-cyan" /> Sincronizando indicadores e relatórios administrativos…</div>;
  return null;
}

function AdminProjectReviewTab({ entries, isLoading, errorMessage, onReview }: { entries: Array<{ id: number; userName: string | null; userEmail: string | null; projectId: string; summary: string | null; status: string; completedAt: Date }>; isLoading: boolean; errorMessage: string | null; onReview: (id: number, status: "in_review" | "needs_changes" | "approved") => void }) {
  if (isLoading) return <div className="rounded-xl border border-border bg-card/30 p-6 text-sm text-muted-foreground"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Carregando entregas PMSEC…</div>;
  if (errorMessage) return <div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-5 text-sm text-red-100">Não foi possível carregar os projetos: {errorMessage}</div>;
  if (entries.length === 0) return <div className="rounded-xl border border-border bg-card/30 p-6 text-sm text-muted-foreground">Nenhum projeto final foi enviado ainda.</div>;
  return <div className="space-y-4">{entries.map((entry) => <article key={entry.id} className="rounded-xl border border-border bg-card/30 p-5"><div className="flex flex-col justify-between gap-3 md:flex-row md:items-start"><div><p className="text-xs font-bold tracking-[0.12em] text-[oklch(0.85_0.2_195)]">PMSEC-01 · {entry.status.toUpperCase()}</p><h3 className="mt-1 font-semibold">{entry.userName || entry.userEmail}</h3><p className="text-xs text-muted-foreground">Enviado em {new Date(entry.completedAt).toLocaleString("pt-BR")}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => onReview(entry.id, "in_review")} className="rounded-lg border border-blue-300/30 px-3 py-2 text-xs font-bold text-blue-200">Em revisão</button><button type="button" onClick={() => onReview(entry.id, "needs_changes")} className="rounded-lg border border-amber-300/30 px-3 py-2 text-xs font-bold text-amber-200">Solicitar ajustes</button><button type="button" onClick={() => onReview(entry.id, "approved")} className="rounded-lg border border-neon-green/30 px-3 py-2 text-xs font-bold text-neon-green">Aprovar</button></div></div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{entry.summary || "Sem resumo informado."}</p><p className="mt-3 text-xs text-muted-foreground">A rubrica pode ser consultada no registro do projeto; a revisão administrativa não cria nota acadêmica automaticamente.</p></article>)}</div>;
}

export default function Admin() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/admin/acesso" });

  const statsQuery = trpc.admin.stats.useQuery();
  const usersQuery = trpc.admin.users.useQuery();
  const certsQuery = trpc.admin.certificates.useQuery();
  const sourcesQuery = trpc.admin.externalSources.useQuery();
  const podcastListeningQuery = trpc.admin.podcastListening.useQuery();
  const [adminTab, setAdminTab] = useState<"progresso" | "podcast" | "portfolios" | "projetos">("progresso");
  const [portfolioFilter, setPortfolioFilter] = useState<{ search: string; courseSlug: string }>({ search: "", courseSlug: "" });
  const portfolioQuery = trpc.admin.portfolioEvidence.useQuery(portfolioFilter.search || portfolioFilter.courseSlug ? portfolioFilter : undefined, { enabled: adminTab === "portfolios" });
  const portfolioCourseSlugsQuery = trpc.admin.portfolioCourseSlugs.useQuery(undefined, { enabled: adminTab === "portfolios" });
  const projectReviewsQuery = trpc.admin.projectReviews.useQuery(undefined, { enabled: adminTab === "projetos" });
  const utils = trpc.useUtils();
  const adminQueries = [statsQuery, usersQuery, certsQuery, sourcesQuery, podcastListeningQuery];
  const adminIsLoading = adminQueries.some((query) => query.isLoading);
  const adminErrors = adminQueries.map((query) => query.error?.message).filter((message): message is string => Boolean(message));
  const retryAdminData = () => { void Promise.all(adminQueries.map((query) => query.refetch())); };
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [sourceForm, setSourceForm] = useState(initialExternalSource);
  const reviewProject = trpc.admin.reviewProject.useMutation({ onSuccess: async () => { await projectReviewsQuery.refetch(); } });
  const removePortfolioEvidence = trpc.admin.removePortfolioEvidence.useMutation({
    onSuccess: async () => { await utils.admin.portfolioEvidence.invalidate(); },
  });
  const createSource = trpc.admin.createExternalSource.useMutation({
    onSuccess: async () => {
      setSourceForm(initialExternalSource);
      await utils.admin.externalSources.invalidate();
    },
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Acesso negado. Apenas administradores podem acessar esta página.</p>
      </div>
    );
  }

  const handleToggleUser = (userId: number) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white" style={{ width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.2 }} />
      ))}

      <header className="relative z-10 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <span className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
              <span className="font-bold font-[Orbitron] text-sm">
                Cyber<span className="text-[oklch(0.65_0.25_280)]">Dimension</span> Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/users">
              <span className="text-sm text-[oklch(0.85_0.2_195)] hover:underline">Usuários</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 container py-8">
        <h1 className="text-2xl font-bold font-[Orbitron] mb-6">Painel Administrativo</h1>
        <AdminDataBanner errorMessages={adminErrors} isLoading={adminIsLoading} onRetry={retryAdminData} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
              <span className="text-sm text-muted-foreground">Usuários</span>
            </div>
            <p className="text-3xl font-bold"><AdminStatValue value={statsQuery.data?.totalUsers} isLoading={statsQuery.isLoading} /></p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-[oklch(0.65_0.25_280)]" />
              <span className="text-sm text-muted-foreground">Certificados</span>
            </div>
            <p className="text-3xl font-bold"><AdminStatValue value={statsQuery.data?.totalCertificates} isLoading={statsQuery.isLoading} /></p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-[oklch(0.78_0.2_150)]" />
              <span className="text-sm text-muted-foreground">Simulados</span>
            </div>
            <p className="text-3xl font-bold"><AdminStatValue value={statsQuery.data?.totalQuizAttempts} isLoading={statsQuery.isLoading} /></p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
              <span className="text-sm text-muted-foreground">Domínios</span>
            </div>
            <p className="text-3xl font-bold"><AdminStatValue value={statsQuery.data?.totalDomains} isLoading={statsQuery.isLoading} /></p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-[oklch(0.78_0.2_150)]" />
              <span className="text-sm text-muted-foreground">Lições</span>
            </div>
            <p className="text-3xl font-bold"><AdminStatValue value={statsQuery.data?.totalLessons} isLoading={statsQuery.isLoading} /></p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setAdminTab("progresso")} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${adminTab === "progresso" ? "border-[oklch(0.85_0.2_195/0.5)] bg-[oklch(0.85_0.2_195/0.15)] text-foreground" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}><Users className="w-4 h-4" />Usuários e Progresso</button>
          <button onClick={() => setAdminTab("podcast")} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${adminTab === "podcast" ? "border-[oklch(0.85_0.2_195/0.5)] bg-[oklch(0.85_0.2_195/0.15)] text-foreground" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}><Radio className="w-4 h-4" />Podcast CyberCast</button>
          <button onClick={() => setAdminTab("portfolios")} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${adminTab === "portfolios" ? "border-[oklch(0.85_0.2_195/0.5)] bg-[oklch(0.85_0.2_195/0.15)] text-foreground" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}><FolderOpen className="w-4 h-4" />Portfólios</button>
          <button onClick={() => setAdminTab("projetos")} className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${adminTab === "projetos" ? "border-blue-300/50 bg-blue-300/15 text-foreground" : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"}`}><ClipboardList className="w-4 h-4" />Projetos PMSEC</button>
        </div>

        {adminTab === "projetos" ? (
          <AdminProjectReviewTab entries={projectReviewsQuery.data ?? []} isLoading={projectReviewsQuery.isLoading} errorMessage={projectReviewsQuery.error?.message ?? null} onReview={(id, status) => { void reviewProject.mutateAsync({ id, status, rubric: { escopo: 0, risco: 0, controles: 0, governanca: 0, metricas: 0 }, reviewerComment: status === "approved" ? "Entrega revisada e aprovada." : status === "needs_changes" ? "Revise as evidências e reenvie o projeto." : undefined }); }} />
        ) : adminTab === "podcast" ? (
          <AdminPodcastTab listeners={podcastListeningQuery.data?.listeners ?? null} isLoading={podcastListeningQuery.isLoading} errorMessage={podcastListeningQuery.error?.message ?? null} />
        ) : adminTab === "portfolios" ? (
          <AdminPortfolioTab
            filter={portfolioFilter}
            setFilter={setPortfolioFilter}
            courseSlugs={portfolioCourseSlugsQuery.data ?? null}
            entries={portfolioQuery.data ?? null}
            isLoading={portfolioQuery.isLoading}
            onRemove={(itemId, itemTitle) => {
              if (!window.confirm(`Remover a evidência "${itemTitle}"? A ação não pode ser desfeita.`)) return;
              void removePortfolioEvidence.mutateAsync({ itemId });
            }}
          />
        ) : (
          <>
        {/* Users with Progress */}
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
          Usuários e Progresso
        </h2>
        <div className="rounded-xl border border-border bg-card/30 overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Nome</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Email</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Role</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Último Login</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.isLoading ? [1, 2, 3, 4].map((row) => <tr key={`user-loading-${row}`}><td colSpan={5} className="p-4"><div className="h-5 animate-pulse rounded bg-white/10" aria-label="Carregando usuário" /></td></tr>) : usersQuery.error ? <tr><td colSpan={5} className="p-4 text-sm text-red-200" role="alert">Não foi possível carregar os usuários: {usersQuery.error.message}</td></tr> : usersQuery.data?.slice(0, 20).map((u) => (
                <Fragment key={buildAdminUserRowKey(u.id)}>
                  <tr className="border-b border-border/30 hover:bg-[oklch(0.85_0.2_195/0.05)]">
                    <td className="p-3 text-sm">{u.name || "—"}</td>
                    <td className="p-3 text-sm text-muted-foreground">{u.email || "—"}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.role === "admin" ? "bg-[oklch(0.65_0.25_280/0.2)] text-[oklch(0.65_0.25_280)]" : "bg-[oklch(0.85_0.2_195/0.1)] text-[oklch(0.85_0.2_195)]"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(u.lastSignedIn).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleUser(u.id)}
                        className="flex items-center gap-1 text-xs text-[oklch(0.85_0.2_195)] hover:underline"
                      >
                        <Eye className="w-3 h-3" />
                        {expandedUser === u.id ? "Ocultar" : "Progresso"}
                      </button>
                    </td>
                  </tr>
                  {expandedUser === u.id && (
                    <tr className="border-b border-border/30 bg-[oklch(0.85_0.2_195/0.03)]">
                      <td colSpan={5} className="p-4">
                        <ProgressDetail userId={u.id} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Certificates */}
        <h2 className="text-lg font-bold mb-4">Certificados Recentes</h2>
        <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Aluno</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Módulo</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">ID</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {certsQuery.isLoading ? [1, 2, 3].map((row) => <tr key={`certificate-loading-${row}`}><td colSpan={4} className="p-4"><div className="h-5 animate-pulse rounded bg-white/10" aria-label="Carregando certificado" /></td></tr>) : certsQuery.error ? <tr><td colSpan={4} className="p-4 text-sm text-red-200" role="alert">Não foi possível carregar os certificados: {certsQuery.error.message}</td></tr> : certsQuery.data?.slice(0, 10).map((c) => (
                <tr key={c.id} className="border-b border-border/30 hover:bg-[oklch(0.85_0.2_195/0.05)]">
                  <td className="p-3 text-sm">{c.userName}</td>
                  <td className="p-3 text-sm text-muted-foreground">{c.domainTitle}</td>
                  <td className="p-3 text-xs font-mono text-[oklch(0.85_0.2_195)]">{c.identifier}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(c.issuedAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-8" aria-labelledby="external-sources-title">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-4">
            <div>
              <h2 id="external-sources-title" className="text-lg font-bold flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
                Registro de Fontes Externas
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Cadastre origem, licença e finalidade pedagógica antes de associar uma referência à escola.</p>
            </div>
            <Link href="/politica-de-conteudo">
              <span className="text-sm text-[oklch(0.85_0.2_195)] hover:underline">Consultar política editorial</span>
            </Link>
          </div>

          <form
            className="rounded-xl border border-[oklch(0.85_0.2_195/0.3)] bg-card/30 p-5 mb-5"
            onSubmit={(event) => {
              event.preventDefault();
              createSource.mutate(sourceForm);
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">Título da referência</span>
                <input required minLength={3} value={sourceForm.title} onChange={(event) => setSourceForm({ ...sourceForm, title: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2" placeholder="Ex.: Introdução a segurança em cloud" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">Tipo de material</span>
                <select value={sourceForm.category} onChange={(event) => setSourceForm({ ...sourceForm, category: event.target.value as typeof sourceForm.category })} className="rounded-md border border-border bg-background px-3 py-2">
                  <option>YouTube</option><option>Documentação</option><option>Curso externo</option><option>Artigo</option><option>CTF</option><option>Ferramenta</option><option>Podcast</option><option>Outro</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">Fonte / autor</span>
                <input required minLength={2} value={sourceForm.source} onChange={(event) => setSourceForm({ ...sourceForm, source: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2" placeholder="Canal, organização ou autor" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">Licença ou termo de uso</span>
                <input required minLength={3} value={sourceForm.license} onChange={(event) => setSourceForm({ ...sourceForm, license: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2" placeholder="Conforme disponibilizada pelo autor" />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">URL pública</span>
                <input required type="url" value={sourceForm.href} onChange={(event) => setSourceForm({ ...sourceForm, href: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2" placeholder="https://..." />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-muted-foreground">Slug do curso (opcional)</span>
                <input value={sourceForm.courseSlug} onChange={(event) => setSourceForm({ ...sourceForm, courseSlug: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2" placeholder="seguranca-iot" />
              </label>
              <label className="grid gap-1.5 text-sm md:col-span-2">
                <span className="text-muted-foreground">Finalidade de uso na escola</span>
                <textarea required minLength={12} value={sourceForm.usage} onChange={(event) => setSourceForm({ ...sourceForm, usage: event.target.value })} className="min-h-24 rounded-md border border-border bg-background px-3 py-2 resize-y" placeholder="Ex.: vídeo incorporado como referência complementar a uma aula autoral; não substitui material, laboratório ou avaliação próprios." />
              </label>
            </div>
            {createSource.error && <p className="mt-3 text-sm text-destructive">Não foi possível registrar a fonte: {createSource.error.message}</p>}
            <button type="submit" disabled={createSource.isPending} className="mt-4 inline-flex items-center gap-2 rounded-md bg-[oklch(0.85_0.2_195)] px-4 py-2 text-sm font-semibold text-[oklch(0.18_0.03_260)] disabled:opacity-60">
              <PlusCircle className="w-4 h-4" />
              {createSource.isPending ? "Registrando..." : "Registrar fonte externa"}
            </button>
          </form>

          <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 text-sm text-muted-foreground">Fontes registradas pela administração</div>
            {sourcesQuery.isLoading ? <div className="space-y-2 p-4">{[1, 2, 3].map((row) => <div key={`source-loading-${row}`} className="h-14 animate-pulse rounded-lg bg-white/10" aria-label="Carregando fonte externa" />)}</div> : sourcesQuery.error ? <div role="alert" className="p-4 text-sm text-red-200">Não foi possível carregar as fontes externas: {sourcesQuery.error.message}</div> : sourcesQuery.data?.length ? (
              <div className="divide-y divide-border/40">
                {sourcesQuery.data.map((entry) => (
                  <div key={entry.id} className="p-4 grid gap-1 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="text-sm font-semibold">{entry.title} <span className="text-xs font-normal text-[oklch(0.85_0.2_195)]">· {entry.category}</span></p>
                      <p className="text-xs text-muted-foreground mt-1">Fonte: {entry.source} · Licença: {entry.license}</p>
                      <p className="text-xs text-muted-foreground mt-1">Uso: {entry.usage}</p>
                    </div>
                    <a href={entry.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-[oklch(0.85_0.2_195)] hover:underline">
                      Abrir <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : <p className="p-4 text-sm text-muted-foreground">Nenhuma fonte externa registrada manualmente.</p>}
          </div>
        </section>
          </>
        )}
      </main>
    </div>
  );
}

interface PodcastListenerEntry {
  userId: number;
  name: string | null;
  email: string | null;
  completedEpisodes: number;
  quizAttempts: number;
  quizPercentage: number | null;
  podcastXp: number;
  lastActivityAt: Date;
}

interface AdminPodcastTabProps {
  listeners: PodcastListenerEntry[] | null;
  isLoading: boolean;
  errorMessage: string | null;
}

function AdminPodcastTab({ listeners, isLoading, errorMessage }: AdminPodcastTabProps) {
  if (isLoading) {
    return (
      <section aria-labelledby="podcast-listening-title">
        <h2 id="podcast-listening-title" className="text-lg font-bold mb-1 flex items-center gap-2">
          <Headphones className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
          Relatório de Escuta do CyberCast
        </h2>
        <p className="text-sm text-muted-foreground mb-4 inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-[oklch(0.85_0.2_195)]" /> Carregando dados de escuta…</p><div className="grid gap-2">{[1, 2, 3].map((row) => <div key={row} className="h-14 animate-pulse rounded-xl border border-border/50 bg-card/30" />)}</div>
      </section>
    );
  }

  if (errorMessage) {
    return <section role="alert" aria-labelledby="podcast-listening-title"><h2 id="podcast-listening-title" className="text-lg font-bold mb-2 flex items-center gap-2"><Headphones className="w-5 h-5 text-red-300" /> Relatório de Escuta do CyberCast</h2><div className="rounded-xl border border-red-400/30 bg-red-400/10 p-5 text-sm text-red-100"><p className="font-semibold">Não foi possível carregar o relatório de escuta.</p><p className="mt-1 text-red-100/75">{errorMessage}</p><p className="mt-2 text-xs text-red-100/60">Use o botão de tentativa novamente no topo do painel.</p></div></section>;
  }

  const entries = listeners ?? [];
  const totalCompleted = entries.reduce((total, entry) => total + entry.completedEpisodes, 0);
  const totalQuizzes = entries.reduce((total, entry) => total + entry.quizAttempts, 0);
  const totalXp = entries.reduce((total, entry) => total + entry.podcastXp, 0);

  return (
    <section aria-labelledby="podcast-listening-title">
      <h2 id="podcast-listening-title" className="text-lg font-bold mb-1 flex items-center gap-2">
        <Headphones className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
        Relatório de Escuta do CyberCast
      </h2>
      <p className="text-sm text-muted-foreground mb-4">Progresso real de cada ouvinte na série CyberCast Security+: episódios concluídos, quizzes de revisão, XP acumulado e última atividade.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2"><Headphones className="w-5 h-5 text-[oklch(0.85_0.2_195)]" /><span className="text-sm text-muted-foreground">Ouvintes ativos</span></div>
          <p className="text-3xl font-bold">{entries.length}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2"><Trophy className="w-5 h-5 text-[oklch(0.78_0.2_150)]" /><span className="text-sm text-muted-foreground">Episódios concluídos</span></div>
          <p className="text-3xl font-bold">{totalCompleted}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2"><ClipboardList className="w-5 h-5 text-[oklch(0.65_0.25_280)]" /><span className="text-sm text-muted-foreground">Quizzes de revisão</span></div>
          <p className="text-3xl font-bold">{totalQuizzes}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2"><BarChart3 className="w-5 h-5 text-[oklch(0.85_0.2_195)]" /><span className="text-sm text-muted-foreground">XP total do podcast</span></div>
          <p className="text-3xl font-bold">{totalXp}</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/30 p-6"><p className="text-sm text-muted-foreground">Nenhum aluno concluiu episódios do CyberCast ainda. O relatório aparecerá aqui assim que houver atividade de escuta.</p></div>
      ) : (
        <div className="rounded-xl border border-border bg-card/30 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Ouvinte</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Episódios concluídos</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Quizzes</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Aproveitamento</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">XP do Podcast</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Última atividade</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.userId} className="border-b border-border/30 hover:bg-[oklch(0.85_0.2_195/0.05)]">
                  <td className="p-3">
                    <p className="text-sm font-medium">{entry.name || "Ouvinte"}</p>
                    {entry.email ? <p className="text-xs text-muted-foreground truncate max-w-56">{entry.email}</p> : null}
                  </td>
                  <td className="p-3 text-sm">{entry.completedEpisodes} / 60</td>
                  <td className="p-3 text-sm text-muted-foreground">{entry.quizAttempts}</td>
                  <td className="p-3 text-sm text-muted-foreground">{entry.quizPercentage !== null ? `${entry.quizPercentage}%` : "—"}</td>
                  <td className="p-3"><span className="text-sm font-semibold text-[oklch(0.78_0.2_150)]">{entry.podcastXp} XP</span></td>
                  <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(entry.lastActivityAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ProgressDetail({ userId }: { userId: number }) {
  const domain1 = trpc.admin.userProgress.useQuery({ userId, domainId: 1 });
  const domain2 = trpc.admin.userProgress.useQuery({ userId, domainId: 2 });
  const domain3 = trpc.admin.userProgress.useQuery({ userId, domainId: 3 });
  const domain4 = trpc.admin.userProgress.useQuery({ userId, domainId: 4 });
  const domain5 = trpc.admin.userProgress.useQuery({ userId, domainId: 5 });

  const allData = [domain1, domain2, domain3, domain4, domain5];
  const domainNames = [
    "General Security Concepts",
    "Threats & Vulnerabilities",
    "Security Architecture",
    "Security Operations",
    "Program Management",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      {allData.map((query, i) => (
        <div key={i} className="p-3 rounded-lg bg-background/50 border border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-1 truncate">{domainNames[i]}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[oklch(0.85_0.2_195)]">{query.data?.completed || 0}/{query.data?.total || 0}</span>
            <span className="text-[oklch(0.78_0.2_150)]">{query.data?.bestScore || 0}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[oklch(0.85_0.2_195/0.1)] overflow-hidden mt-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[oklch(0.85_0.2_195)] to-[oklch(0.65_0.25_280)]"
              style={{ width: `${query.data?.total ? Math.round((query.data.completed / query.data.total) * 100) : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

type AdminPortfolioTabProps = {
  filter: { search: string; courseSlug: string };
  setFilter: (filter: { search: string; courseSlug: string }) => void;
  courseSlugs: Array<{ courseSlug: string; title: string }> | null;
  entries: Array<{
    id: number;
    userId: number;
    userName: string | null;
    userEmail: string | null;
    courseSlug: string;
    labIndex: number;
    title: string;
    description: string | null;
    fileUrl: string;
    fileKey: string | null;
    mimeType: string | null;
    createdAt: Date;
  }> | null;
  isLoading: boolean;
  onRemove: (itemId: number, itemTitle: string) => void;
};

function AdminPortfolioTab({ filter, setFilter, courseSlugs, entries, isLoading, onRemove }: AdminPortfolioTabProps) {
  const uniqueStudents = new Set((entries ?? []).map((entry) => entry.userId));
  const recentEntries = (entries ?? []).slice(0, 50);
  return (
    <section aria-labelledby="portfolio-moderation-title">
      <h2 id="portfolio-moderation-title" className="text-lg font-bold mb-1 flex items-center gap-2">
        <FolderOpen className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
        Moderação de Evidências de Laboratórios
      </h2>
      <p className="text-sm text-muted-foreground mb-4">Todas as evidências anexadas pelos alunos nos laboratórios concluídos. Revise o conteúdo e remova anexos que violem as diretrizes da Academia.</p>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-56 max-w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={filter.search}
            onChange={(event) => setFilter({ ...filter, search: event.target.value })}
            placeholder="Buscar por nome ou e-mail do aluno..."
            className="w-full rounded-lg border border-border/60 bg-input px-9 py-2 text-sm placeholder:text-muted-foreground/70 focus:border-[oklch(0.85_0.2_195/0.6)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.85_0.2_195/0.4)]"
            aria-label="Buscar evidências por nome ou e-mail do aluno"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            value={filter.courseSlug}
            onChange={(event) => setFilter({ ...filter, courseSlug: event.target.value })}
            className="appearance-none rounded-lg border border-border/60 bg-input pl-9 pr-9 py-2 text-sm focus:border-[oklch(0.85_0.2_195/0.6)] focus:outline-none focus:ring-1 focus:ring-[oklch(0.85_0.2_195/0.4)]"
            aria-label="Filtrar evidências por curso"
          >
            <option value="">Todos os cursos</option>
            {(courseSlugs ?? []).map((course) => (
              <option key={course.courseSlug} value={course.courseSlug}>{course.title}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2"><FolderOpen className="w-5 h-5 text-[oklch(0.85_0.2_195)]" /><span className="text-sm text-muted-foreground">Evidências anexadas</span></div>
          <p className="text-3xl font-bold">{entries?.length ?? 0}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2"><Users className="w-5 h-5 text-[oklch(0.78_0.2_150)]" /><span className="text-sm text-muted-foreground">Alunos com portfólio</span></div>
          <p className="text-3xl font-bold">{uniqueStudents.size}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2"><ImageIcon className="w-5 h-5 text-[oklch(0.65_0.25_280)]" /><span className="text-sm text-muted-foreground">Imagens · PDFs</span></div>
          <p className="text-3xl font-bold">{(entries ?? []).filter((entry) => (entry.mimeType ?? "").startsWith("image/")).length} · {(entries ?? []).filter((entry) => entry.mimeType === "application/pdf").length}</p>
        </div>
      </div>
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card/30 p-6 text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Carregando evidências...</div>
      ) : entries === null || entries.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/30 p-6"><p className="text-sm text-muted-foreground">Nenhum aluno anexou evidências aos laboratórios ainda. O painel de moderação aparecerá aqui assim que houver anexos.</p></div>
      ) : (
        <div className="rounded-xl border border-border bg-card/30 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Aluno</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Evidência</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Laboratório</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Arquivo</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-medium">Anexado em</th>
                <th className="text-right p-3 text-xs text-muted-foreground font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry) => {
                const isPdf = entry.mimeType === "application/pdf";
                return (
                  <tr key={entry.id} className="border-b border-border/30 hover:bg-[oklch(0.85_0.2_195/0.05)]">
                    <td className="p-3">
                      <p className="text-sm font-medium">{entry.userName || "Ouvinte"}</p>
                      {entry.userEmail ? <p className="text-xs text-muted-foreground truncate max-w-56">{entry.userEmail}</p> : null}
                    </td>
                    <td className="p-3 max-w-52">
                      <p className="text-sm font-medium truncate">{entry.title}</p>
                      {entry.description ? <p className="text-xs text-muted-foreground line-clamp-2">{entry.description}</p> : null}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{entry.courseSlug.toUpperCase()} · LAB {entry.labIndex + 1}</td>
                    <td className="p-3">
                      <a href={entry.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[oklch(0.85_0.2_195)] hover:underline">
                        {isPdf ? <FileText className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />} Abrir
                      </a>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(entry.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onRemove(entry.id, entry.title)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/30 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:border-red-400/55 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remover
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {entries.length > 50 ? <p className="p-3 text-xs text-muted-foreground">Exibindo as 50 evidências mais recentes de {entries.length} no total.</p> : null}
        </div>
      )}
    </section>
  );
}
