import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Search, ShieldCheck, XCircle } from "lucide-react";

export default function CertificateVerify() {
  const [identifier, setIdentifier] = useState(() => new URLSearchParams(window.location.search).get("identifier") || "");
  const [submittedIdentifier, setSubmittedIdentifier] = useState(() => new URLSearchParams(window.location.search).get("identifier") || "");
  const verificationQuery = trpc.certificates.verify.useQuery({ identifier: submittedIdentifier });
  const certificate = verificationQuery.data;

  useEffect(() => {
    const sharedIdentifier = new URLSearchParams(window.location.search).get("identifier")?.trim() || "";
    if (sharedIdentifier && sharedIdentifier !== submittedIdentifier) {
      setIdentifier(sharedIdentifier);
      setSubmittedIdentifier(sharedIdentifier);
    }
  }, [submittedIdentifier]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = identifier.trim();
    if (normalized) setSubmittedIdentifier(normalized);
  };

  return (
    <div className="min-h-screen space-canvas text-foreground"><div className="pointer-events-none fixed inset-0 space-grid opacity-50" />
      <header className="relative z-10 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.8)] backdrop-blur-xl"><div className="container flex min-h-18 items-center justify-between gap-4 py-3"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-neon-cyan"><ArrowLeft className="h-4 w-4" /> Início</Link><span className="font-orbitron text-xs font-bold tracking-[0.08em]">CYBERDIMENSION <span className="text-neon-cyan">ACADEMY</span></span></div></header>
      <main className="container relative py-10 md:py-16"><section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[linear-gradient(135deg,oklch(0.12_0.04_260/0.96),oklch(0.08_0.025_260/0.92))] p-6 md:p-10"><div className="text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10"><ShieldCheck className="h-7 w-7 text-neon-cyan" /></span><p className="mt-5 text-xs font-bold tracking-[0.18em] text-neon-cyan">VERIFICAÇÃO PÚBLICA</p><h1 className="mt-3 font-orbitron text-2xl font-bold md:text-4xl">Validar certificado</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Informe o identificador exibido no certificado para confirmar sua autenticidade, titular e data de emissão.</p></div>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="certificate-id">Identificador do certificado</label><input id="certificate-id" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="Ex.: CDA-FUNDAMENTOS-TI-U12-..." className="h-12 flex-1 rounded-xl border border-white/12 bg-black/20 px-4 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-neon-cyan/60" /><button type="submit" disabled={!identifier.trim()} className="orbit-button inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-neon-cyan px-5 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:opacity-50"><Search className="h-4 w-4" /> Verificar</button></form>
        {submittedIdentifier && <section className="mt-7">{verificationQuery.isLoading ? <div className="rounded-2xl border border-white/10 bg-black/15 p-6 text-center text-sm text-muted-foreground">Consultando certificado...</div> : certificate ? <div className="rounded-2xl border border-neon-green/30 bg-neon-green/[0.07] p-6"><div className="flex gap-3"><BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-neon-green" /><div><p className="font-orbitron text-lg font-bold text-neon-green">Certificado válido</p><p className="mt-1 text-sm text-muted-foreground">Este registro foi emitido pela CyberDimension Academy.</p></div></div><div className="mt-5 grid gap-3 border-t border-neon-green/15 pt-5 sm:grid-cols-2"><div><p className="text-xs font-bold tracking-[0.12em] text-muted-foreground">TITULAR</p><p className="mt-1 font-bold">{certificate.studentName}</p></div><div><p className="text-xs font-bold tracking-[0.12em] text-muted-foreground">FORMAÇÃO</p><p className="mt-1 font-bold">{certificate.courseTitle}</p></div><div><p className="text-xs font-bold tracking-[0.12em] text-muted-foreground">EMISSÃO</p><p className="mt-1 font-bold">{new Date(certificate.issuedAt).toLocaleDateString("pt-BR")}</p></div><div><p className="text-xs font-bold tracking-[0.12em] text-muted-foreground">IDENTIFICADOR</p><p className="mt-1 break-all font-mono text-xs text-neon-cyan">{certificate.identifier}</p></div></div></div> : <div className="rounded-2xl border border-red-400/25 bg-red-400/[0.06] p-6 text-center"><XCircle className="mx-auto h-7 w-7 text-red-300" /><p className="mt-3 font-orbitron text-base font-bold">Certificado não localizado</p><p className="mt-2 text-sm text-muted-foreground">Revise o identificador informado e tente novamente.</p></div>}</section>}
      </section></main>
    </div>
  );
}
