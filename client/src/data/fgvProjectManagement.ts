export type FgvExternalCourse = {
  id: string;
  title: string;
  duration: string;
  href: string;
  topic: string;
};

export const fgvProjectManagementCourses: readonly FgvExternalCourse[] = [
  {
    id: "conceitos-projetos",
    title: "Conceitos e Características dos Projetos",
    duration: "5 horas",
    topic: "Fundamentos de projetos",
    href: "https://cursosgratuitos.fgv.br/curso/conceitos-e-caracteristicas-dos-projetos",
  },
  {
    id: "viabilidade-projetos",
    title: "Análise de Viabilidade de Projetos",
    duration: "10 horas",
    topic: "Decisão e viabilidade",
    href: "https://cursosgratuitos.fgv.br/curso/metodos-de-analise-de-viabilidade-de-projetos",
  },
  {
    id: "introducao-scrum",
    title: "Introdução ao Scrum",
    duration: "6 horas",
    topic: "Agilidade",
    href: "https://cursosgratuitos.fgv.br/curso/introducao-ao-scrum",
  },
  {
    id: "kanban-ferramentas-ageis",
    title: "Kanban e Ferramentas Ágeis de Gestão de Projetos",
    duration: "5 horas",
    topic: "Fluxo e gestão visual",
    href: "https://cursosgratuitos.fgv.br/curso/kanban-e-ferramentas-ageis-de-gestao-de-projetos",
  },
  {
    id: "gestao-lean",
    title: "Gestão Enxuta e Lean: Desafios da Implantação",
    duration: "5 horas",
    topic: "Lean",
    href: "https://cursosgratuitos.fgv.br/curso/gestao-enxuta-e-lean-desafios-da-implantacao",
  },
  {
    id: "conceito-okr",
    title: "Origens e Conceito Geral do OKR",
    duration: "8 horas",
    topic: "Metas e resultados",
    href: "https://cursosgratuitos.fgv.br/curso/origens-e-conceito-geral-do-okr",
  },
  {
    id: "riscos-projetos",
    title: "Gerenciamento e Identificação de Riscos",
    duration: "5 horas",
    topic: "Riscos em projetos",
    href: "https://cursosgratuitos.fgv.br/curso/planejamento-do-gerenciamento-e-identificacao-de-riscos-em-projetos",
  },
] as const;

export const fgvProjectManagementSource = {
  institution: "Fundação Getulio Vargas (FGV)",
  license: "Conforme os termos e condições publicados pela FGV",
  usage: "Link externo para acesso ao curso; conteúdo, inscrição, avaliação e declaração permanecem sob responsabilidade da FGV.",
  note: "A CyberDimension Academy não emite declaração da FGV nem contabiliza a nota externa como certificado próprio.",
};
