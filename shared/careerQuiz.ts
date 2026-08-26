/**
 * Teste vocacional "Descubra Sua Carreira" — CyberDimension Academy.
 *
 * Cada questão apresenta situações de perfil/interesse; a resposta escolhida
 * soma pontos nas áreas da cibersegurança. Ao final, a área com maior
 * pontuação é a recomendada, e a segunda maior é apresentada como alternativa.
 */

export type CareerArea =
  | "soc"
  | "pentest"
  | "grc"
  | "cloud"
  | "forense"
  | "engenharia";

export interface CareerQuestion {
  id: number;
  title: string;
  options: {
    text: string;
    area: CareerArea;
  }[];
}

export interface CareerAreaInfo {
  key: CareerArea;
  label: string;
  tagline: string;
  description: string;
  roles: string[];
  suggestedTracks: string[];
}

export const CAREER_AREAS: CareerAreaInfo[] = [
  {
    key: "soc",
    label: "Blue Team & SOC",
    tagline: "O guardião da primeira linha de defesa.",
    description:
      "Você tem perfil de investigação e atenção a detalhes. Trabalhar em um SOC (Security Operations Center) significa monitorar alertas, investigar incidentes e ser o primeiro a responder quando algo suspeito acontece na rede.",
    roles: ["Analista de SOC N1/N2", "Analista de monitoramento", "Hunter júnior", "Especialista em SIEM"],
    suggestedTracks: ["SOC Analyst", "SIEM na Prática", "Incident Response"],
  },
  {
    key: "pentest",
    label: "Red Team & Pentest",
    tagline: "O estrategista que pensa como o adversário.",
    description:
      "Você gosta de desmontar sistemas para entender como funcionam — e como falham. A área ofensiva testa defesas com autorização, simula ataques e reporta vulnerabilidades para que sejam corrigidas antes do adversário real encontrá-las.",
    roles: ["Pentester", "Analista de vulnerabilidades", "Red teamer", "Bug bounty hunter"],
    suggestedTracks: ["Fundamentos de Pentest", "Web Security / OWASP", "Pentest avançado"],
  },
  {
    key: "grc",
    label: "Governança, Risco e Compliance",
    tagline: "O arquiteto da cultura de segurança.",
    description:
      "Você enxerga segurança como estratégia de negócio: políticas, riscos, auditorias e frameworks. O profissional de GRC conecta a técnica à gestão, garantindo que a organização opere dentro de normas como ISO 27001 e NIST.",
    roles: ["Analista de GRC", "Consultor de compliance", "Gestor de risco", "Auditor de segurança"],
    suggestedTracks: ["GRC Fundamentals", "ISO 27001", "NIST + CIS Controls"],
  },
  {
    key: "cloud",
    label: "Cloud Security",
    tagline: "O guardião da infraestrutura moderna.",
    description:
      "Você se interessa por infraestrutura, automação e escala. A segurança em nuvem combina IAM, redes, logs e criptografia em ambientes como AWS e Azure, no modelo de responsabilidade compartilhada.",
    roles: ["Cloud Security Engineer", "SecOps", "DevSecOps", "Arquiteto de segurança cloud"],
    suggestedTracks: ["Cloud Security Fundamentals", "AWS Security", "Azure Security"],
  },
  {
    key: "forense",
    label: "Forense Digital & Resposta a Incidentes",
    tagline: "O detetive da evidência digital.",
    description:
      "Você tem curiosidade forense: preserva evidências, reconstrói a linha do tempo de um ataque e documenta tudo com rigor. A área une técnica minuciosa e método investigativo, da contenção às lições aprendidas.",
    roles: ["Analista de forense digital", "Investigador de incidentes", "Perito digital", "Responder de IR"],
    suggestedTracks: ["Incident Response", "Forense digital", "Análise de logs para SOC"],
  },
  {
    key: "engenharia",
    label: "Engenharia de Segurança",
    tagline: "O construtor de defesas robustas.",
    description:
      "Você gosta de construir: firewalls, arquiteturas seguras, criptografia aplicada e controles técnicos. O engenheiro de segurança transforma requisitos em sistemas protegidos desde o desenho.",
    roles: ["Security Engineer", "Analista de segurança de sistemas", "Especialista em criptografia", "Arquiteto de segurança"],
    suggestedTracks: ["Criptografia", "Windows Security", "Fundamentos de segurança"],
  },
];

