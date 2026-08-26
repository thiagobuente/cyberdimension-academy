import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import PwaInstallCta from "@/components/PwaInstallCta";
import { trpc } from "@/lib/trpc";
import { starterCourses } from "@/data/courseCatalog";
import {
  ArrowUpRight,
  BookOpen,
  Brain,
  Compass,
  ChevronRight,
  CirclePlay,
  Cpu,
  GraduationCap,
  Headphones,
  Layers3,
  Linkedin,
  MessageSquare,
  Network,
  Radio,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Terminal,
  Trophy,
  Flag,
} from "lucide-react";

const domains = [
  { code: "01", title: "General Security Concepts", weight: "12%", accent: "text-neon-cyan", dot: "bg-neon-cyan" },
  { code: "02", title: "Threats & Vulnerabilities", weight: "22%", accent: "text-neon-purple", dot: "bg-neon-purple" },
  { code: "03", title: "Security Architecture", weight: "18%", accent: "text-neon-green", dot: "bg-neon-green" },
  { code: "04", title: "Security Operations", weight: "28%", accent: "text-neon-cyan", dot: "bg-neon-cyan" },
  { code: "05", title: "Program Management", weight: "20%", accent: "text-neon-purple", dot: "bg-neon-purple" },
];

const catalogIconMap = { cpu: Cpu, shield: Shield, network: Network, terminal: Terminal };
const catalogAccentMap = {
  cyan: { text: "text-neon-cyan", border: "border-neon-cyan/25", surface: "bg-neon-cyan/10" },
  purple: { text: "text-neon-purple", border: "border-neon-purple/25", surface: "bg-neon-purple/10" },
  green: { text: "text-neon-green", border: "border-neon-green/25", surface: "bg-neon-green/10" },
  blue: { text: "text-blue-300", border: "border-blue-300/25", surface: "bg-blue-300/10" },
};

