import { Link, useRoute } from "wouter";
import { ArrowLeft, BadgeCheck, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function BadgeVerify() {
  const [, params] = useRoute("/badge/:id");
  const badgeId = Number(params?.id);
  const isValidId = Number.isInteger(badgeId) && badgeId > 0;
  const verificationQuery = trpc.badges.verify.useQuery(
    { id: isValidId ? badgeId : 1 },
    { enabled: isValidId },
  );
  const badge = verificationQuery.data;

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-50" />
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.82)] backdrop-blur-xl">
        <div className="container flex min-h-18 items-center justify-between gap-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Início</Link>
          <Link href="/" className="font-orbitron text-xs font-bold tracking-[0.08em]">CYBERDIMENSION <span className="text-neon-cyan">ACADEMY</span></Link>
        </div>
      </header>
      <main className="container relative flex min-h-[calc(100vh-72px)] items-center justify-center py-10">
        <section className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(0.12_0.045_260/0.96),oklch(0.075_0.025_270/0.96))] p-6 text-center md:p-10">
          {verificationQuery.isLoading ? <p className="text-sm text-muted-foreground">Validando conquista...</p> : badge ? <><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-neon-purple/35 bg-neon-purple/15"><BadgeCheck className="h-7 w-7 text-neon-purple" /></div><p className="mt-5 text-xs font-bold tracking-[0.16em] text-neon-cyan">CONQUISTA VERIFICADA</p><h1 className="mt-3 font-orbitron text-2xl font-bold md:text-4xl">{badge.badgeTitle}</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">{badge.badgeDescription}</p><div className="mt-8 grid gap-4 text-left sm:grid-cols-3"><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-[10px] font-bold tracking-[0.13em] text-muted-foreground">ALUNO</p><p className="mt-2 text-sm font-bold">{badge.studentName}</p></div><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-[10px] font-bold tracking-[0.13em] text-muted-foreground">FORMAÇÃO</p><p className="mt-2 text-sm font-bold">{badge.courseTitle}</p></div><div className="rounded-xl border border-white/10 bg-black/15 p-4"><p className="text-[10px] font-bold tracking-[0.13em] text-muted-foreground">CONQUISTADO EM</p><p className="mt-2 text-sm font-bold">{new Date(badge.unlockedAt).toLocaleDateString("pt-BR")}</p></div></div><p className="mt-7 inline-flex items-center gap-2 text-xs font-bold tracking-[0.12em] text-neon-green"><ShieldCheck className="h-4 w-4" /> CREDENCIAL EMITIDA PELA CYBERDIMENSION ACADEMY</p></> : <><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/30 bg-red-400/10"><ShieldAlert className="h-7 w-7 text-red-300" /></div><p className="mt-5 text-xs font-bold tracking-[0.16em] text-red-300">CONQUISTA NÃO LOCALIZADA</p><h1 className="mt-3 font-orbitron text-2xl font-bold">Badge indisponível</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Este link não corresponde a uma conquista pública da CyberDimension Academy.</p></>}
          <Link href="/catalog" className="orbit-button mt-8 inline-flex items-center gap-2 rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 px-4 py-2.5 text-sm font-bold text-neon-cyan"><Sparkles className="h-4 w-4" /> Explorar formações</Link>
        </section>
      </main>
    </div>
  );
}
