export type CurriculumLevel = "Iniciante" | "Intermediário" | "Avançado";

export type AcademySlug = "blue-team" | "red-team" | "grc" | "cloud-security" | "threat-intelligence" | "security-engineering" | "ai-security" | "artificial-intelligence";

export type CurriculumCourse = {
  id: string;
  title: string;
  level: CurriculumLevel;
  academy: AcademySlug;
  description: string;
  topics: string[];
  status: "Disponível" | "Em planejamento";
  existingSlug?: string;
};

export type Academy = {
  slug: AcademySlug;
  name: string;
  tagline: string;
  description: string;
  color: "cyan" | "purple" | "green" | "blue" | "amber" | "rose" | "lime";
  route: string[];
};

export const academies: Academy[] = [
  { slug: "blue-team", name: "Blue Team Academy", tagline: "Detectar, investigar e responder.", description: "Uma rota defensiva que evolui de proteção pessoal e fundamentos de segurança para operações, detecção, forense e resposta a incidentes.", color: "cyan", route: ["Segurança Pessoal Digital", "Fundamentos de Cibersegurança", "IT Fundamentals for Cybersecurity", "Security Awareness & Social Engineering", "Análise de Tráfego com Wireshark", "E-mail Seguro", "Gestão de Vulnerabilidades", "SOC Analyst", "SIEM na Prática", "Engenharia de Detecção", "Purple Team Operations", "Threat Hunting Avançado", "Incident Response"] },
  { slug: "red-team", name: "Red Team Academy", tagline: "Entender ofensiva para construir defesa melhor.", description: "Uma trilha prática e responsável para reconhecimento, validação de controles e segurança de aplicações em laboratórios isolados.", color: "rose", route: ["Fundamentos de Redes", "Linux para Cibersegurança", "Introdução ao Hacking Ético", "Fundamentos de Pentest", "Red Team Fundamentals", "Web Security / OWASP", "Red Team Operations Responsáveis"] },
  { slug: "grc", name: "GRC Academy", tagline: "Transformar risco em decisões e controles.", description: "Governança, gestão de riscos e compliance para quem precisa conectar segurança a políticas, auditoria e negócio.", color: "amber", route: ["Privacidade e Proteção de Dados", "Fundamentos de Cibersegurança", "GRC Fundamentals", "ISO 27001", "NIST + CIS Controls", "Gestão de Programas de Segurança", "Comunicação e Gestão de Crise Cibernética"] },
  { slug: "cloud-security", name: "Cloud Security Academy", tagline: "Proteger identidades, workloads e dados na nuvem.", description: "Uma rota de fundamentos de cloud, identidade e controles para ambientes modernos e distribuídos.", color: "purple", route: ["Fundamentos de Cloud para Segurança", "Fundamentos de Redes", "Cloud Security Fundamentals", "AWS Security — Fundamentos", "Azure Security — Fundamentos", "Operações de Cloud Security"] },
  { slug: "threat-intelligence", name: "Threat Intelligence Academy", tagline: "Converter sinais externos em contexto defensivo.", description: "Aprenda a analisar IOCs, TTPs, fontes abertas, artefatos e inteligência aplicável à tomada de decisão de segurança.", color: "green", route: ["Fundamentos de Cibersegurança", "Threat Intelligence", "Análise de Malware — Fundamentos", "SOC Analyst", "SIEM na Prática", "Simulação de Adversários"] },
  { slug: "security-engineering", name: "Security Engineering Academy", tagline: "Projetar sistemas resilientes desde a base.", description: "Uma rota para quem quer combinar redes, identidade, criptografia, segurança de aplicações e arquitetura resiliente.", color: "blue", route: ["Identidade e Autenticação Segura", "Identity & Access Management", "Active Directory Security", "API Security", "Mobile Security", "Database Security", "Segurança de Software Aplicada", "Segurança da Cadeia de Suprimentos de Software", "Segurança de Containers", "Automação Segura para Operações", "Segurança de Redes e Zero Trust", "Segurança de IoT e Dispositivos Conectados", "Segurança de Memória e Mitigações", "Arquitetura de Segurança e Modelagem de Ameaças", "Segurança em ICS/SCADA"] },
  { slug: "ai-security", name: "AI Security Academy", tagline: "Proteger a era da inteligência artificial.", description: "Uma rota completa para entender, avaliar e governar riscos de IA: de fundamentos de LLMs ao red teaming autorizado e governança corporativa com NIST AI RMF.", color: "lime", route: ["IT Fundamentals for Cybersecurity", "AI Security Fundamentals", "AI Red Team", "AI Security & Governance"] },
  { slug: "artificial-intelligence", name: "Academia de Inteligência Artificial", tagline: "Do zero ao avançado, aprendendo a construir com responsabilidade.", description: "Uma trilha completa de Inteligência Artificial que leva dos fundamentos e engenharia de prompts até APIs, RAG, agentes, segurança, governança e aplicações profissionais.", color: "cyan", route: ["Fundamentos de Inteligência Artificial", "Ferramentas de Inteligência Artificial", "Engenharia de Prompts", "IA Aplicada à Cibersegurança"] },
];

