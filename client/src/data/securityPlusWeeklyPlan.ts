export type SecurityPlusWeeklyMilestone = {
  week: number;
  title: string;
  focus: string;
  goal: string;
  cadence: string;
  domainOrder?: number;
  quizTarget?: number;
};

export const SECURITY_PLUS_WEEKLY_TARGET = 70;

export const securityPlusWeeklyPlan: SecurityPlusWeeklyMilestone[] = [
  {
    week: 1,
    title: "Construa a base",
    focus: "General Security Concepts",
    goal: "Concluir as lições do domínio e atingir pelo menos 70% no simulado do tema.",
    cadence: "Distribua o domínio em quatro blocos curtos de estudo e uma sessão de prática.",
    domainOrder: 1,
    quizTarget: SECURITY_PLUS_WEEKLY_TARGET,
  },
  {
    week: 2,
    title: "Reconheça ameaças",
    focus: "Threats & Vulnerabilities",
    goal: "Concluir as lições do domínio e atingir pelo menos 70% no simulado do tema.",
    cadence: "Estude vetores, vulnerabilidades e mitigação antes de iniciar o simulado.",
    domainOrder: 2,
    quizTarget: SECURITY_PLUS_WEEKLY_TARGET,
  },
  {
    week: 3,
    title: "Projete com segurança",
    focus: "Security Architecture",
    goal: "Concluir as lições do domínio e atingir pelo menos 70% no simulado do tema.",
    cadence: "Alterne entre arquitetura, controles e revisão prática dos conceitos.",
    domainOrder: 3,
    quizTarget: SECURITY_PLUS_WEEKLY_TARGET,
  },
  {
    week: 4,
    title: "Opere e responda",
    focus: "Security Operations",
    goal: "Concluir as lições do domínio e atingir pelo menos 70% no simulado do tema.",
    cadence: "Priorize monitoramento, resposta a incidentes e recuperação em blocos focados.",
    domainOrder: 4,
    quizTarget: SECURITY_PLUS_WEEKLY_TARGET,
  },
  {
    week: 5,
    title: "Governe e gerencie",
    focus: "Program Management",
    goal: "Concluir as lições do domínio e atingir pelo menos 70% no simulado do tema.",
    cadence: "Conecte governança, risco e políticas aos cenários que aparecem nas questões.",
    domainOrder: 5,
    quizTarget: SECURITY_PLUS_WEEKLY_TARGET,
  },
  {
    week: 6,
    title: "Consolide a preparação",
    focus: "Revisão integrada e simulado geral",
    goal: "Revisar pontos frágeis e realizar um simulado geral após completar as cinco missões.",
    cadence: "Use o resultado do simulado para voltar aos domínios com menor desempenho.",
  },
];
