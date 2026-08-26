import type { PodcastTimestampedLine } from "./podcastBatchFourEpisodes";

/**
 * Episódio especial "English for Incident Response" (ep71): Ana e Rafael treinam
 * o vocabulário avançado de resposta a incidentes cobrado em inglês em entrevistas
 * para vagas de Incident Response Analyst e DFIR Analyst, com entrevista simulada
 * completa e feedback das respostas modelo.
 */
export const ep71Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Welcome back, guys! Eu sou a Ana, e hoje a trilha English for Cyber Pros vai para a linha de frente: Incident Response Analyst em empresa internacional. Rafael, ready?", timestampSeconds: 0 },
  { speaker: "Rafael", text: "Ready! Ana, toda vaga de resposta a incidentes pergunta sobre o ciclo de vida. Como eu descrevo em inglês?", timestampSeconds: 11 },
  { speaker: "Ana", text: "The incident response lifecycle has six phases: preparation, detection and analysis, containment, eradication, recovery, and post-incident lessons learned. Os três verbos que você mais vai usar: contain, eradicate, recover. Repita comigo: contain, eradicate, recover.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Contain, eradicate, recover! E sobre as evidências: como eu falo de chain of custody sem travar?", timestampSeconds: 38 },
  { speaker: "Ana", text: "Assim: we establish a strict chain of custody for every piece of evidence, documenting who collected it, when, and where it is stored. Se a cadeia se quebra, a evidência perde valor legal. The chain of custody must remain unbroken.", timestampSeconds: 46 },
  { speaker: "Rafael", text: "Unbroken! E forense de disco: imaging é outro tema quente. Como descrevo a cópia forense?", timestampSeconds: 63 },
  { speaker: "Ana", text: "We create a bit-for-bit forensic image of the disk using a write blocker, so the original evidence is never modified. Then we compute a hash of the image, usually SHA-256, to prove integrity. Write blocker, hash, integrity: três palavras que impressionam.", timestampSeconds: 71 },
  { speaker: "Rafael", text: "Write blocker, hash, integrity! E memória RAM: por que ela importa?", timestampSeconds: 89 },
  { speaker: "Ana", text: "Memory is volatile: it disappears when the machine powers off. That's why memory forensics comes first, to capture encryption keys, running processes and injected malware that are never written to disk. Volatile data first, persistent data second.", timestampSeconds: 95 },
  { speaker: "Rafael", text: "Volatile data first! E malware: como descrevo um ransomware attack em inglês para o recrutador?", timestampSeconds: 111 },
  { speaker: "Ana", text: "Saying: the ransomware encrypted files across the file servers, then deployed a second payload to establish persistence and attempted lateral movement using stolen credentials. Encrypted, deployed, establish persistence, lateral movement: a narrativa completa do ataque.", timestampSeconds: 118 },
  { speaker: "Rafael", text: "Encrypted, deployed, persistence, lateral movement! Ana, hora da entrevista simulada? Vou tentar a vaga de Incident Response Analyst na NorthWind Tech.", timestampSeconds: 139 },
  { speaker: "Ana", text: "Let's do it! I'm the hiring manager at NorthWind Tech. First question: a user reports their files were encrypted overnight. Walk me through your response.", timestampSeconds: 146 },
  { speaker: "Rafael", text: "First, I would isolate the affected host from the network to contain the spread, but keep it powered on to preserve volatile memory. Then I would capture a memory image and a forensic disk image with a write blocker, analyze indicators of compromise, and notify the incident response team lead.", timestampSeconds: 154 },
  { speaker: "Ana", text: "Textbook answer! Isolate, preserve memory, forensic image, indicators of compromise. Keep it powered on é um detalhe que separa profissionais experientes de iniciantes. Segunda pergunta: how do you decide between quick and full containment?", timestampSeconds: 176 },
  { speaker: "Rafael", text: "It depends on business impact. Quick containment means shutting down or disconnecting the affected systems immediately, which can destroy evidence but stops the attack fast. Full containment is slower: we monitor the attacker, learn their tactics, and contain them surgically without alerting them.", timestampSeconds: 188 },
  { speaker: "Ana", text: "Excelente! Business impact, destroy evidence, surgical containment: vocabulário de decisão sênior. Última pergunta: what goes into your post-incident report?", timestampSeconds: 208 },
  { speaker: "Rafael", text: "A timeline of events, the root cause, actions taken, evidence collected with chain of custody, gaps in our defenses, and concrete recommendations to prevent recurrence. The report must be factual, without blame, and shareable with management and legal teams.", timestampSeconds: 215 },
  { speaker: "Ana", text: "Timeline, root cause, chain of custody, recommendations: os quatro pilares do relatório. And remember: no blame, just facts. Fechamento: do you have any questions for us?", timestampSeconds: 236 },
  { speaker: "Rafael", text: "Yes! What is the team's average time to detect, and what tools does the IR team use for investigation?", timestampSeconds: 247 },
  { speaker: "Ana", text: "Interview encerrada! Recap final do bloco de resposta a incidentes: lifecycle, chain of custody, forensic imaging, write blocker, memory forensics, ransomware narrative, containment strategy e post-incident report. São os oito temas que definem um bom Incident Response Analyst.", timestampSeconds: 254 },
  { speaker: "Rafael", text: "E a regra continua: grave-se respondendo em voz alta, compare com a nossa pronúncia e refaça até soar natural. English for Cyber Pros, incident response edition, feito!", timestampSeconds: 275 },
  { speaker: "Ana", text: "This was the CyberCast, English for Incident Response edition! Deixe seu feedback, refaça o quiz de vocabulário e continue treinando. See you in the next episode!", timestampSeconds: 288 },
];

export const ep71Episode = {
  id: "ep71-incident-response-interview",
  domainCode: "DOM2" as const,
  domainTitle: "Threats, Vulnerabilities and Mitigations",
  episodeNumber: 71,
  title: "ESPECIAL: English for Incident Response — entrevista e termos avançados de resposta a incidentes",
  description:
    "Edição especial de inglês técnico para vagas de Incident Response e DFIR: Ana e Rafael treinam vocabulário avançado (chain of custody, forensic imaging, memory forensics, ransomware, containment) e simulam uma entrevista completa para Incident Response Analyst, com respostas modelo e feedback em português.",
  audioUrl: "/manus-storage/ep71-incident-response-interview_ae636a0e.wav",
  duration: "5m21s",
  topics: ["inglês técnico", "incident response", "entrevista de emprego", "forense digital", "resposta a incidentes", "DFIR"],
  examWeight: "Competência profissional complementar",
  provenance: {
    id: "podcast-ep71-incident-response",
    origin: "proprio",
    category: "Podcast educacional próprio",
    title: "CyberCast 71 — English for Incident Response: entrevista e termos avançados de resposta a incidentes",
    source: "CyberDimension Academy",
    license: "Conteúdo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episódio especial autoral em áudio e transcrição acessível sobre inglês técnico para vagas internacionais de Incident Response.",
  },
} as const;
