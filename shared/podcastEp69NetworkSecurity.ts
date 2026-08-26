import type { PodcastTimestampedLine } from "./podcastBatchFourEpisodes";

/**
 * Episódio especial "English for Network Security" (ep69): Ana e Rafael
 * aprofundam os termos avançados de segurança de rede cobrados em inglês em
 * entrevistas para vagas de Network Security Engineer e Network Security Analyst,
 * com entrevista simulada completa e vocabulário de firewall, VPN, segmentação
 * e monitoramento de tráfego.
 */
export const ep69Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Welcome back, guys! Eu sou a Ana, e esse episódio é a continuação direta do English for Cyber Pros. Hoje a vaga é outra: Network Security Engineer em empresa internacional.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! E se no episódio sessenta e oito a gente treinou os termos básicos, hoje entra o nível avançado de rede: firewall, VPN, segmentação, tráfego e monitoramento. Ready, Ana?", timestampSeconds: 10 },
  { speaker: "Ana", text: "Ready! Primeiro bloco: os verbos que decidem a entrevista. To segment: segmentar a rede. To encrypt: criptografar o tráfego. To inspect: inspecionar pacotes. To enforce: fazer cumprir uma política. To mitigate: mitigar o risco. Repita comigo: segment, encrypt, inspect, enforce, mitigate.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Segment! Encrypt! Inspec... inspect! Enforce! Mitigate! Ana, e como eu descrevo um firewall stateful em inglês?", timestampSeconds: 34 },
  { speaker: "Ana", text: "Assim: a stateful firewall inspects packets and tracks the state of active connections. Ele não olha só o pacote isolado, ele lembra do contexto da conexão. E o stateless? Only matches packets against static rules, packet by packet, without context. Stateful tracking connections, stateless static rules.", timestampSeconds: 43 },
  { speaker: "Rafael", text: "Entendi! E VPN? Tem a famosa confusão de pronúncia: vee-pi-en, letra por letra, nunca \"vâpin\". What is a VPN? It creates an encrypted tunnel over an untrusted network, so traffic is protected end to end.", timestampSeconds: 58 },
  { speaker: "Ana", text: "Vee-pi-en, perfeito! Agora o trio que toda vaga de rede cobra: a difference between a hub, a switch and a router. Hub broadcasts to all ports. Switch forwards frames based on MAC addresses. Router routes packets between networks based on IP addresses.", timestampSeconds: 70 },
  { speaker: "Rafael", text: "Broadcasts, forwards, routes! E segmentação: o vocabulário de ouro para redes modernas. Network segmentation divides a large network into smaller zones. A VLAN is a logical network segment. And microsegmentation enforces policies between workloads, not just between VLANs.", timestampSeconds: 84 },
  { speaker: "Ana", text: "Excelente! E na entrevista vão perguntar por que segmentar. Sua resposta modelo: segmentation limits lateral movement. If an attacker compromises one zone, they cannot easily pivot to the rest of the network. Pivot: esse verbo é essencial.", timestampSeconds: 97 },
  { speaker: "Rafael", text: "Limits lateral movement, cannot pivot! Agora o bloco de monitoramento. Como descrevo o tráfego suspeito em inglês? I noticed unusual outbound traffic, a spike in connections to an external IP, and repetitive failed login attempts from multiple sources.", timestampSeconds: 110 },
  { speaker: "Ana", text: "Perfeito. Vocabulário de monitoramento: an anomaly, uma anomalia. A baseline, a linha de base de comportamento normal. Packet capture, ou PCAP, para capturar tráfego. NetFlow records, que resumem os fluxos. E IDS versus IPS você já domina: detects and alerts, sits inline and blocks.", timestampSeconds: 122 },
  { speaker: "Rafael", text: "Detects and alerts, blocks! Ana, hora da entrevista simulada? Vou tentar a vaga de Network Security Engineer na NorthWind Tech.", timestampSeconds: 135 },
  { speaker: "Ana", text: "Let's do it! I'm the hiring manager at NorthWind Tech. First question: how would you design secure remote access for our distributed workforce?", timestampSeconds: 142 },
  { speaker: "Rafael", text: "I would deploy a zero trust architecture for remote access: every user must authenticate with MFA, and their session would run through an encrypted VPN tunnel. I would apply least privilege, verify device posture before granting access, and log all sessions for audit.", timestampSeconds: 151 },
  { speaker: "Ana", text: "Strong answer! MFA, zero trust, least privilege e device posture são as palavras-chave que o recrutador espera. Segunda pergunta: our web server was attacked last week. How would you investigate?", timestampSeconds: 166 },
  { speaker: "Rafael", text: "First, I would check the firewall and IDS logs to establish a timeline of the attack. Then I would run a packet capture on the affected segment and compare the traffic against our baseline. I would isolate the segment, patch the vulnerability, and write a post-incident report with recommendations.", timestampSeconds: 175 },
  { speaker: "Ana", text: "Excelente estrutura! Establish a timeline, run a packet capture, isolate, patch e post-incident report. É o ciclo completo de investigação. Última pergunta, a mais avançada: explain how you would respond to a DDoS attack.", timestampSeconds: 192 },
  { speaker: "Rafael", text: "During a DDoS attack, my first step is traffic analysis: identify the attack vector, whether it is volumetric, protocol-based or application layer. I would enable rate limiting and geo-blocking on the edge, activate DDoS mitigation with our ISP or CDN provider, and keep stakeholders informed throughout the incident.", timestampSeconds: 201 },
  { speaker: "Ana", text: "Impressionante! Volumetric, application layer, rate limiting, edge e ISP. Esse é exatamente o vocabulário de um Network Security Engineer sênior. Fechamento da entrevista: do you have any questions for us?", timestampSeconds: 220 },
  { speaker: "Rafael", text: "Yes! What is the current network architecture like, and what are the biggest security challenges the team faces this year?", timestampSeconds: 229 },
  { speaker: "Ana", text: "Interview encerrada! Recap final do bloco de rede: stateful firewall, encrypted tunnel, segmentation, lateral movement, pivot, baseline, packet capture, rate limiting e DDoS mitigation. São os dez termos que abrem a porta para vagas internacionais de network security.", timestampSeconds: 237 },
  { speaker: "Rafael", text: "E a regra continua a mesma: grave-se respondendo essas perguntas em voz alta, compare com a nossa pronúncia e refaça até soar natural. English for Cyber Pros, network edition, feito!", timestampSeconds: 252 },
  { speaker: "Ana", text: "This was the CyberCast, English for Network Security edition! Deixe seu feedback, refaça o quiz de vocabulário e continue treinando. See you in the next episode!", timestampSeconds: 261 },
];

export const ep69Episode = {
  id: "ep69-network-security-interview",
  domainCode: "DOM3" as const,
  domainTitle: "Security Architecture",
  episodeNumber: 69,
  title: "ESPECIAL: English for Network Security — entrevista e termos avançados de rede",
  description:
    "Edição especial de inglês técnico para vagas de Network Security: Ana e Rafael treinam vocabulário avançado de rede (stateful firewall, segmentação, lateral movement, DDoS mitigation) e simulam uma entrevista completa para Network Security Engineer, com respostas modelo e feedback em português.",
  audioUrl: "/manus-storage/ep69-network-security-interview_54014d2f.wav",
  duration: "5m57s",
  topics: ["inglês técnico", "network security", "entrevista de emprego", "firewall", "segmentação de rede", "DDoS"],
  examWeight: "Competência profissional complementar",
  provenance: {
    id: "podcast-ep69-network-security",
    origin: "proprio",
    category: "Podcast educacional próprio",
    title: "CyberCast 69 — English for Network Security: entrevista e termos avançados de rede",
    source: "CyberDimension Academy",
    license: "Conteúdo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episódio especial autoral em áudio e transcrição acessível sobre inglês técnico para vagas internacionais de Network Security.",
  },
} as const;