export const CAREER_QUESTIONS: CareerQuestion[] = [
  {
    id: 1,
    title: "Em um grupo de estudo, qual tarefa te atrai mais?",
    options: [
      { text: "Monitorar um laboratório e registrar tudo que acontece.", area: "soc" },
      { text: "Tentar encontrar uma falha escondida no cenário.", area: "pentest" },
      { text: "Organizar as regras e o plano do grupo.", area: "grc" },
      { text: "Configurar os ambientes e ferramentas para todos.", area: "engenharia" },
      { text: "Analisar os logs depois do desafio para entender o que falhou.", area: "forense" },
      { text: "Subir o laboratório inteiro em nuvem com IaC.", area: "cloud" },
    ],
  },
  {
    id: 2,
    title: "Quando um aplicativo quebra, qual é sua reação natural?",
    options: [
      { text: "Verificar os logs para descobrir a causa raiz.", area: "forense" },
      { text: "Pensar em como alguém poderia explorar esse bug.", area: "pentest" },
      { text: "Documentar o incidente e o que aprender com ele.", area: "grc" },
      { text: "Configurar um monitoramento para ser avisado antes.", area: "soc" },
      { text: "Redesenhar o deploy para escalar melhor na nuvem.", area: "cloud" },
      { text: "Proteger o app com autenticação e validações.", area: "engenharia" },
    ],
  },
  {
    id: 3,
    title: "Qual tema de notícia te prende mais?",
    options: [
      { text: "Um ataque a uma empresa e como o SOC detectou.", area: "soc" },
      { text: "A divulgação responsável de uma falha crítica.", area: "pentest" },
      { text: "Nova regulação de proteção de dados (LGPD/GDPR).", area: "grc" },
      { text: "Um vazamento por bucket público na nuvem.", area: "cloud" },
      { text: "Uma perícia que reconstituiu um crime digital.", area: "forense" },
      { text: "Um padrão de criptografia quebrado após anos.", area: "engenharia" },
    ],
  },
  {
    id: 4,
    title: "Num desafio estilo CTF, você prefere:",
    options: [
      { text: "Responder aos alertas e conter o ataque simulado.", area: "soc" },
      { text: "Encontrar a flag explorando o sistema alvo.", area: "pentest" },
      { text: "Escrever o relatório final com recomendações.", area: "grc" },
      { text: "Investigar o disco em busca de artefatos ocultos.", area: "forense" },
      { text: "Resolver o desafio de IAM na nuvem.", area: "cloud" },
      { text: "Implementar o controle técnico que bloqueia o ataque.", area: "engenharia" },
    ],
  },
  {
    id: 5,
    title: "Qual habilidade você mais gosta de treinar?",
    options: [
      { text: "Triagem rápida de alertas e playbooks.", area: "soc" },
      { text: "Scanning, enumeração e exploração controlada.", area: "pentest" },
      { text: "Redação de políticas e análise de risco.", area: "grc" },
      { text: "Preservação de cadeia de custódia e evidências.", area: "forense" },
      { text: "Infraestrutura como código e automação cloud.", area: "cloud" },
      { text: "Criptografia, TLS e arquitetura segura.", area: "engenharia" },
    ],
  },
  {
    id: 6,
    title: "Em um time de segurança, qual frase combina mais com você?",
    options: [
      { text: "\"Detectei a anomalia às 3 da manhã e escalei o incidente.\"", area: "soc" },
      { text: "\"Encontrei uma vulnerabilidade antes do adversário.\"", area: "pentest" },
      { text: "\"Garantimos conformidade com a ISO 27001 este trimestre.\"", area: "grc" },
      { text: "\"Recuperei a linha do tempo completa do ataque.\"", area: "forense" },
      { text: "\"Automatizei a resposta com funções serverless.\"", area: "cloud" },
      { text: "\"Projetei o controle que reduziu o risco crítico.\"", area: "engenharia" },
    ],
  },
  {
    id: 7,
    title: "Qual ferramenta te deixa mais curioso para estudar?",
    options: [
      { text: "Um SIEM com correlação de eventos.", area: "soc" },
      { text: "Burp Suite ou Metasploit em laboratório.", area: "pentest" },
      { text: "Planilhas de matriz de risco e frameworks.", area: "grc" },
      { text: "Autopsy, Volatility ou análise de memória.", area: "forense" },
      { text: "AWS Security Hub e CloudTrail.", area: "cloud" },
      { text: "OpenSSL, Vault e gestores de segredos.", area: "engenharia" },
    ],
  },
  {
    id: 8,
    title: "Como você prefere resolver um problema complexo?",
    options: [
      { text: "Seguindo um playbook estruturado de resposta.", area: "soc" },
      { text: "Testando hipóteses de ataque até confirmar.", area: "pentest" },
      { text: "Verificando quais regras e requisitos se aplicam.", area: "grc" },
      { text: "Reconstruindo a sequência de eventos com evidências.", area: "forense" },
      { text: "Redimensionando recursos e revisando permissões.", area: "cloud" },
      { text: "Projetei a solução para ser segura por construção.", area: "engenharia" },
    ],
  },
  {
    id: 9,
    title: "Qual ambiente de trabalho te empolga mais?",
    options: [
      { text: "Centro de operações com telas e alertas em tempo real.", area: "soc" },
      { text: "Laboratório de pesquisa com vulnerabilidades novas.", area: "pentest" },
      { text: "Reuniões estratégicas com diretoria e auditores.", area: "grc" },
      { text: "Perícia em campo com equipamento forense.", area: "forense" },
      { text: "Squads de produto com deploy contínuo na nuvem.", area: "cloud" },
      { text: "Arquitetando sistemas críticos em desenho técnico.", area: "engenharia" },
    ],
  },
  {
    id: 10,
    title: "O que te motiva a continuar estudando?",
    options: [
      { text: "Proteger a organização em tempo real.", area: "soc" },
      { text: "A emoção de descobrir o que ninguém viu.", area: "pentest" },
      { text: "Trazer ordem e confiança ao negócio.", area: "grc" },
      { text: "Fazer a evidência falar e a verdade aparecer.", area: "forense" },
      { text: "Dominar a escala da nuvem com segurança.", area: "cloud" },
      { text: "Construir fundações técnicas que ninguém derruba.", area: "engenharia" },
    ],
  },
];