export const curriculumCourses: CurriculumCourse[] = [
  { id: "cyber-fundamentos", title: "Fundamentos de Cibersegurança", level: "Iniciante", academy: "blue-team", description: "Risco, controles, identidade, ameaças e princípios para começar com contexto profissional.", topics: ["CIA Triad", "MFA", "Zero Trust"], status: "Disponível", existingSlug: "fundamentos-cyber-security" },
  { id: "redes-fundamentos", title: "Fundamentos de Redes", level: "Iniciante", academy: "security-engineering", description: "Protocolos, endereçamento, DNS, segmentação e conectividade para segurança.", topics: ["TCP/IP", "DNS", "VLAN"], status: "Disponível", existingSlug: "redes-para-cyber-security" },
  { id: "linux-cyber", title: "Linux para Cibersegurança", level: "Iniciante", academy: "red-team", description: "Terminal, permissões, serviços, logs e hardening para operações de segurança.", topics: ["Bash", "SSH", "Logs"], status: "Disponível", existingSlug: "linux-para-operacoes-de-seguranca" },
  { id: "windows-security", title: "Windows Security", level: "Iniciante", academy: "blue-team", description: "Contas, eventos, Defender e conceitos de Active Directory no ambiente Windows.", topics: ["Event Viewer", "PowerShell", "Defender"], status: "Disponível", existingSlug: "windows-security" },
  { id: "cripto", title: "Criptografia", level: "Iniciante", academy: "security-engineering", description: "Criptografia, hashes, certificados, PKI e TLS aplicados à proteção de dados.", topics: ["PKI", "TLS", "Assinaturas"], status: "Disponível", existingSlug: "criptografia" },
  { id: "threat-intel", title: "Threat Intelligence", level: "Iniciante", academy: "threat-intelligence", description: "IOCs, TTPs, OSINT e fontes de inteligência para enriquecer a defesa.", topics: ["IOC", "OSINT", "MITRE"], status: "Disponível", existingSlug: "threat-intelligence" },
  { id: "pentest", title: "Fundamentos de Pentest", level: "Intermediário", academy: "red-team", description: "Reconhecimento, enumeração e validação responsável de vulnerabilidades em laboratório.", topics: ["Recon", "Scanning", "Relatório"], status: "Disponível", existingSlug: "fundamentos-pentest" },
  { id: "soc", title: "SOC Analyst", level: "Intermediário", academy: "blue-team", description: "Alertas, triagem, playbooks e escalonamento para começar em um SOC.", topics: ["Triage", "SIEM", "Playbooks"], status: "Disponível", existingSlug: "soc-analyst" },
  { id: "siem", title: "SIEM na Prática", level: "Intermediário", academy: "blue-team", description: "Coleta, normalização, correlação e investigação de logs em cenários guiados.", topics: ["Logs", "Correlação", "Detecção"], status: "Disponível", existingSlug: "siem-na-pratica" },
  { id: "incident-response", title: "Incident Response", level: "Intermediário", academy: "blue-team", description: "Preparação, contenção, erradicação e lições aprendidas em incidentes simulados.", topics: ["Contenção", "Evidências", "Recuperação"], status: "Disponível", existingSlug: "incident-response" },
  { id: "web-security", title: "Web Security / OWASP", level: "Intermediário", academy: "red-team", description: "Autenticação, autorização e riscos comuns em aplicações web com foco seguro.", topics: ["OWASP", "Sessions", "Validação"], status: "Disponível", existingSlug: "web-security-owasp" },
  { id: "grc", title: "GRC Fundamentals", level: "Intermediário", academy: "grc", description: "Governança, risco, compliance, políticas e controles para segurança organizacional.", topics: ["Risco", "Políticas", "Auditoria"], status: "Disponível", existingSlug: "grc-fundamentals" },
  { id: "iso-27001", title: "ISO 27001", level: "Intermediário", academy: "grc", description: "ISMS, gestão de riscos, controles e melhoria contínua em um programa de segurança.", topics: ["ISMS", "Controles", "Auditoria"], status: "Disponível", existingSlug: "iso-27001" },
  { id: "nist-cis", title: "NIST + CIS Controls", level: "Intermediário", academy: "grc", description: "Frameworks e controles para organizar, priorizar e medir uma estratégia defensiva.", topics: ["NIST CSF", "CIS", "Métricas"], status: "Disponível", existingSlug: "nist-cis-controls" },
  { id: "cloud-fundamentos", title: "Cloud Security Fundamentals", level: "Intermediário", academy: "cloud-security", description: "Responsabilidade compartilhada, IAM, redes e logging em ambientes cloud.", topics: ["IAM", "Cloud logs", "KMS"], status: "Disponível", existingSlug: "cloud-security-fundamentals" },
  { id: "aws-security", title: "AWS Security — Fundamentos", level: "Intermediário", academy: "cloud-security", description: "IAM, VPC, criptografia e auditoria para proteger workloads na AWS.", topics: ["IAM", "CloudTrail", "VPC"], status: "Disponível", existingSlug: "aws-security-fundamentals" },
  { id: "azure-security", title: "Azure Security — Fundamentos", level: "Intermediário", academy: "cloud-security", description: "Entra ID, RBAC, redes e postura de segurança em ambientes Azure.", topics: ["Entra ID", "RBAC", "NSG"], status: "Disponível", existingSlug: "azure-security-fundamentals" },
  { id: "forense-digital", title: "Forense Digital — Fundamentos", level: "Intermediário", academy: "blue-team", description: "Evidências, cadeia de custódia, linha do tempo e comunicação de achados.", topics: ["Evidências", "Timeline", "Custódia"], status: "Disponível", existingSlug: "digital-forensics-fundamentals" },
  { id: "devsecops", title: "DevSecOps — Fundamentos", level: "Intermediário", academy: "security-engineering", description: "Segurança integrada ao código, dependências, segredos, pipeline e entrega.", topics: ["CI/CD", "Segredos", "Dependências"], status: "Disponível", existingSlug: "devsecops-fundamentals" },
  { id: "network-zero-trust", title: "Segurança de Redes e Zero Trust", level: "Intermediário", academy: "security-engineering", description: "Segmentação, DNS, telemetria e verificação contínua para redes modernas.", topics: ["Segmentação", "DNS", "Zero Trust"], status: "Disponível", existingSlug: "network-security-zero-trust" },
  { id: "malware-analysis", title: "Análise de Malware — Fundamentos", level: "Intermediário", academy: "threat-intelligence", description: "Análise defensiva de artefatos, indicadores e comportamento em ambiente isolado.", topics: ["IOCs", "Sandbox", "Detecção"], status: "Disponível", existingSlug: "malware-analysis-fundamentals" },
  { id: "identidade-segura", title: "Identidade e Autenticação Segura", level: "Iniciante", academy: "security-engineering", description: "Senhas, MFA, autorização e ciclo de vida de acessos em uma jornada orientada por vídeo e prática.", topics: ["MFA", "Senhas", "IAM"], status: "Disponível", existingSlug: "identidade-autenticacao-segura" },
  { id: "privacidade-dados", title: "Privacidade e Proteção de Dados", level: "Iniciante", academy: "grc", description: "Dados pessoais, classificação, minimização e privacidade por padrão para decisões responsáveis.", topics: ["Classificação", "Retenção", "Privacidade"], status: "Disponível", existingSlug: "privacidade-protecao-dados" },
  { id: "ad-security", title: "Active Directory Security", level: "Intermediário", academy: "blue-team", description: "Grupos, privilégios, políticas e auditoria para identidades corporativas mais seguras.", topics: ["GPO", "Privilégios", "Auditoria"], status: "Disponível", existingSlug: "active-directory-security" },
  { id: "vulnerability-management", title: "Gestão de Vulnerabilidades", level: "Intermediário", academy: "blue-team", description: "Inventário, priorização, remediação e verificação de riscos técnicos com evidências.", topics: ["Inventário", "Priorização", "Correção"], status: "Disponível", existingSlug: "vulnerability-management" },
  { id: "email-security", title: "Segurança de E-mail e Defesa contra Phishing", level: "Intermediário", academy: "blue-team", description: "Proteção de e-mail, autenticação de domínio, triagem e resposta a mensagens suspeitas.", topics: ["Phishing", "DMARC", "Triagem"], status: "Disponível", existingSlug: "email-security-phishing-defense" },
  { id: "container-security", title: "Segurança de Containers", level: "Intermediário", academy: "security-engineering", description: "Imagens, segredos, permissões e observabilidade para workloads em containers.", topics: ["Imagens", "Segredos", "Runtime"], status: "Disponível", existingSlug: "container-security" },
  { id: "threat-hunting", title: "Threat Hunting Avançado", level: "Avançado", academy: "threat-intelligence", description: "Hipóteses, telemetria, correlação e comunicação de achados defensivos.", topics: ["Hipóteses", "Telemetria", "Detecção"], status: "Disponível", existingSlug: "threat-hunting-avancado" },
  { id: "security-architecture", title: "Arquitetura de Segurança e Modelagem de Ameaças", level: "Avançado", academy: "security-engineering", description: "Fronteiras de confiança, cenários de ameaça e controles resilientes desde o desenho.", topics: ["STRIDE", "Trust Boundaries", "Controles"], status: "Disponível", existingSlug: "security-architecture-threat-modeling" },
  { id: "ics-scada", title: "Segurança em ICS/SCADA", level: "Avançado", academy: "security-engineering", description: "Ativos industriais, segmentação, mudanças controladas e resposta responsável em OT.", topics: ["OT", "Segmentação", "Continuidade"], status: "Disponível", existingSlug: "ics-scada-security" },
  { id: "seguranca-pessoal-digital", title: "Segurança Pessoal Digital", level: "Iniciante", academy: "blue-team", description: "Senhas, MFA, privacidade, dispositivos e reconhecimento de phishing para começar a jornada com hábitos seguros.", topics: ["Senhas", "MFA", "Privacidade"], status: "Disponível", existingSlug: "seguranca-pessoal-digital" },
  { id: "hacking-etico-intro", title: "Introdução ao Hacking Ético", level: "Iniciante", academy: "red-team", description: "Ética, autorização, escopo e relato responsável para compreender a prática ofensiva apenas em laboratórios.", topics: ["Ética", "Escopo", "Relatório"], status: "Disponível", existingSlug: "introducao-hacking-etico" },
  { id: "cloud-inicial", title: "Fundamentos de Cloud para Segurança", level: "Iniciante", academy: "cloud-security", description: "Modelos de serviço, responsabilidade compartilhada, identidade e visibilidade para os primeiros passos em nuvem.", topics: ["IaaS", "Responsabilidade", "IAM"], status: "Disponível", existingSlug: "fundamentos-cloud-iniciante" },
  { id: "red-team-fundamentals", title: "Red Team Fundamentals", level: "Intermediário", academy: "red-team", description: "Planejamento, descoberta autorizada, validação controlada e recomendação defensiva em ambientes isolados.", topics: ["Escopo", "Inventário", "Evidências"], status: "Disponível", existingSlug: "red-team-fundamentals" },
  { id: "api-security", title: "API Security", level: "Intermediário", academy: "security-engineering", description: "Identidade, autorização, validação, limites e observabilidade para APIs mais seguras.", topics: ["REST", "Autorização", "Logs"], status: "Disponível", existingSlug: "api-security" },
  { id: "mobile-security", title: "Mobile Security", level: "Intermediário", academy: "security-engineering", description: "Permissões, dados, comunicação e privacidade por design em aplicações Android e iOS.", topics: ["Permissões", "TLS", "Privacidade"], status: "Disponível", existingSlug: "mobile-security" },
  { id: "database-security", title: "Database Security", level: "Intermediário", academy: "security-engineering", description: "Acesso mínimo, consultas seguras, criptografia, backup e auditoria de bancos de dados.", topics: ["RBAC", "Dados", "Auditoria"], status: "Disponível", existingSlug: "database-security" },
  { id: "purple-team-operations", title: "Purple Team Operations", level: "Intermediário", academy: "blue-team", description: "Exercícios autorizados que conectam simulação, telemetria e melhoria contínua de detecções.", topics: ["Cobertura", "Telemetria", "Métricas"], status: "Disponível", existingSlug: "purple-team-operations" },
  { id: "red-team-operations", title: "Red Team Operations Responsáveis", level: "Avançado", academy: "red-team", description: "Governança, coordenação e relatório de simulações autorizadas com segurança operacional.", topics: ["Engajamento", "Evidências", "Reteste"], status: "Disponível", existingSlug: "red-team-operations" },
  { id: "seguranca-memoria", title: "Segurança de Memória e Mitigações", level: "Avançado", academy: "security-engineering", description: "Riscos de memória, engenharia defensiva, revisão de código e mitigações modernas sem desenvolvimento de exploits.", topics: ["Código seguro", "Análise", "Mitigações"], status: "Disponível", existingSlug: "seguranca-memoria-mitigacoes" },
  { id: "adversary-simulation", title: "Simulação de Adversários", level: "Avançado", academy: "threat-intelligence", description: "Emulação ética de comportamentos em dados sintéticos para validar telemetria, cobertura e resposta.", topics: ["MITRE ATT&CK", "Cobertura", "Simulação"], status: "Disponível", existingSlug: "adversary-simulation" },
  { id: "security-program-management", title: "Gestão de Programas de Segurança", level: "Avançado", academy: "grc", description: "Estratégia, riscos, roadmap, métricas e comunicação executiva para programas de segurança.", topics: ["Estratégia", "Roadmap", "Métricas"], status: "Disponível", existingSlug: "security-program-management" },
  { id: "cloud-security-operations", title: "Operações de Cloud Security", level: "Intermediário", academy: "cloud-security", description: "Postura, identidade, logs e resposta em nuvem com uma trilha complementar em vídeo.", topics: ["Postura", "IAM", "Cloud Logs"], status: "Disponível", existingSlug: "cloud-security-operations" },
  { id: "software-security-applied", title: "Segurança de Software Aplicada", level: "Intermediário", academy: "security-engineering", description: "SDLC seguro, revisão, dependências e entrega com vídeo complementar sobre OWASP.", topics: ["SDLC", "OWASP", "Dependências"], status: "Disponível", existingSlug: "software-security-applied" },
  { id: "security-automation-operations", title: "Automação Segura para Operações", level: "Intermediário", academy: "security-engineering", description: "Scripting, validações, logs e reversão para automatizar rotinas de segurança com controle.", topics: ["Scripting", "Logs", "Revisão"], status: "Disponível", existingSlug: "security-automation-operations" },
  { id: "detection-engineering", title: "Engenharia de Detecção", level: "Avançado", academy: "blue-team", description: "Casos de uso, telemetria, validação e evolução de detecções com apoio audiovisual de SOC e SIEM.", topics: ["Telemetria", "Regras", "Métricas"], status: "Disponível", existingSlug: "detection-engineering" },
  { id: "iot-security-foundations", title: "Segurança de IoT e Dispositivos Conectados", level: "Intermediário", academy: "security-engineering", description: "Inventário, identidade, segmentação, atualização e telemetria em uma formação com audioguia próprio e vídeo complementar.", topics: ["IoT", "Segmentação", "Firmware"], status: "Disponível", existingSlug: "iot-security-foundations" },
  { id: "software-supply-chain-security", title: "Segurança da Cadeia de Suprimentos de Software", level: "Intermediário", academy: "security-engineering", description: "Componentes, SBOM, integridade de build e risco de fornecedores com audioguia próprio e referência audiovisual complementar.", topics: ["SBOM", "Build", "Dependências"], status: "Disponível", existingSlug: "software-supply-chain-security" },
  { id: "cyber-crisis-communication", title: "Comunicação e Gestão de Crise Cibernética", level: "Avançado", academy: "grc", description: "Papéis, mensagens, aprovações e lições aprendidas para crises simuladas, com audioguia próprio e vídeo complementar.", topics: ["Crise", "Comunicação", "Resposta"], status: "Disponível", existingSlug: "cyber-crisis-communication" },
  { id: "it-fundamentals", title: "IT Fundamentals for Cybersecurity", level: "Iniciante", academy: "blue-team", description: "Hardware, sistemas operacionais, virtualização, redes, servidores, Active Directory e nuvem para a base técnica de segurança.", topics: ["SO", "Virtualização", "Servidores"], status: "Disponível", existingSlug: "it-fundamentals-cybersecurity" },
  { id: "wireshark", title: "Análise de Tráfego com Wireshark", level: "Intermediário", academy: "blue-team", description: "Captura, filtros, protocolos e investigação de incidentes com PCAP em laboratórios guiados.", topics: ["TCP", "DNS", "PCAP"], status: "Disponível", existingSlug: "wireshark-traffic-analysis" },
  { id: "security-awareness", title: "Security Awareness & Social Engineering", level: "Iniciante", academy: "blue-team", description: "Phishing, engenharia social, hábitos seguros, insider risk e programas de awareness corporativos.", topics: ["Phishing", "MFA", "Métricas"], status: "Disponível", existingSlug: "security-awareness-social-engineering" },
  { id: "identity-access-management", title: "Identity & Access Management", level: "Intermediário", academy: "security-engineering", description: "RBAC, ABAC, SSO, OAuth/OIDC, SAML, acesso privilegiado e governança de identidade corporativa.", topics: ["RBAC", "SSO", "Privileged Access"], status: "Disponível", existingSlug: "identity-access-management" },
  { id: "ai-security-fundamentals", title: "AI Security Fundamentals", level: "Iniciante", academy: "ai-security", description: "IA generativa, LLMs, OWASP Top 10 para LLMs, prompt injection, jailbreak e vazamento de dados.", topics: ["LLMs", "Prompt Injection", "OWASP LLM"], status: "Disponível", existingSlug: "ai-security-fundamentals" },
  { id: "ai-red-team", title: "AI Red Team", level: "Intermediário", academy: "ai-security", description: "Testes autorizados de LLMs: injeção de prompts, exfiltração via RAG e abuso de modelos em ambiente isolado.", topics: ["Red Teaming", "RAG", "Abuso"], status: "Disponível", existingSlug: "ai-red-team" },
  { id: "ai-governance", title: "AI Security & Governance", level: "Avançado", academy: "ai-security", description: "NIST AI RMF, controles, políticas, qualidade de dados e governança corporativa de IA.", topics: ["NIST AI RMF", "Políticas", "Controles"], status: "Disponível", existingSlug: "ai-security-governance" },
  { id: "ai-academy", title: "Academia de Inteligência Artificial — Do Zero ao Avançado", level: "Avançado", academy: "artificial-intelligence", description: "Fundamentos, prompts, produtividade, programação, APIs, RAG, agentes, segurança e governança em uma trilha prática.", topics: ["Prompt Engineering", "RAG", "Agentes"], status: "Disponível", existingSlug: "ia-do-zero-ao-avancado" },
  { id: "linux-cli-pratico", title: "Linux na Prática — CLI no Terminal", level: "Iniciante", academy: "red-team", description: "Terminal Linux, navegação, permissões, processos, redes e automação com scripts para operações de segurança.", topics: ["Bash", "Permissões", "Redes"], status: "Disponível", existingSlug: "linux-cli-pratico" },
  { id: "redes-zero-avancado", title: "Redes de Computadores — Do Zero ao Avançado", level: "Iniciante", academy: "security-engineering", description: "Fundamentos de redes: TCP/IP, DNS, HTTP, roteamento, switches e segurança de rede.", topics: ["TCP/IP", "DNS", "Roteamento"], status: "Disponível", existingSlug: "redes-zero-avancado" },
  { id: "soc-n1-pratico", title: "SOC N1 — Prática em Ambiente Fictício", level: "Iniciante", academy: "blue-team", description: "Operação prática de SOC N1: triagem, análise de logs, detecção e resposta em ambiente simulado.", topics: ["Triage", "Logs", "Detecção"], status: "Disponível", existingSlug: "soc-n1-pratico" },
  { id: "nmap-sem-mentira", title: "Nmap Sem Mentira — Do Zero ao Avançado", level: "Intermediário", academy: "red-team", description: "Escaneamento de rede com Nmap: descoberta de hosts, portas, serviços, scripts NSE e evasão.", topics: ["Nmap", "NSE", "Evasão"], status: "Disponível", existingSlug: "nmap-sem-mentira" },
  { id: "osquery-floresta", title: "OSQuery na Floresta — Endpoint Hunting", level: "Intermediário", academy: "blue-team", description: "Telemetria de endpoint com osquery: hunting, persistência, rede e investigação forense digital.", topics: ["osquery", "Endpoint", "DFIR"], status: "Disponível", existingSlug: "osquery-floresta" },
  { id: "yara-na-veia", title: "YARA na Veia — Caçando Padrão sem Caçar Fantasma", level: "Intermediário", academy: "blue-team", description: "Regras YARA para detecção: strings, hex, condições, tuning e governança de detecção.", topics: ["YARA", "Detecção", "Malware"], status: "Disponível", existingSlug: "yara-na-veia" },
  { id: "identidade-quebrada", title: "Identidade Quebrada — IAM, AD, Kerberos e Detecção", level: "Intermediário", academy: "security-engineering", description: "Active Directory, Kerberos, NTLM, privilégios, cloud identity e detecção de abuso de identidade.", topics: ["AD", "Kerberos", "BloodHound"], status: "Disponível", existingSlug: "identidade-quebrada" },
  { id: "ia-security-avancado", title: "Segurança de Inteligência Artificial — Avançado", level: "Avançado", academy: "ai-security", description: "Defesa LLM: guardrails, output sanitization, threat modeling e governança para aplicações com IA.", topics: ["LLM Hardening", "Guardrails", "Threat Modeling"], status: "Disponível", existingSlug: "ia-security-avancado" },
  { id: "cti-apostila", title: "Guia Interativo de Inteligência de Ameaças Cibernéticas", level: "Avançado", academy: "threat-intelligence", description: "CTI avançado: frameworks, TTPs, IOCs, OSINT, atribuição e operação de inteligência.", topics: ["MITRE ATT&CK", "OSINT", "Attribution"], status: "Disponível", existingSlug: "cti-apostila" },
  { id: "iso-27001-sem-ilusao", title: "ISO 27001 Sem Ilusão — SGSI, Risco e Controles", level: "Intermediário", academy: "grc", description: "SGSI prático: escopo, análise de risco, controles Anexo A, auditoria e Statement of Applicability.", topics: ["SGSI", "Risco", "Anexo A"], status: "Disponível", existingSlug: "iso-27001-sem-ilusao" },
];

