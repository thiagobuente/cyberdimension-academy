/**
 * Catálogo oficial de laboratórios e desafios CTF (Capture The Flag) externos,
 * curados para os alunos da CyberDimension Academy. Cada entrada aponta para a
 * plataforma real onde o aluno executa o desafio e registra a própria flag.
 *
 * Níveis: iniciante, intermediário, avançado.
 * Áreas: linux, web, crypto, forense, malware, blue-team, red-team.
 */
export type CtfLevel = "iniciante" | "intermediario" | "avancado";
export type CtfArea =
  | "linux"
  | "web"
  | "crypto"
  | "forense"
  | "malware"
  | "blue-team"
  | "red-team";

export type CtfEntry = {
  id: string;
  title: string;
  platform: string;
  platformUrl: string;
  level: CtfLevel;
  area: CtfArea;
  description: string;
  url: string;
  xp: number;
};

/**
 * Pergunta de verificação associada a um desafio CTF. O aluno só recebe XP
 * ao marcar o desafio como concluído se responder corretamente à pergunta
 * (validação server-side, normalizada: minúsculas, sem acentos e trim).
 */
export type CtfVerificationQuestion = {
  ctfId: string;
  question: string;
  /**
   * Resposta correta normalizada para comparação (a comparação no backend
   * aceita a entrada com acentos, caixa e espaços extras — o texto abaixo
   * é apenas o valor normalizado esperado).
   */
  answer: string;
  /** Rótulo curto usado no frontend (ex.: palavra-chave esperada). */
  answerHint?: string;
};

