export type TechnicalEnglishSection = {
  id: string;
  label: string;
  title: string;
  objective: string;
  keyPoints: string[];
  practice: string;
  vocabulary: readonly { term: string; translation: string; context: string }[];
};

export type TechnicalEnglishLab = {
  id: string;
  label: string;
  title: string;
  objective: string;
  scenario: string;
  command: string;
  expectedOutput: string;
  solutionNotes: readonly string[];
};

export const technicalEnglishCourse = {
  id: "ingles-tecnico-ciberseguranca",
  title: "Inglês Técnico para Cibersegurança — do Zero ao Profissional",
  subtitle: "Do vocabulário essencial à comunicação profissional: leia alertas, CVEs, logs e incident reports em inglês, escreva tickets e handovers com precisão e prepare-se para entrevistas em vagas internacionais de segurança.",
  duration: "26 horas",
  level: "Do Zero ao Profissional",
  levelTag: "Progressivo",
  totalModules: 6,
  passingScore: 80,
  certificateCode: "CDA-ENG-TECH",
  sections: [
    {
      id: "vocabulario-essencial",
      label: "Módulo 01 · Nível Zero",
      title: "O vocabulário essencial: a língua franca da segurança",
      objective: "Dominar os 40 termos e expressões que aparecem em praticamente todo material de cibersegurança em inglês.",
      keyPoints: [
        "A comunidade global de segurança trabalha em inglês: CVEs, advisories, RFCs e padrões como NIST são publicados em inglês, mesmo quando escritos por autores não nativos.",
        "Termos compostos precisam ser aprendidos como unidades de significado: phishing, ransomware, threat actor, vulnerability, exploit, patch, asset, breach.",
        "O mesmo termo pode mudar de sentido pelo contexto: 'exploit' é a técnica ou o código; 'patch' é o verbo (aplicar) ou o substantivo (a correção); 'incident' é um evento de segurança, não um acidente genérico.",
        "Falsos amigos são comuns: 'to address an issue' significa tratar um problema (não endereçar); 'to issue' é emitir (a política é issued pela direção); 'to compromise' é comprometer uma conta ou sistema.",
        "Abreviações dominam a comunicação profissional: MFA, DLP, EDR, SIEM, SOC, IR, TTP, IOC, RBAC, SLA, MTTD e MTTR são usados sem explicação em tickets e relatórios.",
        "Preposições técnicas têm padrão: 'compromised BY an attacker', 'vulnerable TO injection', 'apply a patch TO the server', 'access TO the resource', 'protection OF assets'.",
      ],
      practice: "Monte seu glossário inicial: escolha 10 termos desta seção, registre a definição em inglês simples, a tradução e uma frase de exemplo tirada de um material real que você estiver estudando.",
      vocabulary: [
        { term: "asset", translation: "ativo", context: "Everything the organization needs to protect — data, systems, people." },
        { term: "threat actor", translation: "agente de ameaça", context: "The person or group behind an attack (also: attacker, adversary)." },
        { term: "vulnerability", translation: "vulnerabilidade", context: "A weakness that can be exploited — e.g. 'a critical vulnerability in the web app'." },
        { term: "exploit", translation: "exploit / explorar", context: "Verb: to exploit a flaw. Noun: the code that takes advantage of it." },
        { term: "patch", translation: "correção / corrigir", context: "Noun: the fix. Verb: to patch a server (apply the fix)." },
        { term: "breach", translation: "violação / vazamento", context: "A security incident that compromises protected data: 'data breach'." },
        { term: "to compromise", translation: "comprometer", context: "To make a system insecure: 'the account was compromised'." },
        { term: "malware", translation: "software malicioso", context: "Umbrella term: ransomware, spyware, trojan, worm, rootkit..." },
        { term: "ransomware", translation: "ransomware / sequestro de dados", context: "Malware that encrypts data and demands payment." },
        { term: "phishing", translation: "pesca de credenciais", context: "Deception via message to steal credentials or install malware." },
      ],
    },
    {
      id: "leitura-alertas-cve",
      label: "Módulo 02 · Nível Iniciante",
      title: "Leitura técnica: CVEs, advisories e changelogs",
      objective: "Ler e interpretar notices de segurança oficiais da CompTIA, CISA, NIST e fornecedores sem depender de tradução.",
      keyPoints: [
        "Um CVE advisory segue um padrão reconhecível: 'A vulnerability in X allows Y to Z' — identifique o produto afetado, o vetor de ataque e o impacto.",
        "Palavras-chave de severidade sinalizam prioridade: critical (CVSS 9.0+), high (7.0–8.9), medium, low — e 'actively exploited' exige ação imediata.",
        "O campo 'Impact' descreve o dano possível: 'allows remote code execution (RCE)', 'leads to privilege escalation', 'results in information disclosure'.",
        "O campo 'Mitigation/Workaround' é o que você deve fazer já: 'Update to version 2.4.1', 'Apply the vendor patch', 'Restrict access until patched'.",
        "Changelogs de ferramentas (ex.: atualização do Nmap, Wireshark, Kali) usam verbos padrão: added, fixed, deprecated, removed, bumped — entender essa economia de linguagem acelera a manutenção do laboratório.",
        "Leia em camadas: primeiro o título e o CVSS, depois o impact, por último os detalhes técnicos. Nem todo advisory precisa ser lido integralmente — triagem é uma habilidade.",
      ],
      practice: "Escolha um CVE real de 2026 com CVSS >= 9.0. Registre: affected product, attack vector, impact e a ação recomendada, usando apenas o texto original em inglês. Depois traduza a síntese para o português.",
      vocabulary: [
        { term: "advisory", translation: "aviso oficial de segurança", context: "Official notice published by the vendor or CISA about a vulnerability." },
        { term: "affected product", translation: "produto afetado", context: "The software or device with the vulnerability." },
        { term: "attack vector", translation: "vetor de ataque", context: "How the attacker reaches the vulnerability: network, local, adjacent." },
        { term: "privilege escalation", translation: "escalonamento de privilégio", context: "Gaining more rights than intended — local (LPE) or remote (RCE)." },
        { term: "workaround", translation: "contorno temporário", context: "A temporary measure until a proper patch is available." },
        { term: "deprecated", translation: "descontinuado", context: "A feature or version no longer recommended or maintained." },
        { term: "actively exploited", translation: "ativamente explorado", context: "The vulnerability is being used in real attacks — act now." },
        { term: "patch Tuesday", translation: "dia de patches (terça-feira)", context: "Microsoft's monthly release cycle for security updates." },
        { term: "end of life (EOL)", translation: "fim de vida útil", context: "No more updates or support: e.g. 'Windows 10 reached EOL'." },
        { term: "disclosure", translation: "divulgação (de falha)", context: "The public announcement of a vulnerability, often with a responsible disclosure timeline." },
      ],
    },
    {
      id: "logs-e-incident-reports",
      label: "Módulo 03 · Nível Intermediário",
      title: "Logs, alertas e incident reports: o inglês do SOC",
      objective: "Interpretar eventos de SIEM, alertas de EDR e relatórios de incidente em inglês como fazem analistas de SOC ao redor do mundo.",
      keyPoints: [
        "Eventos de SIEM vêm com campos padronizados em inglês: source, destination, event_id, severity, rule_name, action_taken (blocked, allowed, dropped).",
        "Regras de detecção descrevem comportamento em linguagem precisa: 'Multiple failed logon attempts followed by a success' indica tentativa de força bruta.",
        "Incident reports seguem o padrão 5W + ações: what happened, when, who is affected, where (systems), why it matters — followed by containment, eradication e recovery.",
        "Frasear a gravidade corretamente importa: 'we detected suspicious activity' (sinal), 'we confirmed a compromise' (fato), 'we suspect lateral movement' (hipótese).",
        "Status updates de incidente têm fórmula: 'As of 14:30 UTC, the threat actor has been contained on 3 hosts; egress traffic is being monitored; ETA for full remediation is 48 hours.'",
        "Verbos de resposta têm gradiente de certeza: observe, suspect, confirm, contain, eradicate, recover, report — escolher o verbo certo comunica o estado real da investigação.",
      ],
      practice: "Escreva um status update de incidente em inglês com base no cenário: 12 alertas de login falho em conta administrativa, 1 login bem-sucedido às 03:12 UTC e o usuário nega ter acessado. Use o padrão: detecção → confirmação → contenção → próximo passo.",
      vocabulary: [
        { term: "false positive", translation: "falso positivo", context: "An alert that fired but was not an actual threat." },
        { term: "lateral movement", translation: "movimento lateral", context: "An attacker moving between systems inside the network." },
        { term: "containment", translation: "contenção", context: "Stopping the incident from spreading (e.g. isolate the host)." },
        { term: "remediation", translation: "remediação", context: "The complete fix: patch, rebuild, restore clean backups." },
        { term: "post-incident review", translation: "lições aprendidas", context: "The review after an incident to improve detection and response." },
        { term: "to escalate", translation: "escalar", context: "Raise the issue to a higher tier: 'escalated to Tier 2'." },
        { term: "egress traffic", translation: "tráfego de saída", context: "Outbound network traffic — monitored for data exfiltration." },
        { term: "data exfiltration", translation: "exfiltração de dados", context: "Sensitive data being sent out of the network without authorization." },
        { term: "baseline", translation: "linha de base", context: "Normal behavior used to spot anomalies: 'traffic is above baseline'." },
        { term: "mean time to detect (MTTD)", translation: "tempo médio de detecção", context: "KPI of the SOC: how fast threats are detected." },
      ],
    },
    {
      id: "comunicacao-profissional",
      label: "Módulo 04 · Nível Intermediário",
      title: "Comunicação profissional: tickets, e-mails e handovers",
      objective: "Escrever tickets claros, e-mails de segurança e handovers de turno sem ambiguidade, no padrão usado em equipes globais.",
      keyPoints: [
        "Tickets seguem a estrutura BLUF (Bottom Line Up Front): primeiro a conclusão ou o pedido, depois o contexto e as evidências.",
        "Assuntos de e-mail devem ser acionáveis: 'ACTION REQUIRED: patch CVE-2026-XXXX on web servers by Friday' é melhor que 'Security issue' genérico.",
        "Handovers de turno resumem: current status, open actions, items watched e escalations — em frases curtas com timestamps UTC.",
        "Pedidos educados têm padrão: 'Could you please...?', 'Would it be possible to...?', 'I'd appreciate it if you could...' — direto demais soa ríspido em inglês.",
        "Relatar problemas sem culpar exige voz impessoal: 'The server was left unpatched' em vez de 'You forgot to patch the server'.",
        "Concordância e negação educada: 'That makes sense, however...', 'I see your point, but the risk level requires...' — dissent é esperado, desde que fundamentado.",
      ],
      practice: "Redija um e-mail em inglês para a diretoria anunciando um incidente contido, sem pânico e sem minimizar: abertura com o essencial, corpo com fatos e ações, fechamento com próximos passos e ponto de contato.",
      vocabulary: [
        { term: "BLUF", translation: "conclusão em primeiro lugar", context: "Bottom Line Up Front: state the point before the background." },
        { term: "action item", translation: "ação pendente", context: "A concrete task assigned to someone: 'Action item for Maria: review ACLs'." },
        { term: "handover", translation: "passagem de turno", context: "Shift briefing documenting status, open items and watch items." },
        { term: "stakeholder", translation: "parte interessada", context: "Anyone affected by the decision: business, legal, customers." },
        { term: "to mitigate", translation: "mitigar", context: "Reduce the risk or impact: 'mitigate the exposure by restricting access'." },
        { term: "ETA", translation: "previsão de conclusão", context: "Estimated Time of Arrival/Completion: 'ETA for remediation: 48h'." },
        { term: "downtime", translation: "tempo fora do ar", context: "Period when a service is unavailable: 'planned downtime: 02:00–04:00 UTC'." },
        { term: "rollout", translation: "implantação gradual", context: "Phased deployment: 'rollout starts with the pilot group'." },
        { term: "to push back", translation: "adiar / contestar", context: "To delay a date or disagree politely: 'we pushed back the deadline'." },
        { term: "wrap-up", translation: "encerramento / resumo final", context: "Final summary of a meeting or incident: 'wrap-up call at 17:00 UTC'." },
      ],
    },
    {
      id: "entrevista-e-carreira",
      label: "Módulo 05 · Nível Profissional",
      title: "Entrevista e carreira internacional: soando como um profissional",
      objective: "Comunicar sua experiência técnica em inglês com confiança em entrevistas, daily meetings e comunidades globais.",
      keyPoints: [
        "Perguntas clássicas têm estrutura esperada: 'Tell me about a time you handled an incident' pede o formato STAR (Situation, Task, Action, Result).",
        "Descreva experiências com verbos de impacto no passado: 'I led the triage of...', 'I reduced false positives by 40%', 'I implemented detection rules for...'",
        "Quando não souber o termo exato, use paráfrase técnica: 'the tool that blocks attacks at the endpoint' (EDR) mantém a conversa fluindo sem travar.",
        "Honestidade profissional tem fórmula em inglês: 'I haven't worked with that tool directly, but I've done similar work with X, and I'd approach it by...'",
        "Perguntas que VOCÊ faz demonstram senioridade: 'How does the team handle on-call rotation?', 'What does the incident response workflow look like?'",
        "Comunidades globais (blogs, Discord, conferences) usam registro específico: CFP (call for papers), talk, workshop, CTF write-up, disclosure — participar constrói presença internacional.",
      ],
      practice: "Grave (ou escreva) sua resposta em inglês para 'Tell me about a security project you're proud of' usando o formato STAR, com pelo menos um número ou métrica de resultado.",
      vocabulary: [
        { term: "on-call", translation: "plantão / sobreaviso", context: "Being available outside business hours to handle incidents." },
        { term: "write-up", translation: "relatório técnico publicado", context: "A published explanation of a CTF solution or vulnerability analysis." },
        { term: "talk", translation: "palestra técnica", context: "A conference presentation: 'she gave a talk about purple teaming'." },
        { term: "hands-on", translation: "prático", context: "Practical experience: 'hands-on experience with SIEM tuning'." },
        { term: "soft skills", translation: "habilidades comportamentais", context: "Communication, teamwork, documentation — weighted heavily in interviews." },
        { term: "to scope", translation: "dimensionar (escopo)", context: "Define project boundaries: 'let's scope this to the web tier first'." },
        { term: "dealbreaker", translation: "impeditivo", context: "A condition that rules out a candidate or offer: 'no remote work is a dealbreaker'." },
        { term: "bandwidth", translation: "capacidade de trabalho", context: "Informal: 'I don't have the bandwidth this week' = no time." },
        { term: "to onboard", translation: "integrar (pessoa/sistema)", context: "Integrate a new hire or a new system into the environment." },
        { term: "retro", translation: "retrospectiva", context: "Meeting to review what went well and what to improve." },
      ],
    },
    {
      id: "laboratorio-leitura-real",
      label: "Módulo 06 · Laboratório",
      title: "Laboratório: uma semana de inglês imersivo em ambiente real",
      objective: "Aplicar tudo em fontes reais: subscrever advisories, ler um incident report completo e produzir um handover profissional.",
      keyPoints: [
        "Fonte 1 — CVE Program (cve.org) e NVD: leia 1 CVE por dia durante 5 dias; registre product, severity, impact e mitigation em uma tabela própria.",
        "Fonte 2 — Advisory oficial de um incidente público (ex.: reports da CISA ou de vendors após breaches conhecidos): identifique timeline, root cause e corrective actions.",
        "Fonte 3 — Um blog técnico de segurança (ex.: de vendors de EDR ou equipes de resposta): releia uma seção sem tradutor e anote os termos que precisou reler.",
        "Entregável — handover em inglês de um turno simulado de SOC, com 3 eventos, ações tomadas e watch items, no padrão do Módulo 03.",
        "Métrica de evolução — compare o tempo que você levou para compreender o primeiro CVE com o tempo do quinto; a diferença é o seu progresso mensurável.",
        "Hábito permanente — 15 minutos por dia de inglês técnico (um advisory, um post de blog ou uma thread de comunidade) valem mais que sessões longas e esporádicas.",
      ],
      practice: "Produza o handover final do laboratório e compare com o status update do Módulo 03: procure menos hesitação, mais estrutura e vocabulário específico de SOC.",
      vocabulary: [
        { term: "timeline", translation: "linha do tempo", context: "Chronological record of events in an incident or disclosure." },
        { term: "root cause", translation: "causa raiz", context: "The underlying reason an incident happened." },
        { term: "corrective action", translation: "ação corretiva", context: "A fix that addresses the root cause, not just the symptom." },
        { term: "watch item", translation: "item de monitoramento", context: "Something to keep an eye on in the next hours/days." },
        { term: "subscription", translation: "assinatura de feeds", context: "Following advisories by e-mail or RSS to stay updated." },
        { term: "write-up (de laboratório)", translation: "relatório do exercício", context: "Your documented evidence of the lab: what you did and learned." },
        { term: "daily", translation: "reunião diária de acompanhamento", context: "Short stand-up meeting: what you did, what's next, blockers." },
        { term: "blocker", translation: "impedimento", context: "Something stopping progress: 'my blocker is access to the SIEM'." },
        { term: "sync", translation: "alinhamento rápido", context: "A short coordination meeting: 'let's have a quick sync'." },
        { term: "deliverable", translation: "entregável", context: "The concrete output you must produce: report, handover, checklist." },
      ],
    },
  ] satisfies TechnicalEnglishSection[],
  labs: [
    {
      id: "lab-glossario",
      label: "Lab 01",
      title: "Glossário vivo do analista",
      objective: "Construir e manter um glossário pessoal de inglês técnico com 30 termos verificados em fontes reais.",
      scenario: "Você vai integrar uma equipe global de segurança. Crie o glossário que a equipe exige de novos membros: 30 termos, cada um com definição em inglês simples, tradução e uma frase extraída de material real.",
      command: "construir-glossario --termos 30 --fontes cve.org,nvd.nist.gov,blog-vendor --formato tabela",
      expectedOutput: "Glossário: 30/30 termos verificados\nFontes consultadas: 5\nTermos com exemplo real: 30\nStatus: pronto para integração internacional",
      solutionNotes: [
        "Valide cada termo em pelo menos duas fontes oficiais (CVE advisory + documentação de vendor).",
        "Inclua falsos amigos deliberadamente (address, issue, compromise) — são os que mais causam mal-entendidos.",
        "Revisite o glossário a cada novo material que estudar; um glossário vivo acompanha a evolução real.",
      ],
    },
    {
      id: "lab-advisory-real",
      label: "Lab 02",
      title: "Triagem de advisories em inglês",
      objective: "Executar a triagem de 5 CVEs reais usando apenas o texto original em inglês, sem tradutor.",
      scenario: "Sua equipe recebeu um lote de 5 advisories. Você tem 40 minutos para classificar cada um: severity, exploitação ativa, produto afetado e ação imediata — e produzir uma recomendação de uma frase por CVE.",
      command: "triar-cves --lote 5 --tempo 40min --sem-tradutor --saida recomendacoes.md",
      expectedOutput: "CVE-2026-XXXX: Critical, RCE, patch agora\nCVE-2026-YYYY: High, sem exploração ativa, agendar janela\nCVE-2026-ZZZZ: Medium, workaround aplicado\n... (5 recomendações em inglês, 1 frase cada)\nTriagem concluída sem apoio de tradução",
      solutionNotes: [
        "Leia na ordem: título → CVSS → affected → impact → mitigation. Não leia tudo: triagem é economia de atenção.",
        "A recomendação em uma frase deve conter o verbo de ação: patch, isolate, monitor ou accept risk.",
        "Registre quanto tempo cada CVE levou; a meta é reduzir o tempo médio sem perder severidade crítica.",
      ],
    },
    {
      id: "lab-incident-report",
      label: "Lab 03",
      title: "Leitura de incident report completo",
      objective: "Interpretar um report de incidente público em inglês e extrair timeline, root cause e corrective actions.",
      scenario: "Um vendor publicou o report de um incidente real. Extraia os elementos profissionais e responda em português: o que aconteceu, como foi detectado, qual foi a causa raiz e o que mudou depois.",
      command: "analisar-report --fonte vendor-report-public --extração timeline,root-cause,corrections",
      expectedOutput: "Timeline: 6 eventos mapeados (UTC)\nDetecção: alert de egress traffic anômalo\nRoot cause: credencial de service account exposta\nCorrections: rotação global de secrets + MFA obrigatório\nLeitura 100% sem tradutor: sim",
      solutionNotes: [
        "Reports reais seguem o padrão: summary → timeline → root cause → corrective actions → lessons.",
        "Marque os verbos de gradiente (detected, confirmed, contained) — eles revelam o que a empresa sabia em cada momento.",
        "Compare com o formato do Módulo 03: você agora entende por que os reports são escritos assim.",
      ],
    },
    {
      id: "lab-handover",
      label: "Lab 04",
      title: "Handover profissional em inglês",
      objective: "Produzir um handover de turno de SOC completo em inglês, pronto para uma equipe global.",
      scenario: "Fim do seu turno: 3 eventos tratados (1 falso positivo, 1 phishing contido, 1 host em investigação), 2 watch items e 1 escalonamento pendente. Escreva o handover que a equipe da próxima região vai receber.",
      command: "produzir-handover --eventos 3 --watch-items 2 --escalations 1 --padrao utc",
      expectedOutput: "Shift handover — 2026-08-16, 22:00 UTC\n1. Phishing campaign contained: 14 accounts reset\n2. Host SOC-INV-03 under investigation (EDR telemetry)\n3. False positive on build server — rule tuned\nWatch items: egress spike from VLAN 20\nEscalation: Tier 2 reviewing SOC-INV-03 (ETA 04:00 UTC)",
      solutionNotes: [
        "Comece pelo resumo executivo de 2–3 linhas; analistas de outros fusos decidem em segundos se precisam agir.",
        "Use timestamps UTC em todos os eventos e ETAs nos itens pendentes.",
        "Diferencie fato ('contained'), hipótese ('suspected lateral movement') e pedido ('please review').",
      ],
    },
  ] satisfies TechnicalEnglishLab[],
  sources: [
    "CVE Program — cve.org (advisories oficiais de vulnerabilidades)",
    "NIST National Vulnerability Database (nvd.nist.gov)",
    "CISA Cybersecurity Advisories e Cyber Alerts",
    "Microsoft Security Response Center (MSRC) — advisories e Patch Tuesday",
    "CompTIA Security+ SY0-701 — domínios de terminologia técnica",
    "OWASP Cheat Sheet Series (comunicação e documentação de segurança)",
    "Blogs técnicos de equipes de resposta a incidentes (IR write-ups públicos)",
    "NIST SP 800-61 Rev. 2 — Computer Security Incident Handling Guide (padrões de report)",
  ],
  caseStudy: {
    title: "Missão integrada: FusionLabs Security",
    situation: "A FusionLabs, fintech com equipes no Brasil, EUA e Portugal, contrata você como analista de segurança. Sua primeira semana: triar 5 CVEs em inglês, acompanhar um incidente real reportado por um vendor, escrever o handover do turno e preparar a apresentação de 5 minutos sobre o incidente para a daily internacional.",
    tasks: [
      "Tríe 5 CVEs reais e produza 5 recomendações de uma frase, todas em inglês.",
      "Extraia timeline, root cause e corrective actions do report do vendor.",
      "Produza o handover do turno com 3 eventos, 2 watch items e 1 escalonamento.",
      "Prepare 5 bullets em inglês para apresentar o incidente na daily internacional.",
    ],
  },
  knowledgeCheck: [
    {
      question: "Em um advisory, o que a expressão 'actively exploited' exige de você?",
      options: ["Aguardar o próximo ciclo de patches", "Ação imediata de contenção ou correção", "Registrar para a reunião mensal", "Ignorar por ser sensacionalismo"],
      correctIndex: 1,
      rationale: "Quando uma vulnerabilidade está sendo usada em ataques reais, o risco deixa de ser teórico e a resposta precisa ser imediata.",
    },
    {
      question: "Qual verbo comunica que você CONFIRMOU uma violação (não apenas suspeita)?",
      options: ["We observed suspicious activity", "We suspect a compromise", "We confirmed a compromise", "We might have an issue"],
      correctIndex: 2,
      rationale: "O gradiente observe → suspect → confirm comunica o nível de certeza; usar 'confirmed' sem evidência gera crise desnecessária, e suavizar um fato confirmado atrasa a resposta.",
    },
    {
      question: "No padrão BLUF de tickets e e-mails, o que vem primeiro?",
      options: ["Todo o histórico do problema", "A conclusão ou o pedido direto", "A lista de participantes", "O organograma da empresa"],
      correctIndex: 1,
      rationale: "Bottom Line Up Front coloca a informação acionável no início; contexto e evidências vêm depois, para quem precisa de profundidade.",
    },
    {
      question: "Como se diz corretamente 'A conta foi comprometida POR um atacante'?",
      options: ["The account was compromised of an attacker", "The account was compromised by an attacker", "The account was compromised with an attacker", "The account was compromised from an attacker"],
      correctIndex: 1,
      rationale: "Na voz passiva técnica, o agente da ação usa 'by'; as demais preposições produzem frases que soam erradas para leitores nativos.",
    },
    {
      question: "Em uma entrevista, você não conhece uma ferramenta mencionada. Qual resposta demonstra profissionalismo?",
      options: ["Fingir que conhece e torcer", "Dizer apenas 'não sei' e parar", "Admitir e conectar com experiência semelhante e abordagem de aprendizado", "Culpar o recrutador pela pergunta"],
      correctIndex: 2,
      rationale: "Honestidade com direção ('I haven't used X, but I've done similar work with Y and I'd approach it by...') mostra maturidade e capacidade de aprendizado.",
    },
    {
      question: "Qual é o formato esperado para responder 'Tell me about a time you handled an incident'?",
      options: ["STAR: Situation, Task, Action, Result", "Listar todos os cursos que fez", "Falar genericamente sobre cibersegurança", "Descrever apenas a ferramenta usada"],
      correctIndex: 0,
      rationale: "O formato STAR estrutura a resposta em contexto, responsabilidade, o que você fez e o resultado mensurável — exatamente o que o entrevistador avalia.",
    },
    {
      question: "O que 'workaround' significa em um advisory de segurança?",
      options: ["A correção definitiva do fornecedor", "Um contorno temporário até o patch adequado", "O nome do exploit usado", "A versão afetada do produto"],
      correctIndex: 1,
      rationale: "Workaround é a medida paliativa que reduz o risco imediatamente, enquanto o patch definitivo está sendo desenvolvido ou testado.",
    },
    {
      question: "Em um handover de SOC, qual elemento transmite incerteza de forma correta?",
      options: ["Afirmar invasão total sem evidência", "'Suspected lateral movement — monitoring egress traffic'", "Não mencionar o evento", "Prometer resolução em 1 hora sem base"],
      correctIndex: 1,
      rationale: "Verbos de gradiente (suspect, confirmed, observed) comunicam exatamente o que se sabe; o handover precisa separar fato de hipótese com precisão.",
    },
    {
      question: "Qual prática reduz mais o risco de mal-entendidos em e-mail técnico em inglês?",
      options: ["Escrever frases longas e complexas", "Usar gírias para parecer nativo", "Ser direto, usar voz impessoal e evitar ambiguidade", "Evitar números e datas"],
      correctIndex: 2,
      rationale: "Clareza profissional em inglês técnico vem de frases objetivas, timestamps explícitos e voz impessoal que descreve fatos sem culpar pessoas.",
    },
    {
      question: "Qual é o hábito diário mais eficaz para evoluir o inglês técnico em segurança?",
      options: ["Estudar gramática 2 horas por semana", "15 minutos por dia com fontes reais (advisories, blogs, threads)", "Apenas assistir filmes legendados", "Memorizar dicionários inteiros"],
      correctIndex: 1,
      rationale: "Exposição diária curta a material real do domínio cria vocabulário aplicável imediatamente; consistência supera intensidade esporádica.",
    },
  ],
} as const;

export const technicalEnglishLessonSlug = "ingles-tecnico-ciberseguranca";
export const technicalEnglishCertificateTitle = "Inglês Técnico para Cibersegurança — do Zero ao Profissional";
export const technicalEnglishSectionIds = technicalEnglishCourse.sections.map((section) => section.id) as unknown as readonly [string, ...string[]];
export const technicalEnglishPassingScore = 80;