export type CareerGoalSlug = "soc" | "pentest" | "grc-career" | "cloud-career" | "threat-intel-career" | "security-engineer-career" | "ai-security-career";

export type CareerGoal = {
  slug: CareerGoalSlug;
  title: string;
  emoji: string;
  academy: AcademySlug;
  recommendedTrilha: string;
  startSequence: string[];
};

export const careerGoals: CareerGoal[] = [
  { slug: "soc", title: "Quero trabalhar em SOC", emoji: "🛡️", academy: "blue-team", recommendedTrilha: "SOC Analyst", startSequence: ["Segurança Pessoal Digital", "Fundamentos de Cibersegurança", "SOC Analyst", "SIEM na Prática", "Threat Hunting Avançado", "Incident Response"] },
  { slug: "pentest", title: "Quero trabalhar com Pentest", emoji: "🔴", academy: "red-team", recommendedTrilha: "Red Team", startSequence: ["Fundamentos de Redes", "Linux para Cibersegurança", "Web Security / OWASP", "Fundamentos de Pentest", "Red Team Fundamentals"] },
  { slug: "grc-career", title: "Quero trabalhar com GRC", emoji: "🏛️", academy: "grc", recommendedTrilha: "GRC", startSequence: ["Privacidade e Proteção de Dados", "Fundamentos de Cibersegurança", "GRC Fundamentals", "ISO 27001", "NIST + CIS Controls", "Comunicação e Gestão de Crise Cibernética"] },
  { slug: "cloud-career", title: "Quero trabalhar com Cloud Security", emoji: "☁️", academy: "cloud-security", recommendedTrilha: "Cloud Security", startSequence: ["Fundamentos de Cloud para Segurança", "Fundamentos de Redes", "Cloud Security Fundamentals", "AWS Security — Fundamentos", "Azure Security — Fundamentos", "Operações de Cloud Security"] },
  { slug: "threat-intel-career", title: "Quero trabalhar com Threat Intelligence", emoji: "🧠", academy: "threat-intelligence", recommendedTrilha: "Threat Intelligence", startSequence: ["Fundamentos de Cibersegurança", "Threat Intelligence", "Análise de Malware — Fundamentos", "SOC Analyst", "Simulação de Adversários"] },
  { slug: "security-engineer-career", title: "Quero ser Security Engineer", emoji: "🔐", academy: "security-engineering", recommendedTrilha: "Security Engineering", startSequence: ["Redes", "Criptografia", "Identidade Segura", "Zero Trust", "Cloud"] },
  { slug: "ai-security-career", title: "Quero trabalhar com AI Security", emoji: "🤖", academy: "ai-security", recommendedTrilha: "AI Security", startSequence: ["IT Fundamentals for Cybersecurity", "AI Security Fundamentals", "AI Red Team", "AI Security & Governance"] },
];

