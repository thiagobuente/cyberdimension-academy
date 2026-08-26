import type { PodcastTimestampedLine } from "./podcastBatchFourEpisodes";

/**
 * Expansao da trilha "English for Cyber Pros": 16 novos episodios especiais
 * de ingles tecnico (ep73-ep88), cobrindo vocabulario de area e entrevistas
 * simuladas com respostas modelo, sempre com dicas de pronuncia.
 *
 * Padrao de formato espelhado nos arquivos podcastEp68..72 existentes.
 */

const makeEpisode = (
  id: string,
  episodeNumber: number,
  title: string,
  description: string,
  topics: readonly string[],
  transcript: readonly PodcastTimestampedLine[],
  filename: string
) =>
  ({
    id,
    domainCode: "DOM1" as const,
    domainTitle: "General Security Concepts",
    episodeNumber,
    title,
    description,
    audioUrl: `/manus-storage/${filename}.wav`,
    duration: "~6 min",
    topics,
    examWeight: "Competencia profissional complementar",
    provenance: {
      id: `podcast-${id}`,
      origin: "proprio" as const,
      category: "Podcast educacional proprio",
      title: `CyberCast ${episodeNumber} - ${title}`,
      source: "CyberDimension Academy",
      license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
      usage: "Episodio especial autoral em audio e transcricao acessivel sobre ingles tecnico para o mercado internacional de ciberseguranca.",
    },
    transcript,
  } as const);


/**
 * ep73 — English for SOC Analyst: Triage, alertas e escalonamento: o vocabulario do dia a dia de um SOC internacional, com entrevista simulada.
 */
export const ep73Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Welcome back to the English for Cyber Pros track! Eu sou a Ana, e hoje a vaga e SOC Analyst, o cargo mais pedido do mundo em seguranca. Rafael, what did you bring?", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje a gente cobre o vocabulario do dia a dia do SOC: alert, triage, escalate, false positive, playbook. E tem entrevista simulada com a SOC manager da GlobalShield.", timestampSeconds: 9 },
  { speaker: "Ana", text: "First, the verbs. To triage: tri-ej, priorizar os alertas por severidade. To escalate: es-kei-leit, subir o incidente para o proximo nivel. To investigate: inves-ti-geit. To contain: conter a ameaca. To document: registrar tudo. Pronuncia comigo: triage, escalate, investigate, contain, document.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Triage! Escalate! Investigate! Contain! Document! Ana, e como eu descrevo um alert no console em ingles?", timestampSeconds: 33 },
  { speaker: "Ana", text: "Assim: the SIEM flagged a brute force alert against the RDP endpoint. The alert has high severity. I need to triage it before the SLA expires. Flag: sinalizar. Severity: severidade. SLA: o prazo de atendimento. Alert fatigue: quando o analista se acostuma com muitos alertas e ignora os importantes.", timestampSeconds: 42 },
  { speaker: "Rafael", text: "Alert fatigue! E false positive versus true positive: a false positive fires when nothing malicious happened. A true positive is a real threat. And a false negative is the dangerous one: an attack that the tool did not detect.", timestampSeconds: 56 },
  { speaker: "Ana", text: "Perfeito. E incident response stages: detection, containment, eradication, recovery, lessons learned. Na entrevista, quando pedirem um exemplo, use o past tense: when I detected the phishing campaign, I contained the affected accounts and eradicated the malware.", timestampSeconds: 68 },
  { speaker: "Rafael", text: "Detected, contained, eradicated! Hora da entrevista simulada? Vaga de SOC Analyst nivel um na GlobalShield.", timestampSeconds: 81 },
  { speaker: "Ana", text: "Let's go! I'm the SOC manager. Question one: what would you do when a critical alert appears on your dashboard at three AM?", timestampSeconds: 88 },
  { speaker: "Rafael", text: "First, I would verify if the alert is a true positive by checking the raw logs and the context. Then I would triage it by severity, check the affected asset, and follow the playbook. If confirmed, I would escalate to the incident response lead and document every step with timestamps.", timestampSeconds: 97 },
  { speaker: "Ana", text: "Excellent answer! True positive, triage, playbook, escalate e document com timestamps. Segunda pergunta: how do you differentiate an IDS alert from an IPS action?", timestampSeconds: 111 },
  { speaker: "Rafael", text: "An IDS detects and alerts, but it is passive. An IPS sits inline and can block malicious traffic in real time. In the SOC, we investigate the IDS alerts and tune the rules to reduce false positives without missing true positives.", timestampSeconds: 121 },
  { speaker: "Ana", text: "Perfect! Tune the rules: ajustar as regras para reduzir falsos positivos. Ultima pergunta de comportamento: tell me about a time you handled a stressful situation during a shift.", timestampSeconds: 134 },
  { speaker: "Rafael", text: "During a night shift, our detection system flagged a ransomware attempt. I stayed calm, isolated the affected machines, blocked the command and control IP, and kept clear communication with the team until the threat was eradicated.", timestampSeconds: 143 },
  { speaker: "Ana", text: "Muito bem! Isolated, blocked the C2 IP, stayed calm e clear communication sao exatamente o que o SOC manager quer ouvir. Recap final do episodio: triage, escalate, contain, eradicate, false positive, true positive, alert fatigue, SLA, playbook e tune the rules. These are your ten words for the SOC interview.", timestampSeconds: 158 },
  { speaker: "Rafael", text: "Regra de sempre: grave-se respondendo em voz alta, compare com a nossa pronuncia e refaca ate soar natural. English for SOC Analyst, done!", timestampSeconds: 175 },
  { speaker: "Ana", text: "This was the CyberCast, English for SOC Analyst edition! Deixe seu feedback, refaca o quiz e continue treinando. See you in the next episode!", timestampSeconds: 183 },
];

export const ep73Episode = {
  id: "ep73",
  episodeNumber: 73,
  title: "English for SOC Analyst",
  description: "Triage, alertas e escalonamento: o vocabulario do dia a dia de um SOC internacional, com entrevista simulada.",
  topics: ["triage", "escalate", "contain", "eradicate", "false positive", "true positive", "alert fatigue", "SLA", "playbook", "tune the rules"],
  audioUrl: "/manus-storage/ep68-english-for-cyber-pros_bae9287d.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep73",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 73 — English for SOC Analyst",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep74 — English for Cloud Security: AWS e Azure em ingles: shared responsibility, IAM, KMS e misconfiguration para vagas internacionais de cloud security.
 */
export const ep74Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hello again! Eu sou a Ana, e hoje a trilha de ingles sobe para a nuvem: English for Cloud Security. Vagas de cloud security sao das mais bem pagas do mundo, e todas pedem ingles.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: shared responsibility model, IAM, encryption, KMS, misconfiguration. Ana, por onde comecamos?", timestampSeconds: 9 },
  { speaker: "Ana", text: "Pelo conceito que define tudo: the shared responsibility model. O provedor e responsavel pela seguranca da nuvem, security of the cloud, e o cliente, pela seguranca na nuvem, security in the cloud. O provedor protege o data center; voce protege seus dados, suas contas e suas configuracoes.", timestampSeconds: 18 },
  { speaker: "Rafael", text: "Of the cloud, in the cloud! E IAM? Identity and Access Management. IAM users, roles and policies control who can access what in the cloud.", timestampSeconds: 32 },
  { speaker: "Ana", text: "Isso mesmo. Vocabulario de IAM: least privilege, so o acesso minimo necessario. Root account, a conta raiz, protegida com MFA e raramente usada. Role: papel com permissoes temporarias. Policy: documento que define o que pode ou nao. And MFA: multi-factor authentication on every account.", timestampSeconds: 40 },
  { speaker: "Rafael", text: "Least privilege, root account, role, policy, MFA! E criptografia: KMS is the key management service. Customer managed keys give you control, and provider managed keys are simpler to maintain.", timestampSeconds: 55 },
  { speaker: "Ana", text: "Perfeito. E o erro mais comum na nuvem tem nome: misconfiguration. Um bucket publico, uma security group aberta, uma conta sem MFA. Most cloud breaches start with misconfiguration, not with a sophisticated hack. As palavras de ouro: public bucket, security group, access key, logging e audit.", timestampSeconds: 66 },
  { speaker: "Rafael", text: "Hora da entrevista! Vaga de Cloud Security Analyst na CloudFortress.", timestampSeconds: 80 },
  { speaker: "Ana", text: "Here we go! Question one: a developer left an S3 bucket public. How would you respond?", timestampSeconds: 86 },
  { speaker: "Rafael", text: "First, I would block public access on the bucket and check the access logs to see if any data was exposed. Then I would rotate the access keys, review the bucket policy, and enable encryption at rest. Finally, I would set up an automated check to prevent public buckets in the future.", timestampSeconds: 95 },
  { speaker: "Ana", text: "Excellent! Block public access, access logs, rotate the keys, encryption at rest e check automatizado. Segunda pergunta: explain the shared responsibility model to a non-technical manager.", timestampSeconds: 110 },
  { speaker: "Rafael", text: "Imagine renting an apartment. The building owner protects the building: the walls, the gates, the common areas. That is the cloud provider. But you must lock your own door, manage who has the keys, and not leave the window open. That is your responsibility in the cloud.", timestampSeconds: 119 },
  { speaker: "Ana", text: "Sensacional! A analogia do apartamento funciona em qualquer entrevista. Ultima pergunta: what is the biggest security risk in cloud environments today?", timestampSeconds: 135 },
  { speaker: "Rafael", text: "Misconfiguration. Overly permissive IAM policies, public storage buckets and missing MFA cause more incidents than advanced attacks. That is why I focus on infrastructure as code reviews, logging and continuous compliance checks.", timestampSeconds: 143 },
  { speaker: "Ana", text: "Perfeito: misconfiguration, overly permissive, logging e continuous compliance. Recap final: shared responsibility, IAM, least privilege, root account, KMS, misconfiguration, public bucket, rotate keys, encryption at rest e audit. Suas dez palavras para a vaga de cloud security.", timestampSeconds: 158 },
  { speaker: "Rafael", text: "Treine em voz alta todos os dias, compare com a gente e refaca ate soar natural. English for Cloud Security, nailed it!", timestampSeconds: 173 },
  { speaker: "Ana", text: "This was the CyberCast, English for Cloud Security edition! Deixe seu feedback, refaca o quiz e nos vemos no proximo episodio!", timestampSeconds: 181 },
];