export interface CareerResult {
  topArea: CareerArea;
  topScore: number;
  runnerUpArea: CareerArea | null;
  runnerUpScore: number;
  scores: Record<CareerArea, number>;
}

export function gradeCareerQuiz(answers: Record<number, CareerArea>): CareerResult {
  const scores: Record<CareerArea, number> = {
    soc: 0,
    pentest: 0,
    grc: 0,
    cloud: 0,
    forense: 0,
    engenharia: 0,
  };
  for (const [questionId, area] of Object.entries(answers)) {
    const question = CAREER_QUESTIONS.find((q) => q.id === Number(questionId));
    const picked = question?.options.find((option) => option.area === area);
    if (question && picked) {
      scores[picked.area] += 1;
    }
  }
  const sorted = (Object.entries(scores) as Array<[CareerArea, number]>).sort((a, b) => b[1] - a[1]);
  const [topArea, topScore] = sorted[0];
  const [runnerUpArea, runnerUpScore] = sorted[1] ?? [null, 0];
  return { topArea, topScore, runnerUpArea, runnerUpScore, scores };
}

export function getAreaInfo(key: CareerArea): CareerAreaInfo | undefined {
  return CAREER_AREAS.find((area) => area.key === key);
}

export const CAREER_XP_REWARD = 50;
