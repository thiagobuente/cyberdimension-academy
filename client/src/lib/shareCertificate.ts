import { buildCertificateVerificationUrl } from "@/lib/linkedinShare";

export function buildLinkedInPostText(contentUrl: string, description: string) {
  return `Acabei de concluir ${description} na CyberDimension Academy! Verifique meu certificado aqui: ${contentUrl}`;
}

/**
 * Copia o texto da postagem ao clipboard e abre a página de criação de
 * publicação do LinkedIn (a mais direta possível), garantindo que o aluno
 * só precise colar o texto e publicar.
 */
export function openLinkedInCertificateShare(identifier: string, description: string = "o teste Descubra Sua Carreira") {
  const previousTitle = document.title;
  document.title = `Certificado verificável de conclusão · CyberDimension Academy (${identifier})`;
  const verificationUrl = buildCertificateVerificationUrl(window.location.origin, identifier);
  const postText = buildLinkedInPostText(verificationUrl, description);
  const feedUrl = `https://www.linkedin.com/feed/?shareActive=true`;
  const opened = window.open(feedUrl, "_blank", "noopener,noreferrer");
  window.setTimeout(async () => {
    if (document.title !== previousTitle) document.title = previousTitle;
    try {
      await navigator.clipboard.writeText(postText);
    } catch {
      // Sem acesso ao clipboard: a janela do LinkedIn já está aberta.
    }
  }, 300);
  if (!opened) {
    window.location.href = feedUrl;
  }
  return opened;
}
