import { trpc } from "@/lib/trpc";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const login = trpc.auth.login.useMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await login.mutateAsync({ email, password });
      await utils.auth.me.invalidate();
      setLocation("/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível validar as credenciais administrativas.");
    }
  };

  return (
    <div className="min-h-screen space-canvas text-foreground">
      <div className="pointer-events-none fixed inset-0 space-grid opacity-55" />
      <header className="relative z-10 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.75)] backdrop-blur-xl">
        <div className="container flex items-center justify-between py-4"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Voltar ao site</Link><span className="font-orbitron text-xs font-bold tracking-[0.08em]">CYBERDIMENSION <span className="text-neon-purple">ADMIN</span></span></div>
      </header>
      <main className="container relative grid min-h-[calc(100vh-4.5rem)] place-items-center py-10">
        <section className="module-card w-full max-w-md rounded-3xl p-7 md:p-10">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-neon-purple/30 bg-neon-purple/10"><ShieldCheck className="h-5 w-5 text-neon-purple" /></span>
          <p className="mt-5 text-xs font-bold tracking-[0.16em] text-neon-purple">ÁREA RESTRITA</p>
          <h1 className="mt-2 font-orbitron text-2xl font-bold">Acesso administrativo</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">Este acesso é exclusivo para administração e utiliza credenciais protegidas. Alunos entram somente pelo link enviado ao e-mail.</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block text-sm font-bold">E-mail<input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-neon-purple/60 focus:ring-2 focus:ring-neon-purple/15" placeholder="admin@exemplo.com" /></label>
            <label className="block text-sm font-bold">Senha<input type="password" required minLength={10} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-neon-purple/60 focus:ring-2 focus:ring-neon-purple/15" placeholder="••••••••••" /></label>
            {error && <p className="rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}
            <button disabled={login.isPending} className="orbit-button inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-purple to-[oklch(0.68_0.2_245)] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"><LockKeyhole className="h-4 w-4" /> {login.isPending ? "Verificando..." : "Entrar como administrador"}</button>
          </form>
        </section>
      </main>
    </div>
  );
}
