/**
 * Simulado de entrevista guiada "English for Cyber Pros":
 * perguntas típicas de vagas internacionais (SOC Analyst, Pentester,
 * Network Security Engineer) com avaliação de palavras-chave e feedback
 * sobre a resposta ideal em inglês.
 */

export type InterviewRole = "soc" | "pentester" | "network";

export interface InterviewQuestion {
  id: string;
  role: InterviewRole;
  recruiter: string;
  recruiterTranslation: string;
  ideaScoreLabel: string;
  ideaScore: readonly string[];
  idealAnswerEn: string;
  idealAnswerPt: string;
  keywords: readonly string[];
  tips: string;
}

export const interviewQuestions: readonly InterviewQuestion[] = [
  {
    id: "interview-soc-1",
    role: "soc",
    recruiter: "Can you walk me through your approach when a SIEM alert fires on your dashboard?",
    recruiterTranslation: "Você pode me explicar sua abordagem quando um alerta do SIEM aparece no seu painel?",
    ideaScoreLabel: "O que a resposta ideal contém",
    ideaScore: [
      "Confirma se o alerta é um verdadeiro ou falso positivo antes de agir",
      "Classifica a severidade e correlaciona com outros logs",
      "Escalona conforme o playbook e documenta tudo",
    ],
    idealAnswerEn:
      "First, I verify if the alert is a true positive or a false positive. Then I triage by severity, correlate the event with other logs, and check the affected asset. If confirmed, I escalate according to the playbook and document everything.",
    idealAnswerPt:
      "Primeiro verifico se o alerta é verdadeiro ou falso positivo. Depois classifico por severidade, correlaciono com outros logs e verifico o ativo afetado. Se confirmado, escalono conforme o playbook e documentar tudo.",
    keywords: ["triage", "false positive", "true positive", "correlate", "escalate", "playbook", "document"],
    tips: "Comece sempre com a triagem (triage) e termine com a documentação. Verbos na primeira pessoa do presente dão confiança e clareza.",
  },
  {
    id: "interview-soc-2",
    role: "soc",
    recruiter: "Tell me about a time you handled a high-pressure security incident.",
    recruiterTranslation: "Me conte sobre uma vez em que você lidou com um incidente de segurança sob pressão.",
    ideaScoreLabel: "O que a resposta ideal contém",
    ideaScore: [
      "História real estruturada: contexto, ação e resultado",
      "Palavras como calm, playbook e stakeholders",
      "Tempo verbal correto (passado simples e contínuo)",
    ],
    idealAnswerEn:
      "During a weekend shift, our detection system flagged a ransomware attempt at two AM. I stayed calm, followed the incident response playbook, isolated the affected machines, and communicated clearly with the stakeholders until the threat was eradicated.",
    idealAnswerPt:
      "Durante um plantão de fim de semana, nosso sistema de detecção flagrou uma tentativa de ransomware às 2 da manhã. Mantive a calma, segui o playbook de resposta a incidentes, isolei as máquinas afetadas e me comuniquei claramente com os stakeholders até a ameaça ser erradicada.",
    keywords: ["stayed calm", "playbook", "isolated", "stakeholders", "eradicated", "shift", "flagged"],
    tips: "Use a estrutura passado + ação + resultado. \"Stakeholders\" e \"playbook\" são as duas palavras que recrutadores internacionais mais valorizam nessa resposta.",
  },
  {
    id: "interview-soc-3",
    role: "soc",
    recruiter: "What would you do if you detected a brute force attack against a critical server?",
    recruiterTranslation: "O que você faria se detectasse um ataque de força bruta contra um servidor crítico?",
    ideaScoreLabel: "O que a resposta ideal contém",
    ideaScore: [
      "Bloqueio imediato da origem e reset de senhas",
      "Lockout de contas e análise de comprometimento",
      "Reporte ao time lead com evidências",
    ],
    idealAnswerEn:
      "I would immediately contain the threat: block the source IP on the firewall, force a password reset, and enable account lockout policies. Then I would analyze the logs to check if any account was compromised and report the incident to the team lead.",
    idealAnswerPt:
      "Eu conteria a ameaça imediatamente: bloquearia o IP de origem no firewall, forçaria a troca de senha e ativaria políticas de lockout de conta. Depois analisaria os logs para verificar se alguma conta foi comprometida e reportaria o incidente ao líder do time.",
    keywords: ["contain", "block", "password reset", "lockout", "compromised", "report"],
    tips: "Use o condicional \"I would\" para respostas hipotéticas — é o tempo verbal que recrutadores esperam em perguntas \"what would you do\".",
  },
  {
    id: "interview-pentester-1",
    role: "pentester",
    recruiter: "How do you start a penetration test, and how do you ensure it stays ethical?",
    recruiterTranslation: "Como você inicia um teste de invasão e como garante que ele permanece ético?",
    ideaScoreLabel: "O que a resposta ideal contém",
    ideaScore: [
      "Escopo escrito e autorização formal antes de qualquer teste",
      "Fases claras: reconhecimento, enumeração, exploração, relatório",
      "Regras de engajamento e limites bem definidos",
    ],
    idealAnswerEn:
      "Every engagement starts with a signed scope and written authorization. Then I move through reconnaissance, enumeration and controlled exploitation. I follow the rules of engagement strictly, never exceed the agreed scope, and deliver a clear report with findings and remediation advice.",
    idealAnswerPt:
      "Todo engajamento começa com um escopo assinado e autorização por escrito. Depois sigo reconhecimento, enumeração e exploração controlada. Respeito rigorosamente as regras de engajamento, nunca excedo o escopo acordado e entrego um relatório claro com descobertas e recomendações de remediação.",
    keywords: ["scope", "authorization", "reconnaissance", "enumeration", "rules of engagement", "remediation"],
    tips: "\"Rules of engagement\" e \"written authorization\" são obrigatórias: mostram profissionalismo e separação entre pentest ético e ataque ilegal.",
  },
  {
    id: "interview-pentester-2",
    role: "pentester",
    recruiter: "You find a critical vulnerability during a test. How do you disclose it?",
    recruiterTranslation: "Você encontra uma vulnerabilidade crítica durante um teste. Como você a reporta?",
    ideaScoreLabel: "O que a resposta ideal contém",
    ideaScore: [
      "Documentação imediata com evidências e passos de reprodução",
      "Severidade correta (CVSS) e risco para o negócio",
      "Recomendações de correção claras e priorizadas",
    ],
    idealAnswerEn:
      "I document the finding immediately with evidence, reproduction steps and its CVSS severity. Then I prioritize it by business risk and deliver it through the agreed reporting channel, including clear remediation guidance so the team can fix it quickly.",
    idealAnswerPt:
      "Documento a descoberta imediatamente com evidências, passos de reprodução e sua severidade CVSS. Depois priorizo pelo risco ao negócio e a entrego pelo canal de relatório acordado, incluindo orientações claras de correção para o time resolver rápido.",
    keywords: ["evidence", "reproduction steps", "CVSS", "prioritize", "reporting channel", "remediation"],
    tips: "Mencione CVSS para mostrar método de classificação. Entregue sempre pelo canal formal definido no escopo — nunca exponha a falha fora dele.",
  },
  {
    id: "interview-pentester-3",
    role: "pentester",
    recruiter: "What is the difference between black-box, white-box and gray-box testing?",
    recruiterTranslation: "Qual a diferença entre testes black-box, white-box e gray-box?",
    ideaScoreLabel: "O que a resposta ideal contém",
    ideaScore: [
      "Black-box: nenhum conhecimento interno, simula um atacante externo",
      "White-box: acesso total ao código e arquitetura",
      "Gray-box: conhecimento parcial, como credenciais de usuário",
    ],
    idealAnswerEn:
      "In black-box testing I have no internal knowledge and simulate an external attacker. In white-box I have full access to source code and architecture. In gray-box I have partial knowledge, like a low-privilege user account. Each approach finds different classes of vulnerabilities.",
    idealAnswerPt:
      "No teste black-box não tenho conhecimento interno e simulo um atacante externo. No white-box tenho acesso total ao código-fonte e à arquitetura. No gray-box tenho conhecimento parcial, como uma conta de usuário com baixo privilégio. Cada abordagem encontra classes diferentes de vulnerabilidades.",
    keywords: ["black-box", "white-box", "gray-box", "external attacker", "source code", "privilege"],
    tips: "Feche com \"each approach finds different classes of vulnerabilities\" — mostra que você escolhe o método conforme o objetivo, não por preferência.",
  },
  {
    id: "interview-network-1",
    role: "network",
    recruiter: "How would you design secure remote access for our distributed workforce?",
    recruiterTranslation: "Como você projetaria acesso remoto seguro para nossa força de trabalho distribuída?",
    ideaScoreLabel: "O que a resposta ideal contém",
    ideaScore: [
      "Autenticação com MFA obrigatória para todo acesso",
      "Túnel VPN criptografado de ponta a ponta",
      "Least privilege e registro de sessões para auditoria",
    ],
    idealAnswerEn:
      "I would deploy a zero trust architecture for remote access: every user must authenticate with MFA, and their session would run through an encrypted VPN tunnel. I would apply least privilege, verify device posture before granting access, and log all sessions for audit.",
    idealAnswerPt:
      "Eu implantaria uma arquitetura zero trust para acesso remoto: todo usuário precisa autenticar com MFA e a sessão rodaria por um túnel VPN criptografado. Aplicaria o menor privilégio, verificaria o estado do dispositivo antes de conceder acesso e registraria todas as sessões para auditoria.",
    keywords: ["zero trust", "MFA", "VPN tunnel", "least privilege", "device posture", "audit"],
    tips: "\"Device posture\" (estado do dispositivo) e \"zero trust\" são os termos que diferenciam candidatos juniores de seniores nessa pergunta.",
  },
  {
    id: "interview-network-2",
    role: "network",
    recruiter: "Our web server was attacked last week. How would you investigate?",
    recruiterTranslation: "Nosso servidor web foi atacado na semana passada. Como você investigaria?",
    ideaScoreLabel: "O que a resposta ideal contém",
    ideaScore: [
      "Linha do tempo a partir de logs de firewall e IDS",
      "Captura de pacotes comparada com a linha de base",
      "Isolamento, correção e relatório pós-incidente",
    ],
    idealAnswerEn:
      "First, I would check the firewall and IDS logs to establish a timeline of the attack. Then I would run a packet capture on the affected segment and compare the traffic against our baseline. I would isolate the segment, patch the vulnerability, and write a post-incident report with recommendations.",
    idealAnswerPt:
      "Primeiro verificaria os logs de firewall e IDS para estabelecer a linha do tempo do ataque. Depois faria uma captura de pacotes no segmento afetado e compararia o tráfego com nossa linha de base. Isolaria o segmento, aplicaria o patch da vulnerabilidade e escreveria um relatório pós-incidente com recomendações.",
    keywords: ["timeline", "packet capture", "baseline", "isolate", "patch", "post-incident report"],
    tips: "\"Establish a timeline\" é a abertura perfeita: mostra método. Nunca pule para a correção sem antes documentar a evidência.",
  },
  {
    id: "interview-network-3",
    role: "network",
    recruiter: "Explain how you would respond to a DDoS attack.",
    recruiterTranslation: "Explique como você responderia a um ataque DDoS.",
    ideaScoreLabel: "O que a resposta ideal contém",
    ideaScore: [
      "Análise do vetor: volumétrico, de protocolo ou de camada de aplicação",
      "Rate limiting e bloqueios na borda (edge)",
      "Mitigação com ISP/CDN e comunicação com stakeholders",
    ],
    idealAnswerEn:
      "During a DDoS attack, my first step is traffic analysis: identify the attack vector, whether it is volumetric, protocol-based or application layer. I would enable rate limiting and geo-blocking on the edge, activate DDoS mitigation with our ISP or CDN provider, and keep stakeholders informed throughout the incident.",
    idealAnswerPt:
      "Durante um ataque DDoS, meu primeiro passo é a análise de tráfego: identificar o vetor do ataque — volumétrico, baseado em protocolo ou de camada de aplicação. Ativaria rate limiting e bloqueios geográficos na borda, acionaria a mitigação de DDoS com nosso ISP ou CDN e manteria os stakeholders informados durante todo o incidente.",
    keywords: ["attack vector", "volumetric", "application layer", "rate limiting", "edge", "ISP", "CDN"],
    tips: "Nomear os três tipos de vetor (volumetric, protocol-based, application layer) demonstra domínio técnico real do tema.",
  },
];

export const getQuestionsByRole = (role: InterviewRole) =>
  interviewQuestions.filter((question) => question.role === role);

export const interviewRoles = [
  {
    id: "soc" as InterviewRole,
    title: "SOC Analyst",
    subtitle: "Monitoramento, triagem e resposta a incidentes",
    icon: "ShieldAlert" as const,
  },
  {
    id: "pentester" as InterviewRole,
    title: "Pentester",
    subtitle: "Testes de intrusão éticos e relatórios de vulnerabilidade",
    icon: "Crosshair" as const,
  },
  {
    id: "network" as InterviewRole,
    title: "Network Security Engineer",
    subtitle: "Firewalls, segmentação, VPN e mitigação de DDoS",
    icon: "Network" as const,
  },
];