export type ContentFormat = "Curso" | "Laboratório" | "Simulado";

export type PracticeCard = {
  id: string;
  title: string;
  format: "Laboratório" | "CTF" | "Simulado";
  level: CurriculumLevel;
  academy: AcademySlug;
  description: string;
  minutes: string;
  route: string;
};

export const practiceCards: PracticeCard[] = [
  { id: "soc-investigation", title: "SOC Investigation", format: "Laboratório", level: "Intermediário", academy: "blue-team", description: "Investigue alertas e identifique IOCs em um cenário guiado de triagem.", minutes: "45 min", route: "SIEM na Prática" },
  { id: "web-security-lab", title: "Web Security Lab", format: "Laboratório", level: "Intermediário", academy: "red-team", description: "Analise vulnerabilidades em uma aplicação de laboratório com foco seguro.", minutes: "60 min", route: "Web Security / OWASP" },
  { id: "threat-intel-lab", title: "Threat Intelligence", format: "Laboratório", level: "Intermediário", academy: "threat-intelligence", description: "Investigue IPs, domínios e hashes para enriquecer a defesa.", minutes: "40 min", route: "Threat Intelligence" },
  { id: "grc-risk-assessment", title: "GRC Risk Assessment", format: "Simulado", level: "Intermediário", academy: "grc", description: "Faça uma avaliação de risco de uma organização fictícia com framework aplicado.", minutes: "50 min", route: "NIST + CIS Controls" },
];

