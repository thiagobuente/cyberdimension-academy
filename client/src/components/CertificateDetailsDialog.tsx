import { useEffect, useState } from "react";
import { Award, CheckCircle2, X } from "lucide-react";
import { isValidCertificateDisplayName, normalizeCertificateDisplayName } from "@/lib/certificateDetails";

type CertificateDetailsDialogProps = {
  open: boolean;
  defaultName: string;
  courseTitle: string;
  submitting?: boolean;
  onClose: () => void;
  onConfirm: (displayName: string) => void;
};

export function CertificateDetailsDialog({
  open,
  defaultName,
  courseTitle,
  submitting = false,
  onClose,
  onConfirm,
}: CertificateDetailsDialogProps) {
  const [displayName, setDisplayName] = useState(defaultName);

  useEffect(() => {
    if (open) setDisplayName(defaultName);
  }, [defaultName, open]);

  if (!open) return null;

  const normalizedName = normalizeCertificateDisplayName(displayName);
  const valid = isValidCertificateDisplayName(displayName);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="certificate-details-title">
      <div className="w-full max-w-lg rounded-2xl border border-neon-cyan/30 bg-[oklch(0.09_0.03_260)] p-6 shadow-[0_0_60px_oklch(0.85_0.2_195/0.16)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-neon-green/30 bg-neon-green/10"><Award className="h-5 w-5 text-neon-green" /></span>
            <div><p className="text-xs font-bold tracking-[0.16em] text-neon-green">ÚLTIMA ETAPA</p><h2 id="certificate-details-title" className="mt-1 font-orbitron text-lg font-bold">Confirme os dados do certificado</h2></div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground" aria-label="Fechar formulário"><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">O nome abaixo será exibido no certificado de <strong className="text-foreground">{courseTitle}</strong> e ficará associado ao seu perfil para a verificação pública.</p>
        <form className="mt-5 space-y-4" onSubmit={(event) => { event.preventDefault(); if (valid && !submitting) onConfirm(normalizedName); }}>
          <div><label htmlFor="certificate-display-name" className="text-xs font-bold tracking-[0.12em] text-muted-foreground">NOME COMPLETO NO CERTIFICADO</label><input id="certificate-display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={120} autoFocus className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-black/25 px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-neon-cyan/70" placeholder="Ex.: Ana Beatriz da Silva" /><p className="mt-2 text-xs text-muted-foreground">Use o nome que deseja apresentar publicamente. Mínimo de 2 caracteres.</p></div>
          <div className="flex items-start gap-2 rounded-xl border border-neon-cyan/20 bg-neon-cyan/[0.06] p-3 text-xs leading-5 text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan" />O certificado incluirá seu nome, a formação, a data de emissão e um identificador verificável.</div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} disabled={submitting} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-white/10">Voltar</button><button type="submit" disabled={!valid || submitting} className="rounded-xl bg-neon-green px-4 py-3 text-sm font-bold text-[oklch(0.1_0.02_260)] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Emitindo certificado..." : "Confirmar e emitir certificado"}</button></div>
        </form>
      </div>
    </div>
  );
}

export default CertificateDetailsDialog;
