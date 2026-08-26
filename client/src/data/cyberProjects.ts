/**
 * Cyber Projects — programa de projetos práticos que consolidam a formação.
 * Cada projeto tem etapas de entrega claras; ao concluir, o aluno registra
 * um resumo do que foi entregue e o projeto aparece no portfólio público.
 */

export type ProjectArea = "Blue Team" | "Red Team" | "GRC" | "Cloud Security" | "Threat Intelligence";

export type CyberProjectStep = {
  step: number;
  title: string;
  description: string;
};

export type CyberProject = {
  id: string;
  title: string;
  area: ProjectArea;
  level: "Iniciante" | "Intermediário" | "Avançado";
  emoji: string;
  objective: string;
  deliverable: string;
  duration: string;
  prerequisites: string[];
  steps: CyberProjectStep[];
  skills: string[];
};

export const cyberProjects: CyberProject[] = [
  {
    id: "soc-incident-report",
    title: "Relatório de Incidente SOC",
    area: "Blue Team",
    level: "Iniciante",
    emoji: "🛡️",
    objective: "Investigar um conjunto de alertas simulados e produzir um relatório profissional de incidente para um SOC fictício.",
    deliverable: "Relatório em PDF com linha do tempo, IOCs identificados, classificação de severidade e recomendações de contenção.",
    duration: "3–5 h",
    prerequisites: ["Fundamentos de Cibersegurança", "SOC Analyst"],
    steps: [
      { step: 1, title: "Receber o cenário", description: "Analise o pacote de alertas e logs fornecido pelo ambiente de laboratório (brute force, beaconing suspeito e política quebrada)." },
      { step: 2, title: "Triagem e correlação", description: "Classifique cada alerta, descarte falsos positivos justificando o motivo e correlacione os eventos em uma linha do tempo." },
      { step: 3, title: "Identificar IOCs", description: "Extraia IPs, domínios e hashes relevantes e descreva como eles enriqueceriam uma busca de ameaças." },
      { step: 4, title: "Redigir o relatório", description: "Documente severidade, impacto, ações de contenção e lições aprendidas no modelo corporativo." },
      { step: 5, title: "Apresentar ao 'SOC'", description: "Simule um handoff para o time de resposta a incidentes com recomendações de playbooks a serem acionados." },
    ],
    skills: ["Triage", "Correlação", "Relatório", "IOCs"],
  },
  {
    id: "web-app-security-audit",
    title: "Auditoria de Aplicação Web Segura",
    area: "Red Team",
    level: "Intermediário",
    emoji: "🔴",
    objective: "Conduzir uma auditoria responsável em uma aplicação de laboratório, validando riscos comuns do OWASP Top 10 com foco em correção.",
    deliverable: "Relatório de auditoria com vulnerabilidades confirmadas (ou descartadas), severidade, evidências controladas e plano de correção priorizado.",
    duration: "4–6 h",
    prerequisites: ["Fundamentos de Redes", "Web Security / OWASP"],
    steps: [
      { step: 1, title: "Definir escopo", description: "Delimite alvos autorizados, métodos proibidos e critérios de sucesso do engajamento em um documento de escopo." },
      { step: 2, title: "Reconhecimento passivo", description: "Mapeie a superfície da aplicação sem gerar tráfego de exploração: endpoints, tecnologias e parâmetros." },
      { step: 3, title: "Testes controlados", description: "Valide riscos de autenticação, autorização, injeção e configurações usando payloads seguros e reversíveis." },
      { step: 4, title: "Documentar achados", description: "Classifique cada achado por severidade com evidência mínima necessária e cenário de exploração hipotético." },
      { step: 5, title: "Plano de remediação", description: "Proponha correções priorizadas, controles compensatórios e como revalidar após a correção." },
    ],
    skills: ["Escopo", "OWASP", "Evidência", "Remediação"],
  },
  {
    id: "grc-security-program",
    title: "Programa de Segurança e Conformidade",
    area: "GRC",
    level: "Intermediário",
    emoji: "🏛️",
    objective: "Desenhar um programa de segurança completo para uma PME fictícia alinhado a NIST CSF, ISO 27001 e LGPD.",
    deliverable: "Documento com análise de riscos, políticas essenciais, plano de implementação em 12 meses e indicadores de métricas (KPIs/KRIs).",
    duration: "5–7 h",
    prerequisites: ["GRC Fundamentals", "NIST + CIS Controls"],
    steps: [
      { step: 1, title: "Caracterizar a organização", description: "Defina o cenário da PME fictícia: setor, dados críticos, ativos, terceiros e restrições orçamentárias." },
      { step: 2, title: "Análise de risco", description: "Aplique uma matriz de probabilidade x impacto aos cenários mais prováveis e ranqueie os riscos principais." },
      { step: 3, title: "Políticas essenciais", description: "Redija as políticas de maior alavancagem: controle de acesso, classificação de dados, resposta a incidentes e uso aceitável." },
      { step: 4, title: "Roadmap de 12 meses", description: "Organize a implantação em trimestres com responsáveis, dependências e marcos de verificação." },
      { step: 5, title: "Métricas e governança", description: "Defina KPIs e KRIs mensuráveis e um modelo de comitê de segurança com rotina de reporting." },
    ],
    skills: ["Risco", "Políticas", "NIST CSF", "Métricas"],
  },
  {
    id: "cloud-security-posture",
    title: "Postura de Segurança em Nuvem",
    area: "Cloud Security",
    level: "Intermediário",
    emoji: "☁️",
    objective: "Avaliar e corrigir a postura de segurança de um ambiente cloud fictício usando o modelo de responsabilidade compartilhada.",
    deliverable: "Relatório de postura com matriz de responsabilidade, configurações corrigidas, IAM revisado e plano de monitoramento de logs.",
    duration: "4–6 h",
    prerequisites: ["Cloud Security Fundamentals", "AWS Security — Fundamentos"],
    steps: [
      { step: 1, title: "Inventário de ativos", description: "Liste serviços, contas, armazenamentos e identidades do ambiente fictício e classifique dados por sensibilidade." },
      { step: 2, title: "Matriz de responsabilidade", description: "Marque o que é do provedor e o que é do cliente para cada serviço, destacando brechas comuns de entendimento." },
      { step: 3, title: "Revisão de IAM", description: "Aplique menor privilégio, MFA e separação de duties na política de identidades do cenário." },
      { step: 4, title: "Hardening de configuração", description: "Corrija os desvios de postura fornecidos: buckets públicos, criptografia ausente e logs desligados." },
      { step: 5, title: "Monitoramento contínuo", description: "Desenhe a pipeline de CloudTrail/Cloud Logs para detecção com alertas prioritários e revisões periódicas." },
    ],
    skills: ["IAM", "Postura", "Hardening", "Cloud Logs"],
  },
  {
    id: "threat-intel-report",
    title: "Relatório de Threat Intelligence",
    area: "Threat Intelligence",
    level: "Avançado",
    emoji: "🧠",
    objective: "Produzir um relatório de inteligência operacional sobre um grupo de ameaça fictício, mapeando TTPs no MITRE ATT&CK.",
    deliverable: "Relatório de inteligência com perfil do adversário, TTPs mapeadas, IOCs sintéticos e recomendações de detecção para o blue team.",
    duration: "5–7 h",
    prerequisites: ["Threat Intelligence", "SOC Analyst"],
    steps: [
      { step: 1, title: "Definir o PIR", description: "Formule perguntas de inteligência prioritárias que orientem a coleta e evitem escopo infinito." },
      { step: 2, title: "Coleta e triagem", description: "Reúna fontes OSINT fornecidas no cenário e triage por relevância, confiabilidade e atualidade." },
      { step: 3, title: "Análise e mapeamento", description: "Mapeie o comportamento do adversário fictício às TTPs do MITRE ATT&CK com exemplos concretos." },
      { step: 4, title: "IOCs sintéticos", description: "Produza IOCs sintéticos do cenário que sirvam de exercício para a equipe de detecção, sem dados reais." },
      { step: 5, title: "Disseminação acionável", description: "Finalize com recomendações de detecção e prevenção para o time de operações em formato utilizável." },
    ],
    skills: ["PIR", "OSINT", "MITRE ATT&CK", "Disseminação"],
    },
  {
    id: "pmsec-security-project",
    title: "Plano de Transformação de Segurança",
    area: "GRC",
    level: "Intermediário",
    emoji: "📋",
    objective: "Planejar uma iniciativa de melhoria de segurança para uma organização fictícia, conectando risco, escopo, governança, execução e métricas.",
    deliverable: "Projeto final com termo de abertura, matriz de riscos, roadmap, RACI, plano de mudança e indicadores de acompanhamento.",
    duration: "6–8 h",
    prerequisites: ["Gestão de Projetos em Segurança Cibernética", "GRC Fundamentals"],
    steps: [
      { step: 1, title: "Contextualizar o desafio", description: "Defina a organização fictícia, o problema de segurança, os ativos envolvidos, as partes interessadas e a evidência que motivou a iniciativa." },
      { step: 2, title: "Definir escopo e entregáveis", description: "Escreva objetivo, fora de escopo, premissas, dependências, entregáveis e critérios de aceite verificáveis." },
      { step: 3, title: "Priorizar riscos", description: "Registre riscos, classifique impacto e probabilidade, escolha respostas e indique responsáveis pelo risco residual." },
      { step: 4, title: "Planejar governança e execução", description: "Monte RACI, roadmap, cadência de comunicação, plano de mudança, testes e estratégia de rollback." },
      { step: 5, title: "Definir métricas e encerramento", description: "Escolha KPIs e KRIs, descreva handover, pendências, aceite, retrospectiva e o próximo ciclo de melhoria." },
    ],
    skills: ["Escopo", "Risco", "RACI", "Roadmap", "Métricas"],
  },
];
export function getCyberProjectById(id: string): CyberProject | undefined {
  return cyberProjects.find((project) => project.id === id);
}