export type MapNode = { label: string; courseIds: string[] };

export type MapBranch = {
  name: string;
  emoji: string;
  color: "cyan" | "rose" | "amber" | "purple" | "lime";
  branches: MapNode[];
};

export const cyberMap: MapBranch[] = [
  { name: "Defesa", emoji: "🛡️", color: "cyan", branches: [
    { label: "SOC", courseIds: ["soc", "siem"] },
    { label: "SIEM", courseIds: ["siem"] },
    { label: "DFIR", courseIds: ["forense-digital", "incident-response"] },
    { label: "Wireshark / PCAP", courseIds: ["wireshark"] },
  ] },
  { name: "Ataque", emoji: "⚔️", color: "rose", branches: [
    { label: "Pentest", courseIds: ["hacking-etico-intro", "web-security"] },
    { label: "Red Team", courseIds: ["red-team-fundamentals", "red-team-operations"] },
  ] },
  { name: "GRC", emoji: "🏛️", color: "amber", branches: [
    { label: "Risco", courseIds: ["grc"] },
    { label: "ISO", courseIds: ["iso-27001"] },
    { label: "LGPD", courseIds: ["privacidade-dados"] },
  ] },
  { name: "Cloud", emoji: "☁️", color: "purple", branches: [
    { label: "Cloud Fundamentos", courseIds: ["cloud-inicial", "cloud-fundamentos"] },
    { label: "AWS / Azure", courseIds: ["aws-security", "azure-security"] },
    { label: "DevSecOps", courseIds: ["devsecops"] },
  ] },
  { name: "AI Security", emoji: "🤖", color: "lime", branches: [
    { label: "Fundamentos", courseIds: ["ai-security-fundamentals"] },
    { label: "Red Team IA", courseIds: ["ai-red-team"] },
    { label: "Governança", courseIds: ["ai-governance"] },
  ] },
];