export const CTF_VERIFICATION_QUESTIONS: CtfVerificationQuestion[] = [
  {
    ctfId: "bandit",
    question: "No Bandit (OverTheWire), você entra em cada nível usando SSH. Qual é o comando para conectar ao nível seguinte usando uma porta não padrão (ex.: porta 2220)?",
    answer: "ssh bandit1@localhost -p 2220",
    answerHint: "ssh bandit1@localhost -p 2220",
  },
  {
    ctfId: "leviathan",
    question: "Qual ferramenta do Linux é usada para rastrear as chamadas de biblioteca feitas por um binário, técnica essencial nos níveis de Leviathan?",
    answer: "ltrace",
    answerHint: "ltrace",
  },
  {
    ctfId: "natas",
    question: "Nos desafios de natas (OverTheWire), a autenticação dos níveis é feita via credenciais de qual tipo de autenticação HTTP? Basic HTTP Auth (usuário e senha no prompt do navegador). Responda apenas o nome do método.",
    answer: "basic",
    answerHint: "Basic HTTP Auth",
  },
  {
    ctfId: "picoctf",
    question: "Na plataforma picoCTF, qual formato padrão as flags seguem (o texto entre chaves)? Exemplo: picoCTF{...}",
    answer: "picoctf{...}",
    answerHint: "picoCTF{...}",
  },
  {
    ctfId: "cyberdefenders",
    question: "No CyberDefenders, os laboratórios de Blue Team trabalham com dumps reais de qual artefato de análise de memória do Windows, fornecido pela Volatility?",
    answer: "memory dump",
    answerHint: "memory dump (despejo de memória)",
  },
  {
    ctfId: "letsdefend",
    question: "No simulador LetsDefend, o que um analista de SOC examina primeiro quando um alerta chega: tickets, playbooks ou hardware? Responda apenas a palavra principal.",
    answer: "tickets",
    answerHint: "tickets de alerta",
  },
  {
    ctfId: "blueteamlabs",
    question: "No Blue Team Labs Online, qual ferramenta web gratuita é frequentemente usada para analisar e visualizar arquivos PCAP de tráfego de rede?",
    answer: "networkminer",
    answerHint: "NetworkMiner (ou Wireshark)",
  },
  {
    ctfId: "webacademy",
    question: "Na Web Security Academy (PortSwigger), qual ataque de injeção usa uma aspa simples (') em campos de login ou formulários para manipular consultas SQL? Escreva o nome em inglês.",
    answer: "sql injection",
    answerHint: "SQL Injection",
  },
  {
    ctfId: "juice-shop",
    question: "A OWASP Juice Shop é uma aplicação web vulnerável escrita em qual linguagem/framework de backend? Responda apenas a tecnologia (ex.: node.js / express / javascript).",
    answer: "node",
    answerHint: "Node.js / Express",
  },
  {
    ctfId: "cryptohack",
    question: "No CryptoHack, qual operação booleana é a base da cifra de Vernam (one-time pad), onde cifra-texto = texto-plano XOR chave?",
    answer: "xor",
    answerHint: "XOR",
  },
  {
    ctfId: "htb-academy-beginner",
    question: "Na Hack The Box Academy, qual é a primeira fase do pentest em que se coleta informações públicas sobre o alvo antes de qualquer varredura? (enumeração, reconhecimento ou exploração?)",
    answer: "reconhecimento",
    answerHint: "Reconhecimento (OSINT)",
  },
  {
    ctfId: "pwnable",
    question: "No pwn.college, a exploração binária em C frequentemente abusa de qual vulnerabilidade clássica, quando um buffer no stack é preenchido além do seu tamanho?",
    answer: "buffer overflow",
    answerHint: "Buffer Overflow",
  },
  {
    ctfId: "malware-traffic",
    question: "No Malware-Traffic-Analysis.net, os exercícios usam arquivos de qual tipo de captura de tráfego de rede para análise? (sigla de 4 letras em maiúsculas)",
    answer: "pcap",
    answerHint: "PCAP",
  },
  {
    ctfId: "volatility-foundation",
    question: "Nos desafios de forense da SANS, qual framework open-source é o padrão para análise de dumps de memória RAM do Windows e do Linux?",
    answer: "volatility",
    answerHint: "Volatility",
  },
  {
    ctfId: "ctftime",
    question: "No CTFtime, a maioria das competições online (jeopardy-style) é disputada por quais unidades de participação: indivíduos ou equipes?",
    answer: "equipes",
    answerHint: "Equipes (teams)",
  },
  {
    ctfId: "picoctf-comp",
    question: "A competição anual picoCTF é organizada com apoio de qual universidade norte-americana que também opera a plataforma picoCTF? (primeiro nome da universidade, em inglês)",
    answer: "carnegie mellon",
    answerHint: "Carnegie Mellon University",
  },
  {
    ctfId: "cyberapocalypse",
    question: "O HTB Cyber Apocalypse é uma competição CTF online organizada por qual plataforma de treinamento? (3 letras)",
    answer: "htb",
    answerHint: "Hack The Box (HTB)",
  },
  {
    ctfId: "defcon-quals",
    question: "O DEF CON CTF, considerado a final mundial dos CTFs, acontece anualmente em qual cidade dos EUA durante a conferência DEF CON?",
    answer: "las vegas",
    answerHint: "Las Vegas",
  },
];

/** Mapa de perguntas por ctfId para acesso O(1). */
const verificationByCtfId = new Map<string, CtfVerificationQuestion>(
  CTF_VERIFICATION_QUESTIONS.map((q) => [q.ctfId, q]),
);

/** Normaliza a resposta do aluno para comparação tolerante (minúsculas, sem acentos, trim). */
export function normalizeCtfAnswer(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 @#$_{}.]/g, "")
    .trim();
}

export function getCtfVerificationQuestion(ctfId: string): CtfVerificationQuestion | undefined {
  return verificationByCtfId.get(ctfId);
}

/** Compara a resposta do aluno com a resposta esperada (tolerante a caixa/acentos/espaços). */
export function isCtfAnswerCorrect(ctfId: string, rawAnswer: string): boolean {
  const question = verificationByCtfId.get(ctfId);
  if (!question) return false;
  return normalizeCtfAnswer(rawAnswer) === normalizeCtfAnswer(question.answer);
}

