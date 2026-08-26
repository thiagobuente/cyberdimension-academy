import type { PodcastTimestampedLine } from "./podcastBatchFourEpisodes";

/**
 * Episódio especial "English for Cloud Security" (ep70): Ana e Rafael treinam
 * o vocabulário avançado de segurança em nuvem cobrado em inglês em entrevistas
 * para vagas de Cloud Security Engineer e Cloud Security Analyst, com
 * entrevista simulada completa para a NorthWind Tech e feedback das respostas.
 */
export const ep70Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Welcome back, guys! Eu sou a Ana, e hoje a trilha English for Cyber Pros vai para a nuvem: Cloud Security Engineer em empresa internacional. Rafael, ready?", timestampSeconds: 0 },
  { speaker: "Rafael", text: "Ready! Ana, eu sempre fico nervoso quando o recrutador fala shared responsibility. Como eu descrevo isso em inglês?", timestampSeconds: 11 },
  { speaker: "Ana", text: "Assim: the cloud provider is responsible for the security of the cloud, and the customer is responsible for security in the cloud. O provedor protege a infraestrutura, o cliente protege o que coloca nela. Repita comigo: the customer is responsible for security in the cloud.", timestampSeconds: 20 },
  { speaker: "Rafael", text: "The customer is responsible for security in the cloud! E como eu falo sobre os três modelos de serviço: IaaS, PaaS e SaaS?", timestampSeconds: 36 },
  { speaker: "Ana", text: "In Infrastructure as a Service, the customer manages the operating system and applications. In Platform as a Service, the provider manages the platform and runtime. In Software as a Service, the provider manages almost everything. In each layer, the customer keeps the responsibility for data and access.", timestampSeconds: 44 },
  { speaker: "Rafael", text: "Customer keeps responsibility for data and access! Agora o trio da nuvem que toda vaga cobra: IAM, KMS e logging. Como eu uso em uma frase?", timestampSeconds: 61 },
  { speaker: "Ana", text: "Assim: we enforce least privilege through IAM, encrypt data at rest with KMS, and send all activity logs to a centralized SIEM. Three concepts, three verbs: enforce, encrypt, centralize. Repita: enforce, encrypt, centralize.", timestampSeconds: 71 },
  { speaker: "Rafael", text: "Enforce, encrypt, centralize! E configuração errada, que é a causa número um de vazamentos: how do I talk about misconfigurations?", timestampSeconds: 88 },
  { speaker: "Ana", text: "S3 bucket misconfigurations are the leading cause of cloud data leaks. Always verify that public access is blocked, encryption is enabled, and access logging is on. Um bucket S3 exposto é um classic interview topic.", timestampSeconds: 97 },
  { speaker: "Rafael", text: "Blocked, enabled, on! E segurança de containers: a pergunta de follow-up mais comum. Containers share the same kernel, right?", timestampSeconds: 112 },
  { speaker: "Ana", text: "Exactly! Containers share the host kernel, which makes the hypervisor layer lighter, but a kernel vulnerability can affect all containers on the host. That's why you need runtime protection and vulnerability scanning in your CI/CD pipeline.", timestampSeconds: 119 },
  { speaker: "Rafael", text: "Share the host kernel, runtime protection, CI/CD scanning! Ana, hora da entrevista simulada? Vou tentar a vaga de Cloud Security Engineer na NorthWind Tech.", timestampSeconds: 136 },
  { speaker: "Ana", text: "Let's do it! I'm the hiring manager at NorthWind Tech. First question: how would you secure a multi-cloud environment?", timestampSeconds: 144 },
  { speaker: "Rafael", text: "I would start with a cloud security posture management tool to get full visibility across providers. Then I would enforce consistent IAM policies with least privilege, encrypt all data at rest and in transit, and centralize logs so we can detect anomalies in one place.", timestampSeconds: 151 },
  { speaker: "Ana", text: "Strong answer! Posture management, least privilege, encryption at rest and in transit, centralize logs. São as quatro bandeiras que o recrutador procura. Segunda pergunta: a developer accidentally made a storage bucket public. How would you respond?", timestampSeconds: 171 },
  { speaker: "Rafael", text: "First, I would immediately restrict public access to contain the exposure. Then I would review access logs to see what was accessed and by whom, notify the data protection team if personal data was exposed, and implement automated scanning to prevent bucket misconfigurations in the future.", timestampSeconds: 186 },
  { speaker: "Ana", text: "Contain, review, notify, prevent: a sequência completa de resposta a incidente em nuvem, e com o vocabulário certo. Última pergunta: what is your experience with zero trust in the cloud?", timestampSeconds: 207 },
  { speaker: "Rafael", text: "In the cloud, identity is the new perimeter. I never trust the network alone: every request must be authenticated, authorized, and encrypted. I use MFA, conditional access policies, and verify device posture before granting access to any resource.", timestampSeconds: 216 },
  { speaker: "Ana", text: "Identity is the new perimeter: essa frase abre qualquer entrevista de cloud security! Authenticated, authorized, encrypted, device posture: vocabulário de nível sênior. Fechamento: do you have any questions for us?", timestampSeconds: 236 },
  { speaker: "Rafael", text: "Yes! How is the team structured, and what is the biggest cloud security challenge you expect this year?", timestampSeconds: 248 },
  { speaker: "Ana", text: "Interview encerrada! Recap final do bloco de nuvem: shared responsibility, IAM, KMS, SIEM, bucket misconfiguration, container security, multi-cloud e zero trust. São os oito conceitos que separam candidatos comuns de candidatos competitivos.", timestampSeconds: 255 },
  { speaker: "Rafael", text: "E a regra continua: grave-se respondendo em voz alta, compare com a nossa pronúncia e refaça até soar natural. English for Cyber Pros, cloud edition, feito!", timestampSeconds: 273 },
  { speaker: "Ana", text: "This was the CyberCast, English for Cloud Security edition! Deixe seu feedback, refaça o quiz de vocabulário e continue treinando. See you in the next episode!", timestampSeconds: 285 },
];

export const ep70Episode = {
  id: "ep70-cloud-security-interview",
  domainCode: "DOM3" as const,
  domainTitle: "Security Architecture",
  episodeNumber: 70,
  title: "ESPECIAL: English for Cloud Security — entrevista e termos avançados de nuvem",
  description:
    "Edição especial de inglês técnico para vagas de Cloud Security: Ana e Rafael treinam vocabulário avançado de nuvem (shared responsibility, IAM, KMS, bucket misconfiguration, containers, zero trust) e simulam uma entrevista completa para Cloud Security Engineer, com respostas modelo e feedback em português.",
  audioUrl: "/manus-storage/ep70-cloud-security-interview_0daefd69.wav",
  duration: "5m14s",
  topics: ["inglês técnico", "cloud security", "entrevista de emprego", "IAM", "nuvem", "zero trust"],
  examWeight: "Competência profissional complementar",
  provenance: {
    id: "podcast-ep70-cloud-security",
    origin: "proprio",
    category: "Podcast educacional próprio",
    title: "CyberCast 70 — English for Cloud Security: entrevista e termos avançados de nuvem",
    source: "CyberDimension Academy",
    license: "Conteúdo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episódio especial autoral em áudio e transcrição acessível sobre inglês técnico para vagas internacionais de Cloud Security.",
  },
} as const;