export type Prerequisite = { courseTitle: string; type: "required" | "recommended" };
export function getPrerequisites(courseId: string): Prerequisite[] {
  const map: Record<string, Prerequisite[]> = {
    "seguranca-pessoal-digital": [],
    "cyber-fundamentos": [{ courseTitle: "Segurança Pessoal Digital", type: "recommended" }],
    "redes-fundamentos": [{ courseTitle: "Segurança Pessoal Digital", type: "recommended" }],
    "linux-cyber": [{ courseTitle: "Fundamentos de Redes", type: "recommended" }],
    "windows-security": [{ courseTitle: "Fundamentos de Redes", type: "recommended" }],
    "cripto": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Fundamentos de Cibersegurança", type: "recommended" }],
    "threat-intel": [{ courseTitle: "Fundamentos de Cibersegurança", type: "required" }],
    "identidade-segura": [{ courseTitle: "Segurança Pessoal Digital", type: "recommended" }],
    "privacidade-dados": [],
    "cloud-inicial": [],
    "hacking-etico-intro": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Linux para Cibersegurança", type: "required" }],
    "pentest": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Linux para Cibersegurança", type: "required" }, { courseTitle: "TCP/IP", type: "required" }, { courseTitle: "Python básico", type: "recommended" }],
    "soc": [{ courseTitle: "Fundamentos de Cibersegurança", type: "required" }, { courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Windows Security", type: "recommended" }],
    "siem": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "SOC Analyst", type: "required" }, { courseTitle: "Linux para Cibersegurança", type: "recommended" }],
    "incident-response": [{ courseTitle: "SOC Analyst", type: "required" }, { courseTitle: "SIEM na Prática", type: "recommended" }],
    "web-security": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Linux para Cibersegurança", type: "recommended" }],
    "grc": [{ courseTitle: "Fundamentos de Cibersegurança", type: "required" }],
    "iso-27001": [{ courseTitle: "GRC Fundamentals", type: "required" }],
    "nist-cis": [{ courseTitle: "GRC Fundamentals", type: "required" }],
    "cloud-fundamentos": [{ courseTitle: "Fundamentos de Cloud para Segurança", type: "required" }, { courseTitle: "Fundamentos de Redes", type: "required" }],
    "aws-security": [{ courseTitle: "Cloud Security Fundamentals", type: "required" }],
    "azure-security": [{ courseTitle: "Cloud Security Fundamentals", type: "required" }],
    "cloud-security-operations": [{ courseTitle: "Cloud Security Fundamentals", type: "required" }, { courseTitle: "AWS Security — Fundamentos", type: "recommended" }],
    "forense-digital": [{ courseTitle: "SOC Analyst", type: "required" }, { courseTitle: "Linux para Cibersegurança", type: "recommended" }],
    "devsecops": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Linux para Cibersegurança", type: "required" }, { courseTitle: "Python básico", type: "recommended" }],
    "network-zero-trust": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Segurança de E-mail e Defesa contra Phishing", type: "recommended" }],
    "malware-analysis": [{ courseTitle: "Threat Intelligence", type: "required" }, { courseTitle: "Fundamentos de Redes", type: "required" }],
    "ad-security": [{ courseTitle: "Windows Security", type: "required" }, { courseTitle: "Fundamentos de Redes", type: "required" }],
    "vulnerability-management": [{ courseTitle: "Fundamentos de Cibersegurança", type: "required" }, { courseTitle: "Fundamentos de Redes", type: "recommended" }],
    "email-security": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Fundamentos de Cibersegurança", type: "recommended" }],
    "container-security": [{ courseTitle: "Cloud Security Fundamentals", type: "required" }, { courseTitle: "Linux para Cibersegurança", type: "recommended" }],
    "threat-hunting": [{ courseTitle: "SOC Analyst", type: "required" }, { courseTitle: "SIEM na Prática", type: "required" }, { courseTitle: "Threat Intelligence", type: "required" }],
    "security-architecture": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Criptografia", type: "required" }, { courseTitle: "Segurança de Software Aplicada", type: "recommended" }],
    "ics-scada": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Segurança de Redes e Zero Trust", type: "required" }],
    "red-team-fundamentals": [{ courseTitle: "Fundamentos de Pentest", type: "required" }, { courseTitle: "Web Security / OWASP", type: "recommended" }],
    "api-security": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Web Security / OWASP", type: "recommended" }],
    "mobile-security": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Criptografia", type: "recommended" }],
    "database-security": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Criptografia", type: "recommended" }],
    "purple-team-operations": [{ courseTitle: "SOC Analyst", type: "required" }, { courseTitle: "Red Team Fundamentals", type: "required" }],
    "red-team-operations": [{ courseTitle: "Red Team Fundamentals", type: "required" }],
    "seguranca-memoria": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Criptografia", type: "required" }, { courseTitle: "Segurança de Software Aplicada", type: "recommended" }],
    "adversary-simulation": [{ courseTitle: "Threat Intelligence", type: "required" }, { courseTitle: "SOC Analyst", type: "required" }],
    "security-program-management": [{ courseTitle: "GRC Fundamentals", type: "required" }, { courseTitle: "NIST + CIS Controls", type: "required" }],
    "software-security-applied": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Web Security / OWASP", type: "recommended" }],
    "security-automation-operations": [{ courseTitle: "Linux para Cibersegurança", type: "required" }, { courseTitle: "Scripting básico", type: "recommended" }],
    "detection-engineering": [{ courseTitle: "SOC Analyst", type: "required" }, { courseTitle: "SIEM na Prática", type: "required" }],
    "iot-security-foundations": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "Segurança de Redes e Zero Trust", type: "recommended" }],
    "software-supply-chain-security": [{ courseTitle: "DevSecOps — Fundamentos", type: "required" }],
    "cyber-crisis-communication": [{ courseTitle: "GRC Fundamentals", type: "required" }, { courseTitle: "Incident Response", type: "recommended" }],
    "it-fundamentals": [],
    "wireshark": [{ courseTitle: "Fundamentos de Redes", type: "required" }, { courseTitle: "IT Fundamentals for Cybersecurity", type: "recommended" }],
    "security-awareness": [{ courseTitle: "Fundamentos de Cibersegurança", type: "recommended" }],
    "identity-access-management": [{ courseTitle: "Fundamentos de Cibersegurança", type: "required" }, { courseTitle: "Fundamentos de Redes", type: "recommended" }],
    "ai-security-fundamentals": [{ courseTitle: "Fundamentos de Cibersegurança", type: "required" }, { courseTitle: "IT Fundamentals for Cybersecurity", type: "recommended" }],
    "ai-red-team": [{ courseTitle: "AI Security Fundamentals", type: "required" }, { courseTitle: "Fundamentos de Pentest", type: "recommended" }],
    "ai-governance": [{ courseTitle: "AI Security Fundamentals", type: "required" }, { courseTitle: "GRC Fundamentals", type: "recommended" }],
  };
  return map[courseId] ?? [];
}

