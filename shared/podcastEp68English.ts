import type { PodcastTimestampedLine } from "./podcastBatchFourEpisodes";

/**
 * Episódio especial "English for Cyber Pros": Ana e Rafael treinam a pronúncia
 * dos termos técnicos mais cobrados em inglês e simulam uma entrevista real
 * para vaga de SOC Analyst em empresa internacional.
 */
export const ep68Transcript: readonly PodcastTimestampedLine[] = [
  { speaker: "Ana", text: "Welcome to the CyberCast, guys! Eu sou a Ana, e esse episódio é para quem sonha com a vaga internacional de segurança.", timestampSeconds: 0 },
  { speaker: "Rafael", text: "E eu sou o Rafael! E o episódio de hoje é especial: English for Cyber Pros. Pronúncia, vocabulário e uma entrevista simulada completa. Are you ready?", timestampSeconds: 7 },
  { speaker: "Ana", text: "Vamos começar pelo bloqueio número um dos brasileiros: os termos que todo mundo pronuncia errado. Rafael, o clássico: phishing. Não é \"físhing\" com som de x, é \"fíxing\", som de x mesmo, mas sem o chi. Phishing, fishing, phishing.", timestampSeconds: 15 },
  { speaker: "Rafael", text: "Phishing! Anota: a sílaba forte é a primeira. Agora o meu favorito: Ransomware. \"RAN-som-wer\", com o N forte. Nunca \"ransomwáre\". Ransomware!", timestampSeconds: 26 },
  { speaker: "Ana", text: "Ransomware! E vulnerability: vêr-nê-rá-bi-li-ti, cinco sílabas, nunca \"vulnerábilite\". Vulnerability. E o par que derruba candidato: threat é \"thrêt\", com o th de língua entre os dentes. Não é \"tret\" nem \"fret\". Threat!", timestampSeconds: 34 },
  { speaker: "Rafael", text: "Threat! Deixa comigo o trio da sigla: CIA triad. Cê-ai-êi-trí-ad. Confidentiality, integrity, availability. E compliance: com-plái-ans, não \"compliáns\". Compliance!", timestampSeconds: 47 },
  { speaker: "Ana", text: "Compliance! Agora os falsos amigos que enganam na entrevista. Schedule não é \"shedule\": é \"skéd-iul\", com som de K. E forensic é for-rên-sic, não \"forense\" aportuguesado. Forensic!", timestampSeconds: 57 },
  { speaker: "Rafael", text: "Forensic! Última rodada da pronúncia: breach, \"bríitch\", com som de tch suave. Leaked, \"líikt\". Mitigation, mi-ti-gêi-xân. Vulnerable, \"vâl-nê-rê-bol\", três sílabas, não quatro!", timestampSeconds: 66 },
  { speaker: "Ana", text: "Perfeito! Agora vamos para a parte que decide a contratação: a entrevista simulada. Eu sou a recrutadora da NeoShield Security, vaga de SOC Analyst nível dois. Você é o candidato. Let's go!", timestampSeconds: 76 },
  { speaker: "Rafael", text: "Good morning! Thank you for the opportunity. My name is Rafael, and I'm a cybersecurity professional with hands-on experience in incident response and log analysis.", timestampSeconds: 84 },
  { speaker: "Ana", text: "Nice to meet you, Rafael. First question: can you walk me through your approach when a SIEM alert fires on your dashboard?", timestampSeconds: 93 },
  { speaker: "Rafael", text: "Sure. First, I verify if the alert is a true positive or a false positive. Then I triage by severity, correlate the event with other logs, and check the affected asset. If confirmed, I escalate according to the playbook and document everything.", timestampSeconds: 101 },
  { speaker: "Ana", text: "Great answer! The verbs triage, escalate and document são essenciais nesse vocabulário. Segunda pergunta: what would you do if you detected a brute force attack against a critical server?", timestampSeconds: 113 },
  { speaker: "Rafael", text: "I would immediately contain the threat: block the source IP on the firewall, force a password reset, and enable account lockout policies. Then I would analyze the logs to check if any account was compromised and report the incident to the team lead.", timestampSeconds: 123 },
  { speaker: "Ana", text: "Excellent! Vocabulário de ouro aí: contain the threat, compromise, account lockout. Agora a pergunta de comportamento, a mais temida: tell me about a time you handled a high-pressure situation.", timestampSeconds: 136 },
  { speaker: "Rafael", text: "During a weekend shift, our detection system flagged a ransomware attempt at two AM. I stayed calm, followed the incident response playbook, isolated the affected machines, and communicated clearly with the stakeholders until the threat was eradicated.", timestampSeconds: 145 },
  { speaker: "Ana", text: "Muito bom! E aí a dica de ouro: resposta estruturada, passado no past tense, e palavras-chave como calm, playbook, isolated e stakeholders. Última pergunta técnica: what is the difference between IDS and IPS?", timestampSeconds: 157 },
  { speaker: "Rafael", text: "An IDS detects and alerts, but doesn't block. It's passive. An IPS sits inline and can block malicious traffic in real time. In practice, organizations use both, in layers, as part of a defense in depth strategy.", timestampSeconds: 167 },
  { speaker: "Ana", text: "Perfect answer! Agora você pergunta, porque candidato forte também entrevista a empresa: do you have any questions for us, Rafael?", timestampSeconds: 178 },
  { speaker: "Rafael", text: "Yes! What does the onboarding and training process look like for the SOC team, and which tools does the team use daily for detection and response?", timestampSeconds: 185 },
  { speaker: "Ana", text: "Interview encerrada! Volta a Ana aqui. Viram o padrão? Pergunta da recrutadora, resposta em inglês com termos técnicos, e dica minha em português explicando o porquê. Recap rápido: phishing, ransomware, threat, breach, triage, escalate, contain e mitigate são as oito palavras que abrem portas na entrevista internacional.", timestampSeconds: 193 },
  { speaker: "Rafael", text: "E a regra de ouro: treine em voz alta todos os dias. Grave a si mesmo respondendo essas perguntas, compare com a nossa pronúncia, e refaça até sair natural. Inglês técnico não é dom, é treino!", timestampSeconds: 210 },
  { speaker: "Ana", text: "This was the CyberCast, English for Cyber Pros edition! Deixa seu feedback, refaz o quiz de vocabulário e vai praticar. See you in the next episode!", timestampSeconds: 220 },
];