const learningPath = [
  { code: "01", title: "Fundamentos de TI", short: "Base técnica", slug: "fundamentos-ti", description: "Computação, sistemas e conectividade para começar com contexto.", color: "cyan" },
  { code: "02", title: "Fundamentos de Cyber Security", short: "Pensamento seguro", slug: "fundamentos-cyber-security", description: "Ativos, risco, controles, identidade e defesa como linguagem de trabalho.", color: "purple" },
  { code: "03", title: "Redes para Cyber Security", short: "Dados em movimento", slug: "redes-para-cyber-security", description: "Segmentação, protocolos e troubleshooting para proteger a infraestrutura.", color: "green" },
  { code: "04", title: "Linux para Operações de Segurança", short: "Operação prática", slug: "linux-para-operacoes-de-seguranca", description: "Terminal, serviços, logs e hardening para a rotina de defesa.", color: "blue" },
  { code: "05", title: "CompTIA Security+ SY0-701", short: "Missão de certificação", slug: undefined, description: "Cinco domínios, simulados e IA Tutor para consolidar a certificação.", color: "cyan" },
] as const;

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: stats } = trpc.content.stats.useQuery();
  const primaryHref = isAuthenticated ? "/dashboard" : "/login";
  const [activePathIndex, setActivePathIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activePath = learningPath[activePathIndex];

  return (
    <div className="min-h-screen space-canvas cosmic-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-80" />
      <div className="pointer-events-none fixed inset-0 constellation-field opacity-60" />

      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.78)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3" aria-label="CyberDimension Academy — Início">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-neon-cyan/40 bg-neon-cyan/10 shadow-[0_0_24px_oklch(0.85_0.2_195/0.17)]"><Shield className="h-5 w-5 text-neon-cyan" /></span>
            <span className="leading-none"><span className="block font-orbitron text-[0.82rem] font-bold tracking-[0.04em] sm:text-sm">CYBERDIMENSION</span><span className="mt-1 block text-[0.65rem] font-semibold tracking-[0.22em] text-neon-cyan">ACADEMY</span></span>
          </Link>

          <nav className="hidden items-center justify-end gap-x-5 whitespace-nowrap py-1 text-sm font-semibold text-muted-foreground xl:flex" aria-label="Navegação principal">
            <div className="group relative">
              <button type="button" className="inline-flex items-center gap-1 transition-colors hover:text-neon-cyan" aria-haspopup="true" aria-expanded={mobileOpen} onFocus={() => setMobileOpen((v) => v)} onBlur={() => setMobileOpen(false)} onMouseEnter={() => setMobileOpen(true)} onMouseLeave={() => setMobileOpen(false)}><span>APRENDER</span><ChevronRight className={`h-3 w-3 transition-transform ${mobileOpen ? "rotate-90" : ""}`} /></button>
              <div className={`absolute right-0 top-full z-40 mt-1 w-52 overflow-hidden rounded-lg border border-white/12 bg-[oklch(0.1_0.025_260)] shadow-xl transition-opacity ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <Link onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-cyan" href="/catalog"><Layers3 className="h-4 w-4" /> Catálogo</Link>
                <a onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-cyan" href="#trilha-zero"><Compass className="h-4 w-4" /> Trilha do zero</a>
                <a onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-cyan" href="#metodo"><BookOpen className="h-4 w-4" /> Método</a>
                <Link onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-cyan" href="/materiais"><Shield className="h-4 w-4" /> Materiais</Link>
              </div>
            </div>
            <div className="group relative">
              <button type="button" className="inline-flex items-center gap-1 transition-colors hover:text-neon-cyan" aria-haspopup="true" aria-expanded={mobileOpen} onFocus={() => setMobileOpen((v) => v)} onBlur={() => setMobileOpen(false)} onMouseEnter={() => setMobileOpen(true)} onMouseLeave={() => setMobileOpen(false)}><span>CARREIRA</span><ChevronRight className={`h-3 w-3 transition-transform ${mobileOpen ? "rotate-90" : ""}`} /></button>
              <div className={`absolute right-0 top-full z-40 mt-1 w-52 overflow-hidden rounded-lg border border-white/12 bg-[oklch(0.1_0.025_260)] shadow-xl transition-opacity ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <Link onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-cyan" href="/carreira"><Compass className="h-4 w-4" /> Teste vocacional</Link>
                <Link onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-cyan" href="/cyber-projects"><Rocket className="h-4 w-4" /> Projetos</Link>
                <Link onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-cyan" href="/ctfs"><Flag className="h-4 w-4" /> CTFs</Link>
              </div>
            </div>
            <div className="group relative">
              <button type="button" className="inline-flex items-center gap-1 transition-colors hover:text-neon-cyan" aria-haspopup="true" aria-expanded={mobileOpen} onFocus={() => setMobileOpen((v) => v)} onBlur={() => setMobileOpen(false)} onMouseEnter={() => setMobileOpen(true)} onMouseLeave={() => setMobileOpen(false)}><span>CONTEÚDO</span><ChevronRight className={`h-3 w-3 transition-transform ${mobileOpen ? "rotate-90" : ""}`} /></button>
              <div className={`absolute right-0 top-full z-40 mt-1 w-52 overflow-hidden rounded-lg border border-white/12 bg-[oklch(0.1_0.025_260)] shadow-xl transition-opacity ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                <Link onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-cyan" href="/podcast"><Headphones className="h-4 w-4" /> Podcast</Link>
                <Link onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-cyan" href="/cursos-gratuitos"><CirclePlay className="h-4 w-4" /> Cursos em vídeo</Link>
              </div>
            </div>
            <Link className="inline-flex items-center gap-1 transition-colors hover:text-neon-cyan" href="/tutor"><MessageSquare className="h-3.5 w-3.5" /> IA Tutor</Link>
          </nav>

          <Link href={primaryHref} className="orbit-button hidden items-center gap-2 rounded-lg bg-neon-cyan px-4 py-2 text-sm font-bold text-[oklch(0.1_0.02_260)] hover:opacity-90 sm:inline-flex">
            {isAuthenticated ? "Abrir painel" : "Entrar"}<ChevronRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            className="xl:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6 text-neon-cyan" /> : <Menu className="h-6 w-6 text-neon-cyan" />}
          </button>
        </div>
        {mobileOpen && (
          <nav className="container flex flex-col gap-1 border-t border-white/8 py-4 xl:hidden" aria-label="Navegação principal">
            <p className="px-3 pb-1 pt-1 text-[0.68rem] font-bold tracking-[0.18em] text-muted-foreground">APRENDER</p>
            <Link onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="/catalog">Catálogo</Link>
            <a onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="#trilha-zero">Trilha do zero</a>
            <a onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="#metodo">Método</a>
            <Link onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="/materiais">Materiais</Link>
            <p className="px-3 pb-1 pt-2 text-[0.68rem] font-bold tracking-[0.18em] text-muted-foreground">CARREIRA</p>
            <Link onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="/carreira">Teste vocacional</Link>
            <Link onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="/cyber-projects">Projetos</Link>
            <Link onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="/ctfs">CTFs</Link>
            <p className="px-3 pb-1 pt-2 text-[0.68rem] font-bold tracking-[0.18em] text-muted-foreground">CONTEÚDO</p>
            <Link onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="/podcast">Podcast</Link>
            <Link onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="/cursos-gratuitos">Cursos em vídeo</Link>
            <Link onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="/tutor">IA Tutor</Link>
            <a onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold hover:bg-white/5 hover:text-neon-cyan" href="#desenvolvedor">Sobre</a>
            <Link onClick={() => setMobileOpen(false)} className="orbit-button mt-3 inline-flex items-center justify-center gap-2 rounded-lg bg-neon-cyan px-4 py-2.5 text-sm font-bold text-[oklch(0.1_0.02_260)]" href={primaryHref}>
              {isAuthenticated ? "Abrir painel" : "Entrar"}<ChevronRight className="h-4 w-4" />
            </Link>
          </nav>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden pb-16 pt-14 md:pb-20 md:pt-20">
          <div className="container relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs font-bold tracking-[0.12em] text-muted-foreground">ESCOLA ONLINE · GRATUITA · EM PORTUGUÊS</div>
              <h1 className="font-orbitron text-[2.5rem] font-black leading-[1.1] tracking-[-0.02em] sm:text-5xl lg:text-[3.4rem]">Aprenda Cybersecurity.<br /><span className="text-neon-cyan">Construa sua carreira.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Do zero ao Security+, com módulos estruturados, laboratórios, simulados com explicações, podcasts e apoio de uma IA Tutor. Certificados ao concluir cada formação.</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href={primaryHref} className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg bg-neon-cyan px-6 py-3 font-bold text-[oklch(0.1_0.02_260)] hover:opacity-90"><Rocket className="h-4.5 w-4.5" /> Começar minha jornada</Link>
                <Link href="/catalog" className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-6 py-3 font-semibold text-foreground hover:border-neon-cyan/40 hover:text-neon-cyan">Explorar academias <ChevronRight className="h-4 w-4" /></Link>
              </div>

              <PwaInstallCta />

              <div className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-5">
                <div><p className="text-2xl font-bold text-foreground">{stats?.totalDomains ?? "—"}</p><p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">domínios</p></div>
                <div><p className="text-2xl font-bold text-foreground">{stats?.totalLessons ?? "—"}</p><p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">lições</p></div>
                <div><p className="text-2xl font-bold text-foreground">{stats?.totalQuestions ?? "—"}</p><p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">questões</p></div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-xl lg:max-w-none">
              <div className="module-card relative overflow-hidden rounded-xl p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-muted-foreground"><span className="h-2 w-2 rounded-full bg-neon-green" /> TRILHA ADAPTÁVEL</p><h2 className="mt-3 font-orbitron text-xl font-bold">Do zero ao Security+</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Uma rota clara entre teoria, prática, progresso e certificação.</p></div><div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/12 bg-white/[0.04]"><Target className="h-4.5 w-4.5 text-neon-cyan" /></div></div>
                <div className="relative mt-6 space-y-2.5">{[["01", "Conteúdo guiado por objetivo"], ["02", "Prática com explicações"], ["03", "Apoio da IA Tutor"]].map(([number, label]) => <div key={number} className="flex items-center gap-4 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5"><span className="font-orbitron text-xs font-bold text-neon-cyan">{number}</span><span className="text-sm font-medium text-muted-foreground">{label}</span></div>)}</div>
                <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><GraduationCap className="h-4 w-4 text-neon-green" /> Certificados por domínio</div><Link href={primaryHref} className="inline-flex items-center gap-1 text-sm font-semibold text-neon-cyan hover:underline">Explorar <ChevronRight className="h-4 w-4" /></Link></div>
              </div>
            </div>
          </div>
        </section>

        <section id="metodo" className="border-y border-white/8 bg-black/10 py-16 md:py-20">
          <div className="container"><div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"><div><p className="text-xs font-bold tracking-[0.18em] text-neon-green">MÉTODO DE ESTUDO</p><h2 className="mt-3 font-orbitron text-3xl font-bold leading-tight md:text-4xl">A preparação certa começa com um mapa claro.</h2><p className="mt-5 max-w-md text-lg leading-7 text-muted-foreground">Cada recurso foi organizado para alternar entendimento, revisão ativa e prática de tomada de decisão.</p></div><div className="grid gap-4 sm:grid-cols-3">{[{ icon: Layers3, title: "Estude", desc: "Lições em sequência, com conceitos, comparações e pontos de revisão.", color: "text-neon-cyan", border: "border-neon-cyan/20" }, { icon: CirclePlay, title: "Pratique", desc: "Questões de treino com gabarito e explicação após a tentativa.", color: "text-neon-purple", border: "border-neon-purple/20" }, { icon: Brain, title: "Consolide", desc: "Converse com a IA Tutor quando precisar destravar um conceito.", color: "text-neon-green", border: "border-neon-green/20" }].map((item) => <article key={item.title} className={`module-card rounded-2xl border p-5 ${item.border}`}><item.icon className={`h-6 w-6 ${item.color}`} /><h3 className="mt-7 font-orbitron text-lg font-bold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.desc}</p></article>)}</div></div></div>
        </section>

        <section id="catalogo" className="relative overflow-hidden py-16 md:py-24">
          <div className="container"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div className="max-w-2xl"><p className="text-xs font-bold tracking-[0.18em] text-neon-purple">FORMAÇÕES DE LANÇAMENTO</p><h2 className="mt-3 font-orbitron text-3xl font-bold leading-tight md:text-4xl">Sua base de segurança começa antes da certificação.</h2><p className="mt-4 text-base leading-7 text-muted-foreground">Quatro missões fundamentais para transformar curiosidade em capacidade técnica. Cada curso reúne módulos, laboratórios, avaliação e certificado digital.</p></div><Link href="/catalog" className="orbit-button inline-flex items-center gap-2 self-start rounded-xl border border-neon-purple/30 bg-neon-purple/10 px-4 py-3 text-sm font-bold text-neon-purple hover:bg-neon-purple/15 sm:self-auto">Explorar catálogo <ArrowUpRight className="h-4 w-4" /></Link></div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{starterCourses.map((course) => { const Icon = catalogIconMap[course.icon]; const accent = catalogAccentMap[course.accent]; return <Link key={course.slug} href={`/catalog/${course.slug}`} className={`module-card orbit-button group relative min-h-64 overflow-hidden rounded-2xl border p-5 ${accent.border} hover:-translate-y-1`}><div className={`absolute inset-x-0 top-0 h-px ${accent.surface}`} /><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl border ${accent.border} ${accent.surface}`}><Icon className={`h-5 w-5 ${accent.text}`} /></span><span className="font-orbitron text-[0.64rem] font-bold tracking-[0.14em] text-muted-foreground">{course.code}</span></div><p className={`mt-7 text-xs font-bold tracking-[0.14em] ${accent.text}`}>{course.level.toUpperCase()}</p><h3 className="mt-3 font-orbitron text-lg font-bold leading-6">{course.shortTitle}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{course.lessons} lições · {course.labs} laboratórios · {course.duration}</p><span className={`mt-6 inline-flex items-center gap-1 text-sm font-bold ${accent.text}`}>Ver detalhes <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></Link>; })}</div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-black/15 py-12 md:py-16">
          <div className="container grid items-center gap-6 md:grid-cols-[1.2fr_auto]">
            <div><p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-neon-cyan"><Compass className="h-4 w-4" /> ORIENTAÇÃO DE CARREIRA</p>
            <h2 className="mt-3 font-orbitron text-2xl font-bold leading-tight md:text-3xl">Não sabe por onde começar? <span className="text-neon-cyan">Descubra sua carreira.</span></h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">Um teste vocacional com situações reais da cibersegurança revela se o seu perfil combina mais com Blue Team & SOC, Red Team & Pentest, GRC, Cloud Security, Forense Digital ou Engenharia de Segurança — e sugere as trilhas certas da Academia para você, com +50 XP de recompensa.</p></div>
            <Link href="/carreira" className="orbit-button inline-flex shrink-0 items-center gap-2 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 px-5 py-3 text-sm font-bold text-neon-cyan hover:bg-neon-cyan/20">Fazer o teste <Compass className="h-4 w-4" /></Link>
          </div>
        </section>

        <section id="trilha-zero" className="border-y border-white/8 bg-black/10 py-16 md:py-24">
          <div className="container"><div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end"><div><p className="text-xs font-bold tracking-[0.18em] text-neon-green">ROTA INTERATIVA</p><h2 className="mt-3 font-orbitron text-3xl font-bold leading-tight md:text-4xl">Do zero ao Security+, passo a passo.</h2><p className="mt-5 max-w-md text-lg leading-7 text-muted-foreground">Escolha um ponto da rota para ver o propósito de cada formação. A sequência reduz lacunas e deixa você preparado para os cinco domínios do Security+.</p></div><div className="rounded-2xl border border-neon-cyan/20 bg-neon-cyan/[0.045] p-5 text-sm leading-6 text-muted-foreground"><span className="font-bold text-neon-cyan">Como usar a trilha:</span> comece na etapa que corresponde ao seu momento. Se já domina um tema, use a missão seguinte como diagnóstico e avance com os laboratórios.</div></div>
            <div className="mt-10 rounded-3xl border border-white/10 bg-[oklch(0.095_0.027_260/0.76)] p-4 sm:p-6 md:p-8"><div className="relative grid gap-3 md:grid-cols-5 md:gap-0"><div className="course-trajectory pointer-events-none absolute left-[9%] right-[9%] top-6 hidden md:block" />{learningPath.map((stage, index) => { const selected = index === activePathIndex; const stageColor = stage.color === "green" ? "text-neon-green" : stage.color === "purple" ? "text-neon-purple" : stage.color === "blue" ? "text-blue-300" : "text-neon-cyan"; const stageSurface = stage.color === "green" ? "border-neon-green/30 bg-neon-green/10" : stage.color === "purple" ? "border-neon-purple/30 bg-neon-purple/10" : stage.color === "blue" ? "border-blue-300/30 bg-blue-300/10" : "border-neon-cyan/30 bg-neon-cyan/10"; return <button key={stage.code} onClick={() => setActivePathIndex(index)} className="orbit-button relative z-10 flex items-center gap-3 rounded-xl p-3 text-left md:flex-col md:items-center md:text-center" aria-pressed={selected}><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border font-orbitron text-sm font-bold ${selected ? `${stageSurface} ${stageColor} shadow-[0_0_24px_oklch(0.85_0.2_195/0.17)]` : "border-white/15 bg-[oklch(0.11_0.03_260)] text-muted-foreground"}`}>{stage.code}</span><span><span className={`block text-xs font-bold md:mt-3 ${selected ? stageColor : "text-muted-foreground"}`}>{stage.short}</span><span className="mt-1 block text-[0.68rem] text-muted-foreground md:hidden">{stage.title}</span></span></button>; })}</div><div className="mt-6 grid gap-5 rounded-2xl border border-white/10 bg-black/20 p-5 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-xs font-bold tracking-[0.15em] text-neon-cyan">ETAPA {activePath.code} · {activePath.short.toUpperCase()}</p><h3 className="mt-2 font-orbitron text-2xl font-bold">{activePath.title}</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{activePath.description}</p></div><Link href={activePath.slug ? `/catalog/${activePath.slug}` : primaryHref} className="orbit-button inline-flex items-center justify-center gap-2 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-3 text-sm font-bold text-neon-cyan hover:bg-neon-cyan/15">{activePath.slug ? "Ver missão" : "Abrir Security+"}<ChevronRight className="h-4 w-4" /></Link></div></div>
          </div>
        </section>

        <section id="trilha" className="py-16 md:py-24">
          <div className="container"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs font-bold tracking-[0.18em] text-neon-cyan">MAPA DO EXAME</p><h2 className="mt-3 font-orbitron text-3xl font-bold md:text-4xl">Cinco domínios. Uma rota de evolução.</h2></div><Link href={primaryHref} className="inline-flex items-center gap-2 text-sm font-bold text-neon-cyan hover:underline">Abrir a trilha <ArrowUpRight className="h-4 w-4" /></Link></div><div className="mt-10 grid gap-3 lg:grid-cols-5">{domains.map((domain) => <article key={domain.code} className="module-card group min-h-48 rounded-2xl p-5"><div className="flex items-center justify-between"><span className={`font-orbitron text-sm font-bold ${domain.accent}`}>{domain.code}</span><span className={`h-2.5 w-2.5 rounded-full ${domain.dot}`} /></div><h3 className="mt-10 font-orbitron text-base font-bold leading-6">{domain.title}</h3><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-semibold"><span className="text-muted-foreground">peso no exame</span><span className={domain.accent}>{domain.weight}</span></div></article>)}</div></div>
        </section>

        <section id="desenvolvedor" className="pb-16 pt-2 md:pb-24">
          <div className="container"><div className="module-card rounded-xl p-6 md:p-8"><div className="relative grid items-center gap-6 md:grid-cols-[auto_1fr_auto]"><div className="grid h-20 w-20 place-items-center rounded-xl border border-white/12 bg-white/[0.04] font-orbitron text-2xl font-black text-neon-cyan">TB</div><div><p className="text-xs font-bold tracking-[0.18em] text-muted-foreground">SOBRE O DESENVOLVEDOR</p><h2 className="mt-3 font-orbitron text-2xl font-bold md:text-3xl">Thiago Buente</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Membro voluntário da CyberDimension. Esta plataforma foi concebida para tornar a jornada em segurança da informação mais clara, prática e acessível, conectando estudo estruturado, laboratórios e preparação para certificações.</p></div><a href="https://www.linkedin.com/in/thiagobuente" target="_blank" rel="noreferrer" className="orbit-button inline-flex items-center justify-center gap-2 rounded-lg border border-[#60a5fa]/35 bg-[#60a5fa]/10 px-5 py-3 text-sm font-bold text-blue-300 hover:bg-[#60a5fa]/15"><Linkedin className="h-4 w-4" /> LinkedIn <ArrowUpRight className="h-4 w-4" /></a></div></div></div>
        </section>

        <section className="pb-16 md:pb-24"><div className="container"><div className="relative overflow-hidden rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.04] px-6 py-10 md:px-12 md:py-14"><div className="relative max-w-2xl"><p className="text-xs font-bold tracking-[0.18em] text-neon-cyan">PRÓXIMO PASSO</p><h2 className="mt-3 font-orbitron text-3xl font-bold leading-tight md:text-4xl">Sua preparação para certificação pode começar hoje.</h2><p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">Entre para salvar seu progresso, estudar por domínio e emitir certificados ao concluir as etapas.</p><Link href={primaryHref} className="orbit-button mt-7 inline-flex items-center gap-2 rounded-lg bg-neon-cyan px-5 py-3 font-bold text-[oklch(0.1_0.02_260)] hover:opacity-90"><Trophy className="h-5 w-5" /> {isAuthenticated ? "Voltar ao painel" : "Criar minha jornada"}</Link></div></div></div></section>
      </main>

      <footer className="border-t border-white/8 bg-black/15 py-8"><div className="container flex flex-col justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center"><div className="flex items-center gap-2"><Shield className="h-4 w-4 text-neon-cyan" /> <span>CyberDimension Academy</span></div><p>Plataforma educacional para fundamentos de TI, Cyber Security e CompTIA Security+ SY0-701.</p><Link href="/verify-certificate" className="font-bold text-neon-cyan hover:underline">Verificar certificado</Link></div></footer>
    </div>
  );
}