export function getAcademy(slug: string) {
  return academies.find((academy) => academy.slug === slug);
}

export function getCurriculumCourseByTitle(title: string) {
  return curriculumCourses.find((course) => course.title.toLowerCase() === title.toLowerCase());
}

export function getCurriculumCourseById(courseId: string) {
  return curriculumCourses.find((course) => course.id === courseId);
}

export type PrerequisiteWithLink = Prerequisite & { href: string | null; slug: string | null };

export function getCoursePrerequisitesWithLinks(courseId: string): PrerequisiteWithLink[] {
  return getPrerequisites(courseId).map((prerequisite) => {
    const prerequisiteCourse = getCurriculumCourseByTitle(prerequisite.courseTitle);
    const href = prerequisiteCourse?.existingSlug ? `/catalog/${prerequisiteCourse.existingSlug}` : null;
    return { ...prerequisite, href, slug: prerequisiteCourse?.existingSlug ?? null };
  });
}

const careerAreaToAcademy: Record<string, AcademySlug> = {
  soc: "blue-team",
  pentest: "red-team",
  grc: "grc",
  cloud: "cloud-security",
  forense: "blue-team",
  engenharia: "security-engineering",
};

export function getAcademySlugForCareerArea(area: string) {
  return careerAreaToAcademy[area] ?? null;
}

export function getCoursesForAcademy(slug: AcademySlug) {
  return curriculumCourses.filter((course) => course.academy === slug);
}
