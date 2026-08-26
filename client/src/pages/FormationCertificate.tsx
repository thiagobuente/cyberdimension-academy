import { trpc } from "@/lib/trpc";
import { useParams } from "wouter";
import { useEffect } from "react";
import CertificateDocument from "@/components/CertificateDocument";
import { openLinkedInCertificateShare } from "@/lib/shareCertificate";
import { toast } from "sonner";

export default function FormationCertificate() {
  const { id } = useParams<{ id: string }>();
  const certificateId = Number.parseInt(id || "0", 10);
  const certificateQuery = trpc.certificates.courseById.useQuery({ id: certificateId }, { enabled: certificateId > 0 });
  const certificate = certificateQuery.data;
  const refreshNameMutation = trpc.certificatesRefreshName.useMutation({
    onSuccess: () => { toast.success("Nome atualizado no certificado. Recarregue a página para ver o novo nome."); void certificateQuery.refetch(); },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Erro ao atualizar o nome."),
  });

  useEffect(() => {
    if (!certificate || new URLSearchParams(window.location.search).get("download") !== "1") return;
    const timer = window.setTimeout(() => window.print(), 450);
    return () => window.clearTimeout(timer);
  }, [certificate]);

  if (!certificateId || certificateQuery.isLoading) return <div className="grid min-h-screen place-items-center space-canvas text-foreground"><p className="animate-pulse text-sm text-muted-foreground">Carregando certificado...</p></div>;
  if (!certificate) return <div className="grid min-h-screen place-items-center space-canvas px-5 text-center text-foreground"><div><h1 className="text-xl font-bold">Certificado não encontrado</h1><a href="/verify-certificate" className="mt-4 inline-block text-sm font-bold text-neon-cyan hover:underline">Verificar outro identificador</a></div></div>;

  return <CertificateDocument studentName={certificate.studentName} courseTitle={certificate.courseTitle} issuedAt={certificate.issuedAt} identifier={certificate.identifier} onUpdateName={() => refreshNameMutation.mutate()} updateNamePending={refreshNameMutation.isPending} onLinkedIn={() => { openLinkedInCertificateShare(certificate.identifier, `a formação ${certificate.courseTitle}`); toast.success("O texto da postagem foi copiado. Cole na aba do LinkedIn que abriu para publicar."); }} />;
}
