import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Award, BadgeCheck, CalendarDays, CheckCircle2, Download, Linkedin, ShieldCheck } from "lucide-react";
import { buildCertificateVerificationUrl } from "@/lib/linkedinShare";

type CertificateDocumentProps = {
  studentName: string;
  courseTitle: string;
  issuedAt: Date | string | number;
  identifier: string;
  variant?: "course" | "domain";
  onLinkedIn?: () => void;
  onUpdateName?: () => void;
  updateNamePending?: boolean;
};

export default function CertificateDocument({ studentName, courseTitle, issuedAt, identifier, variant = "course", onLinkedIn, onUpdateName, updateNamePending = false }: CertificateDocumentProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const verificationUrl = buildCertificateVerificationUrl(window.location.origin, identifier);
  const issuedDate = new Date(issuedAt).toLocaleDateString("pt-BR");

  useEffect(() => {
    let active = true;
    void QRCode.toDataURL(verificationUrl, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: "H",
      color: { dark: "#d9f7ff", light: "#091426" },
    }).then((dataUrl) => { if (active) setQrCode(dataUrl); }).catch(() => { if (active) setQrCode(""); });
    return () => { active = false; };
  }, [verificationUrl]);

  return <div className="certificate-page-shell min-h-screen space-canvas text-foreground">
    <div className="certificate-actions relative z-10 border-b border-white/8 bg-[oklch(0.075_0.025_260/0.9)] backdrop-blur-xl"><div className="container flex flex-wrap items-center justify-between gap-3 py-3"><a href="/profile" className="text-sm font-bold text-muted-foreground hover:text-neon-cyan">← Perfil</a><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={onUpdateName} disabled={!onUpdateName || updateNamePending} className="inline-flex items-center gap-1.5 rounded-lg border border-neon-purple/25 px-3 py-2 text-xs font-bold text-neon-purple hover:bg-neon-purple/10 disabled:opacity-50"><Award className="h-3.5 w-3.5" /> {updateNamePending ? "Atualizando..." : "Atualizar meu nome"}</button><button type="button" onClick={onLinkedIn} disabled={!onLinkedIn} className="inline-flex items-center gap-1.5 rounded-lg border border-neon-cyan/25 px-3 py-2 text-xs font-bold text-neon-cyan hover:bg-neon-cyan/10 disabled:opacity-50"><Linkedin className="h-3.5 w-3.5" /> Publicar no LinkedIn</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-lg border border-neon-green/25 px-3 py-2 text-xs font-bold text-neon-green hover:bg-neon-green/10"><Download className="h-3.5 w-3.5" /> Baixar PDF</button><a href={`/verify-certificate?identifier=${encodeURIComponent(identifier)}`} className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground sm:inline-flex">Verificar certificado</a></div></div></div>
    <main className="certificate-stage container relative flex justify-center py-8 md:py-12">
      <article className="certificate-document relative w-full max-w-[794px] overflow-hidden border border-neon-cyan/70 bg-[linear-gradient(135deg,#071322_0%,#09182a_48%,#050b16_100%)] shadow-[0_0_70px_oklch(0.85_0.2_195/0.15)]">
        <div className="certificate-corner certificate-corner-tl" /><div className="certificate-corner certificate-corner-tr" /><div className="certificate-corner certificate-corner-bl" /><div className="certificate-corner certificate-corner-br" />
        <div className="certificate-inner relative m-3 flex min-h-[1040px] flex-col border border-neon-cyan/25 p-7 md:m-5 md:p-12">
          <div className="certificate-stars" aria-hidden="true" /><div className="relative text-center"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-neon-cyan/45 bg-neon-cyan/10 shadow-[0_0_35px_oklch(0.85_0.2_195/0.15)]"><ShieldCheck className="h-11 w-11 text-neon-cyan" /></div><p className="mt-5 text-xs font-black tracking-[0.28em] text-foreground">CYBERDIMENSION</p><p className="mt-1 text-sm font-black tracking-[0.35em] text-neon-cyan">ACADEMY</p><div className="mx-auto mt-8 flex items-center justify-center gap-4 text-neon-cyan"><span className="h-px w-14 bg-neon-cyan/50" /><span className="h-2 w-2 rounded-full bg-neon-cyan" /><span className="h-px w-14 bg-neon-cyan/50" /></div><h1 className="mt-7 text-5xl font-black tracking-[0.08em] text-foreground md:text-7xl">CERTIFICADO</h1><p className="mt-3 text-lg font-bold tracking-[0.36em] text-neon-cyan md:text-2xl">DE CONCLUSÃO</p><p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted-foreground">Este certificado reconhece a conclusão integral da formação.</p></div>
          <div className="certificate-course-banner relative mt-8 border border-neon-cyan/45 bg-neon-cyan/[0.06] px-5 py-5 text-center"><p className="text-[0.65rem] font-black tracking-[0.24em] text-muted-foreground">FORMAÇÃO CONCLUÍDA</p><h2 className="mt-2 text-xl font-black text-neon-cyan md:text-3xl">{courseTitle}</h2><div className="mx-auto mt-3 h-px max-w-md bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" /></div>
          <div className="relative mt-9 text-center"><p className="text-xs font-black tracking-[0.3em] text-muted-foreground">CONFERIDO A</p><p className="mt-3 break-words text-3xl font-black tracking-tight text-foreground md:text-5xl">{studentName || "Aluno"}</p><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">por concluir todos os módulos de estudo e laboratórios guiados da formação, registrando uma etapa relevante de sua trajetória em tecnologia e segurança.</p></div>
          <div className="relative mt-9 grid gap-3 border border-white/15 bg-black/15 p-4 sm:grid-cols-2"><div className="flex items-center gap-3 border-b border-white/10 pb-3 sm:border-b-0 sm:border-r sm:pb-0"><CalendarDays className="h-8 w-8 shrink-0 text-neon-cyan" /><div><p className="text-[0.65rem] font-black tracking-[0.16em] text-muted-foreground">DATA DE EMISSÃO</p><p className="mt-1 font-bold text-neon-cyan">{issuedDate}</p></div></div><div className="flex items-center gap-3 pt-1 sm:pl-4 sm:pt-0"><BadgeCheck className="h-8 w-8 shrink-0 text-neon-green" /><div className="min-w-0"><p className="text-[0.65rem] font-black tracking-[0.16em] text-muted-foreground">IDENTIFICADOR PÚBLICO</p><p className="mt-1 break-all font-mono text-xs font-bold text-neon-cyan">{identifier}</p></div></div></div>
          <div className="relative mt-7 flex flex-col items-center justify-between gap-6 sm:flex-row"><div className="max-w-sm text-center sm:text-left"><p className="flex items-center justify-center gap-2 text-sm font-bold text-foreground sm:justify-start"><CheckCircle2 className="h-4 w-4 text-neon-cyan" /> CERTIFICADO VERIFICÁVEL</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Verifique a autenticidade em <span className="break-all text-neon-cyan">{verificationUrl}</span></p></div>{qrCode ? <img src={qrCode} alt="QR Code para verificar a autenticidade do certificado" className="h-28 w-28 border-4 border-[#091426] object-contain" /> : <div className="grid h-28 w-28 place-items-center border border-neon-cyan/25 text-center text-[0.65rem] text-muted-foreground">Gerando QR Code...</div>}</div>
          <div className="relative mt-auto pt-9 text-center"><div className="mx-auto h-px w-44 bg-neon-cyan/50" /><p className="mt-3 text-xl italic text-foreground">Thiago Buente</p><p className="mt-1 text-[0.65rem] font-black tracking-[0.18em] text-neon-cyan">FOUNDER & CYBERSECURITY SPECIALIST</p><p className="mt-1 text-[0.65rem] text-muted-foreground">CyberDimension Academy</p></div>
          <div className="relative mt-8 flex items-center justify-center gap-3 border-t border-white/10 pt-5 text-[0.65rem] font-black tracking-[0.25em] text-muted-foreground"><span>APRENDA</span><span className="text-neon-cyan">•</span><span>PRATIQUE</span><span className="text-neon-cyan">•</span><span>EVOLUA</span><span className="text-neon-cyan">•</span><span>IMPACTE</span></div>
        </div>
      </article>
    </main>
    <style>{`@media print { @page { size: A4 portrait; margin: 0; } .certificate-actions { display: none !important; } .certificate-page-shell { min-height: auto !important; background: #071322 !important; } .certificate-stage { display: block !important; padding: 0 !important; } .certificate-document { width: 210mm !important; min-height: 297mm !important; max-width: none !important; border-width: 0.4mm !important; box-shadow: none !important; print-color-adjust: exact; -webkit-print-color-adjust: exact; } .certificate-inner { min-height: 286mm !important; margin: 3mm !important; padding: 12mm !important; } } @media (max-width: 640px) { .certificate-document { min-width: 0; } .certificate-inner { min-height: 920px; padding: 1.35rem; } }`}</style>
  </div>;
}
