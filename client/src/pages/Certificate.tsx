import { useParams } from "wouter";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import CertificateDocument from "@/components/CertificateDocument";
import { openLinkedInCertificateShare } from "@/lib/shareCertificate";
import { buildCertificateVerificationUrl, buildLinkedInShareUrl } from "@/lib/linkedinShare";

function buildLinkedInUrl(identifier: string) {
  return buildLinkedInShareUrl(buildCertificateVerificationUrl(window.location.origin, identifier));
}

export default function Certificate() {
  const { id } = useParams<{ id: string }>();
  const certId = parseInt(id || "0", 10);
  const certQuery = trpc.certificates.byId.useQuery({ id: certId }, { enabled: certId > 0 });
  const cert = certQuery.data;

  useEffect(() => {
    if (!cert || new URLSearchParams(window.location.search).get("download") !== "1") return;
    const timer = window.setTimeout(() => window.print(), 450);
    return () => window.clearTimeout(timer);
  }, [cert]);

  if (certId === 0) return <div className="grid min-h-screen place-items-center space-canvas text-foreground"><p className="text-muted-foreground">Certificado não encontrado</p></div>;
  if (certQuery.isLoading) return <div className="grid min-h-screen place-items-center space-canvas text-foreground"><p className="animate-pulse text-sm text-muted-foreground">Carregando certificado...</p></div>;
  if (!cert) return <div className="grid min-h-screen place-items-center space-canvas text-foreground"><p className="text-muted-foreground">Certificado não encontrado</p></div>;

  const shareCertificate = () => {
    const identifier = cert.identifier;
    openLinkedInCertificateShare(identifier) ?? window.open(buildLinkedInUrl(identifier), "_blank", "noopener,noreferrer");
  };

  return <CertificateDocument variant="domain" studentName={cert.userName || "Aluno"} courseTitle={cert.domainTitle || "CompTIA Security+ SY0-701"} issuedAt={cert.issuedAt} identifier={cert.identifier} onLinkedIn={shareCertificate} />;
}
