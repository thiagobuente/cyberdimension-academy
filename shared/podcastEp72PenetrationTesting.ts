import type { PodcastTimestampedLine } from "./podcastBatchFourEpisodes";

/**
 * Episódio especial "English for Penetration Testing" (ep72): Ana e Rafael treinam
 * o vocabulário avançado de pentest cobrado em inglês em entrevistas para vagas de
 * Penetration Tester / Ethical Hacker, com entrevista simulada completa e feedback
 * das respostas modelo.
 */
export const ep72Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Welcome back, Cyber Pros! Eu sou a Ana, e hoje a trilha English for Cyber Pros abre o arsenal mais cobiçado do mercado: Penetration Testing em inglês. Rafael, ready to hack it out?", timestampSeconds: 0 },
  { speaker: "Rafael", text: "Ready! Ana, a primeira pergunta de qualquer entrevista de pentest: tell me about your methodology. Como eu respondo sem travar?", timestampSeconds: 12 },
  { speaker: "Ana", text: "Saying: I follow a structured methodology inspired by the Penetration Testing Execution Standard and OWASP Testing Guide. My workflow is reconnaissance, scanning, exploitation, privilege escalation, lateral movement, pivoting and reporting. Memorize o fluxo: recon, scan, exploit, escalate, pivot, report.", timestampSeconds: 21 },
  { speaker: "Rafael", text: "Recon, scan, exploit, escalate, pivot, report! E reconhecimento: qual o vocabulário de passivo e ativo?", timestampSeconds: 43 },
  { speaker: "Ana", text: "Passive reconnaissance uses public sources without touching the target: OSINT, DNS records, Shodan, LinkedIn, archived pages. Active reconnaissance involves direct interaction: port scans, service enumeration, banner grabbing, subdomain brute force. The key phrase: passive leaves no footprint, active is more accurate.", timestampSeconds: 50 },
  { speaker: "Rafael", text: "Leaves no footprint! E vulnerabilidades: como eu descrevo uma exploração em inglês?", timestampSeconds: 70 },
  { speaker: "Ana", text: "Assim: I identified an unauthenticated remote code execution vulnerability on the web application, verified it was not a false positive, and chained it with a local privilege escalation to gain root access. Keywords: exploit, chain, root access, proof of concept.", timestampSeconds: 76 },
  { speaker: "Rafael", text: "Chain, root access, proof of concept! E lateral movement: como descrevo o salto entre hosts?", timestampSeconds: 95 },
  { speaker: "Ana", text: "After compromising the workstation, I dumped credentials using the SAM database, then used pass-the-hash to authenticate to the domain controller and established persistence via a scheduled task. Persistence, credential dumping, pass-the-hash: três golpes que provam senioridade.", timestampSeconds: 101 },
  { speaker: "Rafael", text: "Credential dumping, pass-the-hash! E como eu falo de risco sem assustar o cliente?", timestampSeconds: 122 },
  { speaker: "Ana", text: "Assim: the vulnerability was rated critical based on CVSS nine point eight, with direct internet exposure and known exploits in the wild, so I recommended immediate patching and compensating controls. The formula: severity, exposure, remediation: risco quantificado, não drama.", timestampSeconds: 127 },
  { speaker: "Rafael", text: "Severity, exposure, remediation! Ana, hora da entrevista? Vou tentar a vaga de Penetration Tester na ShadowCorp.", timestampSeconds: 150 },
  { speaker: "Ana", text: "Let's do it! I'm the security lead at ShadowCorp. First question: you find a critical vulnerability but the client says patching would take weeks. What do you do?", timestampSeconds: 156 },
  { speaker: "Rafael", text: "I would first verify the finding and remove any false positive noise. Then I would provide immediate mitigation guidance, such as network segmentation or a temporary rule on the firewall, while working with the team to plan a safe remediation window.", timestampSeconds: 165 },
  { speaker: "Ana", text: "Strong answer! Verify first, mitigate now, remediate safely. É exatamente essa sequência que separa o profissional do caçador de CVEs. Segunda pergunta: how do you ensure your testing doesn't disrupt production?", timestampSeconds: 185 },
  { speaker: "Rafael", text: "I define the scope and rules of engagement in a written agreement before any test. I avoid destructive payloads in production windows, throttle my scanning to reduce load, and coordinate exploitation attempts with the operations team.", timestampSeconds: 196 },
  { speaker: "Ana", text: "Rules of engagement antes do primeiro pacote: essa é a resposta de ouro. Escopo, throttle, coordination. Última pergunta: what makes a pentest report excellent?", timestampSeconds: 217 },
  { speaker: "Rafael", text: "An executive summary written for non-technical stakeholders, a technical section with reproduction steps and proof of concept, clear risk ratings with CVSS scores, and prioritized remediation advice that the team can act on immediately.", timestampSeconds: 224 },
  { speaker: "Ana", text: "Perfect! Two audiences, two languages: a diretoria quer business risk, o time técnico quer steps to reproduce. Recap final do bloco: methodology flow, passive and active recon, exploit chain, credential dumping, persistence, risk communication e o relatório em duas camadas.", timestampSeconds: 246 },
  { speaker: "Rafael", text: "Metodologia, exploração, persistência, comunicação de risco e o relatório: os cinco temas que definem um bom Penetration Tester. E a regra continua: grave-se respondendo em voz alta e compare com a nossa pronúncia!", timestampSeconds: 266 },
  { speaker: "Ana", text: "This was the CyberCast, English for Penetration Testing edition! Refaça o quiz, treine o vocabulário e continue hackeando o inglês. See you in the next episode!", timestampSeconds: 283 },
];

export const ep72Episode = {
  id: "ep72-penetration-testing-interview",
  domainCode: "DOM4" as const,
  domainTitle: "Red Team — Security Operations and Assessments",
  episodeNumber: 72,
  title: "ESPECIAL: English for Penetration Testing — entrevista e termos avançados de pentest",
  description:
    "Edição especial de inglês técnico para vagas de Penetration Testing: Ana e Rafael treinam vocabulário avançado (methodology flow, reconnaissance, exploit chain, credential dumping, persistence, risk communication) e simulam uma entrevista completa para Penetration Tester, com respostas modelo e feedback em português.",
  audioUrl: "/manus-storage/ep72-penetration-testing-interview_6def4bcb.wav",
  duration: "4m52s",
  topics: ["inglês técnico", "penetration testing", "entrevista de emprego", "ethical hacking", "pentest", "relatórios de segurança"],
  examWeight: "Competência profissional complementar",
  provenance: {
    id: "podcast-ep72-penetration-testing",
    origin: "proprio",
    category: "Podcast educacional próprio",
    title: "CyberCast 72 — English for Penetration Testing: entrevista e termos avançados de pentest",
    source: "CyberDimension Academy",
    license: "Conteúdo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episódio especial autoral em áudio e transcrição acessível sobre inglês técnico para vagas internacionais de Penetration Testing.",
  },
} as const;
