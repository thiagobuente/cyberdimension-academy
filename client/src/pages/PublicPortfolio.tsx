import { Link, useRoute } from "wouter";
import { Award, ArrowLeft, FileText, FolderOpen, Image as ImageIcon, Linkedin, ShieldAlert, Rocket } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { buildLinkedInShareUrl } from "@/lib/linkedinShare";
import { activatedCatalogCourses, type ActivatedCatalogCourse } from "@shared/activatedCatalogCourses";
import { cyberProjects } from "@/data/cyberProjects";

const COURSE_TITLES: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const course of activatedCatalogCourses as readonly ActivatedCatalogCourse[]) {
    map[course.slug] = course.shortTitle || course.title;
  }
  map["ingles-tecnico-ciberseguranca"] = "Inglês Técnico para Cibersegurança";
  return map;
})();

export default function PublicPortfolio() {
  const [, params] = useRoute("/portfolio-publico/:token");
  const token = params?.token;
  const query = trpc.portfolioPublic.byToken.useQuery({ token: token ?? "" }, { enabled: Boolean(token) });
  const gallery = query.data;
  const projectsQuery = trpc.portfolioPublic.projectsByToken.useQuery({ token: token ?? "" }, { enabled: Boolean(token) });

  const shareGallery = () => {
    const url = window.location.href;
    void navigator.clipboard?.writeText(url);
    window.open(buildLinkedInShareUrl(url), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Início</Link>
          <Link href="/" className="font-orbitron text-xs font-bold tracking-[0.08em]">CYBERDIMENSION <span className="text-neon-cyan">ACADEMY</span></Link>
        </div>
      </header>
      <main className="container relative py-10 md:py-14">
        {query.isLoading ? (
          <p className="py-24 text-center text-sm text-muted-foreground">Verificando portfólio...</p>
        ) : !gallery ? (
          <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(0.12_0.045_260/0.96),oklch(0.075_0.025_270/0.96))] p-8 text-center md:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/30 bg-red-400/10"><ShieldAlert className="h-7 w-7 text-red-300" /></div>
            <p className="mt-5 text-xs font-bold tracking-[0.16em] text-red-300">PORTFÓLIO NÃO LOCALIZADO</p>
            <h1 className="mt-3 font-orbitron text-2xl font-bold">Galeria indisponível</h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">Este link não corresponde a um portfólio público ativo. O aluno pode ter desativado o compartilhamento ou o endereço estar incompleto.</p>
            <Link href="/catalog" className="orbit-button mt-8 inline-flex items-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-4 py-2.5 text-sm font-bold text-neon-cyan">Explorar formações</Link>
          </section>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(0.13_0.05_260/0.96),oklch(0.08_0.025_270/0.93))] p-6 md:p-10">
              <div className="absolute -right-10 -top-16 h-60 w-60 rounded-full bg-neon-cyan/15 blur-3xl" />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-neon-cyan"><FolderOpen className="h-4 w-4" /> PORTFÓLIO PÚBLICO</p>
                  <div className="mt-4 flex items-center gap-4">
                    {gallery.avatarUrl ? (
                      <img src={gallery.avatarUrl} alt={`Foto de perfil de ${gallery.userName}`} className="h-16 w-16 rounded-full border border-neon-cyan/40 object-cover" />
                    ) : (
                      <div className="grid h-16 w-16 place-items-center rounded-full border border-neon-cyan/40 bg-neon-cyan/10"><FolderOpen className="h-7 w-7 text-neon-cyan" /></div>
                    )}
                    <h1 className="font-orbitron text-2xl font-bold md:text-4xl">{gallery.userName}</h1>
                  </div>
                  <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Evidências práticas de laboratórios de cibersegurança documentadas e verificadas pela CyberDimension Academy.</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <button onClick={shareGallery} className="orbit-button inline-flex items-center gap-2 rounded-lg border border-[#0A66C2]/45 bg-[#0A66C2]/15 px-4 py-2.5 text-sm font-bold text-[#7db7f3]"><Linkedin className="h-4 w-4" /> Compartilhar no LinkedIn</button>
                </div>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="font-orbitron text-lg font-bold">Evidências de laboratórios</h2>
              <p className="mt-1 text-sm text-muted-foreground">{gallery.evidence.length} {gallery.evidence.length === 1 ? "evidência anexada" : "evidências anexadas"} aos laboratórios concluídos.</p>
              {gallery.evidence.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-8 text-center text-sm text-muted-foreground">O portfólio deste aluno ainda não contém evidências públicas.</div>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {gallery.evidence.map((item) => {
                    const isPdf = item.mimeType === "application/pdf";
                    return (
                      <article key={item.id} className="group flex flex-col rounded-2xl border border-neon-cyan/25 bg-black/15 p-4">
                        {isPdf ? (
                          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="grid h-32 place-items-center rounded-xl border border-white/10 bg-neon-cyan/5 transition-colors group-hover:border-neon-cyan/40">
                            <FileText className="h-10 w-10 text-neon-cyan" />
                          </a>
                        ) : (
                          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="grid h-32 place-items-center overflow-hidden rounded-xl border border-white/10 bg-neon-cyan/5 transition-colors group-hover:border-neon-cyan/40">
                            <img src={item.fileUrl} alt={item.title} className="max-h-32 max-w-full object-contain" />
                          </a>
                        )}
                        <h3 className="mt-3 text-sm font-bold leading-5">{item.title}</h3>
                        {item.description ? <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p> : null}
                        <p className="mt-2 text-[0.65rem] font-bold tracking-[0.1em] text-neon-cyan">{(COURSE_TITLES[item.courseSlug] ?? item.courseSlug).toUpperCase()} · LAB {item.labIndex + 1}</p>
                        <p className="mt-0.5 text-[0.65rem] text-muted-foreground">Anexado em {new Date(item.createdAt).toLocaleDateString("pt-BR")}</p>
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="orbit-button mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground">
                          {isPdf ? <FileText className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />} Abrir evidência
                        </a>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {(projectsQuery.data ?? []).length > 0 ? (
              <section className="mt-8">
                <h2 className="font-orbitron text-lg font-bold">Projetos Cyber Projects concluídos</h2>
                <p className="mt-1 text-sm text-muted-foreground">Projetos práticos entregues pela aluna dentro do programa de consolidação da CyberDimension.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {(projectsQuery.data ?? []).map((completion) => {
                    const project = cyberProjects.find((candidate) => candidate.id === completion.projectId);
                    return (
                      <article key={completion.id} className="flex flex-col rounded-2xl border border-neon-cyan/25 bg-black/15 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-cyan/35 bg-neon-cyan/10"><Rocket className="h-6 w-6 text-neon-cyan" /></div>
                        <p className="mt-3 text-[10px] font-bold tracking-[0.14em] text-neon-cyan">{project ? project.area.toUpperCase() : "PROJETO"}</p>
                        <h3 className="mt-1 text-sm font-bold">{project?.title ?? completion.projectId}</h3>
                        {project ? <p className="mt-0.5 text-[0.65rem] font-bold tracking-[0.08em] text-muted-foreground">{project.level.toUpperCase()}</p> : null}
                        {completion.summary ? <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground">{completion.summary}</p> : null}
                        <p className="mt-2 text-[0.65rem] text-muted-foreground">Concluído em {new Date(completion.completedAt).toLocaleDateString("pt-BR")}</p>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {gallery.badges.length > 0 ? (
              <section className="mt-8">
                <h2 className="font-orbitron text-lg font-bold">Certificados emitidos</h2>
                <p className="mt-1 text-sm text-muted-foreground">Credenciais verificáveis emitidas pela Academia.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {gallery.badges.map((badge) => (
                    <article key={badge.id} className="flex flex-col rounded-2xl border border-neon-green/25 bg-black/15 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon-green/35 bg-neon-green/10"><Award className="h-6 w-6 text-neon-green" /></div>
                      <p className="mt-3 text-[10px] font-bold tracking-[0.14em] text-neon-green">CERTIFICADO</p>
                      <h3 className="mt-1 text-sm font-bold">{badge.courseTitle}</h3>
                      <p className="mt-0.5 text-[0.65rem] text-muted-foreground">Aluno: {badge.studentName}</p>
                      <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{badge.identifier} · {new Date(badge.issuedAt).toLocaleDateString("pt-BR")}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