export const CTF_CATALOG: CtfEntry[] = [
  // ── Linux ────────────────────────────────────────────────────────
  {
    id: "bandit",
    title: "Bandit Wargame",
    platform: "OverTheWire",
    platformUrl: "https://overthewire.org",
    level: "iniciante",
    area: "linux",
    description: "Nível 0 ao 34: aprenda SSH, permissões, grep, pipes e a vida no terminal Linux resolvendo um nível por vez.",
    url: "https://overthewire.org/wargames/bandit/",
    xp: 300,
  },
  {
    id: "leviathan",
    title: "Leviathan",
    platform: "OverTheWire",
    platformUrl: "https://overthewire.org",
    level: "intermediario",
    area: "linux",
    description: "Exploração de binários setuid, ltrace/strace e engenharia reversa leve no Linux.",
    url: "https://overthewire.org/wargames/leviathan/",
    xp: 400,
  },
  {
    id: "natas",
    title: "Natas",
    platform: "OverTheWire",
    platformUrl: "https://overthewire.org",
    level: "intermediario",
    area: "web",
    description: "Segurança web no lado do servidor: autenticação, injeção, gestão de sessões e credenciais expostas.",
    url: "https://overthewire.org/wargames/natas/",
    xp: 400,
  },
  // ── Forense e threat hunting ─────────────────────────────────────
  {
    id: "picoctf",
    title: "picoCTF",
    platform: "picoCTF",
    platformUrl: "https://picoctf.org",
    level: "iniciante",
    area: "forense",
    description: "Plataforma gratuita da Carnegie Mellon com trilhas completas: forense, cripto, web, reversing e script writing.",
    url: "https://play.picoctf.org",
    xp: 300,
  },
  {
    id: "cyberdefenders",
    title: "CyberDefenders — Blue Team CTFs",
    platform: "CyberDefenders",
    platformUrl: "https://cyberdefenders.org",
    level: "intermediario",
    area: "forense",
    description: "Investigação com dumps reais: memória, disco, logs e tráfego de rede para analistas defensivos.",
    url: "https://cyberdefenders.org/labs/",
    xp: 400,
  },
  {
    id: "letsdefend",
    title: "LetsDefend SOC Simulator",
    platform: "LetsDefend",
    platformUrl: "https://letsdefend.io",
    level: "iniciante",
    area: "blue-team",
    description: "Simula um SOC real: triagem de alertas, análise de logs e resposta a incidentes com casos guiados.",
    url: "https://app.letsdefend.io/training",
    xp: 300,
  },
  {
    id: "blueteamlabs",
    title: "Blue Team Labs Online",
    platform: "Blue Team Labs Online",
    platformUrl: "https://blueteamlabs.online",
    level: "intermediario",
    area: "blue-team",
    description: "Laboratórios de detecção, SIEM, análise forense e resposta a incidentes com cenários corporativos.",
    url: "https://blueteamlabs.online/",
    xp: 400,
  },
  // ── Web security ─────────────────────────────────────────────────
  {
    id: "webacademy",
    title: "Web Security Academy",
    platform: "PortSwigger",
    platformUrl: "https://portswigger.net",
    level: "iniciante",
    area: "web",
    description: "Labs gratuitos dos criadores do Burp Suite: SQLi, XSS, CSRF, auth e lógica de aplicação, do básico ao avançado.",
    url: "https://portswigger.net/web-security/all-labs",
    xp: 300,
  },
  {
    id: "juice-shop",
    title: "OWASP Juice Shop",
    platform: "OWASP",
    platformUrl: "https://owasp.org",
    level: "intermediario",
    area: "web",
    description: "A loja vulnerável oficial do OWASP: encontre e explore falhas de segurança de forma estruturada.",
    url: "https://owasp.org/www-project-juice-shop/",
    xp: 400,
  },
  // ── Crypto ───────────────────────────────────────────────────────
  {
    id: "cryptohack",
    title: "CryptoHack",
    platform: "CryptoHack",
    platformUrl: "https://cryptohack.org",
    level: "iniciante",
    area: "crypto",
    description: "Criptografia moderna na prática: XOR, RSA, ECC, AES e matemática aplicada, com desafios progressivos.",
    url: "https://cryptohack.org/challenges/",
    xp: 300,
  },
  // ── Red team / pentest ───────────────────────────────────────────
  {
    id: "htb-academy-beginner",
    title: "Hack The Box Academy — Introduction",
    platform: "Hack The Box",
    platformUrl: "https://academy.hackthebox.com",
    level: "iniciante",
    area: "red-team",
    description: "Módulos introdutórios de pentest: enumeração, exploração e pós-exploração em ambiente gamificado.",
    url: "https://academy.hackthebox.com/",
    xp: 300,
  },
  {
    id: "pwnable",
    title: "pwn.college",
    platform: "pwn.college",
    platformUrl: "https://pwn.college",
    level: "avancado",
    area: "red-team",
    description: "Exploração binária e PWN em profundidade, da Arizona State University, com dezenas de módulos práticos.",
    url: "https://pwn.college/",
    xp: 500,
  },
  // ── Malware / forense avançada ───────────────────────────────────
  {
    id: "malware-traffic",
    title: "Malware-Traffic-Analysis.net",
    platform: "Malware Traffic Analysis",
    platformUrl: "https://www.malware-traffic-analysis.net",
    level: "avancado",
    area: "malware",
    description: "PCAPs reais de tráfego malicioso para treinar análise de malware e extração de IOCs.",
    url: "https://www.malware-traffic-analysis.net/training-exercises.html",
    xp: 500,
  },
  {
    id: "volatility-foundation",
    title: "SANS Forensics 508 Labs",
    platform: "SANS",
    platformUrl: "https://www.sans.org",
    level: "avancado",
    area: "forense",
    description: "Portal SANS de desafios de forense digital: casos guiados de análise de memória e disco da trilha DFIR.",
    url: "https://www.sans.org/mlp/challenge-coins/digital-forensics",
    xp: 500,
  },
  // ── CTFs competitivos ────────────────────────────────────────────
  {
    id: "ctftime",
    title: "CTFtime — Calendário global",
    platform: "CTFtime",
    platformUrl: "https://ctftime.org",
    level: "intermediario",
    area: "red-team",
    description: "Calendário oficial das competições CTF ao redor do mundo — participe em equipe e suba no ranking.",
    url: "https://ctftime.org/event/list/",
    xp: 400,
  },
  {
    id: "picoctf-comp",
    title: "picoCTF Competition",
    platform: "picoCTF",
    platformUrl: "https://picoctf.org",
    level: "iniciante",
    area: "crypto",
    description: "Edição anual da competição picoCTF, aberta a todos, ideal para o primeiro CTF competitivo.",
    url: "https://play.picoctf.org",
    xp: 300,
  },
  {
    id: "cyberapocalypse",
    title: "HTB Cyber Apocalypse",
    platform: "Hack The Box",
    platformUrl: "https://www.hackthebox.com",
    level: "intermediario",
    area: "red-team",
    description: "Maior CTF online do mundo, com desafios de web, crypto, pwn, forense e hardware.",
    url: "https://www.hackthebox.com/events/cyber-apocalypse-2026",
    xp: 400,
  },
  {
    id: "defcon-quals",
    title: "DEF CON CTF",
    platform: "DEF CON",
    platformUrl: "https://www.defcon.org",
    level: "avancado",
    area: "red-team",
    description: "A final mundial dos CTFs — assista, estude os write-ups e compare seu nível com os melhores times.",
    url: "https://www.defcon.org/html/links/dc-ctf.html",
    xp: 500,
  },
];

export function getCtfCatalog(): readonly CtfEntry[] {
  return CTF_CATALOG;
}

export function getCtf(id: string): CtfEntry | undefined {
  return CTF_CATALOG.find((entry) => entry.id === id);
}

export const CTF_LEVELS: CtfLevel[] = ["iniciante", "intermediario", "avancado"];
export const CTF_AREAS: CtfArea[] = [
  "linux",
  "web",
  "crypto",
  "forense",
  "malware",
  "blue-team",
  "red-team",
];

export const CTF_AREA_LABELS: Record<CtfArea, string> = {
  linux: "Linux",
  web: "Segurança Web",
  crypto: "Criptografia",
  forense: "Forense Digital",
  malware: "Análise de Malware",
  "blue-team": "Blue Team",
  "red-team": "Red Team",
};

export const CTF_LEVEL_LABELS: Record<CtfLevel, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};
