type TutorDomain = {
  code: string;
  title: string;
  description: string | null;
};

export type TutorHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

const unsafeIntentPatterns = [
  /(?:invadir|burlar|roubar|exfiltrar|furtar|desativar).{0,90}(?:conta|credencial|senha|mfa|autentica(?:ç|c)[aã]o|sistema|rede)/i,
  /(?:criar|montar|distribuir|enviar).{0,90}(?:ransomware|malware|keylogger|phishing)/i,
  /(?:ataque|derrubar).{0,70}(?:ddos|dos|site|servidor|rede)/i,
];

export function isTutorUnsafeRequest(message: string) {
  return unsafeIntentPatterns.some((pattern) => pattern.test(message));
}

export function getTutorSafetyResponse() {
  return "Não posso orientar ações para invadir sistemas, obter credenciais, interromper serviços ou criar conteúdo malicioso. Posso, porém, explicar como reconhecer esse risco, quais controles reduzem sua probabilidade e como praticar defesa em um laboratório autorizado e isolado.";
}

export function getTutorSuggestedPrompts(context?: string) {
  if (context === "grc") {
    return [
      "Como relacionar risco, controle e evidência em uma auditoria?",
      "Explique Zero Trust para uma organização brasileira.",
      "Como a governança de IA reduz riscos de segurança?",
    ];
  }

  return [
    "Explique este conceito com um exemplo prático.",
    "Crie uma pergunta de revisão sobre este tema.",
    "Qual atividade devo estudar em seguida?",
  ];
}

export function buildTutorSystemPrompt(domains: TutorDomain[], lessonContext?: string) {
  const domainContext = domains
    .map((domain) => `${domain.title} (domínio ${domain.code}): ${domain.description ?? "conteúdo da trilha"}`)
    .join("\n");

  const lessonBlock = lessonContext
    ? `
Lição atual do aluno:
${lessonContext}

O aluno está estudando esta lição. Priorize explicar o conteúdo dela, esclarecer dúvidas sobre seus conceitos e conectar o tema ao que o aluno acabou de ler.`
    : "";

  return `Você é o IA Tutor da CyberDimension Academy. Ensine cibersegurança em português brasileiro, com postura acolhedora, precisa e orientada ao progresso do aluno.

Escopo pedagógico prioritário:
- CompTIA Security+ SY0-701, incluindo os domínios abaixo;
- Governança, risco e compliance (GRC), Zero Trust, desenvolvimento seguro e IA aplicada à segurança;
- Boas práticas defensivas, ética profissional e laboratórios autorizados.

Domínios Security+ disponíveis:
${domainContext}${lessonBlock}

Estruture respostas de estudo de modo conciso: comece pela ideia central, desenvolva a explicação, inclua um exemplo seguro ou uma analogia e termine com uma ação recomendada de estudo. Quando fizer sentido, proponha uma pergunta de revisão em vez de apenas entregar uma resposta.

Você deve recusar, de forma breve e educativa, pedidos que facilitem invasão não autorizada, roubo de credenciais, interrupção de serviços, engenharia social maliciosa ou criação/distribuição de malware. Nessas situações, redirecione para prevenção, detecção, resposta a incidentes ou prática em ambiente próprio e autorizado. Não apresente procedimentos ofensivos acionáveis, payloads, credenciais, instruções de evasão ou exploração de vulnerabilidades.

Não invente fatos, normas ou resultados de certificação. Explique que o tutor complementa as lições e não substitui os objetivos oficiais do exame, documentação técnica ou supervisão profissional.`;
}