export const ep74Episode = {
  id: "ep74",
  episodeNumber: 74,
  title: "English for Cloud Security",
  description: "AWS e Azure em ingles: shared responsibility, IAM, KMS e misconfiguration para vagas internacionais de cloud security.",
  topics: ["shared responsibility", "IAM", "least privilege", "KMS", "misconfiguration", "public bucket", "rotate keys", "encryption at rest", "security group", "audit"],
  audioUrl: "/manus-storage/ep70-cloud-security-interview_0daefd69.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep74",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 74 — English for Cloud Security",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep75 — English for Incident Response: Containment, eradication e lessons learned: o ingles da resposta a incidentes com entrevista simulada.
 */
export const ep75Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hey guys! Eu sou a Ana, e hoje o episodio e English for Incident Response. Responder a incidentes em ingles e exigencia em qualquer equipe internacional.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: containment, eradication, recovery, lessons learned, evidence chain. E simulamos uma vaga de IR analyst na CyberRescue.", timestampSeconds: 9 },
  { speaker: "Ana", text: "The six phases of incident response: preparation, identification, containment, eradication, recovery, lessons learned. Repita comigo!", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Containment! Eradication! Recovery! Ana, e como descrevo a linha do tempo de um incidente?", timestampSeconds: 33 },
  { speaker: "Ana", text: "Assim: we established a timeline of the attack. The initial access happened on Monday. The attacker moved laterally on Tuesday. We contained the threat on Wednesday. Establish a timeline: montar a linha do tempo. Initial access: acesso inicial. Lateral movement: movimento lateral. Dwell time: quanto tempo o atacante ficou no ambiente sem ser detectado.", timestampSeconds: 41 },
  { speaker: "Rafael", text: "Dwell time! E evidencia: chain of custody starts at collection. Every piece of evidence must be documented, hashed and stored securely to remain admissible.", timestampSeconds: 58 },
  { speaker: "Ana", text: "Perfeito. Vocabulario de contencao: isolate the affected machines, isolar as maquinas. Block the IP on the firewall, bloquear o IP. Disable the compromised account, desativar a conta comprometida. And forensic image: copia bit a bit do disco para analise sem alterar a original.", timestampSeconds: 68 },
  { speaker: "Rafael", text: "Isolate, block, disable, forensic image! Hora da entrevista na CyberRescue?", timestampSeconds: 82 },
  { speaker: "Ana", text: "Let's go! Question one: you found ransomware on a file server. Walk me through your response.", timestampSeconds: 87 },
  { speaker: "Rafael", text: "First, I would isolate the server from the network to contain the spread. Then I would preserve a forensic image of the disk and collect memory dumps. Next, I would identify the ransomware variant, check backups, and coordinate the recovery with the system owners. Finally, a post-incident report with lessons learned.", timestampSeconds: 96 },
  { speaker: "Ana", text: "Incrivel! Isolate, forensic image, memory dumps, coordinate the recovery e post-incident report. Segunda pergunta: how do you communicate an ongoing incident to the executive team?", timestampSeconds: 112 },
  { speaker: "Rafael", text: "I keep updates factual, timely and impact-focused. Executives need to know what happened, what is affected, what we are doing and what they need to decide. I avoid technical jargon and I never speculate about unconfirmed details.", timestampSeconds: 121 },
  { speaker: "Ana", text: "Factual, timely, impact-focused! Impacto, nao jargao. Ultima pergunta: why are lessons learned important after an incident?", timestampSeconds: 135 },
  { speaker: "Rafael", text: "Because every incident is a free lesson. A structured lessons learned session updates the playbooks, fixes the gaps that allowed the attack and trains the team. Without it, the same incident will happen again.", timestampSeconds: 143 },
  { speaker: "Ana", text: "Every incident is a free lesson, guarde essa frase! Recap final: containment, eradication, recovery, timeline, dwell time, chain of custody, forensic image, lateral movement, post-incident report e lessons learned. Suas dez palavras de incident response.", timestampSeconds: 157 },
  { speaker: "Rafael", text: "Grave-se, compare e refaca ate soar natural. English for Incident Response, mission accomplished!", timestampSeconds: 172 },
  { speaker: "Ana", text: "This was the CyberCast, English for Incident Response edition! Feedback, quiz e nos vemos no proximo!", timestampSeconds: 179 },
];

export const ep75Episode = {
  id: "ep75",
  episodeNumber: 75,
  title: "English for Incident Response",
  description: "Containment, eradication e lessons learned: o ingles da resposta a incidentes com entrevista simulada.",
  topics: ["containment", "eradication", "recovery", "timeline", "dwell time", "chain of custody", "forensic image", "lateral movement", "post-incident report", "lessons learned"],
  audioUrl: "/manus-storage/ep71-incident-response-interview_ae636a0e.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep75",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 75 — English for Incident Response",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep76 — English for Pentesting: Reconnaissance, exploitation e relatorio: o ingles do penetration tester internacional com entrevista simulada.
 */
export const ep76Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hey, hey! Eu sou a Ana, e hoje e English for Pentesting. O penetration tester internacional precisa reportar tudo em ingles, entao o vocabulario de relatorio e decisivo.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: reconnaissance, enumeration, exploit, payload, privilege escalation. E entrevista simulada na RedCell Security.", timestampSeconds: 9 },
  { speaker: "Ana", text: "First, the phases: reconnaissance, ri-con-nei-xans, gathering information before touching the target. Enumeration: e-niu-mei-rei-xan, finding open ports, services and users. Exploitation: ex-plo-i-tei-xan, testing a vulnerability safely. And reporting: delivering findings with severity, evidence and remediation.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Reconnaissance! Enumeration! Exploitation! Reporting! Ana, e CVSS? The CVSS score rates the severity of a vulnerability from zero to ten. Nine and above is critical.", timestampSeconds: 34 },
  { speaker: "Ana", text: "Isso. Vocabulario de exploracao: a proof of concept, the PoC, that demonstrates the vulnerability without causing damage. A false positive no pentest e caro: sempre validate before reporting. E as palavras de ouro do relatorio: severity, impact, likelihood, remediation e recommendation.", timestampSeconds: 44 },
  { speaker: "Rafael", text: "Severity: severidade. Impact: impacto. Likelihood: probabilidade. Remediation: correcao. Recommendation: recomendacao. Ana, e privilege escalation?", timestampSeconds: 58 },
  { speaker: "Ana", text: "Privilege escalation: escalar privilegios, subir de usuario comum para admin. Vertically: user to admin. Horizontally: same level, other user. E pivoting: usar uma maquina comprometida para acessar a rede interna.", timestampSeconds: 68 },
  { speaker: "Rafael", text: "Privilege escalation, pivoting! Hora da entrevista na RedCell Security?", timestampSeconds: 80 },
  { speaker: "Ana", text: "Here we go! Question one: how do you start an external penetration test?", timestampSeconds: 85 },
  { speaker: "Rafael", text: "I start with passive reconnaissance: OSINT, subdomains, exposed services, previous leaks. Then I enumerate the target, map the attack surface and prioritize based on the engagement scope. Everything happens within the signed scope of work, with written authorization.", timestampSeconds: 93 },
  { speaker: "Ana", text: "Scope of work e written authorization, as duas palavras mais importantes de qualquer pentest: nunca saia do escopo! Segunda pergunta: you found a critical SQL injection. What do you do?", timestampSeconds: 109 },
  { speaker: "Rafael", text: "I verify the finding with a safe proof of concept, like retrieving the database version, never extracting customer data. I document the evidence, classify it as critical on the CVSS scale, and recommend parameterized queries and input validation as remediation.", timestampSeconds: 118 },
  { speaker: "Rafael", text: "E nunca: drop the table em producao durante um teste autorizado sem controle. Destruicao de dado real esta fora do PoC seguro.", timestampSeconds: 130 },
  { speaker: "Ana", text: "Exato. Ultima pergunta: how do you explain a technical risk to a business client?", timestampSeconds: 136 },
  { speaker: "Rafael", text: "I translate severity into business impact: what could be stolen, what could stop, how much it would cost, and how fast we can fix it. A good report helps the client decide, not just scares them.", timestampSeconds: 144 },
  { speaker: "Ana", text: "Beautiful! Translate severity into business impact, esse e o diferencial do pentester senior. Recap final: reconnaissance, enumeration, exploitation, PoC, CVSS, privilege escalation, pivoting, scope of work, severity e remediation. Suas dez palavras de pentesting.", timestampSeconds: 156 },
  { speaker: "Rafael", text: "Treine em voz alta, compare e refaca. English for Pentesting, exploited successfully!", timestampSeconds: 170 },
  { speaker: "Ana", text: "This was the CyberCast, English for Pentesting edition! Deixe o feedback, refaca o quiz e ate o proximo episodio!", timestampSeconds: 177 },
];

export const ep76Episode = {
  id: "ep76",
  episodeNumber: 76,
  title: "English for Pentesting",
  description: "Reconnaissance, exploitation e relatorio: o ingles do penetration tester internacional com entrevista simulada.",
  topics: ["reconnaissance", "enumeration", "exploitation", "PoC", "CVSS", "privilege escalation", "pivoting", "scope of work", "severity", "remediation"],
  audioUrl: "/manus-storage/ep72-penetration-testing-interview_6def4bcb.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep76",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 76 — English for Pentesting",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep77 — English for Digital Forensics: Chain of custody, forensic image e hash verification: o ingles da pericia digital internacional.
 */
export const ep77Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hello investigators! Eu sou a Ana, e hoje e English for Digital Forensics. A pericia digital internacional exige vocabulario preciso: uma palavra errada pode invalidar uma evidencia.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: chain of custody, forensic image, hash verification, volatile data, admissible evidence. E uma entrevista na DigitalEvidence Lab.", timestampSeconds: 9 },
  { speaker: "Ana", text: "The golden rule: never alter the original evidence. Primeiro, preserve: create a bit-by-bit forensic image. Depois, verify: compare the hash values before and after analysis. MD5, SHA-1 e SHA-256 sao os algoritmos classicos de verificacao de integridade.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Bit-by-bit image! Hash verification! Ana, e volatile data?", timestampSeconds: 33 },
  { speaker: "Ana", text: "Volatile data sao os dados que se perdem quando o sistema desliga: running processes, network connections, memory contents, logged users. The order of volatility diz o que coletar primeiro: registros e conexoes de rede, depois memoria, depois disco. Memory first: memoria antes de tudo.", timestampSeconds: 40 },
  { speaker: "Rafael", text: "Memory first! E chain of custody: the documented record of who handled the evidence, when, where and why. Every transfer must be signed. Without chain of custody, the evidence is not admissible in court.", timestampSeconds: 54 },
  { speaker: "Ana", text: "Perfeito: admissible evidence e a evidencia aceitavel juridicamente. Vocabulario de analise: timeline analysis, linha do tempo dos artefatos. Deleted file recovery, recuperacao de arquivos apagados. Log correlation, correlacao de logs. And artifact: artefato, cada vestigio deixado pelo atacante.", timestampSeconds: 64 },
  { speaker: "Rafael", text: "Artifacts, timeline, correlation! Hora da entrevista no DigitalEvidence Lab?", timestampSeconds: 79 },
  { speaker: "Ana", text: "Let's go! Question one: you arrive at a company where an employee is suspected of data exfiltration. What is your first step?", timestampSeconds: 85 },
  { speaker: "Rafael", text: "My first step is to secure the scene and start the chain of custody. I identify the devices involved, collect volatile data like running processes and network connections, then create forensic images of the disks and verify the hashes before any analysis.", timestampSeconds: 95 },
  { speaker: "Ana", text: "Excellent chain: scene, custody, volatile data, image, hash. Segunda pergunta: how do you prove that a file was deleted intentionally and not automatically?", timestampSeconds: 110 },
  { speaker: "Rafael", text: "I analyze the file system metadata: timestamps, deletion logs and user activity around the event. If the user account performed the deletion after a suspicious access, and the timeline shows manual actions, the evidence points to intentional deletion. Everything documented and reproducible.", timestampSeconds: 119 },
  { speaker: "Ana", text: "Metadata, timestamps, reproducible! Ultima pergunta: what is the most common mistake in forensic investigations?", timestampSeconds: 134 },
  { speaker: "Rafael", text: "Analyzing the original media instead of the forensic image. Working on the original changes timestamps and can destroy evidence. Always work on the verified copy, never on the original.", timestampSeconds: 142 },
  { speaker: "Ana", text: "Always work on the verified copy, a regra numero um do perito. Recap final: chain of custody, forensic image, hash verification, volatile data, admissible evidence, artifact, timeline analysis, metadata, reproducible e exfiltration. Suas dez palavras de forense digital.", timestampSeconds: 154 },
  { speaker: "Rafael", text: "Grave-se, compare e refaca. English for Forensics, case closed!", timestampSeconds: 169 },
  { speaker: "Ana", text: "This was the CyberCast, English for Forensics edition! Feedback, quiz e nos vemos no proximo episodio!", timestampSeconds: 176 },
];

export const ep77Episode = {
  id: "ep77",
  episodeNumber: 77,
  title: "English for Digital Forensics",
  description: "Chain of custody, forensic image e hash verification: o ingles da pericia digital internacional.",
  topics: ["chain of custody", "forensic image", "hash verification", "volatile data", "admissible evidence", "artifact", "timeline analysis", "metadata", "reproducible", "exfiltration"],
  audioUrl: "/manus-storage/ep19-forense-resposta_6a5ae2af.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep77",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 77 — English for Digital Forensics",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep78 — English for GRC: Policy, risk assessment e compliance: o ingles de governanca, risco e compliance para vagas internacionais.
 */
export const ep78Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hey team! Eu sou a Ana, e hoje e English for GRC, governance, risk and compliance. As vagas de GRC em multinacionais sao quase sempre em ingles.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: policy, standard, procedure, risk assessment, audit, controls. E entrevista simulada na ComplianceFirst.", timestampSeconds: 8 },
  { speaker: "Ana", text: "The hierarchy of documents: policy, a politica, direcao de alto nivel. Standard, o padrao, requisitos minimos obrigatorios. Procedure, o procedimento, passo a passo de execucao. Guideline, a diretriz, orientacao recomendada. Resumindo: policy says what, standard says how much, procedure says how.", timestampSeconds: 17 },
  { speaker: "Rafael", text: "Policy says what, standard says how much, procedure says how! Ana, e risk assessment?", timestampSeconds: 32 },
  { speaker: "Ana", text: "Risk assessment avalia risco com dois fatores: likelihood, probabilidade de ocorrencia, e impact, impacto se ocorrer. Risk equals likelihood times impact. Mitigate: mitigar. Transfer: transferir, como com seguro. Accept: aceitar com aprovacao formal. Avoid: evitar eliminando a atividade.", timestampSeconds: 40 },
  { speaker: "Rafael", text: "Likelihood, impact, mitigate, transfer, accept, avoid! E compliance: compliance with ISO 27001 requires an ISMS, risk treatment and internal audits. Non-compliance findings must be tracked and closed.", timestampSeconds: 54 },
  { speaker: "Ana", text: "ISMS, information security management system. Audit finding: a nao conformidade encontrada. Corrective action: acao corretiva. Remediation plan: plano de correcao com prazo e responsavel. E as palavras de ouro: audit trail, evidence, remediation, stakeholder e accountability.", timestampSeconds: 64 },
  { speaker: "Rafael", text: "Audit trail, evidence, remediation, stakeholder, accountability! Hora da entrevista na ComplianceFirst?", timestampSeconds: 79 },
  { speaker: "Ana", text: "Let's go! Question one: how would you explain risk to a board member?", timestampSeconds: 84 },
  { speaker: "Rafael", text: "I would say that risk is the chance of something bad happening multiplied by how bad it would be. Our job is to measure that chance, decide if we can reduce it, transfer it or accept it, and keep the board informed with clear metrics and trends.", timestampSeconds: 92 },
  { speaker: "Ana", text: "Perfect! Metricas e tendencias, nao siglas. Segunda pergunta: an internal audit found that privileged accounts are not reviewed. What do you do?", timestampSeconds: 107 },
  { speaker: "Rafael", text: "First, I classify the finding by severity. Then I work with the IT team to create a remediation plan with a clear deadline and owner. I schedule a recurring privileged access review, and I track the corrective action until closure, reporting progress to the audit committee.", timestampSeconds: 116 },
  { speaker: "Ana", text: "Severity, remediation plan, owner, recurring review, closure e audit committee, o ciclo completo de GRC! Ultima pergunta: why are policies important beyond compliance?", timestampSeconds: 132 },
  { speaker: "Rafael", text: "Policies create consistency and accountability. When an incident happens, policies define who should have done what. They also protect the organization legally and make training measurable. A policy is not paperwork; it is the foundation of repeatable security.", timestampSeconds: 141 },
  { speaker: "Ana", text: "Repeatable security, seguranca repetivel. Recap final: policy, standard, procedure, likelihood, impact, mitigate, ISMS, corrective action, audit trail e accountability. Suas dez palavras de GRC.", timestampSeconds: 155 },
  { speaker: "Rafael", text: "Treine em voz alta, compare e refaca. English for GRC, fully compliant!", timestampSeconds: 168 },
  { speaker: "Ana", text: "This was the CyberCast, English for GRC edition! Deixe o feedback, refaca o quiz e ate o proximo episodio!", timestampSeconds: 175 },
];

export const ep78Episode = {
  id: "ep78",
  episodeNumber: 78,
  title: "English for GRC",
  description: "Policy, risk assessment e compliance: o ingles de governanca, risco e compliance para vagas internacionais.",
  topics: ["policy", "standard", "procedure", "likelihood", "impact", "mitigate", "ISMS", "corrective action", "audit trail", "accountability"],
  audioUrl: "/manus-storage/ep20-governanca-risco_d7215fc4.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep78",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 78 — English for GRC",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep79 — English for Threat Intelligence: IOC, TTP, attribution e OSINT: o ingles de inteligencia de ameacas com entrevista simulada.
 */
export const ep79Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hello intel hunters! Eu sou a Ana, e hoje e English for Threat Intelligence. Quem trabalha com CTI em equipe internacional vive em ingles.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: IOC, TTP, threat actor, attribution, OSINT. E entrevista na ShadowWatch Intel.", timestampSeconds: 8 },
  { speaker: "Ana", text: "Start with the pyramid of pain: hash values are easy for the attacker to change. IP addresses too. But TTPs, tactics, techniques and procedures, TTPs hurt the most. Tactics: os objetivos do atacante. Techniques: os metodos. Procedures: a forma como ele executa. Pronuncia: tak-tiks, tek-niks, pra-si-jars.", timestampSeconds: 17 },
  { speaker: "Rafael", text: "Tactics, techniques, procedures! E IOCs, indicators of compromise: malicious IPs, file hashes, suspicious domains. An IOC helps detect, but a TTP helps prevent the next attack.", timestampSeconds: 33 },
  { speaker: "Ana", text: "Detect versus prevent, bom resumo. Vocabulario de atores: threat actor, advanced persistent threat, the APT, nation-state actor, cybercriminal group. Attribution: a-tri-biu-xan, identificar quem esta por tras. E MITRE ATT&CK: o framework que classifica tecnicas. Browse the matrix: navegar pela matriz.", timestampSeconds: 43 },
  { speaker: "Rafael", text: "APT, nation-state, attribution, MITRE matrix! E OSINT: open source intelligence. We gather information from public sources: DNS records, social media, leaked databases.", timestampSeconds: 58 },
  { speaker: "Ana", text: "Exactly. Palavras de ouro do CTI: indicator, adversary, campaign, targeting, sector, infrastructure, payload, command and control, the C2, e kill chain. Kill chain: a cadeia de etapas do ataque, do reconhecimento a acao sobre os objetivos.", timestampSeconds: 67 },
  { speaker: "Rafael", text: "Indicator, adversary, campaign, C2, kill chain! Hora da entrevista na ShadowWatch Intel?", timestampSeconds: 81 },
  { speaker: "Ana", text: "Here we go! Question one: you found a new indicator from a known APT. What is your process?", timestampSeconds: 87 },
  { speaker: "Rafael", text: "First, I validate the indicator to reduce false positives. Then I enrich it with context: which infrastructure it belongs to, which sectors are targeted and which techniques from the MITRE matrix it maps to. Finally, I share it with the SOC for detection tuning and with management in a brief threat report.", timestampSeconds: 96 },
  { speaker: "Ana", text: "Validate, enrich, map to MITRE, share with SOC e threat report, o fluxo completo! Segunda pergunta: what is the difference between tactical, operational and strategic intelligence?", timestampSeconds: 111 },
  { speaker: "Rafael", text: "Tactical intelligence gives IOCs for detection tools. Operational intelligence tells us what campaigns are active and how they behave. Strategic intelligence helps leaders understand long-term trends and risks to the business. Different audiences, different products.", timestampSeconds: 120 },
  { speaker: "Ana", text: "Different audiences, different products, frase de senior. Ultima pergunta: why should organizations invest in threat intelligence?", timestampSeconds: 134 },
  { speaker: "Rafael", text: "Because threat intelligence turns reactive security into proactive security. Instead of waiting to be hit, we anticipate the adversaries targeting our sector and harden our defenses before the attack arrives.", timestampSeconds: 141 },
  { speaker: "Ana", text: "From reactive to proactive, esse e o pitch perfeito. Recap final: IOC, TTP, threat actor, APT, attribution, OSINT, adversary, campaign, kill chain e proactive security. Suas dez palavras de threat intelligence.", timestampSeconds: 153 },
  { speaker: "Rafael", text: "Grave-se, compare e refaca. English for Threat Intelligence, intel gathered!", timestampSeconds: 166 },
  { speaker: "Ana", text: "This was the CyberCast, English for Threat Intelligence edition! Feedback, quiz e nos vemos no proximo!", timestampSeconds: 173 },
];

export const ep79Episode = {
  id: "ep79",
  episodeNumber: 79,
  title: "English for Threat Intelligence",
  description: "IOC, TTP, attribution e OSINT: o ingles de inteligencia de ameacas com entrevista simulada.",
  topics: ["IOC", "TTP", "threat actor", "APT", "attribution", "OSINT", "adversary", "campaign", "kill chain", "proactive security"],
  audioUrl: "/manus-storage/ep32-threat-intel-osint_1549cfdc.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep79",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 79 — English for Threat Intelligence",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep80 — English for DevSecOps: CI/CD, SAST/DAST e shift-left: o ingles da seguranca em pipeline com entrevista simulada.
 */
export const ep80Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hi devs and sec folks! Eu sou a Ana, e hoje e English for DevSecOps. A engenharia de aplicacao segura e uma das areas que mais cresce, e o vocabulario e todo em ingles.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: CI/CD pipeline, SAST, DAST, shift-left, dependency scanning. E entrevista na SecurePipeline.", timestampSeconds: 9 },
  { speaker: "Ana", text: "The philosophy: shift-left, desloque a seguranca para o inicio do ciclo. Em vez de testar seguranca no fim, integre desde o codigo. Shift-left: xift-left. Vocabulario do pipeline: commit, build, deploy, rollback, artifact, environment.", timestampSeconds: 18 },
  { speaker: "Rafael", text: "Commit, build, deploy, rollback, artifact, environment! Ana, SAST e DAST: SAST analyzes source code without running it, white-box. DAST tests the running application from the outside, black-box.", timestampSeconds: 33 },
  { speaker: "Ana", text: "White-box e black-box, perfeito. SAST: static application security testing, encontra vulnerabilidades no codigo, como SQL injection e hardcoded secrets. DAST: dynamic application security testing, testa a aplicacao em execucao. E o trio IAST, SCA e secret scanning: interactive testing, software composition analysis de dependencias e busca de segredos vazados no codigo.", timestampSeconds: 43 },
  { speaker: "Rafael", text: "SCA! E OWASP Top Ten: the ten most critical web risks, like injection, broken access control e vulnerable components. Ana, e como eu insiro a seguranca sem virar inimigo do dev?", timestampSeconds: 58 },
  { speaker: "Ana", text: "Palavras de ouro: frictionless, sem atrito. Automate security checks in the pipeline, give developers fast feedback, fix findings at the commit level. Security champions: desenvolvedores que viram embaixadores da seguranca no time. Gate: o ponto de controle que bloqueia deploy com vulnerabilidade critica.", timestampSeconds: 68 },
  { speaker: "Rafael", text: "Frictionless, security champions, pipeline gate! Hora da entrevista na SecurePipeline?", timestampSeconds: 81 },
  { speaker: "Ana", text: "Let's go! Question one: how do you integrate security into a CI/CD pipeline?", timestampSeconds: 86 },
  { speaker: "Rafael", text: "I integrate SAST on every pull request, so developers get feedback before merging. I run SCA to check dependencies, secret scanning to catch leaked keys, and DAST against the staging environment. Critical findings block the deployment through a pipeline gate.", timestampSeconds: 95 },
  { speaker: "Ana", text: "Pull request, SCA, secret scanning, staging, pipeline gate! Segunda pergunta: developers complain that security slows them down. How do you respond?", timestampSeconds: 110 },
  { speaker: "Rafael", text: "I measure it. Most security feedback takes seconds when it runs on the PR. I show the team the data: faster fixes early are cheaper than emergency patches in production. And I appoint security champions inside the dev teams to make security a shared responsibility.", timestampSeconds: 119 },
  { speaker: "Ana", text: "I measure it, dados vencem argumentos. Ultima pergunta: what is the most dangerous secret management failure?", timestampSeconds: 133 },
  { speaker: "Rafael", text: "Hardcoded credentials in source code. Once committed, the secret is leaked forever, even if removed later, because git history keeps it. The fix is automated secret scanning plus a proper vault for credential management.", timestampSeconds: 141 },
  { speaker: "Ana", text: "Git history keeps it forever, alerta perfeito. Recap final: shift-left, CI/CD pipeline, SAST, DAST, SCA, secret scanning, pull request, pipeline gate, security champions e hardcoded credentials. Suas dez palavras de DevSecOps.", timestampSeconds: 154 },
  { speaker: "Rafael", text: "Treine em voz alta, compare e refaca. English for DevSecOps, shipped securely!", timestampSeconds: 167 },
  { speaker: "Ana", text: "This was the CyberCast, English for DevSecOps edition! Feedback, quiz e ate o proximo episodio!", timestampSeconds: 174 },
];

export const ep80Episode = {
  id: "ep80",
  episodeNumber: 80,
  title: "English for DevSecOps",
  description: "CI/CD, SAST/DAST e shift-left: o ingles da seguranca em pipeline com entrevista simulada.",
  topics: ["shift-left", "CI/CD pipeline", "SAST", "DAST", "SCA", "secret scanning", "pull request", "pipeline gate", "security champions", "hardcoded credentials"],
  audioUrl: "/manus-storage/ep31-devseguro-automacao_d22e03c9.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep80",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 80 — English for DevSecOps",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep81 — English for Security Operations 2: SIEM queries, playbooks e escalation matrix: o ingles avancado da rotina de SOC.
 */
export const ep81Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Welcome back to the advanced SOC block! Eu sou a Ana, e hoje e English for Security Operations, nivel dois: SIEM queries, playbooks e escalation matrix.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: query, correlation rule, false positive rate, playbook, escalation matrix, handover. E entrevista na NovaShield SOC.", timestampSeconds: 9 },
  { speaker: "Ana", text: "A base de tudo no SIEM: query, kwiu-e-ri, a consulta que busca eventos. Correlation rule: a regra que junta eventos dispersos em um alerta significativo. Tuning: ajustar regras para reduzir ruido. E as palavras de consulta: source IP, destination, event count, timeframe, threshold, limiar.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Source IP, destination, event count, timeframe, threshold! Ana, como eu descrevo uma query de brute force?", timestampSeconds: 34 },
  { speaker: "Ana", text: "Assim: I wrote a correlation rule that counts failed logins per source IP within a five-minute timeframe. When the count exceeds the threshold of ten attempts, the SIEM generates a high severity alert. Wrote a rule, counts failed logins, exceeds the threshold.", timestampSeconds: 42 },
  { speaker: "Rafael", text: "Wrote, counts, exceeds! E playbook: the documented step-by-step response for each alert type. Each playbook defines who does what, in which order, with which tools.", timestampSeconds: 57 },
  { speaker: "Ana", text: "Isso. E escalation matrix: matriz de escalonamento, quem e acionado a cada nivel de severidade. Handover: a passagem de plantao entre turnos. Runbook: o manual operacional. E de ouro: dwell time, triage queue, severity levels, SLA breach, estouro de prazo, e after action review.", timestampSeconds: 67 },
  { speaker: "Rafael", text: "Escalation matrix, handover, SLA breach, after action review! Hora da entrevista na NovaShield?", timestampSeconds: 81 },
  { speaker: "Ana", text: "Let's go! Question one: the alert queue is full and you are alone on shift. How do you prioritize?", timestampSeconds: 87 },
  { speaker: "Rafael", text: "I prioritize by severity and asset criticality. Critical alerts on production servers come first, followed by high severity alerts with active indicators. I communicate the backlog to the team lead and request support if an SLA breach becomes likely.", timestampSeconds: 96 },
  { speaker: "Ana", text: "Asset criticality e SLA breach, priorizacao com criterio de negocio! Segunda pergunta: how do you improve a detection rule that generates too many false positives?", timestampSeconds: 111 },
  { speaker: "Rafael", text: "I analyze the false positives to find the pattern: a legitimate backup, a scanner, a busy admin. Then I tune the rule with exclusions and context, test it against historical data, and monitor the false positive rate after deployment. I never disable a rule without an alternative control.", timestampSeconds: 120 },
  { speaker: "Ana", text: "Tune, test against historical data, false positive rate! Ultima pergunta: what makes a good handover between SOC shifts?", timestampSeconds: 134 },
  { speaker: "Rafael", text: "A good handover covers open incidents, pending escalations, ongoing investigations and anything unusual spotted during the shift. Written notes, a quick verbal sync, and clear ownership of each open item. The next shift must continue, not restart.", timestampSeconds: 142 },
  { speaker: "Ana", text: "The next shift must continue, not restart, definicao perfeita de handover. Recap final: query, correlation rule, tuning, threshold, playbook, escalation matrix, handover, SLA breach, asset criticality e after action review. Suas dez palavras do SOC avancado.", timestampSeconds: 155 },
  { speaker: "Rafael", text: "Grave-se, compare e refaca. English for Security Operations two, shift secured!", timestampSeconds: 169 },
  { speaker: "Ana", text: "This was the CyberCast, English for Security Operations two edition! Feedback, quiz e ate o proximo!", timestampSeconds: 176 },
];

export const ep81Episode = {
  id: "ep81",
  episodeNumber: 81,
  title: "English for Security Operations 2",
  description: "SIEM queries, playbooks e escalation matrix: o ingles avancado da rotina de SOC.",
  topics: ["query", "correlation rule", "tuning", "threshold", "playbook", "escalation matrix", "handover", "SLA breach", "asset criticality", "after action review"],
  audioUrl: "/manus-storage/ep04-security-operations_90f7cff1.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep81",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 81 — English for Security Operations 2",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep82 — English for Malware Analysis: Sandbox, unpacking e analise comportamental: o ingles do malware analyst internacional.
 */
export const ep82Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hey malware hunters! Eu sou a Ana, e hoje e English for Malware Analysis. O analista de malware internacional vive em ingles, e as entrevistas tecnicas sao profundas.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: sandbox, unpacking, behavioral analysis, persistence, C2 callback. E entrevista na MalwareLab Research.", timestampSeconds: 9 },
  { speaker: "Ana", text: "The two worlds: static analysis, ri-a-na-li-sis, examina o arquivo sem executa-lo. Dynamic analysis: observa o comportamento em execucao, normalmente em uma sandbox, sand-boks, ambiente isolado e seguro. Static finds what it is. Dynamic finds what it does.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Static finds what it is, dynamic finds what it does! Ana, e unpacking?", timestampSeconds: 34 },
  { speaker: "Ana", text: "Unpacking: descompactar o codigo ofuscado em memoria para revelar o payload real. Many malware pack themselves to evade detection. E vocabulario de comportamento: persistence, a capacidade de sobreviver ao reinicio, via registry keys ou scheduled tasks. And C2 callback: the malware phones home to receive commands.", timestampSeconds: 41 },
  { speaker: "Rafael", text: "Persistence, C2 callback, phones home! E as palavras de ouro: obfuscation, ofuscacao. Encryption routine, rotina de criptografia. Anti-debugging, anti-depuracao. And YARA rules: regras para catar familias de malware.", timestampSeconds: 56 },
  { speaker: "Ana", text: "YARA rules: ia-ra riuls. E analise de strings: buscar URLs, paths e comandos embutidos. Palavras da entrevista: benign, benigno. Malicious, malicioso. Suspicious, suspeito. Payload, pei-loud. E evasive techniques: tecnicas para fugir da deteccao.", timestampSeconds: 67 },
  { speaker: "Rafael", text: "Benign, malicious, suspicious, payload, evasive techniques! Hora da entrevista no MalwareLab Research?", timestampSeconds: 80 },
  { speaker: "Ana", text: "Here we go! Question one: you receive an unknown executable from an incident. Walk me through your analysis.", timestampSeconds: 86 },
  { speaker: "Rafael", text: "I start with static analysis: check the hash, examine strings, identify packers and scan with YARA rules. If nothing obvious appears, I execute it in an isolated sandbox and monitor behavior: file creation, registry changes, network callbacks. Then I write a report with indicators and detection rules.", timestampSeconds: 95 },
  { speaker: "Ana", text: "Static, strings, packers, sandbox, behavior, report! Segunda pergunta: the malware is packed and obfuscated. What do you do?", timestampSeconds: 110 },
  { speaker: "Rafael", text: "I use dynamic analysis to unpack it: run it in a controlled sandbox, dump the memory after unpacking, and analyze the revealed payload statically. If needed, I set breakpoints on suspicious API calls like URL download or registry persistence, and I document every behavior.", timestampSeconds: 119 },
  { speaker: "Ana", text: "Memory dump, breakpoints, API calls! Ultima pergunta: why is malware analysis important for the whole security team?", timestampSeconds: 133 },
  { speaker: "Rafael", text: "Because malware analysis turns an incident into intelligence. The indicators we extract improve detection for everyone, the YARA rules catch the family across the organization, and the behavior report helps the IR team respond faster to the next attack.", timestampSeconds: 141 },
  { speaker: "Ana", text: "From incident to intelligence, o valor do analista. Recap final: static analysis, dynamic analysis, sandbox, unpacking, persistence, C2 callback, obfuscation, anti-debugging, YARA rules e evasive techniques. Suas dez palavras de malware analysis.", timestampSeconds: 154 },
  { speaker: "Rafael", text: "Treine em voz alta, compare e refaca. English for Malware Analysis, unpacked and analyzed!", timestampSeconds: 168 },
  { speaker: "Ana", text: "This was the CyberCast, English for Malware Analysis edition! Feedback, quiz e ate o proximo!", timestampSeconds: 176 },
];

export const ep82Episode = {
  id: "ep82",
  episodeNumber: 82,
  title: "English for Malware Analysis",
  description: "Sandbox, unpacking e analise comportamental: o ingles do malware analyst internacional.",
  topics: ["static analysis", "dynamic analysis", "sandbox", "unpacking", "persistence", "C2 callback", "obfuscation", "anti-debugging", "YARA rules", "evasive techniques"],
  audioUrl: "/manus-storage/ep53-malware-familias-analise_503d1ef3.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep82",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 82 — English for Malware Analysis",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep83 — English for Identity and Access Management: Provisioning, SSO, Kerberos e just-in-time: o ingles da gestao de identidades internacional.
 */
export const ep83Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hello identity pros! Eu sou a Ana, e hoje e English for Identity and Access Management. A gestao de identidades e o novo perimetro, e as vagas internacionais cobram ingles tecnico.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: provisioning, deprovisioning, SSO, MFA, Kerberos, privilege review. E entrevista na IdentityGuard.", timestampSeconds: 9 },
  { speaker: "Ana", text: "O ciclo de vida da identidade: provisioning, provi-je-nang, criar o acesso quando a pessoa entra. Deprovisioning: remover tudo quando ela sai. Role-based access control: permissoes por funcao. And password policy: complexidade, expiracao e bloqueio apos tentativas.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Provisioning, deprovisioning, RBAC, password policy! Ana, e SSO?", timestampSeconds: 34 },
  { speaker: "Ana", text: "SSO, single sign-on, singol-sain-on, um login para muitos sistemas. O usuario autentica uma vez no identity provider, o IdP, e acessa todas as aplicacoes federadas. Protocols: SAML, sam-l, para aplicacoes empresariais, e OAuth para autorizacao delegada, com OpenID Connect adicionando identidade. Never confuse OAuth with authentication alone.", timestampSeconds: 42 },
  { speaker: "Rafael", text: "SAML for enterprise apps, OAuth for delegated authorization, OIDC adds identity! E Kerberos: the ticket-based authentication protocol used in Active Directory. The user gets a ticket granting ticket, then service tickets for each resource.", timestampSeconds: 57 },
  { speaker: "Ana", text: "Perfeito. Vocabulario de ouro: orphaned account, conta orfa, de ex-funcionario ainda ativa. Privileged account, conta privilegiada. Just-in-time access, acesso sob demanda, com prazo. Password spraying: ataque que testa senhas comuns contra muitos usuarios. And audit log: o registro de quem acessou o que.", timestampSeconds: 67 },
  { speaker: "Rafael", text: "Orphaned account, just-in-time, password spraying, audit log! Hora da entrevista na IdentityGuard?", timestampSeconds: 80 },
  { speaker: "Ana", text: "Let's go! Question one: an employee changes from marketing to finance. What should happen to their access?", timestampSeconds: 86 },
  { speaker: "Rafael", text: "A role change triggers an access review. I remove the marketing permissions that are no longer needed, apply the finance role with least privilege, and verify the change in the audit log. Access must always match the current role, not the history.", timestampSeconds: 95 },
  { speaker: "Ana", text: "Role change, access review, least privilege, audit log! Segunda pergunta: how do you reduce the risk of privileged accounts?", timestampSeconds: 110 },
  { speaker: "Rafael", text: "I enforce MFA on all privileged accounts, use just-in-time elevation instead of permanent admin rights, rotate credentials regularly, and monitor privileged sessions. Every admin action must be logged and reviewed.", timestampSeconds: 118 },
  { speaker: "Ana", text: "JIT elevation, credential rotation, session monitoring! Ultima pergunta: why is deprovisioning so critical?", timestampSeconds: 132 },
  { speaker: "Rafael", text: "Because orphaned accounts are an open door. If a former employee keeps access, their old credentials can be sold, guessed or abused. Automated deprovisioning on the first day of departure closes that door permanently.", timestampSeconds: 139 },
  { speaker: "Ana", text: "An open door, a melhor metafora de IAM. Recap final: provisioning, deprovisioning, RBAC, SSO, IdP, SAML, Kerberos, orphaned account, just-in-time e password spraying. Suas dez palavras de identidade.", timestampSeconds: 152 },
  { speaker: "Rafael", text: "Grave-se, compare e refaca. English for IAM, identity verified!", timestampSeconds: 165 },
  { speaker: "Ana", text: "This was the CyberCast, English for IAM edition! Feedback, quiz e ate o proximo episodio!", timestampSeconds: 172 },
];

export const ep83Episode = {
  id: "ep83",
  episodeNumber: 83,
  title: "English for Identity and Access Management",
  description: "Provisioning, SSO, Kerberos e just-in-time: o ingles da gestao de identidades internacional.",
  topics: ["provisioning", "deprovisioning", "RBAC", "SSO", "IdP", "SAML", "Kerberos", "orphaned account", "just-in-time", "password spraying"],
  audioUrl: "/manus-storage/ep13-identidade-acesso_f601c4de.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep83",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 83 — English for Identity and Access Management",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep84 — English for Cryptography: Symmetric, hashing, digital signature e TLS handshake: o ingles tecnico da criptografia em entrevistas.
 */
export const ep84Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hey crypto folks! Eu sou a Ana, e hoje e English for Cryptography. A criptografia tem um vocabulario proprio, e as entrevistas tecnicas adoram testa-lo.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: symmetric, asymmetric, hashing, digital signature, TLS handshake, key exchange. E entrevista na CryptoShield Research.", timestampSeconds: 9 },
  { speaker: "Ana", text: "The basics: symmetric encryption, sin-me-trik, usa a mesma chave para cifrar e decifrar. Fast, but key distribution is the challenge. Asymmetric, ei-sin-me-trik, usa par de chaves: public key cifra, private key decifra.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Public key encrypts, private key decrypts! Ana, e hashing?", timestampSeconds: 34 },
  { speaker: "Ana", text: "Hashing is one-way: o hash converte o dado em uma impressao digital fixa. It is not encryption, because you cannot reverse it. Used for passwords, integrity checks e digital signatures. Collision resistant: djirij-an rizis-tant, impossivel achar dois dados com o mesmo hash.", timestampSeconds: 41 },
  { speaker: "Rafael", text: "Collision resistant! E digital signature: I hash the document and encrypt the hash with my private key. The receiver decrypts with my public key and compares the hashes. If they match, the signature is valid: it proves authenticity and integrity.", timestampSeconds: 54 },
  { speaker: "Ana", text: "Perfeito: authenticity, autenticidade, integrity, integridade, non-repudiation, nao repudio. Vocabulario de ouro: key exchange, troca de chaves, certificate authority, autoridade certificadora, root of trust, raiz de confianca, e TLS handshake, a negociacao segura da conexao.", timestampSeconds: 66 },
  { speaker: "Rafael", text: "Certificate authority, root of trust, TLS handshake! Hora da entrevista na CryptoShield Research?", timestampSeconds: 80 },
  { speaker: "Ana", text: "Let's go! Question one: explain TLS to a junior developer.", timestampSeconds: 86 },
  { speaker: "Rafael", text: "TLS protects data in transit. During the handshake, the server proves its identity with a certificate signed by a certificate authority, and the client and server agree on a symmetric session key using asymmetric cryptography. From that moment, everything is encrypted with the session key.", timestampSeconds: 95 },
  { speaker: "Ana", text: "Certificate, handshake, session key, encrypts in transit! Segunda pergunta: why do we hash passwords instead of encrypting them?", timestampSeconds: 110 },
  { speaker: "Rafael", text: "Because hashing is one-way. If we encrypt passwords, whoever holds the key can decrypt them all. With hashing plus salting and slow algorithms like bcrypt, attackers must brute force each password individually, which is much harder at scale.", timestampSeconds: 118 },
  { speaker: "Ana", text: "One-way, salting, brute force! Ultima pergunta: a certificate expired and users see a warning. What happened?", timestampSeconds: 132 },
  { speaker: "Rafael", text: "The certificate has a validity period, and renewal must happen before it ends. An expired certificate breaks trust: browsers warn users and services may refuse connections. The fix is automated certificate management with monitoring and renewal before expiry.", timestampSeconds: 140 },
  { speaker: "Ana", text: "Validity period, automated renewal, o classico esquecido. Recap final: symmetric, asymmetric, hashing, collision resistant, digital signature, non-repudiation, TLS handshake, certificate authority, key exchange e salting. Suas dez palavras de criptografia.", timestampSeconds: 154 },
  { speaker: "Rafael", text: "Treine em voz alta, compare e refaca. English for Cryptography, handshake complete!", timestampSeconds: 167 },
  { speaker: "Ana", text: "This was the CyberCast, English for Cryptography edition! Feedback, quiz e ate o proximo episodio!", timestampSeconds: 174 },
];

export const ep84Episode = {
  id: "ep84",
  episodeNumber: 84,
  title: "English for Cryptography",
  description: "Symmetric, hashing, digital signature e TLS handshake: o ingles tecnico da criptografia em entrevistas.",
  topics: ["symmetric", "asymmetric", "hashing", "collision resistant", "digital signature", "non-repudiation", "TLS handshake", "certificate authority", "key exchange", "salting"],
  audioUrl: "/manus-storage/ep12-criptografia-pki_7a794d5d.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep84",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 84 — English for Cryptography",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep85 — English Interview Mastery: O metodo STAR para perguntas comportamentais: respostas modelo em ingles para entrevistas internacionais.
 */
export const ep85Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hey career seekers! Eu sou a Ana, e hoje e English Interview Mastery: o metodo STAR para responder perguntas comportamentais em entrevistas internacionais.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: behavioral questions, the STAR method, situation, task, action, result. E simulamos tres perguntas classicas com respostas modelo.", timestampSeconds: 9 },
  { speaker: "Ana", text: "O STAR: situation, descreva o contexto em uma frase. Task, qual era sua responsabilidade. Action, o que voce fez, com verbos fortes. Result, o resultado mensuravel. Situacao, tarefa, acao, resultado. E os verbos de ouro: led, designed, detected, implemented, reduced, prevented.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Led, designed, detected, implemented, reduced, prevented! Ana, o erro mais comum?", timestampSeconds: 34 },
  { speaker: "Ana", text: "Responder com we, nos, o tempo todo. O entrevistador quer saber o que voce fez, entao use I, eu. Mas cuidado: nunca minta. Escolha experiencias reais e conte sua parte com honestidade. E sempre termine com o resultado: I reduced the incident response time by forty percent.", timestampSeconds: 41 },
  { speaker: "Rafael", text: "I reduced by forty percent! Hora das perguntas classicas?", timestampSeconds: 55 },
  { speaker: "Ana", text: "Question one: tell me about yourself. Rafael?", timestampSeconds: 60 },
  { speaker: "Rafael", text: "I am a security analyst with three years of experience in a SOC environment. I started as a monitoring analyst, then moved to incident response, where I designed a playbook that cut response time by forty percent. Now I am looking for a role where I can grow into detection engineering.", timestampSeconds: 68 },
  { speaker: "Ana", text: "Presente, passado, presente: experiencia atual, marco com numero e direcao. Segunda pergunta: tell me about a challenge you faced.", timestampSeconds: 83 },
  { speaker: "Rafael", text: "During a major phishing campaign, we received hundreds of alerts per hour. My task was to prioritize them. I built an automated triage script that grouped alerts by sender domain and reputation. As a result, we contained the campaign two hours faster than our previous best time.", timestampSeconds: 92 },
  { speaker: "Ana", text: "STAR completo: situation, task, action com I built, result com numero. Terceira pergunta: why do you want to work here?", timestampSeconds: 107 },
  { speaker: "Rafael", text: "Your team publishes research on emerging threats, and I follow it every month. I want to work where detection innovation is valued, and I believe my experience with automation and incident response fits your roadmap.", timestampSeconds: 115 },
  { speaker: "Ana", text: "Pesquisar a empresa antes da entrevista e citar algo especifico, isso diferencia o candidato preparado. Recap final: STAR, situation, task, action, result, I instead of we, measurable result, preparation e honestidade. Suas ferramentas de entrevista comportamental.", timestampSeconds: 128 },
  { speaker: "Rafael", text: "Grave-se respondendo em voz alta, cronometre dois minutos e refaca ate soar natural. English Interview Mastery, you got this!", timestampSeconds: 140 },
  { speaker: "Ana", text: "This was the CyberCast, English Interview Mastery edition! Feedback, quiz e ate o proximo!", timestampSeconds: 147 },
];

export const ep85Episode = {
  id: "ep85",
  episodeNumber: 85,
  title: "English Interview Mastery",
  description: "O metodo STAR para perguntas comportamentais: respostas modelo em ingles para entrevistas internacionais.",
  topics: ["STAR method", "situation", "task", "action", "result", "measurable result", "I instead of we", "tell me about yourself", "why do you want to work here", "preparation"],
  audioUrl: "/manus-storage/ep69-network-security-interview_54014d2f.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep85",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 85 — English Interview Mastery",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep86 — English Certification Path: Como apresentar certificações em ingles no CV, LinkedIn e entrevistas internacionais.
 */
export const ep86Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hello cert hunters! Eu sou a Ana, e hoje e English Certification Path: como apresentar suas certificacoes de seguranca em ingles para o mercado internacional.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: credentials, exam, validity, continuing education, verification. E como falar das suas certificacoes com confianca em ingles.", timestampSeconds: 9 },
  { speaker: "Ana", text: "First, how to say it: I hold the CompTIA Security+ certification. Or: I am currently preparing for the CySA+ exam. Hold a certification: possuir a certificacao. Preparing for: se preparando para. Sit the exam: fazer a prova. And pass with flying colors: passar com nota excelente.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "I hold the Security+ certification! I am preparing for the CySA+ exam! Ana, e as certificacoes famosas em ingles: Security+, CySA+, Pentest+, Cloud+, e no nivel avancado: CISSP, CISM, OSCP.", timestampSeconds: 34 },
  { speaker: "Ana", text: "Isso. O mercado adora siglas, mas em entrevistas internacionais diga por extenso na primeira vez: Certified Information Systems Security Professional. Depois pode usar o acronimo. E no CV em ingles, a secao e Certifications: CompTIA Security+, issued em month year, credential ID.", timestampSeconds: 42 },
  { speaker: "Rafael", text: "Credential ID! E validade: the certification is valid for three years, renewable with continuing education units, the CEUs. Ana, como mostrar as certificacoes na entrevista?", timestampSeconds: 55 },
  { speaker: "Ana", text: "Nao recite o nome; conte o que aprendeu. Em vez de I have Security+, diga: through my Security+ studies, I built a strong foundation in threat management and cryptography, which I applied in my SOC work. Certificacao e o meio, aplicacao e a mensagem.", timestampSeconds: 64 },
  { speaker: "Rafael", text: "Foundation, threat management, applied! Hora das frases prontas para a entrevista?", timestampSeconds: 77 },
  { speaker: "Ana", text: "Frase um: I hold the Security+ certification, valid until twenty twenty-eight. Frase dois: I earned the certification to deepen my knowledge of detection and response. Frase tres: I am planning to pursue the CySA+ next year to advance my analyst career.", timestampSeconds: 84 },
  { speaker: "Rafael", text: "E para o LinkedIn: I am proud to share that I have earned my CompTIA Security+ certification! Thank you to everyone who supported my journey.", timestampSeconds: 97 },
  { speaker: "Ana", text: "Lindo! E no LinkedIn, sempre marque a certificacao na secao Licenses and Certifications com o credential URL de verificacao. Palavras de ouro: credential, issued, expires, renewal, CEU, accredited exam provider.", timestampSeconds: 105 },
  { speaker: "Rafael", text: "Credential, issued, expires, renewal, CEU! Recap final: I hold, preparing for, sit the exam, with flying colors, credential ID, CEUs, Licenses and Certifications, deepened my knowledge e applied.", timestampSeconds: 118 },
  { speaker: "Ana", text: "E lembre-se: a certificacao abre portas, mas a sua historia de aplicacao e o que fecha o contrato. Recap final completo: certificacoes em ingles, do CV a entrevista.", timestampSeconds: 128 },
  { speaker: "Rafael", text: "Treine em voz alta, compare e refaca. English Certification Path, certified and confident!", timestampSeconds: 138 },
  { speaker: "Ana", text: "This was the CyberCast, English Certification Path edition! Feedback, quiz e ate o proximo episodio!", timestampSeconds: 146 },
];

export const ep86Episode = {
  id: "ep86",
  episodeNumber: 86,
  title: "English Certification Path",
  description: "Como apresentar certificações em ingles no CV, LinkedIn e entrevistas internacionais.",
  topics: ["I hold", "preparing for", "sit the exam", "with flying colors", "credential ID", "CEUs", "Licenses and Certifications", "deepened my knowledge", "applied", "validity"],
  audioUrl: "/manus-storage/ep48-carreira-cyber_bf9810f1.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep86",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 86 — English Certification Path",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep87 — English for the Job Market: LinkedIn, cover letter e networking internacional: como se apresentar ao mercado global de seguranca.
 */
export const ep87Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hey job hunters! Eu sou a Ana, e hoje e English for the Job Market: LinkedIn, cover letter e networking internacional para a carreira em ciberseguranca.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: headline, summary, open to work, cover letter, networking, referral. Como se apresentar ao mercado global em ingles.", timestampSeconds: 9 },
  { speaker: "Ana", text: "O LinkedIn internacional vive de ingles. O headline e sua vitrine: em vez de only Security Student, use: Cybersecurity Analyst | SOC | Incident Response | Security+. O summary apresenta sua trajetoria em tres frases: quem voce e, o que domina e o que busca.", timestampSeconds: 19 },
  { speaker: "Rafael", text: "Three sentences: who you are, what you own, what you seek! Ana, e a cover letter?", timestampSeconds: 34 },
  { speaker: "Ana", text: "A cover letter tem tres paragrafos. Primeiro: por que voce se candidata a vaga especifica, nomeando a empresa. Segundo: duas conquistas com numeros, ligadas aos requisitos. Terceiro: call to action, I would welcome the opportunity to discuss how I can contribute to your team.", timestampSeconds: 41 },
  { speaker: "Rafael", text: "Call to action! E networking: Ana, como abordar um recrutador em ingles?", timestampSeconds: 55 },
  { speaker: "Ana", text: "Curto e educado: Hi, I am a cybersecurity analyst following your company's work on threat detection. I noticed an opening on your team and would love to learn more about the role. Sem pedir emprego de cara; peca conversa e aprendizado.", timestampSeconds: 62 },
  { speaker: "Rafael", text: "E o referral: pedir indicacao a alguem conhecido da empresa. A referral phrase: Would you feel comfortable referring me for the security analyst role? Ana, e as palavras de ouro do job market?", timestampSeconds: 76 },
  { speaker: "Ana", text: "Opening: vaga. Role: cargo. Hiring manager: o gestor contratante. Screening call: a primeira entrevista por telefone. Technical interview: a entrevista tecnica. Offer: a proposta. And onboarding: a integracao. Palavras para cada fase da jornada.", timestampSeconds: 85 },
  { speaker: "Rafael", text: "Opening, role, screening call, offer, onboarding! Hora da pratica: o pitch de trinta segundos.", timestampSeconds: 97 },
  { speaker: "Ana", text: "Meu exemplo: Hi, I am Ana, a security educator with six years of experience building cybersecurity training platforms. I help teams learn through hands-on labs and podcasts. I am looking to bring this experience to a global security awareness program.", timestampSeconds: 104 },
  { speaker: "Rafael", text: "Meu turn: Hi, I am Rafael, a former SOC analyst transitioning to detection engineering. I have built automation that reduced triage time by forty percent, and I am looking for a team that values detection innovation.", timestampSeconds: 116 },
  { speaker: "Ana", text: "Perfeito: nome, identidade profissional, uma conquista com numero e o que busca. Gravem o proprio pitch, cronometrem e refacam ate os trinta segundos voarem. Recap final: headline, summary, cover letter, referral, opening, role, screening call, offer e onboarding.", timestampSeconds: 128 },
  { speaker: "Rafael", text: "Treine em voz alta, compare e refaca. English for the Job Market, you are hired!", timestampSeconds: 140 },
  { speaker: "Ana", text: "This was the CyberCast, English for the Job Market edition! Feedback, quiz e ate o proximo!", timestampSeconds: 148 },
];

export const ep87Episode = {
  id: "ep87",
  episodeNumber: 87,
  title: "English for the Job Market",
  description: "LinkedIn, cover letter e networking internacional: como se apresentar ao mercado global de seguranca.",
  topics: ["headline", "summary", "cover letter", "referral", "opening", "role", "screening call", "offer", "onboarding", "elevator pitch"],
  audioUrl: "/manus-storage/ep48-carreira-cyber_bf9810f1.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep87",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 87 — English for the Job Market",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/**
 * ep88 — English Pronunciation Clinic 2: Termos avancados, falsos amigos e acentuacao das palavras mais dificeis do ingles tecnico.
 */
export const ep88Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Hello pronunciation geeks! Eu sou a Ana, e hoje e a Pronunciation Clinic dois: termos avancados, falsos amigos e acentuacao das palavras que derrubam brasileiros em ingles tecnico.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! Hoje: as palavras que todo profissional trava. Ana, comeca pela minha favorita: vulnerability.", timestampSeconds: 9 },
  { speaker: "Ana", text: "Opa, essa nao: vulnerability e vul-ner-a-bi-li-ti, com o acento no a. E a mais traicoeira nao e schedule, que em ingles americano e ske-djiul, nao xe-djiul. Ana, quais sao os falsos amigos de seguranca?", timestampSeconds: 28 },
  { speaker: "Ana", text: "Os classicos: eventually nao e eventualmente, e no final das contas. Actually nao e atualmente, e na verdade. E support nao e suporte no sentido tecnico de helpdesk apenas; a phrase I will support this investigation significa vou apoiar a investigacao.", timestampSeconds: 38 },
  { speaker: "Rafael", text: "Falsos amigos! Eventually = no final, actually = na verdade. Ana, e as palavras longas que todo mundo enrola?", timestampSeconds: 50 },
  { speaker: "Ana", text: "A trilogia do aperto: configuration: con-fi-giu-rei-xan. Authorization: au-to-ri-zei-xan. Infrastructure: in-fra-strak-cher. E a campea: authentication: au-ten-ti-kei-xan. Repita comigo: configuration, authorization, infrastructure, authentication!", timestampSeconds: 58 },
  { speaker: "Rafael", text: "Configuration! Authorization! Infrastructure! Authentication! E o TH: think, threat, throughput, thorough. O TH e suave, lingua entre os dentes, nao e T nem F.", timestampSeconds: 72 },
  { speaker: "Ana", text: "Exato! Threat, threat, threat! E o TH final: the breach was thoroughly investigated, brech uozs thro-li in-ves-ti-gei-ted. Thorough: thro-ro. Throughput: thru-put. A pronuncia correta do TH passa a mensagem de fluencia.", timestampSeconds: 80 },
  { speaker: "Rafael", text: "Threat! Thorough! Throughput! Ana, o desafio final: uma frase completa com todas as dificuldades.", timestampSeconds: 92 },
  { speaker: "Ana", text: "La vai: The threat actor exploited a vulnerability in the configuration to gain unauthorized access to the infrastructure. Repita: threat actor, vulnerability, configuration, unauthorized, infrastructure!", timestampSeconds: 99 },
  { speaker: "Rafael", text: "The threat actor exploited a vulnerability in the configuration to gain unauthorized access to the infrastructure!", timestampSeconds: 109 },
  { speaker: "Ana", text: "Incrivel! E o segredo nao e perfeicao, e clareza: a pronuncia clara comunica respeito pelo ouvinte e confianca na sua tecnica. Recap final do episodio: vulnerability, configuration, authorization, infrastructure, authentication, schedule, cache, TH sounds e false friends.", timestampSeconds: 117 },
  { speaker: "Rafael", text: "Treine em voz alta, compare e refaca. English Pronunciation Clinic dois, fluently delivered!", timestampSeconds: 130 },
  { speaker: "Ana", text: "This was the CyberCast, English Pronunciation Clinic dois edition! Feedback, quiz e ate o proximo episodio!", timestampSeconds: 138 },
];

export const ep88Episode = {
  id: "ep88",
  episodeNumber: 88,
  title: "English Pronunciation Clinic 2",
  description: "Termos avancados, falsos amigos e acentuacao das palavras mais dificeis do ingles tecnico.",
  topics: ["vulnerability", "configuration", "authorization", "infrastructure", "authentication", "schedule", "cache", "TH sounds", "false friends", "eventually versus actually"],
  audioUrl: "/manus-storage/ep68-english-for-cyber-pros_bae9287d.wav",
  domainCode: "DOM1" as const,
  domainTitle: "General Security Concepts",
  duration: "~8 min",
  examWeight: "Competencia profissional complementar",
  provenance: {
    id: "podcast-ep88",
    origin: "proprio",
    category: "Podcast educacional proprio",
    title: "CyberCast 88 — English Pronunciation Clinic 2",
    source: "CyberDimension Academy",
    license: "Conteudo autoral da CyberDimension Academy; uso de estudo dentro da plataforma.",
    usage: "Episodio autoral da trilha English for Cyber Pros, em ingles tecnico com dialogos didaticos e entrevista simulada.",
  },
  series: "english" as const,
} as const;

/** Todos os episodios novos da trilha de ingles (ep73-ep88). */

export const englishExpansionEpisodes = [
  { ...ep73Episode, transcript: ep73Transcript },
  { ...ep74Episode, transcript: ep74Transcript },
  { ...ep75Episode, transcript: ep75Transcript },
  { ...ep76Episode, transcript: ep76Transcript },
  { ...ep77Episode, transcript: ep77Transcript },
  { ...ep78Episode, transcript: ep78Transcript },
  { ...ep79Episode, transcript: ep79Transcript },
  { ...ep80Episode, transcript: ep80Transcript },
  { ...ep81Episode, transcript: ep81Transcript },
  { ...ep82Episode, transcript: ep82Transcript },
  { ...ep83Episode, transcript: ep83Transcript },
  { ...ep84Episode, transcript: ep84Transcript },
  { ...ep85Episode, transcript: ep85Transcript },
  { ...ep86Episode, transcript: ep86Transcript },
  { ...ep87Episode, transcript: ep87Transcript },
  { ...ep88Episode, transcript: ep88Transcript },
] as const;

