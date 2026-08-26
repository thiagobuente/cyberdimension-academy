import { ExternalLink, FileCheck2, GraduationCap, Shield, Clock3, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { fgvProjectManagementCourses, fgvProjectManagementSource } from "@/data/fgvProjectManagement";

export default function FgvProjectManagement() {
  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Voltar ao catálogo</Link>
          <span className="font-orbitron text-xs font-bold tracking-[0.12em] text-muted-foreground">TRILHA COMPLEMENTAR</span>
        </div>
      </header>
      <main className="relative">
        <section className="border-b border-neon-cyan/15 py-14 md:py-18">
          <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-cyan"><GraduationCap className="h-4 w-4" /> GESTÃO DE PROJETOS</p>
              <h1 className="mt-5 max-w-3xl font-sans text-4xl font-bold leading-[1.12] sm:text-5xl">Amplie sua visão de segurança com fundamentos de projetos.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Uma seleção de sete cursos gratuitos da Fundação Getulio Vargas para complementar sua formação em planejamento, agilidade, metas e riscos.</p>
            </div>
            <div className="module-card rounded-3xl border border-neon-cyan/20 p-6">
              <div className="flex items-start gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10"><Shield className="h-5 w-5 text-neon-cyan" /></div><div><p className="text-xs font-bold tracking-[0.14em] text-neon-cyan">FONTE EXTERNA REGISTRADA</p><p className="mt-2 font-sans text-lg font-bold text-foreground">{fgvProjectManagementSource.institution}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{fgvProjectManagementSource.usage}</p></div></div>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-bold tracking-[0.18em] text-neon-green">ROTA SUGERIDA</p><h2 className="mt-3 font-sans text-2xl font-bold">Sete cursos para explorar no seu ritmo</h2></div><span className="text-sm font-bold text-neon-cyan">Acesso externo · gratuito conforme oferta da FGV</span></div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {fgvProjectManagementCourses.map((course, index) => <article key={course.id} className="module-card flex min-h-[17rem] flex-col rounded-2xl p-5"><div className="flex items-center justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 font-orbitron text-sm font-bold text-neon-cyan">{String(index + 1).padStart(2, "0")}</span><span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground"><Clock3 className="h-3.5 w-3.5 text-neon-cyan" /> {course.duration}</span></div><p className="mt-5 text-xs font-bold tracking-[0.14em] text-neon-purple">{course.topic.toUpperCase()}</p><h3 className="mt-2 font-sans text-lg font-semibold leading-snug text-foreground">{course.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Curso externo complementar da FGV, acessado diretamente na plataforma institucional.</p><a href={course.href} target="_blank" rel="noreferrer" className="orbit-button mt-auto inline-flex items-center justify-between gap-2 pt-5 text-sm font-bold text-neon-cyan">Acessar na FGV <ExternalLink className="h-4 w-4" /></a></article>)}
            </div>
          </div>
        </section>
        <section className="border-y border-white/8 bg-black/10 py-10"><div className="container"><div className="flex items-start gap-4"><FileCheck2 className="mt-1 h-5 w-5 shrink-0 text-neon-green" /><div><h2 className="font-sans text-lg font-bold">Transparência da certificação</h2><p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">A declaração de participação, a avaliação e eventual nota são administradas pela FGV segundo as regras publicadas por ela. A CyberDimension apenas organiza a referência e não emite declaração da FGV, não replica seu conteúdo e não transforma essa atividade externa em certificado próprio.</p><p className="mt-3 text-xs leading-5 text-muted-foreground"><strong className="text-neon-cyan">Licença:</strong> {fgvProjectManagementSource.license}.</p></div></div></div></section>
      </main>
    </div>
  );
}
